# ADR 0006: Creator Commerce Authority and Lifecycle

## Status

Accepted before Phase 4 Commerce.

## Decision

`Creator` is VYRA's seller/merchant aggregate. Its authoritative owning user
is the initial Commerce-administration authority. The starter-kit `Team` and
`current_team` remain workspace/collaboration context and do not confer
product, merchant, financial, payout, or Commerce authority.

Future delegated Commerce administration requires explicit roles, policies,
and authorization rules. It must not be inferred from Team membership.

Creator deactivation and public profile visibility are independent from
destruction of durable history. Future deletion workflows must preserve
internally referential order, payment, entitlement, ledger, audit, and
compliance records. Eligible personal data may be anonymized or redacted; the
historical records themselves must not be broken.

## Consequences

Phase 4 will authorize product administration from explicit Creator ownership.
It will not reuse `current_team` as a merchant boundary. The existing creator
profile deletion behavior remains limited to the pre-Commerce foundation;
durable relationship and retention behavior must be designed before Commerce
records reference a creator or user.
