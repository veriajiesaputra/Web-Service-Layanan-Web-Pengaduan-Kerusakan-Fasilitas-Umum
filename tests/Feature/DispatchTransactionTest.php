<?php

namespace Tests\Feature;

use Tests\TestCase;

class DispatchTransactionTest extends TestCase
{
    public function test_can_list_field_teams_and_their_status(): void
    {
        $response = $this->getJson('/api/teams');

        $response->assertStatus(200);
        $teams = $response->json();
        $this->assertIsArray($teams);
        $this->assertNotEmpty($teams);
        $this->assertNotNull($teams[0]['name']);
    }

    public function test_admin_can_update_field_team_status(): void
    {
        $teams = $this->getJson('/api/teams')->json();
        $teamId = $teams[0]['id'];

        $response = $this->putJson('/api/teams/' . urlencode($teamId), [
            'status' => 'Bertugas',
        ]);

        $response->assertStatus(200);
        $this->assertIsArray($response->json());
        $this->assertNotNull($response->json('status') ?? $response->json()[0]['status']);
    }

    public function test_admin_can_verify_and_change_report_status(): void
    {
        $reports = $this->getJson('/api/reports')->json();
        $targetId = $reports[0]['id'];

        $response = $this->postJson('/api/reports/' . urlencode($targetId) . '/verify', [
            'status' => 'Sedang Dikerjakan',
            'assignedTeam' => 'Regu Lapangan Reaksi Cepat 01',
            'notes' => 'Regu lapangan telah dikerahkan ke lokasi.',
        ]);

        $response->assertStatus(200);
        $this->assertNotNull($response->json('status'));
        $this->assertEquals('Sedang Dikerjakan', $response->json('status'));
        $this->assertNotEmpty($response->json('timeline'));
    }

    public function test_daily_notes_log_can_be_retrieved_and_stored(): void
    {
        $listRes = $this->getJson('/api/daily-notes');
        $listRes->assertStatus(200);
        $this->assertIsArray($listRes->json());

        $createRes = $this->postJson('/api/daily-notes', [
            'text' => 'Pemeriksaan rutin pintu air blok timur selesai tanpa kendala.',
            'author' => 'Petugas Jaga Lapangan',
        ]);
        $this->assertTrue(in_array($createRes->getStatusCode(), [200, 201]));
        $this->assertNotEmpty($createRes->json());
    }

    public function test_emergency_contacts_are_accessible_for_field_team(): void
    {
        $response = $this->getJson('/api/emergency-contacts');

        $response->assertStatus(200);
        $contacts = $response->json();
        $this->assertIsArray($contacts);
        $this->assertNotNull($contacts[0]['phone'] ?? $contacts[0]['number'] ?? $contacts[0]['name']);
    }
}
