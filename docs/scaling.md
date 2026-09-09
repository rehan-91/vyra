# Scaling Direction

PostgreSQL is the active development and intended transactional database.
Database cache, queues, and sessions are sufficient for early development.
Redis will support shared cache, queues, rate limiting, and realtime workloads
when provisioned. Laravel queues remain the background-job mechanism.

Object storage/CDN, specialist media/WebRTC services, Reverb/Echo, OpenSearch,
and analytical warehouses are introduced only when measured product needs
justify them. Laravel remains the system of record and modular-monolith
authority until a bounded extraction has evidence and ownership.
