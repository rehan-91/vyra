# ADR 0003: Laravel Octane + FrankenPHP HTTP Runtime

## Status

Accepted. Phase 3 implements the completed minimum local Docker Compose foundation; deployment migration remains deferred.

## Decision

VYRA selects Laravel Octane with FrankenPHP as its HTTP application runtime. FrankenPHP replaces the application role normally served by a web server plus PHP-FPM. Laravel remains the domain and application authority; this is a runtime optimization, not a move to a second backend or microservices.

Application workers must be stateless between requests. Request-specific mutable state must not be retained in statics, globals, or unsafe singletons. Worker recycling, health checks, graceful restart/drain procedures, and memory/restart observability are required operational concerns.

Slow or failure-prone work belongs on Laravel queues rather than Octane request workers. SSR, if enabled, is a separately supervised rendering process and not part of the PHP request worker or a second backend.

## Consequences

Phase 3 validates package compatibility, long-running-worker safety, repeated-request behavior, and local worker lifecycle. It makes no fixed throughput, latency, RAM, or cost guarantee. Representative load characteristics and a production deployment plan remain later work.

The currently working Wasmer deployment remains unchanged until an approved implementation and deployment plan supports this runtime.
