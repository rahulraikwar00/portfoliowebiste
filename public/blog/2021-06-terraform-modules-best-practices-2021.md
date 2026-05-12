---
title: Terraform Modules — Best Practices We Learned
date: June 20, 2021
slug: terraform-modules-best-practices-2021
---

Terraform modules are the building blocks of infrastructure as code. After managing hundreds of modules across dozens of environments, here's what we learned about designing them well. The lessons came the hard way — through broken deployments, tangled dependencies, and modules that nobody wanted to touch.

## Module Design Principles

**One module per concern.** Each module should manage one infrastructure concern — a VPC, a database cluster, a compute service, a monitoring dashboard. Don't create modules that provision a VPC, a database, an application, and monitoring in one shot. They become unmaintainable.

I inherited a "stack" module that provisioned everything for a service: VPC, subnets, security groups, ECS cluster, RDS database, ElastiCache, load balancer, DNS records, and monitoring. It had 80 variables and produced 40 outputs. A simple change to the database instance type required understanding how it affected the VPC configuration. We spent a week decomposing it into separate modules. The general rule: if your module has more than 20 variables, it's probably doing too much.

**Sensible defaults.** Every variable should have a default value. The default should be production-safe. The module user should get a working, secure configuration without specifying any variables. `encryption = true` by default. `public = false` by default. Make safety the default, not an option.

This seems obvious but is rarely done well. I've seen modules where every variable is required and the documentation doesn't explain what values are appropriate. The user has to read the module source code to understand what to set. A well-designed module should work with `module "vpc" { source = "./vpc" }` — zero variables, production-safe defaults. Advanced users can override as needed.

**Output only what's needed.** Every output is a coupling point. If you expose an internal value, consumers depend on it and you can't change it. Output only the values that consumers genuinely need — resource IDs, endpoints, ARNs. Not internal implementation details.

We had a module that output the raw CloudWatch log group ARN. Consumers started depending on it. When we needed to change the log group name format for naming consistency, we broke every consumer. The fix was to output what consumers actually needed (a way to associate alarms with the service) rather than the implementation details (the ARN).

**Version everything.** Pin module versions in your root configurations. `source = "git::https://..." ref = "v1.2.0"`. Unpinned module sources lead to unexpected changes and broken deployments. The `ref` parameter ensures every deployment uses the exact same module version. CI/CD should check for pinned versions and flag any references using `latest` or `main`.

## What to Avoid

**Over-parameterization.** If you have 50 variables, your module is too flexible. The module should have 5-10 well-chosen variables that cover the common cases. Edge cases should be handled outside the module. A VPC module needs: `cidr_block`, `availability_zones`, `name`, and a map of subnet configurations. It doesn't need separate variables for each subnet's route table, NACL rules, and tags.

**State exposure.** A module should not create or depend on a specific state configuration. The state configuration belongs to the root module. Modules should be stateless in design. A module that assumes remote state with a specific backend configuration will break in environments with different state setups.

**Cloud provider coupling.** If possible, design modules that work across providers or have clear provider-specific implementations. A "database" module for AWS and GCP should have similar interfaces even if the implementations differ. This makes it possible to switch providers or run multi-cloud without rewriting infrastructure code.

## Testing Modules

Test your modules with Terratest or `tofu test`. Validate that `terraform init` and `apply` succeed for each combination of variables. Test destroy as well — a module that creates resources but can't destroy them has a bug.

The testing pattern: create a test configuration that uses the module with various inputs, run `apply`, verify the resources exist, run `destroy`, verify the resources are gone. Run tests in isolated environments (separate AWS accounts, separate workspaces). Test modules are infrastructure too — they should be versioned and maintained alongside the modules they test.

The investment in module design pays off in reduced configuration drift, faster environment provisioning, and fewer production incidents. The key is discipline: modules should be well-tested, versioned, and reviewed like application code. A module with a hole in its security group configuration is as dangerous as a library with an SQL injection vulnerability.
