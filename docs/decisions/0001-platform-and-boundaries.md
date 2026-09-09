# ADR 0001: Laravel Modular Monolith Platform

## Status

Accepted for Phase 0.

## Decision

Creator OS uses Laravel 13 on PHP 8.3+, React 19, TypeScript, Inertia 3, and
Tailwind CSS 4. PostgreSQL is the active development and target transactional
database. Redis is the future shared cache, queue, rate-limit, and realtime
support store; database-backed cache, queue, and sessions are accepted during
Phase 0.

The application is a domain-oriented modular monolith. Laravel owns domain
logic, persistence, authorization, queues, and integrations. React/Inertia is
the primary UI architecture.

Next.js is not used as the primary application because it would split authority
between application backends without a demonstrated need. Microservices are
deferred because current product scope does not justify their operational,
transactional, and observability costs.

Inertia SSR is disabled in Phase 0 because no supported SSR runtime is
provisioned. It may be enabled only with an owned deployment/runtime design.
Reverb and Echo are likewise deferred until an approved phase needs realtime
delivery.

## Consequences

New capabilities are organized under `app/Domain`; services are extracted only
when evidence establishes a bounded need. OpenSearch, ClickHouse, specialist
media infrastructure, and AI product subsystems remain deferred.

The starter-kit Team model remains a temporary collaboration/workspace
primitive. It must not be treated as the final Creator OS tenancy or
organization model without an approved domain decision.
