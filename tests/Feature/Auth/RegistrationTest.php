<?php

namespace Tests\Feature\Auth;

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_registration_screen_includes_team_invitation_context()
    {
        $owner = User::factory()->create();
        $team = Team::factory()->create(['name' => 'Laravel Team']);
        $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);

        $invitation = TeamInvitation::factory()->create([
            'team_id' => $team->id,
            'email' => 'invited@example.com',
            'invited_by' => $owner->id,
        ]);

        $response = $this->get(route('register', ['invitation' => $invitation->code]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('auth/register')
            ->where('teamInvitation.code', $invitation->code)
            ->where('teamInvitation.teamName', 'Laravel Team'),
        );
    }

    public function test_new_users_can_register()
    {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'date_of_birth' => today()->subYears(18)->toDateString(),
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();

        $user = User::where('email', 'test@example.com')->firstOrFail();
        $this->assertSame(today()->subYears(18)->toDateString(), $user->date_of_birth?->toDateString());
        $response->assertRedirect(route('dashboard', ['current_team' => $user->currentTeam->slug]));
    }

    public function test_underage_users_cannot_register(): void
    {
        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Underage User',
            'email' => 'underage@example.com',
            'date_of_birth' => today()->subYears(18)->addDay()->toDateString(),
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response
            ->assertRedirect(route('register'))
            ->assertSessionHasErrors('date_of_birth');

        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['email' => 'underage@example.com']);
    }

    public function test_date_of_birth_is_required_to_register(): void
    {
        $response = $this->from(route('register'))->post(route('register.store'), [
            'name' => 'Missing Date User',
            'email' => 'missing-date@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response
            ->assertRedirect(route('register'))
            ->assertSessionHasErrors('date_of_birth');

        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['email' => 'missing-date@example.com']);
    }

    public function test_date_of_birth_is_not_shared_with_authenticated_inertia_pages(): void
    {
        $user = User::factory()->create(['date_of_birth' => '1990-01-01']);

        $this->actingAs($user)
            ->get(route('profile.edit'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->missing('auth.user.date_of_birth'),
            );
    }
}
