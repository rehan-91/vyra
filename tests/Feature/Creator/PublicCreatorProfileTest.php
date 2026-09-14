<?php

namespace Tests\Feature\Creator;

use App\Domain\Creator\Models\Creator;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicCreatorProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_view_a_public_creator_profile(): void
    {
        $creator = Creator::factory()->public()->create([
            'handle' => 'ada_creates',
            'display_name' => 'Ada Creates',
            'bio' => 'Thoughtful things for the internet.',
            'social_links' => ['website' => 'https://ada.example'],
        ]);

        $this->get('/@'.$creator->handle)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('creator/public')
                ->where('creator.handle', 'ada_creates')
                ->where('creator.displayName', 'Ada Creates')
                ->where('creator.bio', 'Thoughtful things for the internet.')
                ->where('creator.socialLinks.website', 'https://ada.example')
                ->missing('creator.id')
                ->missing('creator.user_id')
                ->missing('creator.email')
                ->missing('creator.owner')
                ->missing('creator.date_of_birth'),
            );
    }

    public function test_private_creator_profiles_are_not_publicly_discoverable(): void
    {
        $creator = Creator::factory()->create(['handle' => 'not_yet_public']);

        $this->get('/@'.$creator->handle)->assertNotFound();
    }

    public function test_nonexistent_and_noncanonical_public_handles_return_not_found(): void
    {
        $this->get('/@missing_creator')->assertNotFound();

        $creator = Creator::factory()->public()->create(['handle' => 'lowercase_only']);

        $this->get('/@LOWERCASE_ONLY')->assertNotFound();
        $this->assertSame('lowercase_only', $creator->fresh()->handle);
    }

    public function test_an_owner_can_update_profile_visibility_and_social_links(): void
    {
        $owner = User::factory()->create();
        $creator = Creator::factory()->for($owner, 'owner')->create();

        $this->actingAs($owner)
            ->patch(route('creator.update', $creator), [
                'display_name' => 'Updated Creator',
                'handle' => 'Updated_Creator',
                'bio' => 'An intentionally public profile.',
                'profile_visibility' => 'public',
                'social_links' => [
                    'website' => 'https://creator.example',
                    'instagram' => 'https://instagram.com/creator',
                ],
            ])
            ->assertRedirect(route('creator.manage', $creator));

        $this->assertDatabaseHas('creators', [
            'id' => $creator->id,
            'handle' => 'updated_creator',
            'profile_visibility' => 'public',
        ]);
        $this->assertSame([
            'website' => 'https://creator.example',
            'instagram' => 'https://instagram.com/creator',
        ], $creator->fresh()->social_links);
    }

    public function test_social_links_are_allowlisted_and_require_http_urls(): void
    {
        $owner = User::factory()->create();
        $creator = Creator::factory()->for($owner, 'owner')->create();

        $this->actingAs($owner)
            ->from(route('creator.manage', $creator))
            ->patch(route('creator.update', $creator), [
                'display_name' => $creator->display_name,
                'handle' => $creator->handle,
                'social_links' => [
                    'website' => 'javascript:alert(1)',
                    'unapproved' => 'https://example.com',
                ],
            ])
            ->assertRedirect(route('creator.manage', $creator))
            ->assertSessionHasErrors(['social_links', 'social_links.website']);
    }

    public function test_a_non_owner_cannot_change_profile_visibility_or_links(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $creator = Creator::factory()->for($owner, 'owner')->create();

        $this->actingAs($otherUser)
            ->patch(route('creator.update', $creator), [
                'display_name' => $creator->display_name,
                'handle' => $creator->handle,
                'profile_visibility' => 'public',
                'social_links' => ['website' => 'https://attacker.example'],
                'user_id' => $otherUser->id,
            ])
            ->assertForbidden();

        $this->assertSame('private', $creator->fresh()->profile_visibility->value);
        $this->assertSame($owner->id, $creator->fresh()->user_id);
        $this->assertNull($creator->fresh()->social_links);
    }
}
