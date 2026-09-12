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
        if (getenv('CI') === 'true') {
            $this->withoutExceptionHandling();
        }

        try {
            $response = $this->post(route('register.store'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);
        } catch (\Throwable $exception) {
            $mailerName = config('mail.default');
            $mailer = config("mail.mailers.{$mailerName}", []);

            fwrite(STDERR, json_encode([
                'registration_exception_diagnostic' => [
                    'exception_class' => $exception::class,
                    'exception_message' => $exception->getMessage(),
                    'exception_file' => $exception->getFile(),
                    'exception_line' => $exception->getLine(),
                    'first_stack_frame' => $exception->getTrace()[0] ?? null,
                    'mail' => [
                        'default' => $mailerName,
                        'transport' => $mailer['transport'] ?? null,
                        'host' => $mailer['host'] ?? null,
                        'port' => $mailer['port'] ?? null,
                        'scheme' => $mailer['scheme'] ?? null,
                        'from_address' => config('mail.from.address'),
                        'from_name' => config('mail.from.name'),
                    ],
                ],
            ], JSON_THROW_ON_ERROR).PHP_EOL);

            throw $exception;
        }

        if (getenv('CI') === 'true') {
            $session = $this->app['session.store'];
            $guard = auth('web');

            fwrite(STDERR, json_encode([
                'registration_diagnostic' => [
                    'response_status' => $response->getStatusCode(),
                    'redirect_location' => $response->headers->get('Location'),
                    'validation_errors' => $session->get('errors')?->getBag('default')->messages() ?? [],
                    'user_exists' => User::query()->where('email', 'test@example.com')->exists(),
                    'web_guard_authenticated' => $guard->check(),
                    'web_guard_id' => $guard->id(),
                    'default_guard' => config('auth.defaults.guard'),
                    'fortify_guard' => config('fortify.guard'),
                    'session_driver' => config('session.driver'),
                    'session_serialization' => config('session.serialization'),
                    'session_keys' => array_keys($session->all()),
                    'auth_session_key' => $guard->getName(),
                    'auth_session_user_id' => $session->get($guard->getName()),
                    'php_version' => PHP_VERSION,
                    'php_ini' => php_ini_loaded_file(),
                    'php_session_ini' => [
                        'auto_start' => ini_get('session.auto_start'),
                        'serialize_handler' => ini_get('session.serialize_handler'),
                        'use_cookies' => ini_get('session.use_cookies'),
                        'use_strict_mode' => ini_get('session.use_strict_mode'),
                    ],
                ],
            ], JSON_THROW_ON_ERROR).PHP_EOL);
        }

        $this->assertAuthenticated();

        $user = User::where('email', 'test@example.com')->first();
        $response->assertRedirect(route('dashboard'));
    }
}
