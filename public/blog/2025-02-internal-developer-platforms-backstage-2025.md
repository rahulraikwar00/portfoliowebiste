---
title: Internal Developer Platforms — Backstage and Beyond in 2025
date: February 25, 2025
slug: internal-developer-platforms-backstage-2025
---

Backstage became the default choice for Internal Developer Platforms (IDPs). A 2025 survey from DX showed Backstage with 89% market share among organizations using developer portals, with 67% overall market penetration. But adoption doesn't mean success.

## The Backstage Reality

Backstage is not a product — it's a framework. You build your IDP using Backstage's plugin architecture. This gives unlimited flexibility but carries significant cost. The numbers are sobering:

- **Team size:** 7-15 dedicated FTEs to get value from Backstage at a 300+ person engineering org
- **Timeline:** 12-18 months to initial value, 18-24 months to 30% adoption
- **Cost:** $1M+ per year in engineering time
- **Adoption:** The "10% problem" is real — average adoption stalls at 10% within most organizations

The community is honest about this. Spotify's VP of Engineering has acknowledged that Backstage adoption often stalls outside of Spotify itself. The backlash on HackerNews and in enterprise post-mortems is well-documented.

This doesn't mean Backstage is bad. It means Backstage is the right choice for organizations with 500+ engineers, strong React/TypeScript capabilities, and a 3-5 year investment horizon. For smaller teams, the math doesn't work.

## The Alternatives

**Port** (no-code IDP): 1-3 months to value, 0.5-1 FTE to maintain, $50K-$200K/year. Best for organizations under 500 engineers that need fast time-to-value. Adoption rates of 40-60% are typical because the interface is simpler and the maintenance burden is lower.

**Cortex** (standards-focused IDP): 2-4 months to value, 1-2 FTEs, $40K-$150K/year. Built around service scorecards and maturity enforcement. Best for regulated industries and organizations where compliance is the primary driver.

**Custom portal:** 3-6 months to value, 2-5 FTEs. Best for organizations with unique needs that no off-the-shelf solution meets.

## What Makes IDPs Fail

The primary failure mode for IDPs isn't technical — it's product. Platform teams that treat their developers as customers and measure adoption, satisfaction, and time-to-value succeed. Teams that treat the IDP as an infrastructure project and measure uptime and features shipped fail.

The 2026 CNCF survey found that 73% of successful platform teams have integrated AI assistants into at least one developer workflow. AI-powered natural language interfaces for the platform — "deploy my service" instead of navigating a portal — are the next frontier.

## Recommendations

If you're under 500 engineers, don't start with Backstage. Start with Golden Paths documented in your README and iterate toward a portal when the friction justifies it. If you're over 500 engineers, evaluate Backstage carefully against the SaaS alternatives. The 7-15 FTE cost is real, and the 10% adoption problem is real too.

Platform engineering is a product discipline. Build what your developers actually need, not what looks good on a slide deck.
