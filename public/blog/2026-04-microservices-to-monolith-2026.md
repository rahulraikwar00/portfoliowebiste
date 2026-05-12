---
title: Why We Moved From Microservices Back to Monoliths
date: April 18, 2026
slug: microservices-to-monolith-2026
---

In 2023, Amazon Prime Video published a case study that made the industry do a double take. They migrated a critical monitoring service from microservices back to a monolith and cut costs by 90%. Not 30%. Ninety percent. If Amazon — the company that practically invented modern microservices — was publicly admitting over-engineering, something had shifted.

## What Went Wrong

Microservices were sold as the default architecture for any serious project. The promise: independent scaling, team autonomy, faster deployments. In practice, many teams discovered a different equation:

- Every internal function call became an HTTP request with latency, retries, and potential failure
- Observability required distributed tracing across dozens of services just to debug a single user request
- CI/CD pipelines multiplied — one per service, each with its own build, test, and deploy
- Cloud bills ballooned from NAT gateways, load balancers, cross-AZ data transfer, and always-on sidecars

The killer? According to DORA research, 90% of microservices teams batch deploy everything together anyway. You get all the complexity of distributed systems with none of the independent deployment benefit. That's the distributed monolith — the worst of both worlds.

## When Microservices Actually Make Sense

This isn't an argument that microservices are always wrong. They work well when:

- You have multiple teams that genuinely deploy independently
- Different services have very different scaling profiles
- Strict compliance isolation is required
- You need polyglot runtimes for specific workloads

If you have 30+ engineers and clear domain boundaries, microservices still make sense. The problem was treating them as the default starting point for teams of 5-10 people.

## What Teams Are Doing Instead

The trend in 2026 is the modular monolith. Same clear module boundaries and domain separation as microservices, but deployed as a single unit. Modules communicate through function calls instead of network RPC. You keep the organizational benefits without the operational nightmare.

Shopify has been running this way for years. They serve millions of merchants on a single Ruby application with strict module boundaries. When they do need to extract a service, the boundaries already exist — it's a clean cut, not a rewrite.

Istio did the same thing. After years of microservice complexity, they merged everything into a single `istiod` process and cut deployment complexity by 90%.

## How to Migrate Back

If you're stuck in microservices hell, the playbook is straightforward:

1. Identify the services that are always deployed together. These are your distributed monolith candidates.
2. Merge them one domain at a time, not all at once.
3. Keep the module boundaries clean. Extract later if needed.
4. Measure what matters: deployment frequency, MTTR, cloud spend.

Most teams see 40-60% reduction in infrastructure costs and noticeable improvements in latency just from removing network hops.

## The Bottom Line

Microservices are a specialized tool, not a default architecture. If you're a small team building a product, start with a well-structured monolith. Extract services only when you have actual evidence that distribution solves a real problem. Boring technology wins.
