# VYRA Domain Model Convention

The Phase 0 domain boundary names are documented in `app/Domain/README.md`.
They are organizational boundaries, not separate services or databases.

Start a domain with only the code required by an approved capability. Keep
models, actions, events, policies, jobs, and tests close to their domain where
practical. Do not create speculative schema or placeholder classes.

The existing `App\\Models\\Team` is a starter-kit workspace primitive, not a
VYRA domain decision. Do not assume it models a creator organization,
agency, staff workspace, brand, collaborator relationship, or final tenancy
boundary. Define that meaning in an approved domain design before building on
it.

`User` is the authentication identity. `Creator` is an independent identity
and ownership aggregate: a creator has exactly one authoritative `User` owner,
and a user currently owns at most one creator. This is enforced by the unique
`creators.user_id` constraint. `Team` remains a separate temporary
workspace/collaboration primitive; Creator ownership is not Team ownership and
does not use `team_id` or `current_team_id`.

The Creator profile extends that identity with an owner-controlled visibility
state and allowlisted social links. Profiles default to private; only public
profiles resolve through the canonical `@handle` URL. Canonicalization is
applied by the Creator model for all Eloquent writes, while PostgreSQL enforces
lowercase storage and unique `lower(handle)` values. Public payloads expose
only handle, display name, bio, and social links. Media uploads, collaborators,
brands, and monetization remain deferred. Future creator lifecycle events and
audit records attach at Creator creation and update boundaries.
