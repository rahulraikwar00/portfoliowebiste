---
title: Serverless with AWS Lambda and TypeScript — Lessons Learned
date: December 5, 2022
slug: serverless-aws-lambda-typescript-2022
---

I've been running TypeScript on AWS Lambda since 2022. The experience has improved dramatically, but there are still patterns that work and patterns that don't. Here's what I've learned about building serverless APIs with Lambda and TypeScript — the good, the bad, and what I'd do differently.

## The Good

**Cold starts are mostly solved.** Lambda SnapStart reduces cold starts for Java and Python dramatically. For TypeScript specifically, Bun runs on Lambda now and cuts cold start times from ~500ms to ~150ms compared to Node.js. If you're using Node.js, keeping your deployment package small (under 5MB) and using the `node:22` runtime keeps cold starts under 300ms for most applications. Provisioned concurrency eliminates cold starts entirely for critical paths, though it costs extra.

**The tooling caught up.** The Serverless Framework is still around but the ecosystem has moved to SST (Serverless Stack), which gives you a CDK-like experience with live Lambda development. `sst dev` starts a local environment that proxies Lambda invocations to your machine, so you can debug with breakpoints and hot reload. This is genuinely good — it makes the local development experience comparable to a regular Express or Fastify server.

**Lambda response streaming is GA.** You can stream responses from Lambda instead of buffering them. This matters for AI inference (streaming tokens), large file generation, and any workload where time-to-first-byte matters. The streaming response starts sending data within milliseconds, and the Lambda keeps generating data as the client receives it. This eliminates one of the biggest complaints about Lambda for real-time use cases.

## The Bad

**The IAM maze is real.** Every Lambda needs permissions for every resource it touches. A typical API uses DynamoDB (read/write), SQS (send message), S3 (read objects), Secrets Manager (read secrets), and CloudWatch (logs). That's five separate resource policies in the execution role. Debugging IAM permission errors at 2 AM is not fun — the error messages are often generic and don't tell you which permission is missing.

**Testing requires infrastructure.** Unit testing a Lambda handler is straightforward — you mock the event object and assert on the response. Integration testing requires actual AWS resources or LocalStack. The pattern I've settled on: unit test the business logic with mocked dependencies, integration test the handler with LocalStack for the database and queue interactions, and rely on production monitoring for end-to-end validation. Skip the full integration test suite if it's slowing down your deployment pipeline.

**Cost surprises.** Lambda is cheap at low volume and expensive at high volume compared to containers. A Lambda handling 10M requests/month with 1-second execution costs roughly $500 in compute plus API Gateway costs. The same workload on ECS Fargate would be ~$150. Lambda's value proposition is not needing to manage servers and paying only for what you use. If you can predict your traffic patterns, containers are cheaper.

## What I'd Do Differently

Start with SST or AWS CDK instead of hand-written CloudFormation templates. Keep functions small but not microscopic — one function per API endpoint creates too many functions to manage. Group related endpoints into a single handler with a routing mechanism. Use Lambda Layers for shared dependencies (SDK clients, utility libraries) to reduce deployment package size. Instrument with OpenTelemetry from day one — debugging Lambda without distributed tracing is misery because you can't SSH into the running function. Set budget alerts before you launch. Lambda's "infinite scale" is a feature until you get the bill for a runaway process.
