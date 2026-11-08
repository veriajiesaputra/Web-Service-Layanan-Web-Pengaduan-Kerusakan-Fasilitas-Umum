<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DailyNoteResource;
use App\Services\JsonDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DailyNoteController extends Controller
{
    protected JsonDataService $service;

    public function __construct(JsonDataService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $notes = $this->service->getDailyNotes();
        return response()->json(DailyNoteResource::collection(collect($notes)));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'text' => 'required|string|max:1000',
            'author' => 'nullable|string',
        ]);

        $note = $this->service->addDailyNote($validated);
        return response()->json(new DailyNoteResource($note), 201);
    }
}
