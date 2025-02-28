<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'lastname' => ['required', 'string', 'max:50', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'id_number' => ['required', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($this->user()->id)],
            'current_password' => ['required_with:password', 'current_password'],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'password_confirmation' => ['required_with:password'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es requerido',
            'name.regex' => 'El nombre solo debe contener letras y espacios',
            'name.max' => 'El nombre no debe exceder los 50 caracteres',
            'lastname.required' => 'Los apellidos son requeridos',
            'lastname.regex' => 'Los apellidos solo deben contener letras y espacios',
            'lastname.max' => 'Los apellidos no deben exceder los 50 caracteres',
            'id_number.required' => 'La cédula es requerida',
            'email.required' => 'El correo electrónico es requerido',
            'email.email' => 'El correo electrónico debe ser válido',
            'email.unique' => 'Este correo electrónico ya está en uso',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // Eliminar espacios al inicio y final de los campos
        $this->merge([
            'name' => $this->name ? trim($this->name) : null,
            'lastname' => $this->lastname ? trim($this->lastname) : null,
            'id_number' => $this->id_number ? trim($this->id_number) : null,
            'phone' => $this->phone ? trim($this->phone) : null,
            'email' => $this->email ? trim($this->email) : null,
        ]);
    }
}
