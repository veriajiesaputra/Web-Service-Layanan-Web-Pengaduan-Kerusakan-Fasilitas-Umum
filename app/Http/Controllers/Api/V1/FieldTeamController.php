<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TeamResource;
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
        $teams = $this->service->getTeams();
        return response()->json(TeamResource::collection(collect($teams)));
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
        return response()->json(new TeamResource($updated));
    }
}
