# Creator OS Agent Policy

AI agents must treat the Master Blueprint and approved ADRs as architectural
authority, while the current repository state is the implementation authority.

- Read `CREATOR_OS_MASTER_BLUEPRINT_v2_0.pdf` and relevant `docs/` material
  before architectural work.
- Keep Laravel the application and domain authority, and React + Inertia the
  primary UI architecture. Use the modular monolith.
- Put new Creator OS product code in a named `app/Domain/<Domain>` boundary;
  organize substantial frontend capability code in `resources/js/features/`.
- Maintain PostgreSQL compatibility. Do not introduce Next.js as the primary
  app, Node.js as the primary backend, or microservices without evidence and an
  approved ADR.
- Do not add Redis, Reverb, or AI infrastructure merely because it appears in
  the blueprint; add it only in an approved phase with a demonstrated need.
- Never place or expose secrets in source, logs, tests, fixtures, commits,
  documentation, or reports.
- Require explicit authorization for resource mutations and focused tests for
  new behavior.
- Design audit/events before payments, ledger, trust, moderation, or privileged
  admin operations.
- Never run destructive database commands without explicit approval. Do not
  reset, drop, truncate, or casually migrate a developer database.
- Do not modify unrelated files or install packages without a clear,
  compatibility-verified reason. Do not silently change architectural decisions;
  record significant changes in ADRs.
- Run appropriate quality checks before declaring work complete.
