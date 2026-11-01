<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Citizen extends Model
{
    protected $table = 'citizens';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'nik',
        'name',
        'phone',
        'dusun',
        'rt_rw',
        'role',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'nik' => $this->nik,
            'name' => $this->name,
            'phone' => $this->phone,
            'dusun' => $this->dusun,
            'rtRw' => $this->rt_rw,
            'role' => $this->role,
            'createdAt' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : date('Y-m-d H:i:s'),
        ];
    }
}
