<?php

namespace Tests\Feature\Infrastructure;

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OctaneRequestStateTest extends TestCase
{
    use RefreshDatabase;

    public function test_team_routing_does_not_retain_url_defaults_between_requests(): void
    {
        $user = User::factory()->create(['email_verified_at' => now()]);
        $team = Team::factory()->create();

        $team->members()->attach($user, ['role' => TeamRole::Owner->value]);
        $user->update(['current_team_id' => $team->id]);

        $this->actingAs($user)
            ->get(route('dashboard', ['current_team' => $team]))
            ->assertOk();

        $this->assertSame([], URL::getDefaultParameters());

        $this->get(route('dashboard', ['current_team' => $team]))
            ->assertOk();

        $this->assertSame([], URL::getDefaultParameters());
    }

    public function test_appearance_is_resolved_for_each_request_without_shared_view_state(): void
    {
        $this->withUnencryptedCookie('appearance', 'dark')
            ->get('/')
            ->assertOk()
            ->assertSee("const appearance = 'dark';", false);

        $this->defaultCookies = [];
        $this->unencryptedCookies = [];

        $this->get('/')
            ->assertOk()
            ->assertSee("const appearance = 'system';", false);
    }

    public function test_inertia_shared_state_does_not_leak_from_an_authenticated_request(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get('/')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user.id', $user->id)
                ->where('currentTeam.slug', $user->currentTeam->slug)
                ->has('teams', 1),
            );

        $this->app['auth']->forgetGuards();

        $this->get('/')
            ->assertInertia(fn (Assert $page) => $page
                ->where('auth.user', null)
                ->where('currentTeam', null)
                ->where('teams', []),
            );
    }
}
