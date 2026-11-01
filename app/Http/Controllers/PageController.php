<?php

namespace App\Http\Controllers;

use App\Services\JsonDataService;
use Illuminate\Contracts\View\View;

class PageController extends Controller
{
    protected JsonDataService $service;

    public function __construct(JsonDataService $service)
    {
        $this->service = $service;
    }

    public function pengguna(): View
    {
        // Provide initial data for quick SSR hydration if needed
        $initialReports = $this->service->getReports();
        $stats = $this->service->getStats();
        $contacts = $this->service->getEmergencyContacts();

        return view('pengguna', compact('initialReports', 'stats', 'contacts'));
    }

    public function dasbor(): View
    {
        $initialReports = $this->service->getReports();
        $teams = $this->service->getTeams();
        $notes = $this->service->getDailyNotes();
        $stats = $this->service->getStats();

        return view('dasbor', compact('initialReports', 'teams', 'notes', 'stats'));
    }
}
