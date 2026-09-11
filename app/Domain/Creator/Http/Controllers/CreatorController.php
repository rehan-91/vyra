<?php

namespace App\Domain\Creator\Http\Controllers;

use App\Domain\Creator\Actions\CreateCreator;
use App\Domain\Creator\Actions\UpdateCreatorProfile;
use App\Domain\Creator\Exceptions\CreatorAlreadyExists;
use App\Domain\Creator\Http\Requests\StoreCreatorRequest;
use App\Domain\Creator\Http\Requests\UpdateCreatorRequest;
use App\Domain\Creator\Models\Creator;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CreatorController extends Controller
{
    /**
     * Direct the authenticated user to their creator identity or creation flow.
     */
    public function show(Request $request): RedirectResponse
    {
        $creator = $request->user()->creator;

        return $creator
            ? to_route('creator.manage', $creator)
            : to_route('creator.create');
    }

    /**
     * Show the creator identity creation form.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Creator::class);

        return Inertia::render('creator/create');
    }

    /**
     * Store a creator identity owned by the authenticated user.
     */
    public function store(StoreCreatorRequest $request, CreateCreator $createCreator): RedirectResponse
    {
        Gate::authorize('create', Creator::class);

        try {
            $creator = $createCreator->handle(
                $request->user(),
                $request->string('handle')->value(),
                $request->string('display_name')->value(),
                $request->filled('bio') ? $request->string('bio')->value() : null,
            );
        } catch (CreatorAlreadyExists $exception) {
            Inertia::flash('toast', ['type' => 'info', 'message' => __('Creator identity already exists.')]);

            return to_route('creator.manage', $exception->creator);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Creator identity created.')]);

        return to_route('creator.manage', $creator);
    }

    /**
     * Show the private creator management page.
     */
    public function manage(Creator $creator): Response
    {
        Gate::authorize('view', $creator);

        return Inertia::render('creator/manage', [
            'creator' => $this->creator($creator),
        ]);
    }

    /**
     * Update the creator identity.
     */
    public function update(UpdateCreatorRequest $request, Creator $creator, UpdateCreatorProfile $updateCreatorProfile): RedirectResponse
    {
        Gate::authorize('update', $creator);

        $updateCreatorProfile->handle($creator, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Creator profile updated.')]);

        return to_route('creator.manage', $creator);
    }

    /**
     * Delete the creator identity.
     */
    public function destroy(Creator $creator): RedirectResponse
    {
        Gate::authorize('delete', $creator);

        $creator->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Creator identity deleted.')]);

        return to_route('creator.create');
    }

    /**
     * Shape the private management payload.
     *
     * @return array{id: int, handle: string, displayName: string, bio: string|null, profileVisibility: string, socialLinks: array<string, string>, publicUrl: string}
     */
    private function creator(Creator $creator): array
    {
        return [
            'id' => $creator->id,
            'handle' => $creator->handle,
            'displayName' => $creator->display_name,
            'bio' => $creator->bio,
            'profileVisibility' => $creator->profile_visibility->value,
            'socialLinks' => $creator->social_links ?? [],
            'publicUrl' => url('/@'.$creator->handle),
        ];
    }
}
