# ADR 0008: Adults-Only Account Boundary

## Status

Accepted before Phase 4 Commerce.

## Decision

VYRA is an adults-only platform. Registration collects date of birth and the
server rejects applicants younger than 18. Date of birth is private sensitive
account data: it is not exposed in public creator data, ordinary Inertia shared
props, URLs, analytics, or unnecessary logs.

This registration boundary is not identity verification. Stronger age or
identity assurance, creator monetization checks, KYC-provider integration, and
restricted-content controls are introduced only when the related trust,
payment, payout, or experience capability requires them.

## Consequences

Existing users are not destructively backfilled; the new database column is
nullable for historical compatibility while all new registrations require a
server-validated date. Future high-risk features may require an additional
age/identity assurance gate before access or monetization.
