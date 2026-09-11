<?php

namespace App\Domain\Creator\Http\Requests;

use App\Domain\Creator\Enums\CreatorProfileVisibility;
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
            'profile_visibility' => ['sometimes', Rule::enum(CreatorProfileVisibility::class)],
            'social_links' => ['nullable', 'array:website,instagram,youtube,tiktok,x', 'max:5'],
            'social_links.website' => ['nullable', 'url:http,https', 'max:2048'],
            'social_links.instagram' => ['nullable', 'url:http,https', 'max:2048'],
            'social_links.youtube' => ['nullable', 'url:http,https', 'max:2048'],
            'social_links.tiktok' => ['nullable', 'url:http,https', 'max:2048'],
            'social_links.x' => ['nullable', 'url:http,https', 'max:2048'],
        ];
    }
}
