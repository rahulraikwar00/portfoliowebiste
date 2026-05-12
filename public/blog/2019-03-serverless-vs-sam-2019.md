---
title: Serverless Framework vs AWS SAM in 2019
date: March 15, 2019
slug: serverless-vs-sam-2019
---

In 2019, choosing between Serverless Framework and AWS SAM was a genuine decision. Both built and deployed serverless applications on AWS Lambda. Both had ecosystem support. Both worked well. The choice came down to preference and workflow.

## Serverless Framework

Serverless Framework was the more mature tool in 2019. It supported multiple cloud providers, had a plugin ecosystem with hundreds of plugins, and offered a SaaS platform for monitoring and deployment. The `serverless.yml` file was clear and concise. Plugins added functionality — webpack bundling, step function support, custom domain management. The community was large and active.

The downside: the Serverless Framework moved fast and sometimes introduced breaking changes. The multi-cloud support was a differentiator but most teams only used AWS. The Pro/Dashboard offering created uncertainty about the open-source future. And the plugin ecosystem, while rich, meant you accumulated dependencies that could break with version upgrades. Over time, teams found themselves maintaining a `serverless.yml` that was more complex than the application code it deployed.

I used Serverless Framework for about two years across several projects. The developer experience for initial setup was excellent. A few commands and you had a deployed API. But as projects grew, the abstraction started to leak. Customizing IAM roles required digging into CloudFormation templates. Debugging deployment failures meant understanding both Serverless Framework and CloudFormation error messages. The convenience of the initial setup was offset by the complexity of maintaining it.

## AWS SAM

AWS SAM was the native AWS option. It was simpler — a CloudFormation extension for Lambda, API Gateway, and DynamoDB. The `template.yaml` file used CloudFormation syntax with SAM-specific shorthand. SAM had better AWS integration. `sam local invoke` and `sam local start-api` worked well for local development. The build and deploy commands were straightforward. There was no multi-cloud story, but if you were all-in on AWS, that didn't matter.

The downside: SAM was slower to add features than Serverless Framework. CloudFormation complexity was a real cost — when a deployment failed, you were debugging CloudFormation, not SAM. The local emulation wasn't identical to production Lambda, which led to occasional surprises. And the tooling was more basic — no plugin ecosystem, no dashboard, no built-in monitoring.

I found SAM more predictable for complex projects. The CloudFormation integration meant I could define non-Lambda resources (VPCs, databases, queues) in the same template. With Serverless Framework, I needed a separate CloudFormation stack or a plugin. SAM's resource coverage was comprehensive because it inherited CloudFormation's provider support.

## The Comparison

| Aspect | Serverless Framework | AWS SAM |
|--------|---------------------|---------|
| Learning curve | Low for basic use | Moderate (CloudFormation knowledge needed) |
| Local testing | Plugin-dependent | Built-in (sam local) |
| Multi-cloud | Yes | AWS only |
| Plugin ecosystem | Rich | None |
| AWS resource coverage | Limited (via plugins) | Full CloudFormation |
| Deployment speed | Fast | Moderate (CloudFormation overhead) |
| Debugging | Opaque | CloudFormation console |
| Community | Large | Medium |
| Maintenance burden | Plugin updates | CloudFormation expertise |

## Which to Choose

Today, the decision is clearer. Serverless Framework declined in adoption as new tools emerged. SAM improved significantly with faster deployments and better local testing. AWS CDK emerged as the preferred infrastructure-as-code option for serverless. The CDK gives you full programming language support (TypeScript, Python, C#, Java) with the same CloudFormation deployment engine as SAM. It's what I'd recommend for new projects starting in 2026.

For new projects, consider SST (Serverless Stack) for TypeScript-focused serverless development with live Lambda debugging, or AWS CDK for infrastructure-defined serverless. SAM is still viable for teams comfortable with CloudFormation who want a simpler syntax. Serverless Framework remains a legacy choice unless you maintain existing deployments and migration isn't worth the effort.

Whichever tool you pick in 2019-2026, the patterns matter more than the tooling. Focus on function granularity (not too fine, not too coarse), proper observability (OpenTelemetry from day one), and clean separation of business logic from infrastructure concerns. The tool you use to deploy will change. The architecture patterns will serve you regardless.
