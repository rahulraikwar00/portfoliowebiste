---
title: From Jenkins to GitHub Actions — Our Migration Story
date: September 12, 2021
slug: jenkins-to-github-actions-2021
---

We ran Jenkins for six years. We migrated to GitHub Actions in a weekend. The only regret was not doing it sooner. If you're still running Jenkins in 2026, here's what the migration looks like, what you gain, and what you lose.

## The Jenkins Tax

Jenkins is powerful but expensive. The cost isn't the software — it's free. The cost is the maintenance. Someone needs to manage the master node, install plugins, handle plugin compatibility issues, fix the Groovy DSL scripts when they break, and maintain the CI infrastructure. Jenkins plugins have a bad habit of breaking with version upgrades. A security update to the Jenkins core can break 10 plugins. Each broken plugin is a support ticket.

At our peak, we had a Jenkins master with 40 plugins, 8 build agents (EC2 instances), and a part-time DevOps engineer whose primary responsibility was Jenkins maintenance. The monthly cost was about $2,000 in EC2 instances and 40 hours of engineering time. For a CI system. That's Jenkins running on AWS infrastructure that needs patching, monitoring, and capacity planning.

GitHub Actions eliminated the infrastructure. There's no CI server to maintain. Actions runners can be self-hosted if needed, but the default hosted runners cover most use cases. The YAML syntax is simpler than Jenkins' Groovy DSL or Pipelines. Integration with GitHub is seamless — PR checks, status updates, branch protections all work together.

## The Migration

We exported Jenkins jobs as shell scripts and wrapped them in GitHub Actions YAML. The migration took one weekend for 30 jobs. Most were straightforward: `npm run build`, `npm test`, `docker build`. Complex pipelines with post-build actions required more work, but GitHub Actions' `needs` and `matrix` strategies covered our requirements.

The hardest part was migrating credential management. Jenkins had a centralized credentials store with 50+ entries. GitHub Actions uses secrets per repository and OIDC for cloud provider access. We had to audit every credential, determine which repositories needed it, and migrate them individually. This took longer than the pipeline migration itself, but the result was significantly more secure. Each repository had only the permissions it needed, not the union of permissions needed by all projects.

The matrix strategy was a revelation. Our Jenkins configuration for testing against multiple Node.js versions was a complex Groovy script. In GitHub Actions:

```yaml
test:
  strategy:
    matrix:
      node-version: [18, 20, 22]
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
```

Four lines instead of 50. This is the pattern throughout: GitHub Actions reduces boilerplate by 60-80% compared to Jenkins.

## What We Lost

**Flexible triggers.** Jenkins can trigger builds from almost anything — cron schedules, file system changes, email, other jobs, REST API calls. GitHub Actions integrates tightly with GitHub events (push, PR, issue, release, schedule). If you need non-GitHub triggers (Slack command, custom webhook), you're adding complexity through repository_dispatch events.

**Custom plugins.** Jenkins' plugins ecosystem is vast with thousands of plugins covering every tool and integration. Actions has a growing marketplace but hasn't matched Jenkins' breadth. For uncommon integrations, you might need to write a custom action or fall back to shell commands.

**Control.** You don't control the Actions infrastructure. When GitHub has an outage, your CI is down. This has happened a few times over the years, typically for 30-60 minutes. Self-hosted runners mitigate this but add operational overhead. For organizations with strict SLA requirements, the hosted model is a concern.

**Pipeline debugging.** Jenkins' Blue Ocean UI provides visual pipeline debugging with replay capabilities. GitHub Actions logs are text-based. For complex pipelines, Jenkins' debugging tools are still better.

## The Verdict

For most teams, GitHub Actions is better than Jenkins. Less maintenance, simpler syntax, tighter GitHub integration. The migration is easier than you expect — most Jenkins jobs translate to Actions workflows in a few hours. The credential cleanup is the most time-consuming part, but it's also the most valuable security improvement.

If you have complex multi-platform build pipelines (building for Windows, Linux, and macOS with different toolchains), extensive plugin needs, or strict SLA requirements for CI uptime, Jenkins still has advantages. But the maintenance cost of self-hosted CI is substantial — measure it honestly before deciding. We estimated our Jenkins TCO at $25,000/year for a team of 20. GitHub Actions costs about $2,000/year for the same workload. The math is clear for most teams.
