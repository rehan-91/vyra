# Testing Policy

VYRA targets PostgreSQL for development and production transactional behavior. The default test suite uses in-memory SQLite through `phpunit.xml`; it is safe for local use and CI. Run normal checks with:

```sh
composer ci:check
```

PostgreSQL compatibility is validated with `phpunit.pgsql.xml`, which always selects the isolated `creator_os_testing` database. Never point test commands at the developer `creator_os` database. After an authorized PostgreSQL administrator creates that isolated database and assigns it to the application role, run:

```sh
php artisan test --configuration=phpunit.pgsql.xml
```

`RefreshDatabase` migrates the selected test database. CI currently provisions a PostgreSQL service only to verify the isolated connection while running the safe SQLite suite. Database-sensitive behavior must be checked against the isolated PostgreSQL suite before it is complete.

## Runtime testing

Phase 3A installs Laravel Octane and supplies a Docker Compose integration runtime for FrankenPHP, PostgreSQL, and Redis. Preserve normal Laravel feature/unit tests and run the focused repeated-request tests in `tests/Feature/Infrastructure/OctaneRequestStateTest.php`; they verify that team routing and appearance state do not pass from one request to the next.

When Docker is available, validate the Compose runtime with `docker compose up --build`, `docker compose exec app php artisan migrate --force --no-interaction`, and HTTP checks for `/up`, authentication, and a public creator profile. Restart the application container and repeat the health and request checks. PostgreSQL and Redis must stay unreachable from the host unless a deliberately temporary local override is added.

Later Phase 3 stages must add coverage for:

- Octane runtime behavior and repeated-request scenarios that expose leaked static, singleton, container, user, authorization, or request state;
- worker restart/recycling and health/readiness behavior where it can be exercised in the integration environment;
- queue dispatch, job idempotency, retry/failure behavior, and isolation of slow work from HTTP requests;
- Reverb/realtime authorization, event delivery, reconnection, and graceful degradation, with durable state asserted in PostgreSQL;
- representative load and performance tests later, with measured latency, throughput, queue delay, database time, memory/restarts, and realtime connection metrics rather than assumed capacity.

Do not treat a passing benchmark as a performance guarantee. Keep integration environments isolated, never use production credentials, and do not run destructive database commands without explicit authorization.
