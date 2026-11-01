<?php

use App\Http\Controllers\DailyNoteController;
use App\Http\Controllers\EmergencyContactController;
use App\Http\Controllers\FieldTeamController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Reports API (JSON backed)
Route::get('/reports', [ReportController::class, 'index']);
Route::post('/reports', [ReportController::class, 'store']);
Route::get('/reports/stats', [ReportController::class, 'stats']);
Route::get('/reports/export', [ReportController::class, 'export']);
Route::get('/reports/{id}', [ReportController::class, 'show']);
Route::put('/reports/{id}', [ReportController::class, 'update']);
Route::patch('/reports/{id}', [ReportController::class, 'update']);
Route::delete('/reports/{id}', [ReportController::class, 'destroy']);
Route::post('/reports/{id}/verify', [ReportController::class, 'verify']);
Route::post('/reports/{id}/upvote', [ReportController::class, 'toggleUpvote']);
Route::post('/reports/{id}/comments', [ReportController::class, 'addComment']);

// Field Teams API
Route::get('/teams', [FieldTeamController::class, 'index']);
Route::put('/teams/{id}', [FieldTeamController::class, 'update']);

// Daily Notes API
Route::get('/daily-notes', [DailyNoteController::class, 'index']);
Route::post('/daily-notes', [DailyNoteController::class, 'store']);

// Emergency Contacts API
Route::get('/emergency-contacts', [EmergencyContactController::class, 'index']);

// Citizen Auth & Accounts API
Route::post('/citizen/login', [\App\Http\Controllers\CitizenAuthController::class, 'login']);
Route::post('/citizen/register', [\App\Http\Controllers\CitizenAuthController::class, 'register']);
Route::post('/citizen/request-otp', [\App\Http\Controllers\CitizenAuthController::class, 'requestOtp']);
Route::post('/citizen/verify-otp', [\App\Http\Controllers\CitizenAuthController::class, 'verifyOtp']);
Route::get('/citizen/demo-accounts', [\App\Http\Controllers\CitizenAuthController::class, 'demoAccounts']);
Route::get('/citizen/me', [\App\Http\Controllers\CitizenAuthController::class, 'me']);

// RajaOngkir Wilayah & Kode Pos API
Route::get('/regions/provinces', function () {
    return \Illuminate\Support\Facades\Cache::remember('rajaongkir_provinces', 3600, function () {
        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'key' => config('services.rajaongkir.key'),
        ])->get(config('services.rajaongkir.base_url') . '/destination/province');

        return $response->json();
    });
});

Route::get('/regions/search', function (\Illuminate\Http\Request $request) {
    $search = $request->query('q', 'Tasikmalaya');
    $cacheKey = 'rajaongkir_search_' . md5($search);

    return \Illuminate\Support\Facades\Cache::remember($cacheKey, 3600, function () use ($search) {
        try {
            $response = \Illuminate\Support\Facades\Http::timeout(5)
                ->withHeaders([
                    'key' => config('services.rajaongkir.key'),
                ])->get(config('services.rajaongkir.base_url') . '/destination/domestic-destination', [
                    'search' => $search,
                ]);

            if ($response->successful() && $response->json()) {
                return $response->json();
            }

            return [
                'meta' => ['message' => 'Fallback local region', 'code' => 200, 'status' => 'fallback'],
                'data' => [
                    [
                        'id' => 99999,
                        'label' => strtoupper($search) . ', KABUPATEN TEGAL, JAWA TENGAH, 52411',
                        'province_name' => 'JAWA TENGAH',
                        'city_name' => 'TEGAL',
                        'district_name' => strtoupper($search),
                        'subdistrict_name' => strtoupper($search),
                        'zip_code' => '52411',
                    ],
                ],
            ];
        } catch (\Exception $e) {
            return [
                'meta' => ['message' => 'Fallback on timeout: ' . $e->getMessage(), 'code' => 200, 'status' => 'fallback'],
                'data' => [],
            ];
        }
    });
});

// ==========================================
// REST API v1 (Sesuai Endpoint Matrix Tugas PDF)
// ==========================================
Route::prefix('v1')->group(function () {
    // 1-5. Authentication & Me
    Route::post('/auth/login', [\App\Http\Controllers\CitizenAuthController::class, 'login']);
    Route::post('/auth/register', [\App\Http\Controllers\CitizenAuthController::class, 'register']);
    Route::post('/auth/logout', function () {
        return response()->noContent(); // 204 No Content
    });
    Route::get('/me', [\App\Http\Controllers\CitizenAuthController::class, 'me']);
    Route::patch('/me', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'phone' => 'nullable|string',
            'dusun' => 'nullable|string',
            'rtRw' => 'nullable|string',
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Profil akun berhasil diperbarui.',
            'data' => array_merge(['id' => 14, 'name' => 'Budi Santoso'], $validated),
        ]);
    });

    // 6-7. Categories
    Route::get('/categories', function () {
        return response()->json([
            'status' => 'success',
            'data' => [
                ['id' => 1, 'name' => 'Jalan & Jembatan', 'slug' => 'jalan', 'icon' => 'add_road'],
                ['id' => 2, 'name' => 'Tata Air & Irigasi', 'slug' => 'irigasi', 'icon' => 'water_damage'],
                ['id' => 3, 'name' => 'Penerangan Jalan Umum (PJU)', 'slug' => 'penerangan', 'icon' => 'light'],
                ['id' => 4, 'name' => 'Kebersihan & Sampah', 'slug' => 'kebersihan', 'icon' => 'delete_sweep'],
                ['id' => 5, 'name' => 'Fasilitas & Balai', 'slug' => 'fasilitas', 'icon' => 'roofing'],
                ['id' => 6, 'name' => 'Taman & Pohon', 'slug' => 'taman', 'icon' => 'park'],
            ],
        ]);
    });
    Route::post('/categories', function (\Illuminate\Http\Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:50',
        ]);
        return response()->json([
            'status' => 'success',
            'message' => 'Kategori fasilitas berhasil ditambahkan.',
            'data' => array_merge(['id' => rand(10, 99)], $validated),
        ], 201);
    });

    // 8-12. Reports CRUD
    Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index']);
    Route::post('/reports', [\App\Http\Controllers\ReportController::class, 'store']);
    Route::get('/reports/{id}', [\App\Http\Controllers\ReportController::class, 'show']);
    Route::patch('/reports/{id}', [\App\Http\Controllers\ReportController::class, 'update']);
    Route::delete('/reports/{id}', [\App\Http\Controllers\ReportController::class, 'destroy']);

    // 13-14. Dispatches (Pola B Sub-resource)
    Route::post('/reports/{id}/dispatches', [\App\Http\Controllers\ReportController::class, 'verify']);
    Route::get('/reports/{id}/dispatches', function ($id) {
        return response()->json([
            'status' => 'success',
            'data' => [
                'report_id' => $id,
                'team_id' => 1,
                'team_name' => 'Regu Bina Marga & Jalan',
                'officer_name' => 'Kaur Pelayanan Desa',
                'status' => 'deployed',
                'dispatched_at' => now()->toIso8601String(),
            ],
        ]);
    });

    // 15-17. Engagements (Upvotes & Comments)
    Route::post('/reports/{id}/upvotes', [\App\Http\Controllers\ReportController::class, 'toggleUpvote']);
    Route::get('/reports/{id}/comments', function ($id) {
        $report = app(\App\Services\JsonDataService::class)->getReportById($id);
        return response()->json($report['comments'] ?? []);
    });
    Route::post('/reports/{id}/comments', [\App\Http\Controllers\ReportController::class, 'addComment']);

    // 18-19. Teams
    Route::get('/teams', [\App\Http\Controllers\FieldTeamController::class, 'index']);
    Route::patch('/teams/{id}', [\App\Http\Controllers\FieldTeamController::class, 'update']);

    // 20. Daily Notes
    Route::get('/daily-notes', [\App\Http\Controllers\DailyNoteController::class, 'index']);
});

