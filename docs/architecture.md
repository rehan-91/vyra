# Architecture

VYRA is a Laravel 13 modular monolith with React 19, TypeScript, and Inertia 3 as its primary UI architecture. Laravel owns domain logic, persistence, authorization, queues, and integrations; React/Inertia renders the product experience. Node tooling is used for frontend development and builds, not as a primary backend.

The [VYRA Master Blueprint](blueprint/VYRA_MASTER_BLUEPRINT.md) is the canonical product and architecture specification. The repository documents the target runtime below; its Phase 3 implementation has not started.

## Target runtime topology

```text
Browser
  -> CDN / WAF / load balancer
  -> Laravel Octane + FrankenPHP application nodes
       -> PostgreSQL (transactional truth)
       -> Redis (shared cache, short-lived state, locks, rate limits)
       -> Laravel queue workers (asynchronous work)
       -> Object storage / CDN (assets)

Realtime: Browser -> Laravel Reverb -> Redis where appropriate
Media:    Browser -> specialist media infrastructure / object storage / CDN
Calls:    Browser -> WebRTC / specialist media infrastructure
```

Application nodes are stateless and scale independently from queue workers and Reverb. PostgreSQL remains authoritative for durable business records, including future financial, order, and entitlement data. Redis is supporting infrastructure, never transactional truth. Video and audio media do not pass through Laravel HTTP workers.

Laravel Reverb is a separate long-lived realtime process, not part of FrankenPHP/Octane request workers. Queues isolate slow or failure-prone work from request paths. See the relevant ADRs for the locked runtime decisions.

## Boundaries and lifecycle

Business capabilities belong under `app/Domain/<Domain>`. Controllers adapt HTTP requests to domain actions. Authorization is explicit and resource-scoped; cross-domain effects use named events and jobs rather than implicit controller coupling.

Octane workers are long-lived. Request-specific user, authorization, tenant, payment, or business state must not be stored in static properties, globals, or unsafe singletons. Worker recycling is deliberate operational hygiene, not a substitute for safe application code.

Inertia SSR remains disabled. If introduced, it is a separately supervised rendering process with its own health checks and resource limits; it consumes Laravel-provided page data and is not a second backend.

The starter-kit `Team` implementation is temporary workspace and collaboration infrastructure, not the final VYRA organization or tenancy model. A future approved domain design must establish that meaning before extending or replacing it.
