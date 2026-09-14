# ADR 0007: Transaction-Safe Asynchronous Work

## Status

Accepted before Phase 4 Commerce.

## Decision

The database queue remains VYRA's current queue transport. Its global
`after_commit` setting remains disabled to avoid changing unrelated dispatch
behavior. A job or notification that depends on database state created or
changed in a transaction must explicitly use Laravel's after-commit mechanism,
or an approved transactional outbox design.

Critical Commerce, payment, entitlement, webhook, reconciliation, and
notification jobs must tolerate duplicate delivery/execution. They use stable
server-generated identifiers and enforce idempotency in durable application
state where appropriate. Client-supplied success or idempotency claims are not
authoritative. Webhook designs must additionally defend against replay.

## Consequences

The existing queued Team invitation notification opts into after-commit
dispatch. Future transactional jobs must make the same choice explicitly; no
global queue behavior is changed. Failed-job payloads and exception details are
restricted operational data: access, retention, and replay require deliberate
handling, and sensitive payload data is minimized.
