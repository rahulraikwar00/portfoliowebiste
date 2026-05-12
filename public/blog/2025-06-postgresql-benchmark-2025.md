---
title: PostgreSQL in 2025 vs. Everyone Else
date: June 18, 2025
slug: postgresql-benchmark-2025
---

PostgreSQL has been the quiet winner of the database wars. While everyone was arguing about NoSQL vs SQL, Postgres kept adding features. By 2025, it's not just a relational database — it's a document store, a vector database, a message queue, and a time-series database all in one.

## What Makes Postgres Hard to Beat

**Extensions.** The extension ecosystem is Postgres's superpower. Need a vector database? `pgvector`. Need full-text search? Built-in. Need to connect to Kafka? `pg_kafka`. Need to shard your data? `Citus` or `pg_partman`. Need geospatial queries? `PostGIS`.

No other database has this kind of ecosystem. MongoDB has Atlas. MySQL has... well, MySQL. SQLite has extensions but nothing close to the Postgres ecosystem.

**Feature parity that keeps growing.** JSON support has been production-quality since Postgres 12. The `jsonb` type with GIN indexes is a legitimate document store. You can store JSON documents, index them, query them with JSONPath, and even create partial indexes on specific JSON keys. For most applications, you don't need MongoDB.

Postgres 17 added incremental backup, improved vacuum performance, and better query parallelism. Postgres 18 (expected late 2025) focuses on logical replication improvements and performance optimizations.

**Performance that competes.** In most benchmarks, Postgres matches or exceeds commercial databases for OLTP workloads. It struggles with extreme write throughput compared to distributed databases, but for the 95% use case, it's faster than you need.

The pgbench stats tell the story: a properly tuned Postgres instance handles 10,000+ TPS on moderate hardware. Most applications will hit application bottlenecks before they hit Postgres bottlenecks.

## Where Postgres Doesn't Win

**Horizontal scaling.** Postgres doesn't shard well out of the box. Citus helps, but it's not as seamless as what Spanner or CockroachDB offer. If you need to scale to 100+ nodes with automatic sharding and global consistency, Postgres isn't your answer.

**Extreme write throughput.** If you're doing millions of writes per second (IoT telemetry, analytics ingest), you want something purpose-built like ClickHouse or TimescaleDB (which is built on Postgres but designed for time-series).

**Managed simplicity.** AWS RDS and Aurora make Postgres easy to operate, but the self-hosted experience still requires more DBA attention than, say, a managed DynamoDB table.

## The Benchmark Numbers That Matter

Real-world benchmarks from 2025 show:

- **OLTP (pgbench):** 15,000 TPS on a 16-core machine with NVMe storage
- **Vector search (pgvector):** 95% recall at 10ms for 1M vectors with HNSW indexes
- **JSON queries:** 8,000 QPS on a 100GB JSON dataset with GIN indexes
- **Read replicas:** Near-linear read scaling up to 8 replicas
- **Logical replication:** ~100MB/s throughput with minimal overhead

## The Verdict

PostgreSQL is the right default database for most applications in 2025. Start with it. Add purpose-built databases only when you hit specific bottlenecks that Postgres can't solve.

You can always migrate specific workloads to specialized databases later. What you can't easily do is start with five different databases because each microservice "needs its own data store." Postgres can handle the variety.
