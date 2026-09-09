# Testing Policy

Creator OS uses `creator_os` as its normal development database and targets
PostgreSQL in development and production. The default test suite intentionally
uses in-memory SQLite through `phpunit.xml`: it is safe to run locally and
remains usable in CI without a separately provisioned database.

PostgreSQL compatibility is validated with the opt-in `phpunit.pgsql.xml`
configuration. It always selects the isolated `creator_os_testing` database;
tests must never target the developer `creator_os` database. Connection
credentials must come from the local environment or CI secrets and must not be
committed.

Before running the PostgreSQL suite, an authorized local PostgreSQL
administrator must provision the isolated database and assign it to the
application role:

```sql
CREATE DATABASE creator_os_testing OWNER creator_os_app;
```

Then run:

```sh
php artisan test --configuration=phpunit.pgsql.xml
```

Tests using `RefreshDatabase` will run migrations against the isolated
database. Do not run this command until `creator_os_testing` exists.

Current GitHub Actions uses the safe SQLite suite because it does not provision
PostgreSQL. A future CI PostgreSQL service must create only
`creator_os_testing` (or its isolated CI equivalent) and supply credentials as
CI secrets. New database-sensitive functionality must be checked against
PostgreSQL before it is considered complete.
