---
title: Kubernetes for JavaScript Developers — An Introduction
date: August 5, 2019
slug: k8s-intro-javascript-developers-2019
---

Kubernetes is infrastructure. JavaScript developers don't need to be Kubernetes experts. But understanding the basics helps you deploy better, debug faster, and communicate more effectively with the platform team. I've seen too many JavaScript developers treat Kubernetes as a black box — push code and hope it works. That approach fails when things go wrong, and in Kubernetes, things always go wrong eventually.

## Why JavaScript Developers Need Kubernetes

You deploy your Node.js or TypeScript application to a cluster. It runs fine in development. In production, it crashes with an out-of-memory error. Your deployment doesn't have resource limits. Another service on the same node consumed all the memory, and your pod was evicted. This happened to me on my first Kubernetes deployment. The application worked perfectly in local Docker Compose. In production, it was killed every few hours during traffic spikes. The fix was adding a single line to the deployment YAML — `resources.limits.memory`. But finding that took three days of debugging.

Understanding resource requests and limits would have prevented this. Understanding probes (liveness, readiness, startup) would tell you why your service isn't receiving traffic. Understanding ConfigMaps and Secrets would help you manage configuration without redeploying. Each of these is a simple concept that saves hours of debugging time.

## The Minimal Kubernetes Knowledge

**Pods.** The smallest deployable unit. One or more containers that share networking and storage. For most applications, one pod runs one container. Think of a pod as a "logical host" for your application process. Pods are ephemeral — they die and get replaced frequently. Don't store data in them.

**Deployments.** Manages pod replicas. Handles rolling updates. If a pod crashes, the deployment creates a new one. You almost never work with pods directly — you work with deployments. The deployment controller ensures the desired number of replicas is always running. If a node fails, the deployment reschedules the pods on healthy nodes.

**Services.** Provides a stable network endpoint for a set of pods. Pods have dynamic IP addresses (they change when pods restart). A service gives you a consistent DNS name that routes to healthy pods. There are different service types: ClusterIP (internal only), NodePort (exposes on node IP), and LoadBalancer (provisions a cloud load balancer).

**Ingress.** HTTP/HTTPS routing. Maps domain names to services. Handles TLS termination. Think of it as a reverse proxy configuration that lives in your cluster instead of in an Nginx config file. Most cloud providers have an Ingress Controller (ALB Ingress Controller for AWS, GCE Ingress for GCP).

**ConfigMaps and Secrets.** Configuration data injected into pods as environment variables or files. ConfigMaps are for non-sensitive data (API URLs, feature flags). Secrets are for sensitive data (API keys, database passwords). Both can be updated without rebuilding the container image. This is the biggest quality-of-life improvement over hardcoded configuration.

## Common Pitfalls and Fixes

**Not setting resource limits.** Your pod can consume all node resources. Always set requests and limits for CPU and memory. Requests guarantee minimum resources. Limits cap maximum usage. Setting limits too low causes throttling (for CPU) or OOM kills (for memory). Setting requests too high wastes cluster capacity. Start with your local resource usage and adjust based on production monitoring.

**Not configuring probes.** Your pod might be running but not ready to serve traffic. Liveness probes know when to restart a container. Readiness probes know when a container is ready to accept traffic. Startup probes are for slow-starting applications. Without these, Kubernetes doesn't know if your application is healthy. A common pattern: HTTP GET probe on a `/healthz` endpoint that checks database connectivity, cache connectivity, and internal state.

**Hardcoding configuration.** Use ConfigMaps for non-sensitive config. Use Secrets for sensitive data. Both can be mounted as environment variables or files. The rule: if it changes between environments, it doesn't belong in the container image.

**Forgetting about pod-to-pod communication.** In development, services communicate via localhost. In Kubernetes, every service has a DNS name within the cluster (servicename.namespace.svc.cluster.local). Your application needs to respect the `SERVICE_HOST` and `SERVICE_PORT` environment variables that Kubernetes injects, or use service discovery.

## Practical Debugging

When your application isn't working in Kubernetes, start with:

1. `kubectl get pods` — are your pods running?
2. `kubectl describe pod <name>` — what events happened? Failed pulls? OOM kills? Probe failures?
3. `kubectl logs <name>` — what does the application say?
4. `kubectl get svc` — is the service pointing at the right pods? (Check selector labels match pod labels)
5. `kubectl get ingress` — is the ingress routing correctly?

These five commands cover 90% of debugging scenarios. The other 10% involve digging into network policies, RBAC permissions, and storage configurations.

You don't need to be a Kubernetes administrator to deploy applications effectively. Understanding these concepts covers 90% of what JavaScript developers encounter. The remaining 10% is learning how your specific organization configures the cluster and what debugging workflows they've established.
