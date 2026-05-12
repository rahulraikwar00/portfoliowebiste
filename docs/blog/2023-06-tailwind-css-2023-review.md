---
title: Tailwind CSS in 2023 — A Practical Review
date: June 15, 2023
slug: tailwind-css-2023-review
---

Tailwind CSS went from controversial to dominant. The utility-first approach that developers initially mocked became the most popular CSS framework by 2023. By 2026, it's hard to find a new project that doesn't use it. The developer community has broadly accepted that Tailwind's tradeoffs are worth it.

## What Works

**Speed of development.** Tailwind with the JIT compiler was a step change in CSS productivity. No more context-switching between HTML and CSS files. No more naming things. No more `!important` battles. You write `flex items-center justify-between p-4` and the styles are applied immediately. The JIT compiler generates only the CSS you use, so the production bundle is tiny — often under 10KB gzipped for an entire application.

The productivity gain is real. In a 2024 survey, developers reported being 30-50% faster with Tailwind compared to writing custom CSS. The elimination of context-switching is the main factor. When styling in Tailwind, you stay in the same file, looking at the same component. There's no external stylesheet to reference.

**Design consistency.** Tailwind's design system (spacing scale, color palette, typography) provides consistency out of the box. Without Tailwind, teams tend to drift — different colors, different spacing, different type scales across components. Tailwind enforces consistency by limiting choices to the configured design tokens.

The spacing scale (`p-1`, `p-2`, `p-4`, `p-8` corresponds to 4px, 8px, 16px, 32px) eliminates the "I'll just use 13px here" pattern that produces inconsistent layouts. The color palette with defined shades (50-900) ensures hover states, active states, and backgrounds use related colors from the same family.

**The ecosystem.** Headless UI, Radix UI, shadcn/ui, and the component libraries built on Tailwind are excellent. You get accessible, unstyled components that you style with Tailwind classes. Shadcn/ui in particular has become the de facto standard for React component libraries — it's not a library you install, it's a collection of copy-paste components that you own and customize. The Tailwind + shadcn/ui combination is the most productive way to build UIs I've experienced.

## What Doesn't Work

**Readability.** `className="flex items-center justify-between gap-4 px-6 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"` is undeniably ugly. You get used to it, but it's a real cost. The class extract pattern (creating a component for anything reused) mitigates this but requires discipline. In practice, experienced Tailwind developers create components for anything used more than once, which naturally keeps JSX readable.

**Design handoff.** Tailwind works great for developers. Designers need to understand the utility classes or rely on the developer to translate designs to Tailwind. Tools like Figma to Tailwind improve this but aren't seamless. The design-to-development pipeline remains the weakest part of the Tailwind workflow.

**Breaking changes.** Tailwind v4, released in 2025, introduced significant changes: the new `@theme` directive, CSS-first configuration (replacing `tailwind.config.js`), and new utility names. Migration required work. The core team communicated well, but upgrading a mature Tailwind project was non-trivial. The v4 changes were well-motivated (CSS-native configuration is cleaner), but the migration cost was higher than most point releases.

## Should You Use It?

Yes, for most projects. Tailwind is the best way to write CSS in 2026 for new projects. It's more productive than hand-written CSS, more performant than runtime CSS-in-JS, and more maintainable than Bootstrap's opinionated components.

The one exception: design-heavy marketing sites where unique visual identity matters more than development speed. For those, hand-written CSS or vanilla extract might serve you better. For everything else — dashboards, SaaS apps, internal tools — Tailwind is the default choice for good reason. The productivity gains, consistency benefits, and ecosystem support make it the pragmatic default for web development in 2026.
