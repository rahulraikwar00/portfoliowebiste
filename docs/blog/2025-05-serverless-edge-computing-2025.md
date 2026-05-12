---
title: Serverless at the Edge in 2025 — A Practical Guide
date: May 7, 2025
slug: serverless-edge-computing-2025
---

Serverless edge computing hit maturity in 2025. The arguments about whether to use it are over. The real question is when to use edge functions, when to use serverless in the cloud, and when to use containers — because in 2026, the winning architecture uses all three.

## What the Edge Is Good At

Edge functions run in CDN nodes close to users. They're good at the things that need to happen fast and close to the requester:

- **Authentication checks.** Verify a JWT, check a session, redirect to login. The edge can do this in single-digit milliseconds without a round trip to a central region.
- **Request routing.** A/B test routing, geolocation-based redirects, feature flag evaluation. Make the decision at the edge, serve the right content.
- **Personalization.** Read a cookie or token, customize the response. Done at the edge, it's effectively instant.
- **Bot mitigation and rate limiting.** Block bad traffic before it reaches your origin servers.
- **API composition.** Call multiple backend APIs and compose the response. The edge parallelizes requests that would otherwise be serial from the client.

Cloudflare Workers processes over 10 million requests per second at 330+ locations. That's production scale, not a demo.

## What the Edge Is Bad At

- **Long-running processes.** Edge functions have tight CPU and memory limits. Cloudflare Workers enforce 30ms CPU budget and 128MB memory. Don't try to process video at the edge.
- **Complex state.** Edge functions are inherently stateless. You can use distributed KV stores (Cloudflare KV, DynamoDB Global Tables), but strong consistency at the edge is hard.
- **Heavy compute.** If you need GPU acceleration or significant processing, the edge isn't ready yet. Containers in a region are still better.

## The Three-Tier Pattern

The emerging best practice in 2025-2026 is a three-tier architecture:

1. **Edge** for ingress decisions — auth, routing, caching, rate limiting
2. **Serverless (cloud region)** for bursty business events — order processing, notifications, webhooks
3. **Containers** for durable services — databases, long-running processes, GPU workloads

Each layer handles different failure modes. The edge handles latency and policy. Serverless absorbs traffic spikes. Containers provide stability.

## Cold Starts Are (Mostly) Solved

Cold starts were the big knock against serverless edge. They're largely a solved problem now. WASM-based edge functions start in microseconds. V8 isolates are pre-warmed. Function providers use ML-based prediction to warm instances before traffic arrives.

Tail latency at the edge is now under 100ms for most providers. Cold starts are still possible for rarely-invoked functions, but for frequently-used paths, they're effectively gone.

## Getting Started

Pick one latency-sensitive endpoint and move it to the edge. Auth verification is the easiest starting point. Instrument it with distributed tracing so you can see the latency improvement. Then expand.

Serverless edge isn't the future — it's the present. The best teams in 2026 are using all three tiers together, not trying to force everything into one model.
