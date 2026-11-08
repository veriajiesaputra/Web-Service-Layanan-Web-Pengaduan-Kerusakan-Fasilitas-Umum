<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DailyNoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        if (is_array($this->resource)) {
            return $this->resource;
        }

        return [
            'id' => $this->id,
            'text' => $this->text,
            'author' => $this->author ?? 'Petugas Lapangan',
            'time' => $this->created_at ? $this->created_at->format('H:i') . ' WIB' : 'Hari ini',
            'createdAt' => $this->created_at ? $this->created_at->toISOString() : null,
        ];
    }
}
