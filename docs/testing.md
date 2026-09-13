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

## Runtime testing after Phase 3

Octane, FrankenPHP, Redis, Reverb, and Docker Compose are target architecture, not currently installed runtime components. When Phase 3 introduces them, preserve normal Laravel feature/unit tests and add focused coverage for:

- Octane runtime behavior and repeated-request scenarios that expose leaked static, singleton, container, user, authorization, or request state;
- worker restart/recycling and health/readiness behavior where it can be exercised in the integration environment;
- queue dispatch, job idempotency, retry/failure behavior, and isolation of slow work from HTTP requests;
- Reverb/realtime authorization, event delivery, reconnection, and graceful degradation, with durable state asserted in PostgreSQL;
- representative load and performance tests later, with measured latency, throughput, queue delay, database time, memory/restarts, and realtime connection metrics rather than assumed capacity.

Do not treat a passing benchmark as a performance guarantee. Keep integration environments isolated, never use production credentials, and do not run destructive database commands without explicit authorization.
