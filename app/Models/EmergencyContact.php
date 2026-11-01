<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmergencyContact extends Model
{
    protected $table = 'emergency_contacts';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'title',
        'name',
        'phone',
        'desc',
        'role',
        'icon',
        'badge',
        'available',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title ?? $this->name,
            'name' => $this->name ?? $this->title,
            'phone' => $this->phone,
            'desc' => $this->desc ?? $this->role,
            'role' => $this->role ?? $this->desc,
            'icon' => $this->icon ?? 'phone_in_talk',
            'badge' => $this->badge ?? $this->available ?? '24 Jam',
            'available' => $this->available ?? $this->badge ?? '24 Jam',
        ];
    }
}
