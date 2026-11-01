<?php

namespace App\Http\Controllers;

use App\Services\JsonDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CitizenAuthController extends Controller
{
    protected JsonDataService $service;

    public function __construct(JsonDataService $service)
    {
        $this->service = $service;
    }

    /**
     * Citizen login by NIK or WhatsApp / Phone & PIN
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nik' => 'nullable|string',
            'phone' => 'nullable|string',
            'password' => 'nullable|string'
        ]);

        $identifier = $validated['nik'] ?? $validated['phone'] ?? null;
        if (empty($identifier)) {
            return response()->json([
                'message' => 'NIK atau Nomor HP wajib diisi.',
                'errors' => [
                    'nik' => ['NIK atau Nomor HP wajib diisi.'],
                    'phone' => ['NIK atau Nomor HP wajib diisi.']
                ]
            ], 422);
        }

        $password = $validated['password'] ?? '123456';
        $citizen = $this->service->authenticateCitizen($identifier, $password);

        if (!$citizen) {
            return response()->json([
                'success' => false,
                'message' => 'NIK / Nomor HP tidak terdaftar atau kata sandi tidak cocok. Silakan daftar akun baru atau gunakan akun demo.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Berhasil masuk sebagai warga desa',
            'token' => $citizen['token'] ?? ('cit_token_' . md5($citizen['id'] . time())),
            'user' => $citizen,
            'data' => $citizen
        ]);
    }

    /**
     * Request OTP via WhatsApp
     */
    public function requestOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string',
        ]);

        $rawPhone = $validated['phone'];
        $cleanPhone = preg_replace('/[^0-9]/', '', $rawPhone);
        if (str_starts_with($cleanPhone, '0')) {
            $formattedPhone = '62' . substr($cleanPhone, 1);
        } else {
            $formattedPhone = $cleanPhone;
        }

        if (strlen($cleanPhone) < 10) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor WhatsApp tidak valid (minimal 10 digit).'
            ], 422);
        }

        // Generate 6 digit OTP
        $otp = (string) rand(100000, 999999);
        \Illuminate\Support\Facades\Cache::put("wa_otp_{$cleanPhone}", $otp, now()->addMinutes(5));

        $fonnteToken = config('services.fonnte.token');
        $sentViaWa = false;

        if ($fonnteToken) {
            try {
                $response = \Illuminate\Support\Facades\Http::timeout(10)
                    ->withHeaders(['Authorization' => $fonnteToken])
                    ->post('https://api.fonnte.com/send', [
                        'target' => $formattedPhone,
                        'message' => "🏛️ *DESA MANDIRI - SISTEM PELAYANAN WARGA*\n\nKode OTP Masuk Akun Anda: *{$otp}*\n\nKode ini bersifat rahasia dan berlaku selama 5 menit. Jangan bagikan kepada siapapun.",
                    ]);

                if ($response->successful()) {
                    $sentViaWa = true;
                } else {
                    \Illuminate\Support\Facades\Log::warning('Fonnte API response failed', ['body' => $response->body()]);
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Fonnte send error: ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => $sentViaWa 
                ? 'Kode OTP telah terkirim ke nomor WhatsApp Anda.' 
                : 'Kode OTP berhasil dibuat. (Gunakan kode OTP di bawah ini untuk verifikasi).',
            'sent_via_wa' => $sentViaWa,
            'demo_otp' => $otp,
            'phone' => $rawPhone,
        ]);
    }

    /**
     * Verify OTP and authenticate citizen
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);

        $cleanPhone = preg_replace('/[^0-9]/', '', $validated['phone']);
        $cachedOtp = \Illuminate\Support\Facades\Cache::get("wa_otp_{$cleanPhone}");

        if (!$cachedOtp || (string) $cachedOtp !== (string) $validated['otp']) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP salah atau sudah kedaluwarsa. Silakan minta kode baru.',
            ], 422);
        }

        // OTP is valid! Remove from cache
        \Illuminate\Support\Facades\Cache::forget("wa_otp_{$cleanPhone}");

        $citizen = $this->service->findCitizenByPhone($validated['phone']);

        if (!$citizen) {
            // Auto-create citizen profile if this is their first time
            $citizen = $this->service->createCitizen([
                'id' => 'cit-' . rand(100, 999) . '-' . time(),
                'name' => 'Warga ' . substr($cleanPhone, -4),
                'phone' => $validated['phone'],
                'dusun' => 'Dusun Krajan',
                'rtRw' => 'RT 01 / RW 01',
                'role' => 'Warga Terverifikasi WhatsApp',
            ]);
        }

        unset($citizen['password']);
        $citizen['token'] = 'cit_token_' . md5($cleanPhone . time());

        return response()->json([
            'success' => true,
            'message' => 'Autentikasi WhatsApp berhasil! Selamat datang.',
            'user' => $citizen,
        ]);
    }

    /**
     * Citizen register
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nik' => [
                'required',
                'string',
                'size:16',
                'regex:/^[0-9]{16}$/',
            ],
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'dusun' => 'required|string|max:100',
            'rtRw' => 'nullable|string|max:50',
            'role' => 'nullable|string|max:100',
            'password' => 'nullable|string|min:4'
        ], [
            'nik.required' => 'Nomor Induk Kependudukan (NIK) wajib diisi.',
            'nik.size' => 'NIK harus berjumlah tepat 16 digit angka.',
            'nik.regex' => 'NIK hanya boleh berupa karakter numerik angka (0-9).',
        ]);

        $result = $this->service->registerCitizen($validated);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran warga berhasil!',
            'user' => $result['citizen']
        ], 201);
    }

    /**
     * List demo accounts for easy 1-click testing
     */
    public function demoAccounts(): JsonResponse
    {
        $citizens = $this->service->getDefaultCitizens();
        // Remove passwords before returning
        $safeCitizens = array_map(function ($c) {
            unset($c['password']);
            return $c;
        }, $citizens);

        return response()->json($safeCitizens);
    }

    /**
     * Get current citizen profile
     */
    public function me(Request $request): JsonResponse
    {
        $phone = $request->header('X-Citizen-Phone') ?? $request->query('phone');
        if (!$phone) {
            return response()->json(['message' => 'Sesi warga belum aktif'], 401);
        }

        $citizen = $this->service->findCitizenByPhone($phone);
        if (!$citizen) {
            return response()->json(['message' => 'Data warga tidak ditemukan'], 404);
        }

        unset($citizen['password']);
        return response()->json($citizen);
    }
}
