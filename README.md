# VYRA

VYRA is a creator commerce and monetization platform. Its current application is a Laravel 13 modular monolith with a React 19, TypeScript, and Inertia 3 user interface.

The canonical product and architecture specification is the [VYRA Master Blueprint](docs/blueprint/VYRA_MASTER_BLUEPRINT.md). The current repository state is the authority for what has actually been implemented.

## Current scope

The completed foundation includes authentication, teams as temporary workspace infrastructure, creator ownership, and public/private creator profiles. Commerce, payments, ledger, entitlements, media delivery, and realtime product features are not implemented yet.

Phase 3 establishes the completed minimum runtime foundation: Laravel Octane + FrankenPHP and a Docker Compose integration environment containing the application, PostgreSQL, Redis, and a separate database queue worker. The application continues to use its database cache, session, and queue defaults; Redis-backed queues, Laravel Reverb, and SSR are deliberately not enabled yet.

## Development

Herd remains a supported lightweight local fallback. For fast Docker-based development, copy `.env.example` to `.env`, set `APP_KEY` and the local database password, then run `docker compose -f compose.yaml -f compose.dev.yaml up` and, in a second Windows-host terminal, `npm run dev`. Laravel runs at `http://localhost:8088`; Vite HMR runs at `http://localhost:5173`. The development overlay bind-mounts source and shares `public/hot` with the application, while keeping `vendor` container-managed and preventing host `node_modules` from entering the app container. Public files update through the bind mount. Reload Octane explicitly after PHP, route, configuration, or Blade changes with `docker compose -f compose.yaml -f compose.dev.yaml exec app php artisan octane:reload`.

For a production-like local integration run, use only the immutable base configuration: `docker compose -f compose.yaml up --build`. It has no source bind mounts and serves the image's compiled assets and public files. PostgreSQL and Redis are private to Compose in both modes. Run migrations intentionally after services are healthy with `docker compose -f compose.yaml exec app php artisan migrate --force --no-interaction`.

PostgreSQL is the development transactional database; the default tests use isolated in-memory SQLite, with an opt-in PostgreSQL suite. See [testing documentation](docs/testing.md) and [deployment documentation](docs/deployment.md) for current constraints.
