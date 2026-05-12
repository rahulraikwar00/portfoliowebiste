---
title: How We Destroyed Our Cloud Bills With Spot Instances
date: April 22, 2024
slug: destroy-cloud-bills-spot-instances-2024
---

We cut our AWS compute bill by 65% using spot instances. Not by migrating to a different provider or "optimizing" our architecture. Just by paying less for the same EC2 instances. The catch: spot instances can be terminated with two minutes notice. If your workload can handle that, you're leaving money on the table. It was the easiest cost optimization we ever made.

## What Are Spot Instances

Spot instances are AWS's spare compute capacity sold at a discount. The price fluctuates based on supply and demand, typically 60-90% below on-demand pricing. AWS can reclaim the instance with a two-minute termination notice when they need the capacity back. The gamble is simple: if your workload can survive instance termination, you save dramatically.

The spot pricing mechanism is market-based. AWS publishes the current spot price for each instance type in each availability zone. When spot demand is low, prices drop to near zero. When demand is high, prices rise toward the on-demand price. The key to reliable spot usage is instance type diversity and availability zone diversity — if one instance type becomes expensive, another might be cheap.

The savings are real. In 2025, we ran a mix of 80% spot and 20% on-demand for our EKS worker nodes. The spot instances cost about 70% less than the on-demand equivalents. Our monthly EC2 bill dropped from $12,000 to $4,200. The migration took a week.

## What Workloads Are Spot-Compatible

**Stateless batch processing.** ETL jobs, data processing, video encoding, CI/CD build agents. If the work can be retried, spot is safe. Our CI pipeline runs entirely on spot instances. If an instance is reclaimed mid-build, another agent picks up the job. The worst case is a slightly longer build time.

**Kubernetes worker nodes.** With node auto-scaling and pod disruption budgets, Kubernetes handles spot terminations gracefully. The pod gets evicted, rescheduled onto another spot instance or an on-demand fallback. Configure pod disruption budgets to ensure minimum service availability. Use cluster auto-scaling to replace terminated instances.

**Stateless API servers.** If your API is stateless behind a load balancer, spot instances work. Terminations cause a brief capacity drop, not data loss. The load balancer routes around failed instances. The auto-scaling group replaces them.

**What doesn't work.** Stateful databases (RDS doesn't support spot), long-running computational workloads without checkpointing (ML training without checkpointing), and anything that can't tolerate interruption (real-time processing with strict SLAs).

## The Setup

1. Use mixed instances policies in EC2 auto-scaling groups or EKS managed node groups. Configure 70-90% spot percentage with on-demand as the fallback.
2. Specify multiple instance types. Spot capacity varies by instance type. Using 5-10 instance types ensures you can always find capacity somewhere. `c5.large`, `c5a.large`, `c5d.large`, `c6i.large`, `m5.large` — mix compute and general purpose types.
3. Use multiple availability zones. Spot capacity varies by AZ. Spread across 3 AZs for maximum availability.
4. Configure termination handling. For Kubernetes, use the AWS Node Termination Handler to gracefully drain pods before the instance is terminated. For EC2 auto-scaling, use lifecycle hooks.

The savings are immediate. Our monthly EC2 bill dropped 65%. The migration was one week of configuration work, no application changes required. If you're not using spot instances for at least some of your compute in 2026, you're paying significantly more than necessary for the same infrastructure.
