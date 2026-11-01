<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class CitizenAuthTest extends TestCase
{
    public function test_citizen_can_register_with_valid_16_digit_nik(): void
    {
        $uniqueNik = '3328' . str_pad((string) rand(100000000000, 999999999999), 12, '0', STR_PAD_LEFT);
        $uniquePhone = '08' . rand(1111111111, 9999999999);

        $response = $this->postJson('/api/citizen/register', [
            'nik' => $uniqueNik,
            'name' => 'Budi Santoso',
            'phone' => $uniquePhone,
            'dusun' => 'Dusun Krajan',
            'rtRw' => 'RT 02 / RW 01',
            'password' => '123456',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('success', true);
        $this->assertNotNull($response->json('user.id'));
        $this->assertEquals($uniqueNik, $response->json('user.nik'));
    }

    public function test_registration_fails_when_nik_is_not_16_digits(): void
    {
        $response = $this->postJson('/api/citizen/register', [
            'nik' => '12345',
            'name' => 'Warga Invalid',
            'phone' => '081299998888',
            'dusun' => 'Dusun Krajan',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('nik');
    }

    public function test_registration_fails_when_nik_already_registered(): void
    {
        $existingNik = '3328012005010001';
        $response = $this->postJson('/api/citizen/register', [
            'nik' => $existingNik,
            'name' => 'Warga Duplikat',
            'phone' => '0812' . rand(10000000, 99999999),
            'dusun' => 'Dusun Krajan',
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [409, 422]));
        $this->assertNotEmpty($response->json('message'));
    }

    public function test_citizen_can_request_and_verify_whatsapp_otp(): void
    {
        $phone = '081234567890';
        $reqOtp = $this->postJson('/api/citizen/request-otp', ['phone' => $phone]);

        $reqOtp->assertStatus(200);
        $otp = $reqOtp->json('demo_otp') ?? Cache::get('wa_otp_' . preg_replace('/[^0-9]/', '', $phone));
        $this->assertNotNull($otp);

        $verify = $this->postJson('/api/citizen/verify-otp', [
            'phone' => $phone,
            'otp' => (string) $otp,
        ]);

        $verify->assertStatus(200);
        $verify->assertJsonPath('success', true);
        $this->assertNotNull($verify->json('user.id'));
    }

    public function test_citizen_profile_can_be_retrieved_via_me_endpoint(): void
    {
        $response = $this->getJson('/api/citizen/me?phone=0812-3456-7890');

        $response->assertStatus(200);
        $this->assertNotEmpty($response->json('name'));
        $this->assertNotEmpty($response->json('dusun'));
    }

    public function test_citizen_can_login_with_nik(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'nik' => '3328012005010001',
            'password' => '123456',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertNotEmpty($response->json('token'));
        $this->assertEquals('Siti Rahmawati', $response->json('user.name'));
    }

    public function test_citizen_can_login_with_phone(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'phone' => '0812-3456-7890',
            'password' => '123456',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertEquals('Siti Rahmawati', $response->json('user.name'));
    }
}
