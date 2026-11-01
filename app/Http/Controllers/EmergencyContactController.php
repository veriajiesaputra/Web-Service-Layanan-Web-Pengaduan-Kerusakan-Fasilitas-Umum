<?php

namespace App\Http\Controllers;

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
        return response()->json($this->service->getEmergencyContacts());
    }
}
