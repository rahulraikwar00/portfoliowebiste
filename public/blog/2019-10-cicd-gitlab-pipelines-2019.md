---
title: CI/CD With GitLab Pipelines — What We Learned
date: October 10, 2019
slug: cicd-gitlab-pipelines-2019
---

GitLab CI/CD was ahead of its time in 2019. While GitHub Actions was still in beta, GitLab had a mature pipeline system with built-in container registry, artifact management, and auto DevOps. I've used GitLab CI across three different companies, from early-stage startups to established enterprises. The experience varies significantly depending on how large your pipeline gets and how much YAML complexity you're willing to tolerate.

## The Pipeline Model

GitLab CI uses `.gitlab-ci.yml` with stages and jobs. Each job runs in a stage. Jobs in the same stage run in parallel. Jobs in subsequent stages wait for previous stages to complete. This model is simple and scales reasonably well.

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
```

The `rules:` keyword (replacing `only:/except:`) provides flexible conditionals. `needs:` allows DAG-style pipelines where jobs depend on specific earlier jobs, not entire stages. This is a significant improvement over linear stage execution and was ahead of what most other CI providers offered in 2019.

One pattern I've used extensively is the DAG pipeline with `needs:`. Instead of waiting for an entire stage to complete, jobs can start as soon as their specific dependencies finish. For a monorepo with multiple packages, this means the frontend tests can start as soon as the frontend build completes, without waiting for the backend to finish building. This cut our pipeline times by about 40%.

## What Works Well

**Built-in container registry.** Every GitLab project gets a container registry. CI builds push images there. Deployments pull from there. No external registry needed. This integration is seamless — the CI job has built-in authentication for the registry. You don't manage credentials or configure Docker login.

**Auto DevOps.** GitLab's Auto DevOps provides a default CI/CD pipeline for projects that don't want to write YAML. It detects the language, runs tests, builds containers, and deploys. It works for simple projects. Complex projects need custom YAML, but the auto-detection is a good starting point. For internal tools and prototypes, Auto DevOps is often sufficient without any configuration.

**Review apps.** GitLab deploys a temporary environment for each merge request. The environment URL is posted as a comment on the MR. This is excellent for previewing changes before merging. The review app is automatically destroyed when the MR is merged or closed. Setting this up for our staging environment eliminated the "works on my machine" class of bugs because reviewers could test changes in a real environment.

**Security scanning.** Built-in SAST, dependency scanning, container scanning, and secret detection. One configuration enables security scanning in your pipeline without external tools. The results appear in the merge request widget, so developers see security issues without leaving their workflow. This is significantly better than running security scans separately and emailing PDF reports.

## What Doesn't Work

**YAML complexity.** GitLab CI YAML becomes complex fast. The `extends:` keyword, `!reference` tags, and `rules:` conditionals can produce pipelines that are hard to understand. A 300-line GitLab CI YAML is common for moderate projects. I've seen 800-line `.gitlab-ci.yml` files that take 15 minutes to understand. The complexity grows because GitLab CI encourages putting everything in a single file instead of composing pipelines from smaller files.

**Job run times.** GitLab's shared runners are slower than GitHub Actions hosted runners. In my experience, GitLab shared runners are about 30-50% slower for the same workload. Self-hosting runners with appropriate hardware solves this but adds operational overhead. You need to manage runner registration, scaling, and updates.

**Pipeline visualization.** GitLab's pipeline graph is functional but visually noisy for complex pipelines with parallel stages and DAG dependencies. When a 50-job pipeline fails in the middle, finding the failed job requires scrolling through a dense graph. GitHub Actions' tabbed job view is easier to navigate.

**Cache invalidation.** GitLab CI's caching mechanism works but cache invalidation is confusing. The cache key supports variables but the behavior of `cache:key:files` isn't always intuitive. I've spent hours debugging "why is my cache not updating" issues.

## Real-World Patterns

For monorepos, use the `needs:` keyword to build DAG pipelines that only run affected packages. For multi-project pipelines, use the `trigger:` keyword to chain pipelines across projects. For deployment, use `environment:` with manual approvals for production gates.

One pattern I particularly like is using GitLab CI's `parallel` matrix for cross-browser or cross-version testing. Define the matrix once, and GitLab CI creates a job for each combination. This is cleaner than generating jobs dynamically.

## The Verdict

GitLab CI/CD is a strong, mature choice. It's best for organizations already using GitLab and teams that value integrated DevOps. The YAML complexity is the main cost — it grows faster than you expect and becomes a maintenance burden. If you're starting fresh with GitHub, GitHub Actions has better integration and simpler syntax. If you're on GitLab, the built-in CI is excellent — use it and invest in keeping the YAML organized.

My recommendation: if your pipeline is under 100 lines of YAML, GitLab CI is great. If it grows beyond 200 lines, invest in splitting it into includes and templates before it becomes unmanageable. The tool is solid; the complexity is self-inflicted.
