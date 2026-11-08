<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class VerifyReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'assignedTeam' => 'required|string',
            'notes' => 'nullable|string',
            'status' => 'nullable|string',
            'priority' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'assignedTeam.required' => 'Regu satgas lapangan wajib ditentukan.',
        ];
    }
}
