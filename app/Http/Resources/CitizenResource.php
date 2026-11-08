<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CitizenResource extends JsonResource
{
    /**
     * Transform the resource into an array adhering to OpenAPI 3.1.0 schema.
     * Sembunyikan field rahasia (password, hash) sesuai instruksi Modul 6.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if (is_array($this->resource)) {
            $data = $this->resource;
            unset($data['password']);
            return $data;
        }

        return [
            'id' => $this->id,
            'nik' => $this->nik,
            'name' => $this->name,
            'phone' => $this->phone,
            'dusun' => $this->dusun,
            'rtRw' => $this->rt_rw,
            'role' => $this->role ?? 'Warga',
            'createdAt' => $this->created_at ? $this->created_at->toISOString() : null,
        ];
    }
}
