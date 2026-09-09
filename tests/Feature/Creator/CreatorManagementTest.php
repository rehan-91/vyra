<?php

namespace Tests\Feature\Creator;

use App\Domain\Creator\Actions\CreateCreator;
use App\Domain\Creator\Exceptions\CreatorAlreadyExists;
use App\Domain\Creator\Models\Creator;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CreatorManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_authentication_is_required_to_create_a_creator_identity(): void
    {
        $this->get(route('creator.create'))->assertRedirect(route('login'));

        $this->post(route('creator.store'), [
            'display_name' => 'Creator',
            'handle' => 'creator',
        ])->assertRedirect(route('login'));
    }

    public function test_an_authenticated_user_can_create_a_creator_identity(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('creator.store'), [
            'display_name' => 'Ada Creates',
            'handle' => 'Ada_Creates',
            'bio' => 'Making thoughtful work.',
        ]);

        $creator = Creator::query()->sole();

        $response->assertRedirect(route('creator.manage', $creator));
        $this->assertDatabaseHas('creators', [
            'id' => $creator->id,
            'user_id' => $user->id,
            'display_name' => 'Ada Creates',
            'handle' => 'ada_creates',
            'bio' => 'Making thoughtful work.',
        ]);
    }

    public function test_creator_handle_is_canonicalized_outside_the_http_form_request(): void
    {
        $user = User::factory()->create();

        $creator = app(CreateCreator::class)->handle($user, 'Ada_Creates', 'Ada Creates', null);

        $this->assertSame('ada_creates', $creator->handle);
        $this->assertDatabaseHas('creators', [
            'id' => $creator->id,
            'handle' => 'ada_creates',
        ]);
    }

    public function test_a_creator_owner_can_view_their_private_management_page(): void
    {
        $user = User::factory()->create();
        $creator = Creator::factory()->for($user, 'owner')->create();

        $this->actingAs($user)
            ->get(route('creator.manage', $creator))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('creator/manage')
                ->where('creator.id', $creator->id)
                ->where('creator.handle', $creator->handle),
            );
    }

    public function test_a_creator_owner_can_update_their_profile(): void
    {
        $user = User::factory()->create();
        $creator = Creator::factory()->for($user, 'owner')->create();

        $this->actingAs($user)
            ->patch(route('creator.update', $creator), [
                'display_name' => 'Updated Creator',
                'handle' => 'Updated_Handle',
                'bio' => 'An updated biography.',
            ])
            ->assertRedirect(route('creator.manage', $creator));

        $this->assertDatabaseHas('creators', [
            'id' => $creator->id,
            'display_name' => 'Updated Creator',
            'handle' => 'updated_handle',
            'bio' => 'An updated biography.',
        ]);
    }

    public function test_non_owners_cannot_view_update_or_delete_a_creator(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $creator = Creator::factory()->for($owner, 'owner')->create();

        $this->actingAs($otherUser)
            ->get(route('creator.manage', $creator))
            ->assertForbidden();

        $this->actingAs($otherUser)
            ->patch(route('creator.update', $creator), [
                'display_name' => 'Attempted change',
                'handle' => 'attempted_change',
            ])
            ->assertForbidden();

        $this->actingAs($otherUser)
            ->delete(route('creator.destroy', $creator))
            ->assertForbidden();

        $this->assertDatabaseHas('creators', ['id' => $creator->id]);
    }

    public function test_creator_profile_fields_are_validated(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('creator.create'))
            ->post(route('creator.store'), [
                'display_name' => '',
                'handle' => 'not a valid handle!',
                'bio' => str_repeat('a', 1001),
            ])
            ->assertRedirect(route('creator.create'))
            ->assertSessionHasErrors(['display_name', 'handle', 'bio']);
    }

    public function test_creator_handles_must_be_unique(): void
    {
        $owner = User::factory()->create();
        $user = User::factory()->create();
        Creator::factory()->for($owner, 'owner')->create(['handle' => 'already_taken']);

        $this->actingAs($user)
            ->from(route('creator.create'))
            ->post(route('creator.store'), [
                'display_name' => 'Another Creator',
                'handle' => 'already_taken',
            ])
            ->assertRedirect(route('creator.create'))
            ->assertSessionHasErrors('handle');
    }

    public function test_creator_handle_case_variations_cannot_create_a_second_creator(): void
    {
        $owner = User::factory()->create();
        $user = User::factory()->create();
        Creator::factory()->for($owner, 'owner')->create(['handle' => 'ada_creates']);

        $this->actingAs($user)
            ->from(route('creator.create'))
            ->post(route('creator.store'), [
                'display_name' => 'Another Ada',
                'handle' => 'ADA_CREATES',
            ])
            ->assertRedirect(route('creator.create'))
            ->assertSessionHasErrors('handle');
    }

    public function test_creator_handle_case_variations_cannot_collide_on_update(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $creator = Creator::factory()->for($user, 'owner')->create(['handle' => 'first_creator']);
        Creator::factory()->for($otherUser, 'owner')->create(['handle' => 'second_creator']);

        $this->actingAs($user)
            ->from(route('creator.manage', $creator))
            ->patch(route('creator.update', $creator), [
                'display_name' => $creator->display_name,
                'handle' => 'SECOND_CREATOR',
                'bio' => $creator->bio,
            ])
            ->assertRedirect(route('creator.manage', $creator))
            ->assertSessionHasErrors('handle');

        $this->assertSame('first_creator', $creator->fresh()->handle);
    }

    public function test_a_user_can_own_at_most_one_creator_identity(): void
    {
        $user = User::factory()->create();
        Creator::factory()->for($user, 'owner')->create();

        $this->actingAs($user)
            ->post(route('creator.store'), [
                'display_name' => 'Second Creator',
                'handle' => 'second_creator',
            ])
            ->assertForbidden();

        $this->assertFalse($user->can('create', Creator::class));
    }

    public function test_the_database_enforces_one_creator_owner_relationship(): void
    {
        $user = User::factory()->create();
        Creator::factory()->for($user, 'owner')->create();

        $this->expectException(QueryException::class);

        Creator::factory()->for($user, 'owner')->create();
    }

    public function test_the_creator_action_returns_a_controlled_outcome_for_the_losing_owner_creation_attempt(): void
    {
        $user = User::factory()->create();
        $action = app(CreateCreator::class);
        $winner = $action->handle($user, 'winner_creator', 'Winner Creator', null);

        try {
            $action->handle($user, 'losing_creator', 'Losing Creator', null);
            $this->fail('The second creator creation attempt should not succeed.');
        } catch (CreatorAlreadyExists $exception) {
            $this->assertTrue($winner->is($exception->creator));
        }

        $this->assertSame(1, Creator::query()->where('user_id', $user->id)->count());
    }

    public function test_a_race_loser_is_redirected_to_the_existing_creator_instead_of_exposing_a_database_exception(): void
    {
        $user = User::factory()->create();

        $this->app->instance(CreateCreator::class, new class extends CreateCreator
        {
            public function handle(User $owner, string $handle, string $displayName, ?string $bio): Creator
            {
                parent::handle($owner, 'race_winner', 'Race Winner', null);

                return parent::handle($owner, $handle, $displayName, $bio);
            }
        });

        $response = $this->actingAs($user)->post(route('creator.store'), [
            'display_name' => 'Race Loser',
            'handle' => 'race_loser',
        ]);

        $creator = Creator::query()->sole();

        $response->assertRedirect(route('creator.manage', $creator));
        $this->assertSame('race_winner', $creator->handle);
    }

    public function test_postgresql_enforces_lowercase_storage_and_case_insensitive_handle_uniqueness(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            $this->markTestSkipped('This assertion requires PostgreSQL.');
        }

        $index = DB::selectOne("select indexdef from pg_indexes where schemaname = current_schema() and indexname = 'creators_handle_lower_unique'");

        $this->assertNotNull($index);
        $this->assertStringContainsString('lower', strtolower($index->indexdef));

        $user = User::factory()->create();
        Creator::factory()->for($user, 'owner')->create(['handle' => 'canonical_handle']);

        $this->expectException(QueryException::class);

        DB::table('creators')->insert([
            'user_id' => User::factory()->create()->id,
            'handle' => 'CANONICAL_HANDLE',
            'display_name' => 'Uppercase Handle',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
