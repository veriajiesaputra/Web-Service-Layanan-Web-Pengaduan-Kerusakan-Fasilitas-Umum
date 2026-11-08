<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmergencyContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        if (is_array($this->resource)) {
            return $this->resource;
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'agency' => $this->agency ?? $this->name,
            'phone' => $this->phone,
            'category' => $this->category ?? 'Umum',
            'available' => $this->available ?? '24 Jam',
            'desc' => $this->desc ?? 'Layanan siaga tanggap darurat Desa Kepunduhan.',
        ];
    }
}
