<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\StoreReportRequest;
use App\Http\Requests\Report\UpdateReportRequest;
use App\Http\Requests\Report\VerifyReportRequest;
use App\Http\Resources\ReportResource;
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
            'sort' => $request->query('sort', 'terbaru'),
        ];

        $reports = $this->service->getReports($filters);
        return response()->json(ReportResource::collection(collect($reports)));
    }

    public function show(string $id): JsonResponse
    {
        $report = $this->service->getReportById($id);
        if (!$report) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }
        return response()->json(new ReportResource($report));
    }

    public function store(StoreReportRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (empty($validated['isAnonymous'])) {
            if (empty($validated['reporterPhone']) && $request->header('X-Citizen-Phone')) {
                $validated['reporterPhone'] = $request->header('X-Citizen-Phone');
            }
            if (empty($validated['reporterName']) && $request->header('X-Citizen-Name')) {
                $validated['reporterName'] = $request->header('X-Citizen-Name');
            }
        }

        $newReport = $this->service->createReport($validated);
        return response()->json(new ReportResource($newReport), 201, [
            'Location' => url('/api/v1/reports/' . $newReport['id']),
        ]);
    }

    public function update(UpdateReportRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();

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
        return response()->json(new ReportResource($result['report']));
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

    public function verify(VerifyReportRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();
        $updated = $this->service->verifyReport($id, $validated);
        if (!$updated) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }
        return response()->json(new ReportResource($updated));
    }

    public function toggleUpvote(string $id): JsonResponse
    {
        $updated = $this->service->toggleUpvote($id);
        if (!$updated) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }
        return response()->json(new ReportResource($updated));
    }

    public function addComment(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'text' => 'nullable|string|max:1000',
            'message' => 'nullable|string|max:1000',
            'author' => 'nullable|string',
            'authorName' => 'nullable|string',
            'role' => 'nullable|string',
            'authorRole' => 'nullable|string',
        ]);

        $commentText = $validated['text'] ?? $validated['message'] ?? null;
        if (empty($commentText)) {
            return response()->json([
                'message' => 'Pesan komentar wajib diisi.',
                'errors' => ['text' => ['Pesan komentar wajib diisi.']],
            ], 422);
        }

        $callerPhone = $request->header('X-Citizen-Phone') ?? $request->input('callerPhone');
        $callerName = $request->header('X-Citizen-Name') ?? $request->input('callerName');
        $isAdmin = $request->header('X-Admin-Role') === 'admin';

        $author = $validated['author'] ?? $validated['authorName'] ?? ($isAdmin ? 'Perangkat Desa Kepunduhan' : ($callerName ?? 'Warga Kepunduhan'));
        $role = $validated['role'] ?? $validated['authorRole'] ?? ($isAdmin ? 'admin' : 'citizen');

        $updated = $this->service->addComment($id, [
            'text' => $commentText,
            'message' => $commentText,
            'author' => $author,
            'role' => $role,
        ]);

        if (!$updated) {
            return response()->json(['message' => 'Laporan tidak ditemukan'], 404);
        }
        return response()->json(new ReportResource($updated));
    }

    public function stats(): JsonResponse
    {
        return response()->json($this->service->getStats());
    }

    public function export(Request $request): StreamedResponse
    {
        $status = $request->query('status');
        $reports = $this->service->getReports($status ? ['status' => $status] : []);

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="laporan-desa-kepunduhan-' . date('Y-m-d') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($reports) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($handle, ['ID Laporan', 'Judul', 'Kategori', 'Status', 'Lokasi', 'Dusun', 'Pelapor', 'Tanggal', 'Dukungan Warga']);

            foreach ($reports as $r) {
                fputcsv($handle, [
                    $r['id'] ?? '-',
                    $r['title'] ?? '-',
                    $r['category'] ?? '-',
                    $r['status'] ?? '-',
                    $r['location'] ?? '-',
                    $r['dusun'] ?? '-',
                    ($r['isAnonymous'] ?? false) ? 'Anonim' : ($r['reporterName'] ?? 'Warga'),
                    $r['createdAt'] ?? '-',
                    $r['upvotes'] ?? 0,
                ]);
            }
            fclose($handle);
        }, 200, $headers);
    }
}
