# Testing Policy

Creator OS targets PostgreSQL in development and production. The default test
suite intentionally uses in-memory SQLite through `phpunit.xml`: it is safe to
run locally and remains usable in CI without a separately provisioned database.

PostgreSQL compatibility is validated with the opt-in `phpunit.pgsql.xml`
configuration. It always selects the isolated `creator_os_testing` database;
it never targets the developer `creator_os` database. Connection credentials
must come from the local environment or CI secrets and must not be committed.

Before running `composer test:pgsql`, provision `creator_os_testing` with the
least-privileged application role and confirm that it is not the developer
database. Tests using `RefreshDatabase` will run migrations against that
isolated database. Do not run this command until the isolated database exists.

Current GitHub Actions uses the safe SQLite suite because it does not provision
PostgreSQL. Add a PostgreSQL service and isolated credentials to CI only when
the repository has an approved, maintained CI database arrangement. New
database-sensitive functionality must be checked against PostgreSQL before it
is considered complete.
