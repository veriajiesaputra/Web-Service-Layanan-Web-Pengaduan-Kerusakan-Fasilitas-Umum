<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'description' => 'required|string',
            'dusun' => 'nullable|string',
            'rtRw' => 'nullable|string',
            'location' => 'nullable|string',
            'priority' => 'nullable|string',
            'reporterName' => 'nullable|string',
            'reporterPhone' => 'nullable|string',
            'phone' => 'nullable|string',
            'isAnonymous' => 'nullable|boolean',
            'photoUrl' => 'nullable|string',
            'coordinates' => 'nullable|array',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul laporan kerusakan wajib diisi.',
            'category.required' => 'Kategori fasilitas publik wajib dipilih.',
            'description.required' => 'Deskripsi keluhan wajib dijelaskan secara rinci.',
        ];
    }
}
