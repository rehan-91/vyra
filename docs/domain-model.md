# Domain Model Convention

The Phase 0 domain boundary names are documented in `app/Domain/README.md`.
They are organizational boundaries, not separate services or databases.

Start a domain with only the code required by an approved capability. Keep
models, actions, events, policies, jobs, and tests close to their domain where
practical. Do not create speculative schema or placeholder classes.

The existing `App\\Models\\Team` is a starter-kit workspace primitive, not a
Creator OS domain decision. Do not assume it models a creator organization,
agency, staff workspace, brand, collaborator relationship, or final tenancy
boundary. Define that meaning in an approved domain design before building on
it.
