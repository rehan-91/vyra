# ADR 0002: Creator Profile Foundation

## Status

Accepted for the first Phase 2 VYRA Creator Profile slice.

## Decision

The existing `Creator` aggregate remains the authoritative owner of its public
profile. This slice adds a `profile_visibility` lifecycle field and an
allowlisted `social_links` JSONB document; it does not duplicate creator
identity fields or introduce a second profile model.

Profiles default to `private`. A public profile resolves by canonical handle at
`/@handle` only after its owner explicitly chooses `public`. Private and absent
profiles both return 404, preventing public enumeration of draft creators.

Avatar and cover uploads are deferred. The deployment baseline has no object
storage or CDN ownership, and the security baseline requires safe media
delivery. The public profile uses an initial-based identity treatment until a
future, approved Content/media asset boundary owns uploads, variants, and
delivery.

## Consequences

Public Inertia payloads are explicit projections containing only display name,
handle, bio, and approved links. User, owner, team, security, and internal
lifecycle data remain private. Social links are stored as JSONB for a compact,
extensible profile field, constrained by PostgreSQL and request validation.
