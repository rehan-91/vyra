# ADR 0005: Reverb and Redis Realtime Boundary

## Status

Accepted. Implementation is deferred to Phase 3.

## Decision

VYRA selects Laravel Reverb as a separate long-lived realtime runtime and Redis as its shared coordination/pub-sub layer where multi-node operation requires it. Reverb is not embedded in Laravel Octane/FrankenPHP request workers.

Redis is also the shared infrastructure for cache, rate limiting, distributed locks, queue transport, and appropriate short-lived state. Durable messages, orders, entitlements, payments, and future ledger records remain transactional PostgreSQL data.

## Consequences

Reverb and Octane nodes can scale independently. Realtime capabilities must authorize channels/events, degrade gracefully on delivery failure, and persist durable business state before or independently of realtime notification. Phase 3 must add the process supervision, health checks, and tests appropriate to this boundary without changing current application behavior prematurely.
