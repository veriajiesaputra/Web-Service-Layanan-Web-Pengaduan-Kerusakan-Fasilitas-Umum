<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        if (is_array($this->resource)) {
            return $this->resource;
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'status' => $this->status,
            'assignedCount' => (int) ($this->assigned_count ?? 0),
            'phone' => $this->phone,
            'code' => $this->code,
            'specialty' => $this->specialty,
            'membersCount' => (int) ($this->members_count ?? 0),
            'leader' => $this->leader,
            'assignedTickets' => $this->assigned_tickets ?? [],
        ];
    }
}
