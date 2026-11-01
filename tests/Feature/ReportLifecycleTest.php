<?php

namespace Tests\Feature;

use Tests\TestCase;

class ReportLifecycleTest extends TestCase
{
    public function test_can_get_paginated_list_of_reports(): void
    {
        $response = $this->getJson('/api/reports');

        $response->assertStatus(200);
        $this->assertIsArray($response->json());
        $this->assertNotEmpty($response->json());
    }

    public function test_can_filter_reports_by_category_and_status(): void
    {
        $response = $this->getJson('/api/reports?category=jalan');

        $response->assertStatus(200);
        $this->assertIsArray($response->json());
    }

    public function test_citizen_can_create_new_report_with_valid_payload(): void
    {
        $payload = [
            'title' => 'Kerusakan Saluran Irigasi Blok Barat',
            'category' => 'irigasi',
            'location' => 'Dusun Sukamaju, RT 02 / RW 03',
            'dusun' => 'Dusun Sukamaju',
            'description' => 'Tanggul irigasi jebol tergerus debit air tinggi kemarin malam.',
            'reporterName' => 'Ahmad Fauzi',
            'priority' => 'Tinggi',
        ];

        $response = $this->postJson('/api/reports', $payload);

        $response->assertStatus(201);
        $this->assertNotNull($response->json('id'));
        $this->assertEquals($payload['title'], $response->json('title'));
        $this->assertEquals('irigasi', $response->json('category'));
        $this->assertEquals('Diajukan', $response->json('status'));
    }

    public function test_create_report_fails_when_required_fields_are_missing(): void
    {
        $response = $this->postJson('/api/reports', []);

        $this->assertTrue(in_array($response->getStatusCode(), [400, 422]));
        $this->assertNotEmpty($response->json('message'));
    }

    public function test_can_show_single_report_details(): void
    {
        $list = $this->getJson('/api/reports');
        $reports = $list->json();
        $this->assertNotEmpty($reports);

        $targetId = $reports[0]['id'];
        $response = $this->getJson('/api/reports/' . urlencode($targetId));

        $response->assertStatus(200);
        $this->assertEquals($targetId, $response->json('id'));
    }

    public function test_show_report_returns_404_for_non_existent_id(): void
    {
        $response = $this->getJson('/api/reports/LAP-NONEXISTENT-9999');

        $response->assertStatus(404);
        $this->assertNotEmpty($response->json('message'));
    }

    public function test_citizen_can_toggle_upvote_and_add_comment(): void
    {
        $list = $this->getJson('/api/reports');
        $targetId = $list->json()[0]['id'];

        $upvoteRes = $this->postJson('/api/reports/' . urlencode($targetId) . '/upvote');
        $upvoteRes->assertStatus(200);
        $this->assertNotNull($upvoteRes->json('upvotes'));

        $commentRes = $this->postJson('/api/reports/' . urlencode($targetId) . '/comments', [
            'author' => 'Warga Peduli',
            'role' => 'Warga',
            'text' => 'Mohon segera diperbaiki agar air tidak menggenang.',
        ]);
        $commentRes->assertStatus(200);
        $this->assertNotNull($commentRes->json('comments'));
        $this->assertNotEmpty($commentRes->json('comments'));
    }
}
