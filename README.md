# VYRA

VYRA is a creator commerce and monetization platform. Its current application is a Laravel 13 modular monolith with a React 19, TypeScript, and Inertia 3 user interface.

The canonical product and architecture specification is the [VYRA Master Blueprint](docs/blueprint/VYRA_MASTER_BLUEPRINT.md). The current repository state is the authority for what has actually been implemented.

## Current scope

The completed foundation includes authentication, teams as temporary workspace infrastructure, creator ownership, and public/private creator profiles. Commerce, payments, ledger, entitlements, media delivery, and realtime product features are not implemented yet.

Phase 3A establishes Laravel Octane + FrankenPHP and a Docker Compose integration environment containing the application, PostgreSQL, and Redis. The application continues to use its database cache, session, and queue defaults; Redis-backed queues, Laravel Reverb, and SSR are deliberately not enabled yet.

## Development

Herd remains a supported lightweight local fallback. For production-like local integration, copy `.env.example` to `.env`, set `APP_KEY` and the local database password, then run `docker compose up --build`. The application is available at `http://localhost:8088` by default; PostgreSQL and Redis are private to Compose. Run `docker compose exec app php artisan migrate --force --no-interaction` after the services are healthy.

PostgreSQL is the development transactional database; the default tests use isolated in-memory SQLite, with an opt-in PostgreSQL suite. See [testing documentation](docs/testing.md) and [deployment documentation](docs/deployment.md) for current constraints.
