---
title: Observability Without Selling Your Soul
date: April 15, 2022
slug: observability-without-selling-soul-2022
---

Observability has become synonymous with expensive SaaS vendors. Datadog bills that grow faster than your infrastructure. New Relic pricing that changes yearly. Honeycomb's value proposition that doesn't scale for smaller teams. The message from vendors is consistent: spend more for better visibility. I've been through this cycle with multiple companies — the first Datadog bill over $10K/month, the frantic optimization, the realization that most of the value comes from basic instrumentation.

But observability doesn't require a six-figure vendor budget. An open-source stack with OpenTelemetry and Grafana can handle serious production workloads. The tradeoff is operational overhead, not capability.

## What You Actually Need

Most teams need three things: metrics (CPU, memory, request rate, error rate, latency), traces (distributed request flow), and logs (structured, searchable). That's it. Everything else is nice-to-have. The vendors sell you on APM, infrastructure monitoring, rum, synthetic monitoring, and profiler integrations. These are valuable but not essential. Start with the basics, add specialized tools when you hit specific pain points.

The core stack:

**OpenTelemetry** is the data collection layer. It's vendor-neutral, CNCF-graduating, and supports traces, metrics, and logs. Instrument your application with OTel SDKs, export to the OTel Collector, and the Collector sends data to your backend. The OTel Collector is the crucial piece — it handles batching, retries, filtering, and multi-backend routing. You instrument once and send to any backend.

**Grafana** is the visualization layer. Dashboards for metrics, traces, and logs. Alerting with Grafana Alerting (or Alertmanager for Prometheus-native). Explore for ad-hoc querying. Grafana is the best visualization tool regardless of your backend — it supports Prometheus, Tempo, Loki, Elasticsearch, Datadog, and dozens of other data sources.

**For metrics:** Prometheus or VictoriaMetrics. Prometheus is simpler for smaller deployments and has excellent Kubernetes integration (service discovery, pod monitoring). VictoriaMetrics handles more scale with less resources — it's a drop-in Prometheus-compatible replacement that uses 10x less storage for the same data.

**For traces:** Grafana Tempo or Jaeger. Tempo is designed for large-scale trace storage without indexing everything. This makes it cheaper to store traces than solutions that index span names, attributes, and tags. Tempo queries traces by service name, operation name, and time range — the most common query patterns. For deep analysis, it can access raw trace data from object storage.

**For logs:** Loki. It indexes labels (service name, pod, namespace), not the full text of log lines. This makes it dramatically cheaper to store logs than Elasticsearch. Loki compresses logs efficiently and stores them in object storage (S3, GCS, MinIO). A typical log retention of 30 days costs pennies per GB in S3.

## The Cost Comparison

For a cluster with 20 services, 100GB/day logs, and moderate tracing:

- Datadog Pro tier: ~$3,000/month for reasonable retention
- Self-hosted OTel + Prometheus + Grafana + Tempo + Loki: ~$300/month in compute costs

The 10x difference compounds over time. A startup spending $3K/month on observability at 20 services will spend $10K/month at 60 services. The self-hosted stack scales sub-linearly because most components can share infrastructure.

The tradeoff is operational overhead. Someone needs to maintain the OTel Collector, Prometheus, Grafana, Tempo, and Loki. An SRE can manage it in about 5 hours per week. A platform team can automate it to near-zero with Kubernetes operators and GitOps. For a team without operational capacity, the vendor premium is worth it.

## When to Pay

The SaaS vendors provide real value: less operational overhead, better integrations, support, and advanced features like APM insights, SLO tracking, and error tracking. If observability isn't your team's core competency, the vendor premium is often justified.

But the baseline — collecting and visualizing traces, metrics, and logs — is achievable with open-source tools at a fraction of the cost. Start with the open-source stack. Add paid tools only when you need specific features that justify the cost. Most teams find the open-source stack sufficient for years.

Don't let observability vendors own your data and your budget. The open-source ecosystem is mature enough for production workloads. If you outgrow it, the experience you gained managing it will help you evaluate vendor offerings — you'll know what you actually need.
