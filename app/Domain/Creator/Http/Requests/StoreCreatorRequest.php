<?php

namespace App\Domain\Creator\Http\Requests;

use App\Domain\Creator\Http\Requests\Concerns\CanonicalizesCreatorHandle;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCreatorRequest extends FormRequest
{
    use CanonicalizesCreatorHandle;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'handle' => ['required', 'string', 'min:3', 'max:30', 'alpha_dash:ascii', Rule::unique('creators', 'handle')],
            'display_name' => ['required', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
