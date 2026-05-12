---
title: Is IaC Dead? The Rise of Desired State
date: January 22, 2025
slug: iac-dead-desired-state-2025
---

Every few years someone declares Infrastructure as Code dead. The arguments sound compelling. "YAML is not code!" "Terraform is too verbose!" "Just use Pulumi in TypeScript!" But IaC isn't dying. It's evolving from imperative provisioning toward desired state management.

## The Problem with Classic IaC

Traditional IaC (Terraform, CloudFormation, ARM templates) works well for initial provisioning. You define resources, run `apply`, and infrastructure appears. The problems start afterward.

**Drift is inevitable.** Someone goes into the AWS console to fix a production issue at 2 AM. They change a security group rule. They resize an instance. They add a tag. The IaC template no longer matches reality. The next `terraform plan` shows changes that might overwrite the emergency fix. Now you have a decision to make — revert the change or update the template.

AWS CloudFormation addressed this in 2025 with drift-aware change sets that do a three-way diff between your template, last deployed state, and actual infrastructure. Terraform has health assessments for the same purpose. But these are band-aids on a fundamental problem: reconciling declarative config with imperative reality.

**Configuration management isn't deployment.** IaC tools are great at saying "make the infrastructure look like this." They're less good at ongoing management — certificate rotation, auto-scaling adjustments, gradual rollouts. You end up layering scripts on top of IaC.

## What Desired State Means

The desired state model flips the approach. Instead of running a tool that makes infrastructure match a template, you have a continuous reconciliation loop. The system constantly compares actual state to desired state and corrects drift automatically.

Kubernetes operators are the canonical example. You define a desired state in a custom resource. The operator watches for drift and reconciles. No manual `apply` needed. GitOps tools like Argo CD and Flux extend this pattern to the entire deployment pipeline.

Crossplane takes this further — managing cloud resources (databases, buckets, queues) through Kubernetes-style reconciliation. Your infrastructure becomes custom resources in a cluster. Drift is corrected automatically.

## What This Means for Practitioners

Terraform isn't dead. Pulumi isn't dead. They're still the right tools for initial provisioning and for teams that don't run Kubernetes. But the direction is clear: continuous reconciliation replaces periodic apply.

If you're starting a new project in 2026, consider whether desired state makes sense for your use case. If you're already on Kubernetes, Crossplane or the AWS Controllers for Kubernetes (ACK) give you desired state for cloud resources. If you're not on Kubernetes, Terraform with automated drift detection is the pragmatic choice.

The "IaC is dead" headlines are wrong. But the practice is changing. IaC used to mean "I run a script to configure infrastructure." Increasingly, it means "I declare what I want and the system makes it so."
