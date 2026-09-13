# VYRA Agent Policy

AI agents must treat the [VYRA Master Blueprint](docs/blueprint/VYRA_MASTER_BLUEPRINT.md) and accepted ADRs in `docs/decisions/` as architectural authority, while the current repository state is the implementation authority. Historical documents are not active specifications; do not revive or follow superseded blueprints.

- Read the canonical master blueprint and relevant `docs/` material before architectural work.
- Keep Laravel 13 as the application and domain authority, with React 19, TypeScript, and Inertia 3 as the primary UI architecture. Use a modular monolith first; do not prematurely introduce microservices.
- Put new VYRA product code in a named `app/Domain/<Domain>` boundary; organize substantial frontend capability code in `resources/js/features/`.
- Maintain PostgreSQL as transactional truth. Redis is for cache, queues, distributed locks, rate limiting, and suitable shared short-lived state; it is never authoritative for durable business or financial records.
- Laravel Octane + FrankenPHP is the selected HTTP runtime. Laravel Reverb is a separate realtime runtime, and queues perform asynchronous work. Docker Compose is the canonical reproducible local integration environment once the runtime foundation is implemented.
- Follow Octane-safe principles: never retain request-specific mutable state in statics, globals, or unsafe singletons; treat workers as long-lived; design explicit worker lifecycle and recycling; validate third-party compatibility.
- Video and other media streams must never pass through Laravel HTTP workers; use specialist media/CDN infrastructure when that capability is introduced.
- Do not install or configure Octane, FrankenPHP, Docker Compose, Redis, Reverb, or related runtime infrastructure before the approved implementation phase. Do not add Node.js as a primary backend, Next.js as the primary app, or microservices without evidence and an approved ADR.
- Never place or expose secrets in source, logs, tests, fixtures, commits, documentation, or reports.
- Require explicit authorization for resource mutations and focused tests for new behavior. Design audit/events before payments, ledger, trust, moderation, or privileged admin operations.
- Never run destructive database commands without explicit approval. Do not reset, drop, truncate, or casually migrate a developer database.
- Do not modify unrelated files or install packages without a clear, compatibility-verified reason. Record significant architectural changes in ADRs. Run appropriate quality checks before declaring work complete.
