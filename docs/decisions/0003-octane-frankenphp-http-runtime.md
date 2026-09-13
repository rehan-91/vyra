# ADR 0003: Laravel Octane + FrankenPHP HTTP Runtime

## Status

Accepted. Implementation is deferred to Phase 3.

## Decision

VYRA selects Laravel Octane with FrankenPHP as its HTTP application runtime. FrankenPHP replaces the application role normally served by a web server plus PHP-FPM. Laravel remains the domain and application authority; this is a runtime optimization, not a move to a second backend or microservices.

Application workers must be stateless between requests. Request-specific mutable state must not be retained in statics, globals, or unsafe singletons. Worker recycling, health checks, graceful restart/drain procedures, and memory/restart observability are required operational concerns.

Slow or failure-prone work belongs on Laravel queues rather than Octane request workers. SSR, if enabled, is a separately supervised rendering process and not part of the PHP request worker or a second backend.

## Consequences

Phase 3 must validate package compatibility, long-running-worker safety, repeated-request behavior, worker lifecycle, and representative load characteristics before this runtime becomes active. The decision makes no fixed throughput, latency, RAM, or cost guarantee.

The currently working Wasmer deployment remains unchanged until an approved implementation and deployment plan supports this runtime.
