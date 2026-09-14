<?php

namespace Tests\Support\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use RuntimeException;

class DatabaseQueueTestJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $cacheKey,
        public int $failUntilAttempt = 0,
    ) {}

    public function handle(): void
    {
        $attempt = Cache::increment($this->cacheKey);

        if ($attempt <= $this->failUntilAttempt) {
            throw new RuntimeException('Intentional database queue test failure.');
        }
    }
}
