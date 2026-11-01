<?php

namespace Database\Seeders;

use App\Models\Citizen;
use App\Models\DailyNote;
use App\Models\EmergencyContact;
use App\Models\Report;
use App\Models\Team;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class JsonToDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $dataDir = File::isDirectory(database_path('seeders/data'))
            ? database_path('seeders/data')
            : storage_path('app/data');

        // 1. Seed Citizens
        $citizensFile = $dataDir . '/citizens.json';
        if (File::exists($citizensFile)) {
            $citizens = json_decode(File::get($citizensFile), true) ?: [];
            foreach ($citizens as $c) {
                $nik = !empty($c['nik']) ? $c['nik'] : null;

                if ($nik && Citizen::where('nik', $nik)->where('id', '!=', $c['id'])->exists()) {
                    $nik = null;
                }

                Citizen::updateOrCreate(
                    ['id' => $c['id']],
                    [
                        'nik' => $nik,
                        'name' => $c['name'] ?? 'Warga',
                        'phone' => $c['phone'] ?? '',
                        'dusun' => $c['dusun'] ?? null,
                        'rt_rw' => $c['rtRw'] ?? $c['rt_rw'] ?? null,
                        'role' => $c['role'] ?? 'Warga',
                        'password' => $c['password'] ?? '123456',
                    ]
                );
            }
        }

        // 2. Seed Teams
        $teamsFile = $dataDir . '/teams.json';
        if (File::exists($teamsFile)) {
            $teams = json_decode(File::get($teamsFile), true) ?: [];
            foreach ($teams as $t) {
                Team::updateOrCreate(
                    ['id' => $t['id']],
                    [
                        'code' => $t['code'] ?? null,
                        'name' => $t['name'] ?? 'Regu Lapangan',
                        'division' => $t['division'] ?? null,
                        'leader' => $t['leader'] ?? null,
                        'active_members' => $t['activeMembers'] ?? $t['active_members'] ?? 4,
                        'vehicle' => $t['vehicle'] ?? null,
                        'current_location' => $t['currentLocation'] ?? $t['current_location'] ?? null,
                        'status' => $t['status'] ?? 'Tersedia',
                        'assigned_tickets' => $t['assignedTickets'] ?? $t['assigned_tickets'] ?? [],
                    ]
                );
            }
        }

        // 3. Seed Daily Notes
        $notesFile = $dataDir . '/daily_notes.json';
        if (File::exists($notesFile)) {
            $notes = json_decode(File::get($notesFile), true) ?: [];
            foreach ($notes as $n) {
                DailyNote::updateOrCreate(
                    ['id' => $n['id']],
                    [
                        'time' => $n['time'] ?? null,
                        'author' => $n['author'] ?? 'Perangkat Desa',
                        'text' => $n['text'] ?? '',
                    ]
                );
            }
        }

        // 4. Seed Emergency Contacts
        $contactsFile = $dataDir . '/emergency_contacts.json';
        if (File::exists($contactsFile)) {
            $contacts = json_decode(File::get($contactsFile), true) ?: [];
            foreach ($contacts as $idx => $ct) {
                $id = $ct['id'] ?? ('contact-' . ($idx + 1));
                EmergencyContact::updateOrCreate(
                    ['id' => $id],
                    [
                        'title' => $ct['title'] ?? $ct['name'] ?? 'Kontak Darurat',
                        'name' => $ct['name'] ?? $ct['title'] ?? 'Kontak Darurat',
                        'phone' => $ct['phone'] ?? '',
                        'desc' => $ct['desc'] ?? $ct['role'] ?? '',
                        'role' => $ct['role'] ?? $ct['desc'] ?? '',
                        'icon' => $ct['icon'] ?? 'phone_in_talk',
                        'badge' => $ct['badge'] ?? $ct['available'] ?? '24 Jam',
                        'available' => $ct['available'] ?? $ct['badge'] ?? '24 Jam',
                    ]
                );
            }
        }

        // 5. Seed Reports
        $reportsFile = $dataDir . '/reports.json';
        if (File::exists($reportsFile)) {
            $reports = json_decode(File::get($reportsFile), true) ?: [];
            foreach ($reports as $r) {
                Report::updateOrCreate(
                    ['id' => $r['id']],
                    [
                        'title' => $r['title'] ?? 'Laporan Warga',
                        'category' => $r['category'] ?? 'jalan',
                        'category_label' => $r['categoryLabel'] ?? $r['category_label'] ?? '',
                        'category_icon' => $r['categoryIcon'] ?? $r['category_icon'] ?? '',
                        'status' => $r['status'] ?? 'Diajukan',
                        'location' => $r['location'] ?? null,
                        'dusun' => $r['dusun'] ?? null,
                        'description' => $r['description'] ?? null,
                        'time_ago' => $r['timeAgo'] ?? $r['time_ago'] ?? null,
                        'priority' => $r['priority'] ?? 'Sedang',
                        'officer_badge' => $r['officerBadge'] ?? $r['officer_badge'] ?? null,
                        'officer_badge_type' => $r['officerBadgeType'] ?? $r['officer_badge_type'] ?? 'priority',
                        'coordinates' => $r['coordinates'] ?? null,
                        'reporter_name' => $r['reporterName'] ?? $r['reporter_name'] ?? null,
                        'reporter_role' => $r['reporterRole'] ?? $r['reporter_role'] ?? null,
                        'reporter_phone' => $r['reporterPhone'] ?? $r['reporter_phone'] ?? null,
                        'reporter_nik' => $r['reporterNik'] ?? $r['reporter_nik'] ?? null,
                        'is_anonymous' => !empty($r['isAnonymous']),
                        'upvotes' => (int)($r['upvotes'] ?? 0),
                        'has_upvoted' => !empty($r['hasUpvoted']),
                        'assigned_team' => $r['assignedTeam'] ?? $r['assigned_team'] ?? null,
                        'notes' => $r['notes'] ?? null,
                        'rejection_reason' => $r['rejectionReason'] ?? $r['rejection_reason'] ?? null,
                        'photos' => $r['photos'] ?? null,
                        'timeline' => $r['timeline'] ?? [],
                        'comments' => $r['comments'] ?? [],
                    ]
                );
            }
        }
    }
}
