<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $table = 'teams';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'code',
        'name',
        'division',
        'leader',
        'active_members',
        'vehicle',
        'current_location',
        'status',
        'assigned_tickets',
    ];

    protected $casts = [
        'assigned_tickets' => 'array',
        'active_members' => 'integer',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'division' => $this->division,
            'leader' => $this->leader,
            'activeMembers' => (int)($this->active_members ?? 4),
            'status' => $this->status,
            'currentLocation' => $this->current_location,
            'assignedTickets' => $this->assigned_tickets ?? [],
            'vehicle' => $this->vehicle,
        ];
    }
}
