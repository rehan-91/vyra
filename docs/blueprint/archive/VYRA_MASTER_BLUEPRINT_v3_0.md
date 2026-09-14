# VYRA MASTER BLUEPRINT v3.0

**World-Class Creator Commerce & Monetization Platform — Product, Architecture, Data, Security, Runtime, Operations & Codex Build Plan**

**STATUS: LOCKED MASTER SOURCE OF TRUTH**

## Version 3.0 Change Summary

- Promotes Laravel Octane + FrankenPHP to the locked HTTP runtime.
- Adds Docker Compose as the canonical reproducible local integration runtime.
- Makes Redis, Laravel Queues and Reverb operational boundaries explicit.
- Adds Octane-safe engineering standards and long-running-worker safeguards.
- Adds SSR process boundary, runtime observability and evidence-driven capacity planning.
- Aligns the roadmap with the actual completed VYRA phases and the next Runtime & Performance phase.
- Preserves PostgreSQL as transactional truth and the immutable ledger as financial truth.
- Excludes unsupported benchmark/RAM/cost claims from the locked architecture.

## 1. Executive Vision

VYRA is a unified operating system for creator businesses: identity, storefronts, commerce, subscriptions, content, messaging, bookings, live experiences, payments, payouts, CRM, analytics, trust and AI.

A creator should be able to publish an offer, acquire a fan, convert that fan into a paying customer, deliver value, receive money, understand the relationship and grow the business without stitching together many unrelated tools.

The strategic differentiation is business infrastructure rather than simply a prettier creator profile: reusable commerce primitives, granular entitlements, a real financial ledger, creator CRM, collaboration and revenue splits, fraud controls, analytics and AI assistance.

User-facing brand: VYRA. Technical repository/project identifiers may remain creator-os / creator_os where changing them provides no technical benefit.

## 2. Technology Decision — Updated

The earlier Next.js + React + Node.js baseline is superseded. The locked application stack is Laravel 13 + PHP 8.3+ + React 19 + TypeScript + Inertia 3.

The runtime decision is now explicit: VYRA uses Laravel Octane with FrankenPHP as the high-performance HTTP application runtime, with Redis, Laravel Queues and Laravel Reverb as first-class infrastructure.

Docker Compose becomes the canonical reproducible local runtime for the full platform stack once the runtime foundation is established. Herd may remain useful for lightweight Laravel work, but Docker is the reference environment for integration testing of the production-like runtime.

| Layer              | LOCKED choice                                        | Purpose                                                                                                                       |
| ------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Backend/domain     | Laravel 13 / PHP 8.3+                                | Business logic, transactions, auth, commerce, payments, ledger, jobs, notifications, admin and AI integration.                |
| HTTP runtime       | Laravel Octane + FrankenPHP                          | Long-lived Laravel workers; reduce repeated framework bootstrap overhead and provide a production-aligned application server. |
| Web UI             | React 19 + TypeScript                                | Mobile-first product experience.                                                                                              |
| Web bridge         | Inertia 3                                            | Cohesive Laravel/React development without a separate web API application at the beginning.                                   |
| SSR                | Inertia SSR when deliberately enabled                | Optional server-side rendering for selected page/SEO/performance requirements; managed as a separate long-running process.    |
| UI                 | Tailwind CSS v4 + shadcn/ui                          | Custom VYRA design system.                                                                                                    |
| OLTP database      | PostgreSQL                                           | Transactional truth for identity, commerce, payments, ledger and entitlements.                                                |
| Cache/shared state | Redis                                                | Cache, rate limiting, distributed locks and appropriate short-lived/shared state.                                             |
| Queues             | Redis + Laravel Queues                               | Asynchronous work, notifications, media jobs, analytics dispatch and other non-request work.                                  |
| Realtime           | Laravel Reverb + Echo                                | WebSockets, presence, realtime application events and message delivery.                                                       |
| Calls              | WebRTC + specialist media infrastructure             | Audio/video sessions; never expose application servers as media transport.                                                    |
| Live               | Specialist ingest/transcoding/CDN                    | Scalable live video; video never passes through normal Laravel HTTP requests.                                                 |
| Media              | S3-compatible object storage + CDN                   | Private/public assets, variants and secure delivery.                                                                          |
| Search             | PostgreSQL first → OpenSearch when justified         | Avoid premature infrastructure while preserving an extraction path.                                                           |
| Analytics          | Transactional events → warehouse/OLAP when justified | Protect OLTP correctness and enable creator/business analytics.                                                               |
| AI                 | Laravel AI SDK                                       | Provider-flexible copilot, tools, structured output, embeddings/RAG and agent workflows.                                      |
| Observability      | OpenTelemetry-compatible + error monitoring          | Traces, metrics, logs, dashboards and alerting.                                                                               |
| Local runtime      | Docker Compose                                       | Reproducible multi-process development and integration environment.                                                           |

## 3. Architecture & Concurrency

VYRA remains a modular monolith first, with strong domain boundaries. Services are extracted only when scale, team ownership, deployment independence or reliability requirements justify it.

The high-performance runtime does not change the domain architecture. Octane is an application-server optimization; it is not a reason to turn the monolith into microservices.

Application nodes are stateless. Reverb owns persistent realtime connections. CDN/media infrastructure owns large media delivery. Redis and queues remove long-running work from request paths.

Reliability rule: if chat fails, video should not necessarily fail; if analytics is delayed, payment settlement must continue. Payment, entitlement and ledger paths receive the highest reliability priority.

```text
Browser
  │
  ├── HTTPS ──► CDN / WAF / Load Balancer
  │                 │
  │                 └──► Laravel Octane + FrankenPHP nodes
  │                         ├── PostgreSQL
  │                         ├── Redis
  │                         ├── Queue workers
  │                         └── Object storage / CDN
  │
  ├── WebSocket ──► Reverb cluster ──► Redis
  │
  ├── Media ──────► Object storage / CDN
  │
  ├── Calls ──────► WebRTC / specialist media infrastructure
  │
  └── Live video ─► Specialist ingest / transcoding / CDN

Optional:
Laravel / Inertia ──► Inertia SSR process (when enabled)
```

## 4. Product Pillars

- Identity: verified creator identity, public profile, custom URL, social proof, roles and team access.
- Commerce: subscriptions, one-time products, PPV, bundles, tips, gifts, requests, tickets, courses, calls and events.
- Content: posts, images, video, audio, collections and access-controlled media.
- Communication: fan/creator messaging, notifications, realtime events, blocking and reporting.
- Experiences: bookings, voice/video calls, live streams and paid events.
- Money: payment intents, taxes/fees, double-entry ledger, refunds, disputes, holds and payouts.
- Trust: KYC, age checks, moderation, fraud/risk, abuse reporting, auditability and safety workflows.
- Intelligence: revenue analytics, funnels, cohorts, retention, creator CRM and AI copilot.

## 5. Personas & Roles

- Fan/customer: discover creators, follow, buy, subscribe, message where permitted, book, attend and manage purchases.
- Creator: publish, price, sell, communicate, schedule, view analytics and withdraw eligible earnings.
- Creator team: role-based access for manager, editor, finance, moderator and support staff.
- Platform operations: support, finance, trust & safety, moderation, risk, compliance and security.
- Administrator: strictly controlled privileged access with just-in-time elevation and full audit trails.

## 6. Core User Journeys

- Creator onboarding: Sign up → verify email/phone → choose creator handle → KYC/age verification → payout account → profile setup → create first product → publish.
- Fan purchase: Visit profile → view offer → authenticate → payment intent → verified payment webhook → order recorded → entitlement granted → receipt/notification → content access.
- Subscription lifecycle: Subscribe → active entitlement → renewal attempt → success/failure → grace period if applicable → cancellation/expiration → entitlement update.
- Custom request: Fan creates request → creator accepts → payment authorized/collected → work delivered → fan confirmation or dispute window → funds become payable → payout.
- Booking: Creator defines availability → fan selects slot → payment → booking lock → reminders → session token → completion/no-show/cancellation → settlement.

## 7. Generic Product & Entitlement Model

Every monetizable offer is a Product with type, price, currency, tax behavior, availability, inventory/capacity, delivery method, refund policy and entitlement rules.

Product types include Subscription, Digital Content, PPV, Bundle, Course, Ticket, Live Access, 1:1 Call, Group Call, Paid Request, Tip/Gift and future physical goods.

The Entitlement Engine is a first-class authorization layer. It answers what a user is entitled to access at a specific moment, preventing scattered access logic across features.

## 8. Domain Map

| Domain         | Responsibilities                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| Identity       | Users, emails, phones, sessions, devices, MFA/passkeys, roles, permissions.                           |
| Creator        | Profiles, verification status, teams, settings, storefront.                                           |
| Commerce       | Products, prices, variants, access rules, orders, subscriptions, bundles, PPV.                        |
| Payments       | Payment intents, attempts, provider events, refunds, disputes, chargebacks, payout accounts, payouts. |
| Ledger         | Accounts, transactions, entries, balance snapshots, fees, taxes, creator payable balances.            |
| Entitlements   | Access grants, expiration, revocation, subscription-derived access.                                   |
| Content        | Posts, media assets/variants, collections, access rules.                                              |
| Messaging      | Conversations, members, messages, attachments, blocks, reports.                                       |
| Booking        | Availability, exceptions, bookings, call sessions.                                                    |
| Live           | Streams, viewers, tips, stream state and moderation hooks.                                            |
| Trust & Safety | Risk events, moderation cases/actions, reports, audit logs.                                           |
| Notifications  | In-app, email/push abstractions and preferences.                                                      |
| Analytics      | Canonical events, creator/admin reporting, warehouse pipeline.                                        |
| AI             | Provider abstraction, copilot, tools, RAG/knowledge base, AI audit/cost controls.                     |
| Admin/Ops      | Support, finance, moderation, risk, security and operational actions.                                 |

## 9. PostgreSQL Database Blueprint

PostgreSQL is the transactional source of truth. Redis must never become the authoritative store for financial truth, orders, entitlements or other durable business records.

Identity: users, user_emails, user_phones, sessions, devices, roles, permissions, creator_profiles, creator_team_members, verification_cases.

Commerce: products, product_prices, product_variants, product_access_rules, orders, order_items, subscriptions, subscription_events, entitlements.

Payments: payment_intents, payment_attempts, payment_provider_events, refunds, disputes, chargebacks, payout_accounts, payouts, payout_items.

Ledger: ledger_accounts, ledger_transactions, ledger_entries, balance_snapshots.

Content: posts, media_assets, media_variants, collections, content_access_rules.

Communication: conversations, conversation_members, messages, message_attachments, blocks, reports.

Booking/live: availability_rules, availability_exceptions, bookings, call_sessions, live_streams, live_viewers, live_tips.

Trust/ops: risk_events, moderation_cases, moderation_actions, audit_logs, admin_notes, support_cases.

Analytics: event ingest metadata and warehouse-side fact/dimension models rather than overloading OLTP.

## 10. Financial Architecture

Non-negotiable: the browser never decides that money moved and never directly grants paid access.

Payment flow: Client creates payment intent → provider handles payment details → provider webhook is signature-verified → idempotent payment event is stored → order marked paid → ledger entries posted → entitlement granted.

Use immutable double-entry accounting. Every financial movement has balanced debit/credit entries and a traceable transaction identifier.

Separate customer payment, platform fees, taxes, creator payable balance, refunds and payout movement.

Daily reconciliation compares external processor events with internal payment records and ledger balances. Exceptions enter an operations queue.

## 11. Authentication & Authorization

Use passkeys where available, secure OAuth, verified email/phone, optional or risk-triggered MFA, device/session management and suspicious-login detection.

Use RBAC for coarse roles plus resource/attribute checks for creator, team, product, entitlement and moderation access.

Resolve requested objects and verify the actor’s relationship and entitlement before returning data. Protect against IDOR/BOLA.

Privileged access requires separate admin identity controls, least privilege, short-lived elevation, strong MFA, risk controls and comprehensive audit logging.

## 12. Media & Content Security

Keep private media in non-public object storage. Deliver through short-lived signed URLs/tokens only after authorization.

For high-value media, support segmented streaming, expiring access, optional DRM and forensic watermarking where commercially justified.

Uploads require malware scanning, file-type validation, size limits, transcoding isolation and content moderation.

Video/audio never passes through normal Laravel application requests.

## 13. Messaging, Realtime & Redis

Messaging requires conversation-level authorization, rate limits, anti-spam, abuse reporting, attachment scanning, block/mute controls and retention rules.

Laravel Reverb + Echo provides realtime transport. The database remains authoritative for durable state.

Redis may provide cache, rate limiting, distributed locks, presence/shared short-lived state and queue transport. Redis-backed counters are not a replacement for durable ledger or transactional records.

Realtime failures must degrade gracefully. Durable messages, purchases, bookings and financial state must remain persisted transactionally.

TLS is required in transit and encryption at rest. Do not promise end-to-end encryption unless the product can reconcile it with safety, support and lawful-access requirements.

## 14. Voice/Video & Live Streaming

Calls use WebRTC/media infrastructure with platform-issued session tokens. Never expose personal phone numbers.

Session authorization must be tied to a valid booking or entitlement.

Live streaming is separated from realtime chat: specialist ingest/transcoding/CDN handles video, while VYRA handles paid access, tickets, moderation, capacity, tips and safety.

Swoole/FrankenPHP/Octane are not the live-video transport layer. Video delivery must not consume normal application workers.

## 15. Trust, Safety & Fraud

KYC uses a specialist regulated identity-verification provider. Store the minimum necessary result and provider reference rather than raw identity documents unnecessarily.

Risk signals include account age, device/IP reputation, transaction velocity, payment behavior, chargebacks, verification status, anomalous access and repeated abuse patterns.

Risk actions may include allow, step-up verification, hold, review, restrict, suspend or escalate according to policy.

Moderation combines automated detection, human review, creator/fan reports, evidence, case states and appeals.

## 16. Privacy & Data Governance

Classify data as public, internal, sensitive, highly sensitive, identity and financial, with different access and retention rules.

Collect only what is needed. Prefer processor references/tokens over payment credentials and verification results over raw identity documents.

Define collection purpose, retention, deletion/anonymization, access requests, consent/notice where applicable and vendor data-processing responsibilities.

For an India-first launch, map applicable Indian privacy, tax, payments, intermediary/platform, consumer and content-safety obligations and obtain qualified legal review before launch.

## 17. Security Program

Secure SDLC: threat model → security review → code review → automated tests → dependency scanning → staging → penetration testing → production monitoring.

Controls include secrets management, key rotation, encryption, WAF, rate limits, API validation, secure headers, dependency pinning, least privilege, network segmentation and hardened CI/CD.

Testing includes unit, integration, contract, authorization, payment, webhook replay/idempotency, upload, abuse, load, chaos/failure and security regression tests.

Plan independent penetration testing and progressively formalize controls toward SOC 2/ISO 27001-style governance if required.

## 18. Admin & Operations Console

Support: search users/orders/bookings, safe operational context, support cases and policy-bound actions.

Finance: refunds, disputes, chargebacks, payouts, holds, reconciliation and ledger investigation.

Trust & Safety: reports, moderation queues, risk alerts, restrictions and evidence.

Security: login anomalies, API abuse, privileged actions, audit events and incident response.

Admin tooling is production-critical software and must receive the same security discipline as the customer product.

## 19. Analytics & Data Platform

Emit canonical events such as user.created, product.published, payment.completed, entitlement.granted, subscription.renewed, booking.completed and payout.completed.

Pipeline: application events → durable event transport → warehouse/OLAP → curated metrics → dashboards/AI.

Core KPIs: GMV, net revenue, MRR, creator earnings, take rate, conversion, ARPU, LTV, churn, renewal rate, refund rate, chargeback rate, request completion and creator retention.

Do not send unnecessary sensitive payloads into analytics. Prefer stable internal IDs and aggregated/coarsened data where possible.

## 20. Creator CRM & AI

CRM segmentation may use engagement, purchase history, membership status, recency, frequency and monetary value, subject to privacy and policy.

AI copilot goals: explain revenue changes, identify funnel bottlenecks, draft offers, summarize performance, suggest content/product experiments and surface likely churn cohorts.

AI must not directly execute high-impact financial, moderation or account actions without explicit policy gates and human confirmation.

Laravel AI SDK is an integration foundation, not automatic intelligence. Provider keys, model choices, prompts, tools, safety controls, cost controls and evaluation still need deliberate design.

## 21. Collaboration & Revenue Splits

Teams support managers, editors, finance and moderators through role-based access.

Collaboration supports multiple creators on products/events with configurable revenue-share rules.

Revenue split calculations feed the same immutable ledger rather than ad-hoc balance arithmetic.

## 22. API & Domain Design

Use versioned APIs where APIs are exposed, consistent error schemas, idempotency keys for financial mutations, cursor pagination, strict input validation and authorization at the domain boundary.

Representative domains: /auth, /users, /creators, /products, /orders, /subscriptions, /entitlements, /payments, /payouts, /content, /messages, /bookings, /live, /reports.

Webhooks require signature verification, timestamp/replay protection, idempotent processing, durable event storage and observability.

The web application remains Laravel routes/controllers/domain + Inertia/React. A separate API is not required merely because React is used. A future mobile app may consume versioned APIs while sharing domain/application logic.

## 23. Mobile-First UX System

Design at 360/375/390/412px first, then expand to tablet and desktop.

Use 44px+ touch targets, safe-area support, keyboard-aware forms, mobile bottom navigation, sheets/drawers for contextual actions, sticky primary actions where useful, responsive desktop navigation, accessible contrast/focus states and reduced-motion support.

Use strong typography, generous whitespace, subtle borders, restrained shadows and clear hierarchy. Avoid generic SaaS-template aesthetics, excessive gradients/glassmorphism, clutter, tiny text and gimmicky animation.

Core reusable UI primitives: Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Avatar, Badge, Card, Sheet, Dialog, Drawer, Dropdown, Tabs, Toast, Alert, Skeleton, EmptyState, ErrorState and Confirmation.

## 24. Greenfield Repository Structure

```text
app/
  Domain/
    Identity/ Creator/ Commerce/ Payments/ Ledger/ Entitlements/
    Content/ Messaging/ Booking/ Live/ Trust/ Notifications/
    Analytics/ AI/ Admin/
  Actions/ Policies/ Jobs/ Events/ Listeners/ Http/ Support/

resources/js/
  components/ features/ layouts/ pages/ hooks/ lib/ types/

tests/
  Feature/ Unit/

docs/
  architecture.md
  security.md
  domain-model.md
  scaling.md
  deployment.md
  testing.md
  decisions/

docker/
  (local runtime assets and service configuration as adopted)
```

## 25. North-Star Architecture Rules

- Money is never a mutable number without ledger evidence.
- Access is never granted without an entitlement decision.
- The browser is never trusted for payment success or authorization.
- Private media is never permanently public.
- Sensitive data is minimized and compartmentalized.
- Every privileged action is attributable and auditable.
- Analytics must not compromise transactional correctness.
- Start modular; extract services when evidence demands it.
- Application workers are stateless between requests; do not rely on process memory for user/business state.
- Long-running workers must be Octane-safe: avoid request-specific mutable static/global state and unsafe singleton state.
- Realtime transport is not transactional truth.
- Video transport is not application transport.
- Expensive or failure-prone work belongs off the synchronous request path.

## 26. Runtime & Performance Foundation — NEW

VYRA adopts Laravel Octane + FrankenPHP as the application HTTP runtime. The goal is to keep the Laravel application warm in long-lived workers and reduce repeated bootstrap overhead, while retaining Laravel's domain model and request lifecycle.

FrankenPHP is the selected Octane server. It replaces the role normally occupied by a web server + PHP-FPM combination for the VYRA application runtime.

This is an optimization and runtime architecture decision, not a promise of a fixed throughput, latency or memory figure. Performance targets must be validated with representative load tests.

The runtime foundation is introduced early, before Commerce and Payments become substantially larger, so long-running-worker safety becomes a normal engineering constraint rather than a late migration.

| Concern            | VYRA decision                                                                                   |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| HTTP server        | FrankenPHP                                                                                      |
| Laravel runtime    | Octane long-lived workers                                                                       |
| Process model      | Multiple stateless application workers; worker recycling configured deliberately.               |
| Request state      | Request-scoped/container-managed state only; no cross-request business state in process memory. |
| Slow work          | Laravel Queue workers, not Octane request workers.                                              |
| Realtime           | Separate Reverb process/cluster.                                                                |
| Cache/shared state | Redis.                                                                                          |
| Database truth     | PostgreSQL.                                                                                     |
| Local environment  | Docker Compose production-like runtime.                                                         |
| Performance proof  | Load testing, profiling and SLO/capacity measurements; no unverified marketing claims.          |

## 27. Docker & Local Development Runtime — NEW

Docker Compose is the canonical local integration environment for the VYRA runtime. The objective is reproducibility: developers should be able to run the same classes of services locally that exist in staging/production.

The initial compose topology should remain intentionally small: application/FrankenPHP + Octane, PostgreSQL, Redis, Reverb and a queue worker. Add SSR and other specialist services when their feature work is introduced.

Local development must support hot code iteration without making production runtime assumptions unsafe. Octane watch/restart behavior should be configured deliberately rather than relying on stale workers.

php artisan serve is not the reference VYRA runtime once Octane is established. It may remain available as a fallback/debug tool only if there is a concrete reason.

```text
docker compose
├── app        → FrankenPHP + Laravel Octane
├── postgres   → PostgreSQL
├── redis      → Redis
├── reverb     → Laravel Reverb
├── queue      → Laravel queue worker
└── ssr*       → Inertia SSR process when enabled

* optional until SSR is deliberately activated.
```

## 28. Octane-Safe Engineering Standard — NEW

Long-lived workers change the risk profile of application code. VYRA must not store request-specific user, authorization, tenant, payment or business state in static properties, globals or unsafe singletons.

Services should prefer request-scoped dependencies and explicit method inputs. If a singleton must hold mutable state, its lifecycle must be explicitly understood and reset-safe.

Service providers must not assume boot/register runs for every request. Configuration and bindings that need per-request state must use appropriate request lifecycle hooks.

Third-party packages must be checked for Octane compatibility before adoption in critical paths.

Worker recycling is a safety mechanism, not a substitute for correct state management. Memory growth and leak behavior must be observable.

Testing must include repeated-request scenarios for sensitive flows and, where practical, Octane runtime tests.

## 29. Queues, Background Work & Failure Isolation — NEW

HTTP requests should perform only the work required to establish a durable result or immediate user response.

Use queues for email, notifications, analytics fan-out, media processing, AI work that does not require synchronous streaming, reconciliation, moderation jobs and other expensive or failure-prone tasks.

Queue jobs must be idempotent where retries are possible, carry stable identifiers, have bounded retry policies and emit useful telemetry.

A slow third-party dependency must not unnecessarily consume application workers. Timeouts, circuit-breaking/retry strategy and failure states must be designed per integration.

Financial state changes must remain transactionally correct even when downstream notifications or analytics are delayed.

## 30. Realtime Runtime & Reverb Scaling — NEW

Reverb runs as a separate long-lived realtime service/process. It is not embedded into FrankenPHP/Octane request workers.

Redis may provide the shared coordination/pub-sub layer required for multi-node realtime deployments.

Presence, typing indicators, live counters and transient realtime state may use Redis where appropriate; durable messages and business events remain persisted transactionally.

When VYRA scales horizontally, Reverb nodes and Octane application nodes can scale independently according to their workload.

## 31. SSR Runtime Boundary — NEW

Inertia SSR, when enabled, is treated as a separate long-running process rather than part of the Laravel HTTP worker itself.

The SSR process is responsible for rendering React views; Laravel remains responsible for authorization, domain logic and data access.

SSR must not become a second backend. It consumes the same application-provided page data and should not duplicate domain logic.

SSR is introduced when page requirements justify it, with process supervision, health checks and resource limits.

## 32. Performance, Observability & Capacity

Performance work is evidence-driven. Establish baseline measurements before and after Octane/Redis/Reverb adoption.

Measure request latency, throughput, queue latency, database query time, cache hit rate, Redis health, worker memory, worker restarts, Reverb connection counts, websocket message rates, error rates and external dependency latency.

Define SLOs and capacity thresholds for checkout, entitlement checks, content access, messaging, creator dashboards and critical financial paths.

Use tracing/correlation IDs across HTTP requests, queued jobs, payment webhooks, realtime events and external provider calls.

Load tests must represent realistic concurrency and payload sizes; do not infer production capacity from local RAM estimates or generic benchmark claims.

## 33. MVP Definition & Updated Roadmap

MVP must-have: authentication; creator profiles; KYC workflow; products; memberships; one-time digital sales; payment integration; ledger; entitlements; media delivery; payouts; basic moderation; admin console; basic analytics.

Defer: full social discovery, advanced live, sophisticated AI, creator marketplace, complex collaboration, international tax/payment expansion and native apps until core economics and reliability are validated.

| Phase                                             | Status / Focus                                                                                                                                        |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 0 — Foundation                              | COMPLETED. Application foundation, architecture, security standards, PostgreSQL, auth, design system, domain structure, CI and deployment foundation. |
| Phase 1 — Creator Identity & Ownership            | COMPLETED. Creator ownership, canonical handles, policy boundaries, owner CRUD and tests.                                                             |
| Phase 2 — Creator Profile Foundation              | COMPLETED. Public/private profile visibility, social links, public profile route and security boundaries.                                             |
| Phase 3 — Runtime & Performance Foundation        | NEXT. Docker, Octane + FrankenPHP, Redis, queues, Reverb, runtime health/observability and Octane-safe standards.                                     |
| Phase 4 — Commerce Foundation                     | Products, prices, variants, availability, orders and reusable commerce primitives.                                                                    |
| Phase 5 — Entitlements & Content Access           | Entitlement engine, access rules, private media delivery and content primitives.                                                                      |
| Phase 6 — Payments & Checkout                     | Payment intents, provider integration, verified webhooks, checkout and payment state machines.                                                        |
| Phase 7 — Ledger, Refunds & Payouts               | Immutable double-entry ledger, reconciliation, refunds/disputes and creator payout flows.                                                             |
| Phase 8 — Memberships, Subscriptions & Storefront | Subscriptions, PPV, bundles, storefront presentation and monetization UX.                                                                             |
| Phase 9 — Relationship Layer                      | Messaging, notifications, CRM, bookings, paid requests and richer analytics.                                                                          |
| Phase 10 — Experiences                            | Live, calls, events, tickets, collaboration and revenue splits.                                                                                       |
| Phase 11 — Intelligence                           | AI copilot, churn prediction, recommendations and advanced fraud/risk tooling.                                                                        |
| Phase 12 — Global & Scale                         | Multi-currency, multi-language, regional payments/tax/compliance and infrastructure expansion.                                                        |

## 34. Correct Build Order — Updated

- Freeze product vocabulary and domain boundaries.
- Maintain migration-ready PostgreSQL schema and authorization matrix.
- Establish the production-like runtime early: Docker + Octane/FrankenPHP + Redis + queues + Reverb.
- Validate Octane safety, health checks, worker lifecycle and observability.
- Design payment state machine and double-entry ledger.
- Design entitlement/access-control engine.
- Design media pipeline and private delivery.
- Build creator/fan/admin UX around those primitives.
- Add observability, fraud, moderation and analytics.
- Security test and load test critical paths.
- Expand into live, calls, AI and global features only after the core is reliable.

## 35. Phase 3 — Exact Codex Mission

Phase 3 is the runtime foundation mission. It must be implemented in the existing VYRA repository without creating a nested application and without changing the established domain/business behavior.

Codex must inspect current official Laravel 13, Octane, FrankenPHP, Reverb, Redis and Docker documentation before changing package/runtime configuration. Use current official package versions and commands rather than guessing.

The mission is to establish a reproducible production-like local runtime and make the existing application safe under long-lived workers.

- Add Laravel Octane and configure FrankenPHP.
- Create a minimal Docker Compose environment for application, PostgreSQL, Redis, Reverb and queue worker.
- Preserve PostgreSQL as transactional truth.
- Configure Redis for cache/shared short-lived state and queue transport where appropriate.
- Configure Laravel Reverb as a separate realtime process and establish Echo client readiness.
- Establish queue worker conventions, retry/idempotency expectations and failure isolation.
- Add health/readiness checks appropriate to the local/staging runtime.
- Add Octane-safe engineering documentation and tests for cross-request state hazards.
- Do not introduce microservices.
- Do not implement payments, KYC, payouts, live streaming or production AI as part of this phase.
- Do not route video through Laravel/Octane.
- Do not weaken authentication, authorization or session behavior to accommodate the runtime.

## 36. Master Codex Prompt — Runtime Phase

Use this as the Phase 3 implementation instruction after confirming the repository is clean and the VYRA Master Blueprint v3.0 is present.

```text
You are the lead staff engineer continuing VYRA, a greenfield creator commerce and monetization platform.

WORKSPACE:
Use the existing repository. Do not create a nested application. Inspect the current workspace and git state first.

LOCKED APPLICATION STACK:
- Laravel 13
- PHP 8.3+
- React 19
- TypeScript
- Inertia 3
- Tailwind CSS v4 + shadcn/ui
- PostgreSQL
- Redis
- Laravel Queues
- Laravel Reverb + Echo
- Laravel Octane + FrankenPHP
- Object storage + CDN abstraction
- WebRTC + specialist media infrastructure for future calls
- Specialist streaming infrastructure + CDN for future live streaming
- Laravel AI SDK for future AI capabilities

PHASE 3 GOAL:
Make the existing VYRA application run on a reproducible production-like runtime using Docker, Octane/FrankenPHP, Redis, Reverb and queues, while preserving all current domain behavior.

NON-NEGOTIABLE:
- PostgreSQL remains transactional truth.
- Redis is not financial truth.
- Reverb is separate from Octane HTTP workers.
- Video never passes through Laravel HTTP workers.
- Do not create microservices.
- Do not change auth/session/Fortify behavior unless required by a documented runtime compatibility issue.
- Do not store request-specific mutable state in static/global/unsafe singleton memory.
- Do not add unverified performance claims.
- Do not implement payments, KYC, payouts, live streaming or production AI in this phase.

IMPLEMENT:
1. Inspect official current Octane/FrankenPHP/Reverb/Redis documentation.
2. Add/configure Octane + FrankenPHP.
3. Add Docker Compose for app, PostgreSQL, Redis, Reverb and queue worker.
4. Configure environment separation safely.
5. Configure Redis cache and queues.
6. Configure Reverb/Echo readiness.
7. Add worker lifecycle/restart strategy and health checks.
8. Add Octane-safe coding conventions and targeted tests.
9. Verify the existing test suite under the new runtime assumptions.
10. Run formatting, static analysis, TypeScript, frontend checks and production build.
11. Update architecture, scaling, deployment, testing and README documentation.
12. Commit only after the repository is clean and all gates pass.

FINAL REPORT:
Report exact files changed, packages installed, runtime commands, Docker services, configuration assumptions, tests, build result, performance/observability additions, remaining gaps and the recommended Phase 4 Commerce plan.
```

## 37. Launch Readiness Checklist

Security: threat model complete; secrets managed; authorization tests; dependency scanning; penetration test; incident response plan.

Payments: webhook signatures; idempotency; reconciliation; refund/dispute flows; ledger balancing; payout controls.

Privacy: data map; retention schedule; deletion/access workflows; vendor review; privacy notices and legal sign-off.

Operations: support tooling; moderation queue; fraud review; finance reconciliation; backup restore test; monitoring and alerts.

Performance: load test checkout, content access, messaging and creator dashboards; define SLOs and capacity thresholds.

Runtime: Octane worker lifecycle verified; memory behavior observed; Redis health monitored; Reverb capacity tested; queue retries/dead-letter handling defined; Docker/staging parity reviewed.

## 38. Final Recommendation & Change Record

LOCKED FINAL DECISION: VYRA will be built as a Laravel 13 + React 19 + TypeScript + Inertia 3 modular monolith, backed by PostgreSQL and Redis, with Laravel Octane + FrankenPHP for the HTTP runtime, Laravel Reverb for realtime, Laravel Queues for asynchronous work, and specialist infrastructure for WebRTC/live media.

The product, financial, security, trust, analytics and operations requirements from the prior master blueprint remain in force unless explicitly changed here.

This v3.0 update formally incorporates the runtime/performance architecture that was previously discussed separately: Octane, FrankenPHP, Docker, Redis, queues, Reverb, Octane-safe engineering, SSR process boundaries, observability and evidence-driven capacity planning.

Gemini-style benchmark/RAM/cost claims are intentionally not adopted as architectural guarantees. VYRA will validate capacity through its own load tests and production telemetry.

The strongest version of VYRA is not a clone of an existing creator-pass product. It is a secure, extensible Creator Operating System whose primitives—identity, products, payments, ledger, entitlements, content, relationships, trust and data—support many monetization models without redesigning the platform each time.

This document supersedes the previous v2.0 master as the active specification once accepted. The previous v2.0 file should be retained only as historical reference, not as an active build instruction.

- v2.0 → v3.0: brand terminology updated to VYRA where user-facing.
- v2.0 → v3.0: Laravel Octane + FrankenPHP promoted to locked HTTP runtime.
- v2.0 → v3.0: Docker Compose promoted to canonical reproducible local integration runtime.
- v2.0 → v3.0: Redis, queues and Reverb runtime boundaries made explicit.
- v2.0 → v3.0: Octane-safe coding standard added.
- v2.0 → v3.0: SSR process boundary documented.
- v2.0 → v3.0: roadmap aligned with actual completed phases and next implementation phase.
- v2.0 → v3.0: unsupported fixed performance, RAM and cloud-cost claims excluded.
