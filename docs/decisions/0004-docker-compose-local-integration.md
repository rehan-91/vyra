# ADR 0004: Docker Compose Local Integration Environment

## Status

Accepted. Phase 3A implements the application, PostgreSQL, and Redis foundation.

## Decision

Docker Compose is VYRA's canonical reproducible local integration environment. Phase 3A contains an Octane + FrankenPHP application service, PostgreSQL, and Redis. The base `compose.yaml` remains immutable and production-like; an explicit `compose.dev.yaml` overlay provides bind-mounted source and Windows-host Vite HMR for fast local iteration. Queue workers, Laravel Reverb, SSR, and specialist services are optional and added only when their feature work is approved.

Docker Compose is the reference environment for production-like local integration and runtime testing. It does not replace the existing Wasmer staging deployment or dictate a production orchestrator.

## Consequences

Phase 3 must provide deliberate local worker restart/watch behavior, health checks, environment separation, and service ownership. Developers may continue to use lightweight local Laravel tools where useful, but those tools are not the canonical integration runtime after Compose exists.
