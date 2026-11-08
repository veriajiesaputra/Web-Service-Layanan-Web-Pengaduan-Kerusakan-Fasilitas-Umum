<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    /**
     * Transform the resource into an array adhering to OpenAPI 3.1.0 schema.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if (is_array($this->resource)) {
            return $this->resource;
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'status' => $this->status,
            'priority' => $this->priority ?? 'medium',
            'location' => $this->location,
            'dusun' => $this->dusun,
            'rtRw' => $this->rt_rw,
            'description' => $this->description,
            'upvotes' => (int) ($this->upvotes ?? 0),
            'has_upvoted' => (bool) ($this->has_upvoted ?? false),
            'reporterName' => $this->is_anonymous ? 'Warga Anonim' : ($this->reporter_name ?? 'Warga Kepunduhan'),
            'reporterPhone' => $this->is_anonymous ? 'Disamarkan' : ($this->reporter_phone ?? '-'),
            'isAnonymous' => (bool) $this->is_anonymous,
            'assignedTeam' => $this->assigned_team ?? '-',
            'officerBadge' => $this->officer_badge,
            'officerBadgeType' => $this->officer_badge_type,
            'notes' => $this->notes,
            'timeline' => $this->timeline ?? [],
            'comments' => $this->comments ?? [],
            'photoUrl' => $this->photo_url,
            'coordinates' => $this->coordinates,
            'createdAt' => $this->created_at ? $this->created_at->toISOString() : null,
            'updatedAt' => $this->updated_at ? $this->updated_at->toISOString() : null,
        ];
    }
}
