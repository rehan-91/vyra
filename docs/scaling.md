# Scaling Direction

VYRA scales its modular monolith horizontally before considering service extraction. The application tier uses stateless Laravel Octane + FrankenPHP nodes. No request or durable business state may depend on process memory, so a load balancer can add or remove application nodes safely.

Octane workers are long-lived and require explicit lifecycle management: configured recycling, graceful restart/drain procedures, memory and restart telemetry, and repeated-request testing for state leakage. Recycling reduces operational risk but does not make unsafe singleton or static state correct.

Redis is shared infrastructure for cache, rate limiting, distributed locks, queue transport, and appropriate short-lived or realtime state. Queue workers are independently supervised and scaled according to queue depth, latency, and job type. Jobs must use stable identifiers, bounded retries, idempotent retry semantics where applicable, and observable failure handling.

Laravel Reverb is a separate realtime process/cluster. Reverb nodes and Octane nodes scale independently; Redis may provide shared coordination or pub/sub for multi-node realtime delivery. Presence, typing, and other transient signals may use Redis, while durable messages and business events remain in PostgreSQL.

PostgreSQL remains authoritative for transactional state. Redis, Reverb, and application memory must not become the source of truth for orders, entitlements, payments, or future ledger records. Specialist object storage, CDN, WebRTC, and live-media systems own media transport rather than application workers.

Capacity decisions are evidence-driven. Establish representative baselines and measure request latency and throughput, queue latency, database query time, cache health, worker memory/restarts, Reverb connections and message rates, error rates, and external-dependency latency. Set SLOs and scaling thresholds from those measurements. This repository makes no fixed performance, RAM, or capacity guarantees.
