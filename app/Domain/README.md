# VYRA Domain Modules

`app/Domain` is the home of VYRA business capabilities. Each module owns
its domain language, application actions, policies, events, jobs, and data
access boundaries. HTTP controllers remain adapters and must not contain core
business rules.

The approved Phase 0 modules are: Identity, Creator, Commerce, Payments,
Ledger, Entitlements, Content, Messaging, Booking, Live, Trust, Notifications,
Analytics, AI, and Admin.

Create code only when a planned capability requires it. Do not add placeholder
models, migrations, or service classes merely to fill a directory. Cross-domain
side effects should be represented by explicit events; financial and trust
operations also require authorization and audit coverage.
