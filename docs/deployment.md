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

The current Wasmer build configuration remains:

```text
Install: composer install --optimize-autoloader --ignore-platform-reqs --no-scripts --no-interaction && pnpm install
Build:   composer run-script post-update-cmd && pnpm run build
Start:   php -S 0.0.0.0:8080 -t public
```

`pnpm run build` invokes direct `vite build`. This is intentional because it
keeps the production frontend build within Wasmer's builder-memory limit.

Run migrations as a distinct, post-deployment operation:

```sh
composer run deploy:migrate --no-interaction
```

The Composer entry point runs:

```sh
php artisan migrate --force --no-interaction
```

For Wasmer, the root `Anybuild` definition retains the Laravel provider and
overrides its generated `after_deploy` command with this portable Composer
command. Do not add a separate Wasmer Edge `jobs` migration: Anybuild packages
the single overridden `after_deploy` command as the deployment migration.
Other hosts may invoke `composer run deploy:migrate --no-interaction` from
their deployment hook, release phase, or CI/CD job.

Migrations are intentionally absent from the PHP Start command, so a process
restart cannot execute them. Laravel's `migrations` table records completed
migrations, making a single authorized deployment migration operation
idempotent for an unchanged release.

No configuration, route, or view cache command is required by the present
deployment contract. Add one only when the target host has a defined build and
runtime environment lifecycle that makes cached configuration safe.
