# Architecture

Creator OS is a Laravel 13 modular monolith with React 19, TypeScript, and
Inertia 3 as its primary UI architecture. Laravel is the domain and application
authority; Node tooling is used only for frontend development and builds.

Business capabilities belong under `app/Domain/<Domain>`. Controllers adapt
HTTP requests to domain actions. Authorization is explicit and resource-scoped;
cross-domain effects use named events and jobs rather than implicit controller
coupling.

Inertia SSR is intentionally disabled in Phase 0 because no managed SSR runtime
exists. It may be enabled later only with a tested runtime, bundle, health
checks, and deployment ownership.

PostgreSQL is the active development database. Database-backed cache, queue,
and session drivers are the accepted Phase 0 baseline. Redis server, Reverb,
and Echo are intentionally deferred; they are introduced only with an approved
phase that needs their workloads.

The starter-kit `Team` implementation is temporary workspace and collaboration
infrastructure. It is not the final Creator OS organizational model. A future
approved domain design must explicitly determine whether tenancy represents
creator organizations, agencies, staff workspaces, brands, collaborators, or
another concept before extending or replacing it.

The Master Blueprint remains the source of truth for product architecture.
