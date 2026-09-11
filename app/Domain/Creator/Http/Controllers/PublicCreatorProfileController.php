<?php

namespace App\Domain\Creator\Http\Controllers;

use App\Domain\Creator\Enums\CreatorProfileVisibility;
use App\Domain\Creator\Models\Creator;
use App\Http\Controllers\Controller;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class PublicCreatorProfileController extends Controller
{
    /**
     * Render a deliberately minimal public projection of a public creator.
     */
    public function show(Creator $creator): InertiaResponse|Response
    {
        abort_unless($creator->profile_visibility === CreatorProfileVisibility::Public, 404);

        return Inertia::render('creator/public', [
            'creator' => [
                'handle' => $creator->handle,
                'displayName' => $creator->display_name,
                'bio' => $creator->bio,
                'socialLinks' => $creator->social_links ?? [],
            ],
        ]);
    }
}
