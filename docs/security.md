# VYRA Security Baseline

## Current foundation

- Production must set `APP_DEBUG=false`; configuration defaults to false when
  absent.
- Laravel's `web` middleware provides CSRF protection. Session cookies are
  HTTP-only and SameSite=Lax, and secure by default in production; HTTPS
  deployments must retain `SESSION_SECURE_COOKIE=true`.
- Passwords use Laravel hashing and validation. Authentication uses Fortify
  login, MFA, passkey, and email-verification protections. Login, MFA,
  passkey, and verification routes have named/routed throttles; password-reset
  tokens are throttled by Laravel's password broker.
- Registration and password-reset request endpoints retain Fortify's standard
  routing in Phase 0. Before public launch, assess endpoint-specific abuse
  limits rather than replacing Fortify routing with an unowned custom layer.
- VYRA accounts are adults-only. Registration requires a date of birth and the
  server rejects under-18 applicants. Date of birth is private account data:
  it is hidden from ordinary Inertia props and public creator projections, and
  must not be placed in URLs, analytics, or unnecessary logs.
- Team invitation URLs contain an invitation value needed by the existing
  acceptance flow. Caddy redacts that query key in access logs; application
  code must not add it to logs or telemetry. The value is still bound to the
  invited authenticated email before acceptance.
- Database session and failed-job records are restricted operational data.
  They may contain IP/user-agent, serialized payload, or exception detail;
  access, retention, and replay must be controlled, and sensitive future jobs
  must minimize payload data.
- Every resource mutation must be authenticated, validated, and authorized by
  policy or a demonstrably scoped query.
- Never commit `.env`, `auth.json`, credentials, generated production data, or
  secrets in logs, tests, fixtures, or documentation.

## Future requirements

Before their associated delivery surfaces are introduced, design and test:

- security headers and production CORS policy;
- signed private-media delivery, object-storage access controls, and malware
  scanning;
- audit logging and privileged-action auditing;
- webhook verification, fraud/risk controls, and financial controls;
- stronger age/identity assurance, KYC-provider references, and
  restricted-content controls before the relevant feature is enabled;
- penetration testing, operational security, and data retention/deletion.
