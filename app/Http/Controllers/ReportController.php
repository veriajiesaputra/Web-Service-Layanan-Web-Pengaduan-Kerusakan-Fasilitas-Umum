<?php

namespace App\Http\Controllers;

use App\Services\JsonDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    protected JsonDataService $service;

    public function __construct(JsonDataService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = [
            'status' => $request->query('status'),
            'category' => $request->query('category'),
            'dusun' => $request->query('dusun'),
            'search' => $request->query('search') ?? $request->query('q'),
            'sort' => $request->query('sort', 'terbaru')
        ];

        $reports = $this->service->getReports($filters);
        return response()->json($reports);
    }

    public function show(string $id): JsonResponse
    {
        $report = $this->service->getReportById($id);
        if (!$report) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }
        return response()->json($report);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'dusun' => 'nullable|string',
            'rtRw' => 'nullable|string',
            'location' => 'nullable|string',
            'priority' => 'nullable|string',
            'reporterName' => 'nullable|string',
            'reporterPhone' => 'nullable|string',
            'phone' => 'nullable|string',
            'isAnonymous' => 'nullable|boolean',
            'photoUrl' => 'nullable|string',
            'coordinates' => 'nullable|array'
        ]);

        // If not anonymous, attach citizen info from header if present
        if (empty($validated['isAnonymous'])) {
            if (empty($validated['reporterPhone']) && $request->header('X-Citizen-Phone')) {
                $validated['reporterPhone'] = $request->header('X-Citizen-Phone');
            }
            if (empty($validated['reporterName']) && $request->header('X-Citizen-Name')) {
                $validated['reporterName'] = $request->header('X-Citizen-Name');
            }
        }

        $newReport = $this->service->createReport($validated);
        return response()->json($newReport, 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'category' => 'nullable|string',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'location' => 'nullable|string',
            'dusun' => 'nullable|string',
            'rtRw' => 'nullable|string',
            'description' => 'nullable|string',
            'assignedTeam' => 'nullable|string',
            'notes' => 'nullable|string',
            'rejectionReason' => 'nullable|string',
            'reporterName' => 'nullable|string',
            'reporterPhone' => 'nullable|string',
            'phone' => 'nullable|string',
            'isAnonymous' => 'nullable|boolean',
            'photoUrl' => 'nullable|string',
        ]);

        if (!empty($validated['rtRw']) && !empty($validated['dusun'])) {
            $validated['location'] = "{$validated['dusun']}, {$validated['rtRw']}";
        }

        $callerPhone = $request->header('X-Citizen-Phone') ?? $request->input('callerPhone');
        $callerName = $request->header('X-Citizen-Name') ?? $request->input('callerName');
        $isAdmin = $request->header('X-Admin-Role') === 'admin' || $request->input('isAdmin') === true;

        $result = $this->service->updateReport($id, $validated, $callerPhone, $callerName, $isAdmin);
        if (!$result['success']) {
            return response()->json(['message' => $result['message']], $result['code'] ?? 403);
        }
        return response()->json($result['report']);
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $callerPhone = $request->header('X-Citizen-Phone') ?? $request->input('callerPhone');
        $callerName = $request->header('X-Citizen-Name') ?? $request->input('callerName');
        $isAdmin = $request->header('X-Admin-Role') === 'admin' || $request->input('isAdmin') === true;

        $result = $this->service->deleteReport($id, $callerPhone, $callerName, $isAdmin);
        if (!$result['success']) {
            return response()->json(['message' => $result['message']], $result['code'] ?? 403);
        }
        return response()->json(['message' => $result['message'], 'id' => $id]);
    }

    public function verify(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'assignedTeam' => 'required|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string',
            'priority' => 'nullable|string'
        ]);

        $updated = $this->service->verifyReport($id, $validated);
        if (!$updated) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }
        return response()->json($updated);
    }

    public function toggleUpvote(string $id): JsonResponse
    {
        $updated = $this->service->toggleUpvote($id);
        if (!$updated) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }
        return response()->json($updated);
    }

    public function addComment(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'author' => 'nullable|string',
            'role' => 'nullable|string',
            'text' => 'required|string|max:1000'
        ]);

        $updated = $this->service->addComment($id, $validated);
        if (!$updated) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }
        return response()->json($updated);
    }

    public function stats(): JsonResponse
    {
        $stats = $this->service->getStats();
        return response()->json($stats);
    }

    public function export(Request $request)
    {
        $format = $request->query('format', 'csv');
        $reports = $this->service->getReports();

        if ($format === 'json') {
            return response()->json($reports)
                ->header('Content-Disposition', 'attachment; filename="laporan-desa-mandiri-' . date('Y-m-d') . '.json"');
        }

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="laporan-desa-mandiri-' . date('Y-m-d') . '.csv"',
        ];

        $callback = function () use ($reports) {
            $file = fopen('php://output', 'w');
            // Write BOM for Excel UTF-8 compatibility
            fputs($file, "\xEF\xBB\xBF");

            fputcsv($file, [
                'ID Tiket',
                'Judul',
                'Kategori',
                'Status',
                'Prioritas',
                'Dusun',
                'Lokasi',
                'Pelapor',
                'Tanggal',
                'Tim Petugas',
                'Dukungan Warga',
                'Deskripsi'
            ]);

            foreach ($reports as $r) {
                fputcsv($file, [
                    $r['id'] ?? '',
                    $r['title'] ?? '',
                    $r['categoryLabel'] ?? $r['category'] ?? '',
                    $r['status'] ?? '',
                    $r['priority'] ?? '',
                    $r['dusun'] ?? '',
                    $r['location'] ?? '',
                    $r['reporterName'] ?? '',
                    $r['createdAt'] ?? '',
                    $r['assignedTeam'] ?? '-',
                    $r['upvotes'] ?? 0,
                    $r['description'] ?? ''
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }
}
