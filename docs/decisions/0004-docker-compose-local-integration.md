# ADR 0004: Docker Compose Local Integration Environment

## Status

Accepted. Implementation is deferred to Phase 3.

## Decision

Docker Compose is VYRA's canonical reproducible local integration environment once the runtime foundation is implemented. The initial topology will contain an Octane + FrankenPHP application service, PostgreSQL, Redis, a Laravel queue worker, and Laravel Reverb. SSR and specialist services are optional and added only when their feature work is approved.

Docker Compose is the reference environment for production-like local integration and runtime testing. It does not replace the existing Wasmer staging deployment or dictate a production orchestrator.

## Consequences

Phase 3 must provide deliberate local worker restart/watch behavior, health checks, environment separation, and service ownership. Developers may continue to use lightweight local Laravel tools where useful, but those tools are not the canonical integration runtime after Compose exists.
