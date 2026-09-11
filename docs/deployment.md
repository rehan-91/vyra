# Deployment

VYRA is a Laravel application with a Vite-built React/Inertia frontend. The
application is hosting-provider agnostic: a host installs dependencies, builds
assets, starts PHP with `public` as the document root, and runs the explicit
deployment migration step once per deployment.

## Production environment

Supply these values through the host's secret or environment configuration:

```text
APP_ENV=production
APP_DEBUG=false
APP_URL=https://<public-hostname>
APP_KEY=<Laravel application key secret>
DB_CONNECTION=pgsql
DB_DATABASE=<provider PostgreSQL database name>
```

`APP_KEY` is a production secret. Generate and store it in the host's secret
manager; never commit, print, or replace it during deployment.

Laravel expects `DB_DATABASE`. If a PostgreSQL provider supplies the database
name as `DB_NAME`, map that value to `DB_DATABASE` in the provider's environment
settings. Leave `DB_HOST`, `DB_PORT`, `DB_USERNAME`, and `DB_PASSWORD` under
provider management. VYRA does not require Redis, Reverb, SMTP, object storage,
or payment/AI credentials for the current deployment baseline.

## Deployment contract

For Wasmer, the root `Anybuild` definition is the source of truth. Its Laravel
provider configuration uses this release flow:

```text
GitHub main
  -> Wasmer / Anybuild
  -> composer install --optimize-autoloader --ignore-platform-reqs --no-scripts --no-interaction
  -> pnpm install
  -> composer run-script post-update-cmd
  -> vite build
  -> remove node_modules
  -> final artifact
  -> php artisan migrate --force --no-interaction
  -> php -S 0.0.0.0:8080 -t public
```

`pnpm run build` invokes direct `vite build`. Immediately after that build,
Anybuild runs `run("rm -rf node_modules")`, so build-time Node dependencies are
not retained in the final artifact.

The single Wasmer `after_deploy` command is:

```sh
php artisan migrate --force --no-interaction
```

Composer remains a build-time tool. Wasmer cannot run Composer as a deployment
binary, so `after_deploy` invokes PHP directly. Do not add a separate Wasmer
Edge migration job.

Migrations are intentionally absent from both Build and Start. This gives each
release exactly one authorized, non-interactive migration operation and ensures
that PHP process restarts cannot run migrations. Laravel's `migrations` table
keeps the operation idempotent for an unchanged release.

The initial Wasmer deployment exposed two packaging constraints now addressed
by this configuration: retaining build-time `node_modules` caused final-artifact
memory pressure, and Composer cannot be used as a Wasmer deployment binary.

Wasmer injects and manages `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and
`DB_PASSWORD`. Map `DB_NAME` to Laravel's `DB_DATABASE` in Wasmer environment
settings; never hard-code production credentials. `APP_KEY` remains a host-held
production secret and must never be committed.
