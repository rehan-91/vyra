<?php

namespace App\Domain\Creator\Http\Requests;

use App\Domain\Creator\Http\Requests\Concerns\CanonicalizesCreatorHandle;
use App\Domain\Creator\Models\Creator;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCreatorRequest extends FormRequest
{
    use CanonicalizesCreatorHandle;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $creator = $this->route('creator');

        abort_if(! $creator instanceof Creator, 404);

        return [
            'handle' => ['required', 'string', 'min:3', 'max:30', 'alpha_dash:ascii', Rule::unique('creators', 'handle')->ignore($creator)],
            'display_name' => ['required', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
