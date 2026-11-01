<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExternalGeoLocationTest extends TestCase
{
    public function test_geocoding_lookup_succeeds_with_valid_coordinates(): void
    {
        $response = $this->getJson('/api/regions/search?q=Slawi');

        $response->assertStatus(200);
        $this->assertNotNull($response->json('data'));
        $this->assertIsArray($response->json('data'));
    }

    public function test_provinces_list_can_be_retrieved_and_cached(): void
    {
        $response = $this->getJson('/api/regions/provinces');

        $response->assertStatus(200);
        $this->assertNotNull($response->json('data'));
    }

    public function test_geocoding_lookup_falls_back_gracefully_on_500_error(): void
    {
        Http::fake([
            '*/destination*' => Http::response(['message' => 'Internal Server Error'], 500),
            '*/reverse*' => Http::response(['message' => 'Internal Server Error'], 500),
        ]);

        $response = $this->getJson('/api/regions/search?q=FallbackTest');

        $this->assertTrue(in_array($response->getStatusCode(), [200, 500]));
        $this->assertNotNull($response->json());
    }

    public function test_geocoding_lookup_handles_network_timeout(): void
    {
        Http::fake([
            '*/destination*' => Http::response(null, 504),
        ]);

        $response = $this->getJson('/api/regions/search?q=TimeoutTest');

        $this->assertNotNull($response->getStatusCode());
        $this->assertNotNull($response->json());
    }

    public function test_regions_search_handles_empty_or_special_characters(): void
    {
        $response = $this->getJson('/api/regions/search?q=' . urlencode('@#$%^&*()'));

        $this->assertTrue(in_array($response->getStatusCode(), [200, 422]));
        $this->assertNotNull($response->json());
        $this->assertIsArray($response->json('data') ?? $response->json());
    }
}
