---
title: Why We Abandoned Kubernetes After 18 Months
date: September 28, 2022
slug: abandoned-kubernetes-after-18-months-2022
---

We ran Kubernetes for 18 months. We had a managed cluster (EKS). We had a platform team. We had Helm charts, Argo CD, Prometheus, and all the standard tooling. And after 18 months, we moved our workloads to simpler infrastructure. Here's what we learned.

## The Problem

Kubernetes was the right choice for our future requirements and the wrong choice for our current requirements. We needed a place to run our API servers and background workers. We didn't need multi-tenant isolation, rolling deployments with fine-grained canary analysis, or horizontal pod autoscaling based on custom metrics. But Kubernetes forces you to think about all of these things.

The operational burden was real. Someone needed to understand Etcd backup and recovery — if etcd dies, your cluster dies with it. Someone needed to debug CoreDNS issues — DNS resolution failures are a common Kubernetes problem that manifests as intermittent service timeouts. Someone needed to manage cluster upgrades, which inevitably broke something — a CNI version incompatibility here, a changed API version there. For a team of six, this was too much.

The control plane cost was significant. EKS control plane: $73/month. Three worker nodes: ~$150/month. But the real cost was the tooling required to operate it safely. VPC CNI, CoreDNS, kube-proxy, AWS Load Balancer Controller, ExternalDNS, cert-manager, Argo CD, Prometheus, Grafana, Loki, Fluent Bit, and a dozen other components. Each one required configuration, updates, and occasional debugging. The Kubernetes ecosystem is powerful but the number of moving parts is staggering.

## What We Did Instead

We moved to a simpler setup: application load balancer -> ECS Fargate. ECS doesn't have pods, services, deployments, or the rest of the Kubernetes object model. You define a task definition (what container to run, how much CPU/memory), specify desired count, and ECS keeps it running. The task definition is a JSON document, not a complex CRD hierarchy. Service discovery uses AWS Cloud Map. Logging goes to CloudWatch Logs automatically.

The migration took about two weeks. We defined task definitions for each service, set up the load balancer target groups, configured CI/CD to deploy to ECS instead of EKS, and turned down the Kubernetes cluster. The ECS service was managed by AWS. Upgrades happened automatically — when a new ECS agent version was available, AWS rolled it out. If the service broke, AWS handled the infrastructure. We were responsible for our application, not the orchestration layer.

The tradeoff was significant. We lost the Kubernetes ecosystem — no custom resource definitions, no operators, no native Helm, no Argo CD syncs. But we gained operational simplicity. We didn't need a dedicated DevOps engineer for infrastructure anymore. Our application developers could handle ECS deployments because the mental model was simpler.

## When Kubernetes Makes Sense

Kubernetes is worth the complexity when you have multiple teams sharing a cluster (multi-tenancy with namespace isolation, resource quotas, and network policies). It makes sense when you need advanced deployment strategies (blue-green, canary, A/B testing with traffic splitting). It's valuable when you run diverse workloads (stateful, stateless, batch, ML training) on shared infrastructure and need custom scheduling. And it matters when you need portability across clouds or on-prem.

If none of these apply, you're paying the Kubernetes complexity tax without getting the benefits. This is the "Kubernetes tax" — the operational overhead of running a distributed systems platform that you might not need. Estimate your tax honestly: include control plane costs, tooling maintenance, upgrade testing time, and the opportunity cost of your team learning Kubernetes internals instead of building product features.

## The Lesson

The best infrastructure is the simplest infrastructure that meets your requirements. Kubernetes is a powerful tool for complex environments. For simpler environments, it's a distraction. Know what you actually need before choosing the tool. The question isn't "should we use Kubernetes?" — it's "what problems are we solving, and is Kubernetes the simplest tool for those problems?" In our case, the answer was no. For many teams, it might still be yes. The key is being honest about the complexity you're taking on.
