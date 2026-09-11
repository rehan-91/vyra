<?php

namespace App\Domain\Creator\Actions;

use App\Domain\Creator\Models\Creator;

class UpdateCreatorProfile
{
    /**
     * Update only the validated, owner-authorized creator profile attributes.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function handle(Creator $creator, array $attributes): Creator
    {
        if (array_key_exists('social_links', $attributes)) {
            $socialLinks = [];

            if (is_array($attributes['social_links'])) {
                foreach ($attributes['social_links'] as $platform => $url) {
                    if (is_string($platform) && is_string($url) && $url !== '') {
                        $socialLinks[$platform] = $url;
                    }
                }
            }

            $attributes['social_links'] = $socialLinks === [] ? null : $socialLinks;
        }

        $creator->update($attributes);

        return $creator->refresh();
    }
}
