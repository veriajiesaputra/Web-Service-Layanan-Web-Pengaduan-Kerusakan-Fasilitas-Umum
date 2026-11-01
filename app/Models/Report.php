<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $table = 'reports';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'category',
        'category_label',
        'category_icon',
        'status',
        'location',
        'dusun',
        'description',
        'time_ago',
        'priority',
        'officer_badge',
        'officer_badge_type',
        'coordinates',
        'reporter_name',
        'reporter_role',
        'reporter_phone',
        'reporter_nik',
        'is_anonymous',
        'upvotes',
        'has_upvoted',
        'assigned_team',
        'notes',
        'rejection_reason',
        'photos',
        'timeline',
        'comments',
    ];

    protected $casts = [
        'is_anonymous' => 'boolean',
        'has_upvoted' => 'boolean',
        'upvotes' => 'integer',
        'coordinates' => 'array',
        'photos' => 'array',
        'timeline' => 'array',
        'comments' => 'array',
    ];

    /**
     * Convert model to the canonical array matching the React frontend and JSON format
     */
    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'categoryLabel' => $this->category_label ?? '',
            'categoryIcon' => $this->category_icon ?? 'construction',
            'status' => $this->status,
            'location' => $this->location,
            'dusun' => $this->dusun,
            'description' => $this->description,
            'timeAgo' => $this->time_ago ?? 'Baru saja',
            'createdAt' => $this->created_at ? $this->created_at->format('Y-m-d H:i') : date('Y-m-d H:i'),
            'priority' => $this->priority ?? 'Sedang',
            'officerBadge' => $this->officer_badge,
            'officerBadgeType' => $this->officer_badge_type ?? 'priority',
            'coordinates' => $this->coordinates ?? [
                'lat' => -6.8797,
                'lng' => 109.1835,
                'xPercent' => 50,
                'yPercent' => 50,
            ],
            'reporterName' => $this->reporter_name,
            'reporterRole' => $this->reporter_role,
            'reporterPhone' => $this->reporter_phone,
            'reporterNik' => $this->reporter_nik,
            'isAnonymous' => (bool)$this->is_anonymous,
            'upvotes' => (int)($this->upvotes ?? 0),
            'hasUpvoted' => (bool)$this->has_upvoted,
            'assignedTeam' => $this->assigned_team,
            'notes' => $this->notes,
            'rejectionReason' => $this->rejection_reason,
            'photos' => $this->photos,
            'timeline' => $this->timeline ?? [],
            'comments' => $this->comments ?? [],
        ];
    }
}
