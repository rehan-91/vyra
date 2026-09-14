<?php

namespace Tests\Feature\Infrastructure;

use Illuminate\Support\Facades\DB;
use RuntimeException;
use Tests\TestCase;

class ApplicationReadinessTest extends TestCase
{
    public function test_health_endpoint_remains_available_without_dependency_checks(): void
    {
        $this->get('/up')->assertOk();
    }

    public function test_readiness_endpoint_returns_no_content_when_postgresql_is_reachable(): void
    {
        $this->get(route('readiness'))->assertNoContent();
    }

    public function test_readiness_endpoint_returns_service_unavailable_when_postgresql_is_unreachable(): void
    {
        DB::shouldReceive('select')
            ->once()
            ->with('select 1')
            ->andThrow(new RuntimeException('Database unavailable.'));

        $this->get(route('readiness'))
            ->assertStatus(503)
            ->assertContent('');
    }
}
