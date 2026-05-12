---
title: Kubernetes Chaos Engineering With Litmus
date: July 20, 2023
slug: k8s-chaos-engineering-litmus-2023
---

Chaos engineering in Kubernetes has evolved from "let's kill some pods and see what happens" to a structured practice with mature tooling. LitmusChaos, now a CNCF project, is the most popular tool for this. When we started our chaos engineering practice, we found bugs that had been in production for months — services with no retry logic, timeouts that were too short, dependencies that couldn't tolerate failures. Chaos engineering found them in hours.

## What Litmus Does

Litmus injects failures into Kubernetes clusters — pod failures, node failures, network latency, CPU stress, DNS failures, and more. You define experiments as Kubernetes custom resources. The experiments run as jobs, inject the failure, monitor the system's response, and generate a report.

Experiments are organized into charts. The Litmus Hub hosts community-contributed experiments covering common failure scenarios. You can install an experiment with a single `kubectl apply` and run it immediately. The experiment defines the failure injection, the steady-state validation (probes that verify the system is healthy), and the rollback procedure.

## The Right Way to Do Chaos

Start small. Run experiments in a staging environment that mirrors production. The goal isn't to break things — it's to validate that your system survives failures. Each experiment should have a clear hypothesis: "When a pod in the user-service deployment fails, the API should return 503 errors for no more than 5 seconds while Kubernetes reschedules the pod."

A typical progression we followed:

1. **Pod failures.** Kill a pod in a deployment. Does the deployment recover? Does the service route around the failure? How long does recovery take? We discovered that our liveness probes were too aggressive — the service took 15 seconds to start, but the probe started checking at 10 seconds, causing a restart loop. Fix: increased `initialDelaySeconds` to 30.

2. **Network latency.** Add latency between services. Do timeouts trigger? Are retries configured correctly? Does the degraded performance cause cascading failures? We found that service A had a 500ms timeout calling service B, but B's p99 response time was 600ms. The timeout should have been 2 seconds. Fix: increased timeouts and added exponential backoff.

3. **Node failures.** Drain a node. Do pods reschedule correctly? Does the load balancer handle the reduced capacity? We discovered that our pod disruption budgets weren't configured, so draining a node evicted all pods simultaneously, causing a temporary outage. Fix: configured PDBs with `minAvailable: 1`.

4. **DNS failures.** Block DNS resolution. Do services have cached DNS entries? Do they handle resolution failures gracefully? Our services had no DNS caching — they made DNS queries for every request. When CoreDNS had an issue (which happened during a cluster upgrade), all services were affected. Fix: added DNS caching to our service mesh configuration.

## Automating Chaos

Litmus supports continuous chaos — running experiments on a schedule in production. This is the end state: you have ongoing validation that your system's resilience properties hold. We started with weekly experiments in staging, moved successful experiments to production after validation, and eventually ran critical experiments (pod failures for deployed services) on a daily schedule.

The automation pattern: schedule experiments to run during low-traffic hours, use the Litmus result CRD to capture outcomes, and integrate with alerting (PagerDuty, Slack) for failures. A failing experiment triggers an incident, just like a production alert.

## The Investment

Litmus is open-source and free. The investment is in setting up experiments, building a hypothesis framework, and creating the observability to measure results. Plan for two weeks to set up a basic chaos program for a moderate Kubernetes deployment. Start with the Litmus community experiments — run pod-delete, node-drain, and network-latency against your staging environment. Those three experiments will catch the most common resilience gaps.

Chaos engineering pays for itself the first time it catches a resilience gap before a real incident does. For us, that happened in week two of our program — a pod-delete experiment revealed that our payment processing service couldn't handle any pod failure because all replicas were on the same node. A real incident would have caused payment processing downtime. The chaos experiment cost 30 minutes of setup.
