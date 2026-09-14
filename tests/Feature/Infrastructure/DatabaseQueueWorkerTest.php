<?php

namespace Tests\Feature\Infrastructure;

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use App\Notifications\Teams\TeamInvitation as TeamInvitationNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Tests\Support\Jobs\DatabaseQueueTestJob;
use Tests\Support\Jobs\IdempotentDatabaseQueueTestJob;
use Tests\TestCase;

class DatabaseQueueWorkerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'queue.default' => 'database',
            'queue.connections.database.retry_after' => 90,
            'queue.failed.driver' => 'database-uuids',
        ]);
    }

    public function test_database_queue_dispatches_and_processes_jobs_outside_the_http_request(): void
    {
        $cacheKey = 'database-queue-success';

        dispatch(new DatabaseQueueTestJob($cacheKey));

        $this->assertDatabaseCount('jobs', 1);
        $this->assertNull(Cache::get($cacheKey));

        $this->workOnce();

        $this->assertDatabaseCount('jobs', 0);
        $this->assertSame(1, Cache::get($cacheKey));
    }

    public function test_team_invitation_notifications_are_processed_by_the_database_worker(): void
    {
        $owner = User::factory()->create();
        $team = Team::factory()->create();
        $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);
        $invitation = TeamInvitation::factory()->create([
            'team_id' => $team->id,
            'invited_by' => $owner->id,
        ]);

        Notification::route('mail', $invitation->email)
            ->notify(new TeamInvitationNotification($invitation));

        $this->assertDatabaseCount('jobs', 1);

        $this->workOnce();

        $this->assertDatabaseCount('jobs', 0);
    }

    public function test_transaction_dependent_team_invitation_notifications_are_marked_for_after_commit_dispatch(): void
    {
        $notification = new TeamInvitationNotification(TeamInvitation::factory()->make());

        $this->assertTrue($notification->afterCommit);
    }

    public function test_duplicate_delivery_is_handled_by_a_server_side_idempotency_key(): void
    {
        $idempotencyKey = 'database-queue-idempotency';
        $resultKey = 'database-queue-idempotency-result';

        dispatch(new IdempotentDatabaseQueueTestJob($idempotencyKey, $resultKey));
        dispatch(new IdempotentDatabaseQueueTestJob($idempotencyKey, $resultKey));

        $this->assertDatabaseCount('jobs', 2);

        $this->workOnce();
        $this->workOnce();

        $this->assertDatabaseCount('jobs', 0);
        $this->assertSame(1, Cache::get($resultKey));
    }

    public function test_database_worker_retries_a_failed_job_within_its_attempt_limit(): void
    {
        $cacheKey = 'database-queue-retry';

        dispatch(new DatabaseQueueTestJob($cacheKey, failUntilAttempt: 1));

        $this->workOnce(tries: 3, backoff: 0);

        $this->assertDatabaseCount('jobs', 1);
        $this->assertDatabaseCount('failed_jobs', 0);
        $this->assertSame(1, Cache::get($cacheKey));

        $this->workOnce(tries: 3, backoff: 0);

        $this->assertDatabaseCount('jobs', 0);
        $this->assertDatabaseCount('failed_jobs', 0);
        $this->assertSame(2, Cache::get($cacheKey));
    }

    public function test_database_worker_persists_jobs_that_exceed_their_attempt_limit(): void
    {
        $cacheKey = 'database-queue-failure';

        dispatch(new DatabaseQueueTestJob($cacheKey, failUntilAttempt: 1));

        $this->workOnce(tries: 1, backoff: 0);

        $this->assertDatabaseCount('jobs', 0);
        $this->assertDatabaseHas('failed_jobs', [
            'connection' => 'database',
            'queue' => 'default',
        ]);
        $this->assertSame(1, Cache::get($cacheKey));
    }

    public function test_queue_restart_sets_the_shared_worker_restart_signal(): void
    {
        Cache::forget('illuminate:queue:restart');

        $this->artisan('queue:restart')
            ->assertSuccessful();

        $this->assertIsInt(Cache::get('illuminate:queue:restart'));
    }

    private function workOnce(int $tries = 3, int $backoff = 3): void
    {
        $this->artisan('queue:work', [
            'connection' => 'database',
            '--once' => true,
            '--sleep' => 0,
            '--tries' => $tries,
            '--backoff' => $backoff,
            '--timeout' => 60,
        ])->run();
    }
}
