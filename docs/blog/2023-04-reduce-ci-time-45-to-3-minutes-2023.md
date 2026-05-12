---
title: How We Reduced CI Time From 45 Minutes to 3 Minutes
date: April 15, 2023
slug: reduce-ci-time-45-to-3-minutes-2023
---

Our CI pipeline took 45 minutes. Developers pushed code and went for coffee. Some went for lunch. Merging a PR took half a day because each commit triggered the full pipeline. We got it down to 3 minutes. Here's exactly how we did it, in order of impact.

## Find the Bottleneck First

We assumed the tests were slow. They weren't. The bottleneck was dependency installation — downloading 500MB of node_modules on every build. The actual test execution was 4 minutes. npm install was 25 minutes. The remaining 16 minutes was Docker image building.

This is a common pattern: teams optimize the wrong thing because they guess instead of measuring. Use CI analytics (GitHub Actions has built-in timing breakdown, GitLab has job traces with duration) to identify where time is actually going. Optimize in order of total time spent, not perceived slowness.

Our pipeline breakdown was:
- Dependency installation: 25 min (55%)
- Docker build: 16 min (36%)
- Unit tests: 4 min (9%)
- Linting: negligible

We optimized in this order: dependencies first (highest impact), then Docker, then tests.

## What Worked

**Dependency caching.** This is the highest-impact change for most projects. Cache `node_modules` (or the package manager's cache directory) between builds. Use a cache key based on the lockfile hash — if `package-lock.json` or `yarn.lock` hasn't changed, restore from cache.

Implementation was simple: add a `actions/cache` step before `npm ci`. The cache key used a hash of `package-lock.json`. Cache hit rate was about 80% — most builds don't change dependencies. Average dependency step time dropped from 25 minutes to 2 minutes.

One gotcha: npm's cache can grow large. Set a `npm cache clean --force` as a cron job or size-limit the cache. We also switched to `npm ci` instead of `npm install` — it's faster and produces deterministic builds.

**Selective test execution.** Run only the tests that are affected by the changes. Jest's `--onlyChanged` and `jest-changed-files` identify which tests to run based on git diffs. For monorepos, Nx and Turborepo do this at build level — only build and test packages that changed.

Implementation: we used `jest --onlyChanged` in CI and a full `jest` run nightly. The selective run covered about 30% of tests on average, cutting test time from 4 minutes to 1.5 minutes. The nightly full run caught regressions in unchanged code.

**Parallelization.** Split tests across multiple CI runners. Jest supports `--shard` natively. GitHub Actions matrix strategy runs shards in parallel. Four shards instead of one cuts test time from 4 minutes to 1 minute.

Implementation: three CI runners, each running a third of the tests. The slowest shard took about 1.5 minutes. We used `jest --shard=1/3`, `jest --shard=2/3`, `jest --shard=3/3`. The matrix strategy in GitHub Actions made this configuration trivial.

**Docker layer caching.** Order your Dockerfile so infrequently-changed layers come first. `apt-get install`, `npm ci`, then application code. Use Docker BuildKit's cache mounts for additional speed.

Implementation: restructured Dockerfile to copy `package.json` and run `npm ci` before copying application code. This way, the `npm ci` layer only invalidates when dependencies change. Used `docker build --cache-from` with a cached image. Docker build time dropped from 16 minutes to 3 minutes.

## The Result

- Before: 45 minutes
- After dependency caching: 7 minutes
- After selective tests + parallelization: 3 minutes
- After Docker caching: 3 minutes (Docker runs in parallel with tests)

The total change was about two days of work. The developer productivity gain was enormous. A 3-minute CI means developers stay in flow — they don't context-switch away while waiting, they don't start a second task that distracts from the first one. Code review happens faster because PRs are tested quickly. Deploys happen more frequently because the feedback loop is short.

If your CI is slow, start with the first step: measure. Then cache dependencies. Then parallelize. The order matters — optimizing test execution before caching dependencies would have saved 2 minutes instead of 20 minutes. Measure first, optimize the biggest bottleneck.
