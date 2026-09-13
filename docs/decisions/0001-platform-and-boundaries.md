# ADR 0001: Laravel Modular Monolith Platform

## Status

Accepted.

## Decision

VYRA uses Laravel 13 on PHP 8.3+, React 19, TypeScript, Inertia 3, and Tailwind CSS 4. PostgreSQL is the transactional source of truth. The application is a domain-oriented modular monolith: Laravel owns domain logic, persistence, authorization, queues, and integrations, while React/Inertia is the primary UI architecture.

Redis supports cache, queues, rate limiting, distributed locks, and appropriate shared short-lived state when the approved runtime foundation is implemented. It is never authoritative for durable business or financial records. The selected HTTP runtime and realtime boundary are recorded in ADRs 0003 and 0005; their implementation is deferred to Phase 3.

Next.js is not the primary application and Node.js is not the primary backend because they would split application authority without a demonstrated need. Microservices are deferred unless evidence establishes a bounded need with ownership, operational, transactional, and observability justification.

## Consequences

New capabilities are organized under `app/Domain`; substantial UI capabilities are organized under `resources/js/features`. Services are extracted only when evidence establishes a bounded need. OpenSearch, warehouse/OLAP systems, specialist media infrastructure, and AI product subsystems remain deferred until an approved capability requires them.

The starter-kit Team model remains a temporary collaboration/workspace primitive. It must not be treated as VYRA's final tenancy or organization model without an approved domain decision.
