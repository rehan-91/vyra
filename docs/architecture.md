# Architecture

VYRA is a Laravel 13 modular monolith with React 19, TypeScript, and Inertia 3 as its primary UI architecture. Laravel owns domain logic, persistence, authorization, queues, and integrations; React/Inertia renders the product experience. Node tooling is used for frontend development and builds, not as a primary backend.

The [VYRA Master Blueprint](blueprint/VYRA_MASTER_BLUEPRINT.md) is the canonical product and architecture specification. Phase 3 implements the completed minimum local HTTP/runtime foundation below; Reverb, Redis-backed queues, and SSR remain deferred.

## Runtime topology

```text
Browser
  -> CDN / WAF / load balancer
  -> Laravel Octane + FrankenPHP application nodes
       -> PostgreSQL (transactional truth)
       -> Redis (available shared infrastructure; not yet the cache or queue default)
       -> Laravel database queue worker (separate service)
       -> Object storage / CDN (assets)

Realtime: Browser -> Laravel Reverb -> Redis where appropriate (future feature stage)
Media:    Browser -> specialist media infrastructure / object storage / CDN
Calls:    Browser -> WebRTC / specialist media infrastructure
```

Application nodes are stateless and scale independently from queue workers and Reverb. PostgreSQL remains authoritative for durable business records, including future financial, order, and entitlement data. Redis is supporting infrastructure, never transactional truth. Video and audio media do not pass through Laravel HTTP workers.

Docker Compose is the canonical local integration runtime for the application, PostgreSQL, Redis, and a separate database queue worker. The base `compose.yaml` binds the application only to loopback on port 8088 and has no source bind mounts; PostgreSQL and Redis have no host ports. The worker runs independently of Octane with bounded retries and deliberate recycling. `compose.dev.yaml` is an explicit development-only overlay: it bind-mounts source for FrankenPHP/Octane and the worker, shares Laravel's `public/hot` file with Windows-host Vite HMR on port 5173, and keeps the base integration workflow immutable. Herd remains a supported lightweight fallback. Laravel Reverb will be a separate long-lived realtime process, not part of FrankenPHP/Octane request workers. Queues isolate slow or failure-prone work from request paths. See the relevant ADRs for the locked runtime decisions.

`/up` is the lightweight liveness endpoint used by the Compose application health check; it confirms that the HTTP application can respond. `/ready` is the readiness endpoint: it performs a minimal PostgreSQL `select 1` query and returns `204` only when the transactional database is reachable, otherwise `503`. Redis is intentionally excluded until it becomes an active application dependency.

## Boundaries and lifecycle

Business capabilities belong under `app/Domain/<Domain>`. Controllers adapt HTTP requests to domain actions. Authorization is explicit and resource-scoped; cross-domain effects use named events and jobs rather than implicit controller coupling.

`Creator` is the seller/merchant owner for future Commerce. Its owning user is the initial and only Commerce-administration authority. The starter-kit `Team` and `current_team` are workspace/collaboration context only; they do not grant product, merchant, financial, payout, or Commerce authority. Any future delegated Commerce role requires an explicit role, policy, and approved domain decision.

Jobs that depend on a database transaction must be explicitly dispatched after commit. The queue connection intentionally does not enable a global after-commit default, so a transactional job or notification must opt into Laravel's after-commit mechanism (or an approved outbox design). Critical Commerce, payment, entitlement, webhook, reconciliation, and notification work must tolerate duplicate delivery with server-enforced stable idempotency identifiers; client-supplied success or idempotency claims are never authoritative.

Creators and users may not be destroyed in a way that breaks future order, payment, entitlement, ledger, audit, or compliance references. Creator public visibility is independently controllable. Future deletion workflows must preserve durable internal references and use anonymization/redaction for eligible personal data rather than breaking financial history.

VYRA accounts are adults-only. Registration collects a private date of birth and validates 18+ eligibility on the server; the date is hidden from ordinary authenticated Inertia props and is never part of public creator serialization. Stronger age/identity assurance, KYC providers, and restricted-content controls are deferred to the relevant trust, monetization, payment, and experience phases.

Octane workers are long-lived. Request-specific user, authorization, tenant, payment, or business state must not be stored in static properties, globals, or unsafe singletons. Worker recycling is deliberate operational hygiene, not a substitute for safe application code.

Inertia SSR remains disabled. If introduced, it is a separately supervised rendering process with its own health checks and resource limits; it consumes Laravel-provided page data and is not a second backend.

The starter-kit `Team` implementation is temporary workspace and collaboration infrastructure, not the final VYRA organization or tenancy model. A future approved domain design must establish that meaning before extending or replacing it.
