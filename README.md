# VYRA

VYRA is a creator commerce and monetization platform. Its current application is a Laravel 13 modular monolith with a React 19, TypeScript, and Inertia 3 user interface.

The canonical product and architecture specification is the [VYRA Master Blueprint](docs/blueprint/VYRA_MASTER_BLUEPRINT.md). The current repository state is the authority for what has actually been implemented.

## Current scope

The completed foundation includes authentication, teams as temporary workspace infrastructure, creator ownership, and public/private creator profiles. Commerce, payments, ledger, entitlements, media delivery, and realtime product features are not implemented yet.

Phase 3 is the next planned runtime-and-performance foundation. Its selected target runtime is Laravel Octane + FrankenPHP, with PostgreSQL, Redis, queues, and Reverb as documented in the blueprint. Those runtime changes are not yet present in this repository.

## Development

Use the existing Laravel and Vite commands documented in `composer.json` and `package.json`. PostgreSQL is the development transactional database; the default tests use isolated in-memory SQLite, with an opt-in PostgreSQL suite. See [testing documentation](docs/testing.md) and [deployment documentation](docs/deployment.md) for current constraints.

Docker Compose becomes the canonical local integration environment when Phase 3 is implemented. Until then, it is a target architecture, not a checked-in runtime.
