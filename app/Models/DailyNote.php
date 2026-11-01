<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyNote extends Model
{
    protected $table = 'daily_notes';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'time',
        'author',
        'text',
    ];

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'time' => $this->time ?? ($this->created_at ? $this->created_at->format('H:i') . ' WIB' : date('H:i') . ' WIB'),
            'author' => $this->author ?? 'Petugas Jaga Lapangan',
            'text' => $this->text,
            'createdAt' => $this->created_at ? $this->created_at->format('Y-m-d H:i:s') : date('Y-m-d H:i:s'),
        ];
    }
}
