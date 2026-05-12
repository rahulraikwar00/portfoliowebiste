---
title: Dagger CI — Pipelines as Code
date: January 10, 2024
slug: dagger-ci-pipeline-code-2024
---

Dagger is a CI/CD engine that lets you define pipelines in code (Go, TypeScript, Python) rather than YAML. It launched in 2022 and has been steadily gaining adoption. By 2026, it's a mature alternative to GitHub Actions, GitLab CI, and Jenkins for teams that want programmatic pipelines. The core insight: CI/CD is software engineering, and software engineering tools should be written in programming languages, not markup languages.

## The Problem Dagger Solves

CI/CD YAML files start simple and grow into unmaintainable messes. GitHub Actions workflows with 500 lines of YAML and 15 job dependencies. GitLab CI files with complex `rules:` blocks and `extends:` chains. Jenkinsfiles that nobody wants to touch. I've maintained all three, and the pattern is always the same: the first 50 lines are clean, the next 100 are functional, and everything after that is held together by workarounds.

The fundamental problem: YAML is a data serialization language, not a programming language. It has no functions, no loops, no variables (in the programming sense), no type checking, and no testing framework. When you need conditional logic, you use YAML conditionals that are specific to your CI provider. When you need reusable logic, you use YAML anchors or `extends` templates. When you need to debug, you commit and push because there's no local test runner.

Dagger replaces YAML with general-purpose programming languages. Your pipeline is a function that takes inputs and returns outputs. You can use loops, conditionals, functions, and types. You can test your pipeline locally. You can compose pipelines from reusable modules.

## How It Works

```typescript
import { dag, Container, Directory, object, func } from "@dagger.io/dagger"

@object()
class MyPipeline {
  @func()
  async build(source: Directory): Promise<Container> {
    return dag
      .container()
      .from("node:22")
      .withDirectory("/src", source)
      .withWorkdir("/src")
      .withExec(["npm", "install"])
      .withExec(["npm", "run", "build"])
      .withExec(["npm", "test"])
  }
}
```

This pipeline runs locally (`dagger run ts-node pipeline.ts`), in CI (GitHub Actions, GitLab, Jenkins), or anywhere else Dagger runs. The same code, the same behavior, regardless of platform. The Dagger engine (a Docker container) executes each step in a containerized environment, caching outputs and parallelizing where possible.

The local development experience is what sold me. With traditional CI, debugging a pipeline requires committing, pushing, waiting for the CI runner, reading the logs, and repeating. With Dagger, you run `dagger run pipeline.ts` and it executes locally. You see the output immediately. You can add `console.log` statements. You can set breakpoints in your IDE. The feedback loop is seconds instead of minutes.

## The Tradeoffs

Dagger is more powerful than YAML but more complex. Writing a pipeline in TypeScript requires understanding Dagger's SDK, the container model, and the caching semantics. For simple projects (build -> test -> deploy), a 20-line GitHub Actions YAML is faster to write and easier to understand. The complexity investment only pays off when your pipeline has non-trivial logic.

Dagger shines when you have complex pipeline logic (conditional deployments, matrix builds, environment- specific steps), when you want to test your pipeline locally before committing, when you need reusable pipeline modules across projects, and when you run the same pipeline across multiple CI providers. For these use cases, Dagger is transformative. The ability to test a deployment pipeline locally before merging to main saves hours of iteration time.

For straightforward CI, stay with your provider's YAML. For complex pipelines, Dagger's programming-language approach is a significant improvement over YAML workarounds. The deciding factor is whether your CI pipeline is simple enough to fit in 100 lines of YAML. If it is, YAML is fine. If it's not, Dagger will save you debugging time.
