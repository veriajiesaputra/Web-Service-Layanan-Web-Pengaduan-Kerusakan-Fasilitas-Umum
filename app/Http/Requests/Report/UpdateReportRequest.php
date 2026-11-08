<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'nullable|string|max:255',
            'category' => 'nullable|string',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
            'location' => 'nullable|string',
            'dusun' => 'nullable|string',
            'rtRw' => 'nullable|string',
            'description' => 'nullable|string',
            'assignedTeam' => 'nullable|string',
            'notes' => 'nullable|string',
            'rejectionReason' => 'nullable|string',
            'reporterName' => 'nullable|string',
            'reporterPhone' => 'nullable|string',
            'phone' => 'nullable|string',
            'isAnonymous' => 'nullable|boolean',
            'photoUrl' => 'nullable|string',
        ];
    }
}
