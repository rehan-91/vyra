# Deployment

## Current deployment baseline

VYRA is currently deployed to Wasmer staging through the root `Anybuild` definition. This remains the active deployment mechanism and must not be replaced as part of documentation or Phase 3 planning work.

Wasmer builds the Laravel application and Vite assets, uses `public` as the document root, executes exactly one post-deployment migration command, and uses the provider-managed PHP runtime. The current release flow is:

```text
GitHub main
  -> Wasmer / Anybuild build
  -> Composer dependencies and Laravel assets
  -> pnpm build
  -> final artifact without node_modules
  -> php artisan migrate --force --no-interaction (after deploy)
  -> provider-managed PHP web process
```

`Anybuild` is the source of truth for this Wasmer integration. Migrations are not part of build or process start, so an unchanged release does not rerun them on restart. Supply `APP_KEY`, PostgreSQL connection values, and mail credentials only through Wasmer secrets/environment configuration. `DB_NAME` from a provider must be mapped to Laravel's `DB_DATABASE`; never commit credentials.

The current deployment baseline does not run Octane, FrankenPHP, Redis, Reverb, Docker Compose, or queue workers. Existing database-backed cache, queue, and session configuration remains the implementation baseline until the runtime foundation is explicitly implemented.

## Target runtime after Phase 3

The approved target is Laravel Octane + FrankenPHP behind CDN/WAF/load balancing, with PostgreSQL, Redis, queue workers, and a separate Laravel Reverb process. Docker Compose will be the canonical reproducible local integration environment for this topology; it is not a staging or production deployment orchestrator by itself.

When that phase is implemented, deployment ownership must explicitly provide:

- supervised Octane/FrankenPHP application processes with health checks, graceful drain/restart, and deliberate worker recycling;
- Redis reachable by application, queue, and applicable realtime processes;
- independently supervised queue workers with retry/failure handling;
- independently supervised Reverb process(es) with websocket health and capacity monitoring;
- health/readiness checks for application, dependencies, and worker lifecycle.

Inertia SSR, if enabled later, is an additional supervised rendering process; it is not a second backend and must have its own health and resource limits. Object storage/CDN and WebRTC/live-media infrastructure are future specialist dependencies. Video must never traverse Laravel HTTP workers.

## Staging mail

Wasmer staging currently sends Laravel mail via Gmail SMTP. Configure SMTP credentials as Wasmer secrets only. `MAIL_PASSWORD` must be a Google App Password, never the account password. Resend remains deferred until VYRA owns its domain and deliberately selects that transport.
