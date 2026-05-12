---
title: GitOps Complete Guide
date: March 5, 2024
slug: gitops-complete-guide-2024
---

GitOps is the practice of using Git as the single source of truth for infrastructure and application deployments. By 2026, it's the standard deployment model for Kubernetes and increasingly for cloud infrastructure. The concept is simple: your Git repository contains the desired state of your system. An operator reconciles actual state to match. No manual kubectl. No SSH access. No CI pipeline with deployment scripts. The Git repository is the source of truth, and everything else is derived from it.

## The Core Loop

1. You commit changes to a Git repository (manifests, Helm charts, Kustomize overlays)
2. A GitOps operator (Argo CD or Flux) detects the change
3. The operator syncs the desired state to the target environment
4. If drift occurs (someone runs kubectl manually, a pod crashes, a node fails), the operator corrects it

This loop means deployments are auditable (every change has a Git commit with a known author and timestamp), repeatable (the repository is the source of truth — deploy any commit to any environment), and automatic (the operator handles sync without human intervention). When an incident occurs, you can trace every infrastructure change to a specific commit.

The most underappreciated benefit of GitOps is the separation of build and deploy. CI builds the artifacts and updates the Git repository. CD (the GitOps operator) deploys whatever is in the repository. This means CI failures don't block deployments, and you can deploy an older version by reverting a commit. The Git repository is the deployment queue — merging to `main` is the equivalent of clicking "deploy."

## Argo CD vs Flux

Argo CD is the market leader with broader adoption. Its UI is excellent — you can see the sync status of every application, the diff between Git and live state, and the sync history. The downside: setup is more complex, and the project has had periods of rapid change that made upgrades painful. Argo CD's architecture includes multiple components (application controller, application set controller, server, dex/SSO integration), each of which needs to be configured and maintained.

Flux is simpler to set up but has a steeper initial learning curve due to its multi-controller architecture (source-controller, kustomize-controller, helm-controller). Its v2 API is cleaner for GitOps-specific patterns. Flux integrates more naturally with the Kubernetes ecosystem. Flux also has better support for multi-tenancy out of the box, with separate controllers per namespace.

Choose Argo CD if you need the UI and broad ecosystem support (many integrations, large community, extensive documentation). Choose Flux if you want simpler core mechanics and tighter Kubernetes-native integration. Both are excellent. The difference is marginal for most use cases.

## Beyond Kubernetes

GitOps principles extend to cloud infrastructure via Crossplane (managed Kubernetes clusters with custom resources for S3 buckets, RDS databases, IAM roles) and tools like AWS CDK with Git-based deployment. The key insight: GitOps works wherever you can represent desired state declaratively. The pattern is proving resilient across Kubernetes, serverless, and infrastructure domains because it solves a universal problem: how do you ensure your actual infrastructure matches your intended configuration?
