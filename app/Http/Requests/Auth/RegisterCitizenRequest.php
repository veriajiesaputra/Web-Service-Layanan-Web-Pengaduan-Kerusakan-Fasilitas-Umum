<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterCitizenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nik' => [
                'required',
                'string',
                'size:16',
                'regex:/^[0-9]{16}$/',
            ],
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'dusun' => 'required|string|max:100',
            'rtRw' => 'nullable|string|max:50',
            'role' => 'nullable|string|max:100',
            'password' => 'nullable|string|min:4',
        ];
    }

    public function messages(): array
    {
        return [
            'nik.required' => 'Nomor Induk Kependudukan (NIK) wajib diisi.',
            'nik.size' => 'NIK harus berjumlah tepat 16 digit angka.',
            'nik.regex' => 'NIK hanya boleh berupa karakter numerik angka (0-9).',
            'name.required' => 'Nama lengkap warga wajib diisi.',
            'phone.required' => 'Nomor telepon/WhatsApp wajib diisi.',
            'dusun.required' => 'Nama dusun domisili wajib diisi.',
        ];
    }
}
