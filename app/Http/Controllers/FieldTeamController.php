<?php

namespace App\Http\Controllers;

use App\Services\JsonDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FieldTeamController extends Controller
{
    protected JsonDataService $service;

    public function __construct(JsonDataService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        return response()->json($this->service->getTeams());
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'nullable|string',
            'currentLocation' => 'nullable|string',
            'leader' => 'nullable|string',
            'activeMembers' => 'nullable|integer',
            'vehicle' => 'nullable|string',
        ]);

        $updated = $this->service->updateTeam($id, $validated);
        if (!$updated) {
            return response()->json(['message' => 'Regu tidak ditemukan'], 404);
        }
        return response()->json($updated);
    }
}
