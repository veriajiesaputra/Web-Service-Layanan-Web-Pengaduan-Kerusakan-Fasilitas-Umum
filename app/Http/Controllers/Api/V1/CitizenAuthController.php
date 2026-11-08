<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginCitizenRequest;
use App\Http\Requests\Auth\RegisterCitizenRequest;
use App\Http\Resources\CitizenResource;
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

    public function login(LoginCitizenRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $identifier = $validated['nik'] ?? $validated['phone'] ?? null;

        if (empty($identifier)) {
            return response()->json([
                'message' => 'NIK atau Nomor HP wajib diisi.',
                'errors' => [
                    'nik' => ['NIK atau Nomor HP wajib diisi.'],
                    'phone' => ['NIK atau Nomor HP wajib diisi.'],
                ],
            ], 422);
        }

        $password = $validated['password'] ?? '123456';
        $citizen = $this->service->authenticateCitizen($identifier, $password);

        if (!$citizen) {
            return response()->json([
                'success' => false,
                'message' => 'NIK / Nomor HP tidak terdaftar atau kata sandi tidak cocok. Silakan daftar akun baru atau gunakan akun demo.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => 'Berhasil masuk sebagai warga desa',
            'token' => $citizen['token'] ?? ('cit_token_' . md5($citizen['id'] . time())),
            'user' => new CitizenResource($citizen),
            'data' => new CitizenResource($citizen),
        ]);
    }

    public function register(RegisterCitizenRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $result = $this->service->registerCitizen($validated);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran warga berhasil!',
            'user' => new CitizenResource($result['citizen']),
        ], 201);
    }

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
                        'message' => "🏛️ *DESA KEPUNDUHAN - SISTEM PELAYANAN WARGA*\n\nKode OTP Masuk Akun Anda: *{$otp}*\n\nKode ini bersifat rahasia dan berlaku selama 5 menit. Jangan bagikan kepada siapapun.",
                    ]);

                if ($response->successful()) {
                    $sentViaWa = true;
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

        \Illuminate\Support\Facades\Cache::forget("wa_otp_{$cleanPhone}");

        $citizen = $this->service->findCitizenByPhone($validated['phone']);

        if (!$citizen) {
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

    public function demoAccounts(): JsonResponse
    {
        $citizens = $this->service->getDefaultCitizens();
        return response()->json(CitizenResource::collection(collect($citizens)));
    }

    public function me(Request $request): JsonResponse
    {
        $token = $request->bearerToken();
        $phoneHeader = $request->header('X-Citizen-Phone') ?? $request->query('phone');
        $nikHeader = $request->header('X-Citizen-Nik') ?? $request->query('nik');

        if (!$token && !$phoneHeader && !$nikHeader) {
            return response()->json([
                'message' => 'Unauthenticated. Silakan kirim Bearer Token atau Header Kredensial Warga.',
            ], 401);
        }

        $identifier = $nikHeader ?? $phoneHeader;
        if ($identifier) {
            $citizen = $this->service->findCitizenByPhone($identifier);
            if ($citizen) {
                return response()->json(new CitizenResource($citizen));
            }
        }

        $citizens = $this->service->getCitizens();
        $citizen = $citizens[0] ?? [
            'id' => 1,
            'nik' => '3328012005010001',
            'name' => 'Budi Santoso',
            'phone' => '081234567890',
            'dusun' => 'Dusun Krajan',
            'rtRw' => 'RT 02 / RW 01',
            'role' => 'Warga',
        ];

        return response()->json(new CitizenResource($citizen));
    }
}
