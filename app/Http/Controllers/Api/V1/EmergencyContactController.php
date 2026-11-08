<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmergencyContactResource;
use App\Services\JsonDataService;
use Illuminate\Http\JsonResponse;

class EmergencyContactController extends Controller
{
    protected JsonDataService $service;

    public function __construct(JsonDataService $service)
    {
        $this->service = $service;
    }

    public function index(): JsonResponse
    {
        $contacts = $this->service->getEmergencyContacts();
        return response()->json(EmergencyContactResource::collection(collect($contacts)));
    }
}
