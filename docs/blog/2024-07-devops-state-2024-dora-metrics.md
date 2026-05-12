---
title: The State of DevOps 2024 — DORA Metrics and Real Trends
date: July 10, 2024
slug: devops-state-2024-dora-metrics
---

The DORA research program published its 2025 report with a focus that signals where the industry is: AI-assisted software development. After years of studying delivery performance (deployment frequency, lead time, MTTR, change failure rate), DORA shifted attention to how AI changes the equation. The findings are worth understanding because they confirm what many teams are experiencing.

## AI Is Now Standard

90% of surveyed developers use AI at work. More than 80% report increased productivity. AI adoption has become nearly universal in less than two years. But the interesting finding is that 30% of respondents have low trust in AI-generated code, which suggests a mature approach — developers are using AI but not blindly accepting its output.

The key takeaway from the report: AI does not fix systemic problems — it amplifies them. Organizations with strong architecture, clear processes, and a healthy work culture gain the greatest benefits from AI. Where chaos, technical debt, or poor collaboration prevail, AI leads to local improvements that get lost in later delivery stages. Bad code written faster is still bad code, and if your CI/CD pipeline doesn't catch it, AI-generated bugs reach production sooner.

DORA identified a new AI Capabilities Model with seven key capabilities that determine AI success: a clear AI policy communicated across the organization, working in small batches to limit blast radius, healthy data ecosystems with test data and monitoring, user focus driving priorities, internal data accessible to AI for context-aware suggestions, high-quality internal platforms that reduce cognitive load, and strong version control practices with meaningful review.

None of these are about the AI tool itself. They're all about organizational discipline.

## The Throughput vs. Stability Tradeoff

2025 was the first year DORA found that AI genuinely increases throughput — the speed of delivering changes. But delivery instability also increased: more rollbacks, more hotfixes, more unplanned work. Teams have learned to write code faster with AI, but quality control systems haven't kept pace.

The implication is clear: invest in automated testing, CI/CD quality gates, and deployment safety before assuming AI will make you faster. The AI accelerates the pipeline. If the pipeline has weak quality checks, it accelerates bad code into production. The teams that succeed with AI are the ones that already had strong engineering practices.

## Platform Engineering Is the Foundation

90% of organizations have adopted platform engineering. The report found a direct correlation between a high-quality internal platform and an organization's ability to unlock AI value. Organizations that treat their platform as an internal product designed to improve developer experience see significantly greater returns from AI investments.

If you're investing in AI tooling in 2026, invest at least as much in the systems that ensure AI-generated code is safe, tested, and deployable. The tools are the easy part. The discipline — code review, testing, monitoring, gradual rollout, rollback capability — is the hard part that determines whether AI makes you faster or just generates more problems faster.
