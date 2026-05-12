---
title: OpenTelemetry Reaches Critical Mass in 2025
date: March 16, 2025
slug: opentelemetry-critical-mass-2025
---

OpenTelemetry has become the second-largest CNCF project after Kubernetes. A 2025 survey showed 61% of respondents running it in production, with another 25% actively evaluating. The website got 13 million page views in 2025. The project processes telemetry from systems that serve billions of users.

It's not experimental anymore. OpenTelemetry is the standard.

## What Reached Maturity

**The Collector hit v1.0 in 2025.** This matters because the Collector is the backbone of most OTel deployments. It receives telemetry from instrumented applications, processes it (filter, sample, transform), and exports to backends like Datadog, Grafana, or your own infrastructure. A stable Collector means a stable foundation.

**Semantic conventions stabilized for HTTP spans.** Semantic conventions (semconv) define the field names and values that make telemetry data consistent across languages and frameworks. HTTP spans are stable. Database and messaging semconv are in advanced stages. This means your Go service and your Python service produce the same span attributes for the same operations.

**Traces are the most-used signal.** The 2025 survey found 93% of OTel users collect traces, followed by metrics (71%) and logs (60%). Profiling is the newest signal at 13%. This reverses earlier surveys where metrics led. The shift reflects better tracing instrumentation and the growing maturity of distributed tracing in debugging.

**Go teams lead adoption commitment.** 76% of Go users running OTel in production, the highest of any language. Java is close behind at 69%, then TypeScript at roughly 50%.

## The Real Pain Points

A 2026 analysis of 10,000 Slack messages from OTel community channels revealed what users actually struggle with.

**The gap between "getting started" and "production" is real.** The tutorials work fine for a single service sending to one backend. Scaling to production with proper memory limits, persistent queues, and multi-backend routing requires significant learning. The Collector's memory usage in particular generates a lot of support questions — the recent `GOMEMLIMIT` support helped.

**Sampling is conceptually difficult.** Tail sampling (deciding whether to keep a span after seeing the full trace) generates ongoing confusion. The concept is straightforward but getting the configuration right takes experimentation.

**Kubernetes complexity compounds OTel complexity.** The `k8sattributes` processor and the Operator both add layers of configuration. Simplified deployment patterns would help.

**Error messages need improvement.** Many frustrating support conversations start with a cryptic error message. The community is investing in better error messages with suggested fixes.

## For 2026 and Beyond

OpenTelemetry is investing in profiling as a first-class signal, with an eBPF-based continuous profiling agent being contributed to the project. GenAI instrumentation is also on the roadmap, with semantic conventions and Python instrumentation for OpenAI in development.

The project is also approaching CNCF graduation (moving from incubation to graduated status). The website is getting a redesign, and more language localizations are planned.

If you're not using OpenTelemetry yet, the time to start is now. The standard is stable, the ecosystem is mature, and the tooling keeps getting better. The cost of not having standard, vendor-neutral observability will only grow as your systems get more complex.
