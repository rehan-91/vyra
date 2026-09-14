<?php

namespace Tests\Support\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;

/**
 * Test support for the server-side idempotency convention required of future
 * critical jobs. Production financial jobs must use durable domain state and
 * constraints appropriate to their transaction, not this test helper.
 */
class IdempotentDatabaseQueueTestJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $idempotencyKey,
        public string $resultKey,
    ) {}

    public function handle(): void
    {
        if (! Cache::add('queue-idempotency:'.$this->idempotencyKey, true, now()->addHour())) {
            return;
        }

        Cache::increment($this->resultKey);
    }
}
