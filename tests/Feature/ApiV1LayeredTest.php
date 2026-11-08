<?php

namespace Tests\Feature;

use Tests\TestCase;

class ApiV1LayeredTest extends TestCase
{
    public function test_v1_reports_endpoint_returns_json_resource_collection(): void
    {
        $response = $this->getJson('/api/v1/reports');

        $response->assertStatus(200);
        $this->assertIsArray($response->json());
        $this->assertNotEmpty($response->json());
        $this->assertArrayHasKey('id', $response->json()[0]);
        $this->assertArrayHasKey('title', $response->json()[0]);
    }

    public function test_v1_store_report_uses_form_request_validation(): void
    {
        // 1. Invalid payload -> 422 with uniform {message, errors}
        $invalidRes = $this->postJson('/api/v1/reports', []);
        $invalidRes->assertStatus(422);
        $invalidRes->assertJsonStructure(['message', 'errors']);
        $invalidRes->assertJsonValidationErrors(['title', 'category', 'description']);

        // 2. Valid payload -> 201 with ReportResource
        $validPayload = [
            'title' => 'Lampu PJU Padam Depan Balai Desa RT 01',
            'category' => 'penerangan',
            'description' => 'Lampu jalan mati sejak dua malam lalu membahayakan pengendara malam.',
            'dusun' => 'Dusun Krajan',
            'rtRw' => 'RT 01 / RW 01',
            'location' => 'Dusun Krajan, RT 01 / RW 01',
            'reporterName' => 'Ahmad Warga',
            'reporterPhone' => '081234567890',
        ];

        $createRes = $this->postJson('/api/v1/reports', $validPayload);
        $createRes->assertStatus(201);
        $createRes->assertJsonPath('title', $validPayload['title']);
        $createRes->assertJsonPath('category', 'penerangan');
        $this->assertNotNull($createRes->json('id'));
    }

    public function test_v1_citizen_auth_login_returns_citizen_resource(): void
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'nik' => '3328012005010001',
            'password' => '123456',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $this->assertNotEmpty($response->json('token'));
        $this->assertEquals('Siti Rahmawati', $response->json('user.name'));
        $this->assertStringContainsString('Krajan', $response->json('user.dusun'));
    }

    public function test_v1_field_teams_returns_team_resource_collection(): void
    {
        $response = $this->getJson('/api/v1/teams');

        $response->assertStatus(200);
        $teams = $response->json();
        $this->assertIsArray($teams);
        $this->assertNotEmpty($teams);
        $this->assertArrayHasKey('name', $teams[0]);
        $this->assertArrayHasKey('status', $teams[0]);
    }

    public function test_v1_daily_notes_returns_daily_note_resource_collection(): void
    {
        $response = $this->getJson('/api/v1/daily-notes');

        $response->assertStatus(200);
        $notes = $response->json();
        $this->assertIsArray($notes);
        $this->assertNotEmpty($notes);
        $this->assertArrayHasKey('text', $notes[0]);
    }

    public function test_v1_emergency_contacts_returns_emergency_contact_resource_collection(): void
    {
        $response = $this->getJson('/api/v1/emergency-contacts');

        $response->assertStatus(200);
        $contacts = $response->json();
        $this->assertIsArray($contacts);
        $this->assertNotEmpty($contacts);
        $this->assertArrayHasKey('phone', $contacts[0]);
    }

    public function test_exception_handler_returns_uniform_json_for_404(): void
    {
        $response = $this->getJson('/api/v1/non-existent-endpoint-test-404');

        $response->assertStatus(404);
        $response->assertJsonStructure(['message', 'errors']);
    }

    public function test_exception_handler_returns_uniform_json_for_405(): void
    {
        $response = $this->deleteJson('/api/v1/me');

        $response->assertStatus(405);
        $response->assertJsonStructure(['message', 'errors']);
    }
}
