---
title: Migrating From JavaScript to TypeScript — Lessons Learned
date: January 25, 2022
slug: migrate-js-to-typescript-lessons-2022
---

We migrated a 50,000-line JavaScript codebase to TypeScript. The migration took four months. It was painful but worth it. Every team I've talked to that completed the migration says the same thing: they wish they'd done it sooner. Here's what we learned about doing it right.

## The Right Approach

**Don't rewrite.** The instinct to rewrite everything in TypeScript with perfect types is strong. Resist it. I worked on a team that tried this approach — we spent six months rewriting a working application and shipped nothing. The old codebase continued to accumulate features while the rewrite fell further behind. The only safe migration is incremental — file by file, module by module, with the code running in production between each step.

The incremental approach means `any` is your friend. TypeScript exists on a spectrum. A file with `// @ts-check` and JSDoc annotations is more typed than a `.js` file. A `.ts` file with `any` everywhere is more typed than that. A fully typed file is the end goal, but every intermediate step provides value.

**Start with `allowJs: true` and `checkJs: false`.** Rename `.js` files to `.ts` without fixing type errors. TypeScript compiles JavaScript with some type checking disabled. The code runs. No one is blocked. This is the zero-effort starting point — it takes 10 seconds per file and immediately enables TypeScript syntax features.

**Enable `strict: false` initially.** Strict mode is the goal but not the starting point. Start with basic type checking and incrementally enable strict options as files are properly typed. The strict options (`strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`) each catch real bugs. Enable them one at a time as your codebase becomes ready.

**Use `any` liberally at first.** Add types for new code and touched files. Leave existing code as `any` until you have time to fix it. A `: any` annotation is better than a migration that never finishes. The goal is to get the entire codebase compiling as TypeScript. Once it's all compiling, you can go back and tighten types in high-value areas.

## The Pain Points

**Third-party types.** Some packages have excellent types (`lodash`, `express`, `react`). Some have none. You'll spend days on `@types/*` packages and DefinitelyTyped PRs. The situation has improved dramatically since 2022 — most popular packages ship their own types — but edge cases still require effort.

**Dynamic patterns.** JavaScript patterns like `_.get(obj, 'nested.field')` and computed property access don't translate to typed TypeScript without effort. We replaced many of these with typed alternatives during the migration. The `_.get` pattern became optional chaining with type-safe fallbacks. Computed property access required explicit type narrowing.

**Build tooling.** Webpack + Babel + TypeScript required configuration. The `ts-loader` vs `@babel/preset-typescript` decision matters. We settled on Babel for transpilation (faster) and `tsc` for type checking in CI (thorough). This gives fast iteration during development with comprehensive checking before deployment.

## The Results

**Compile-time error catching.** In the first month after migration, TypeScript caught 47 bugs that would have been runtime errors. Undefined property access, incorrect function arguments, mismatched types. Each one would have been a production incident or a bug report. The type system paid for itself in reduced debugging time alone.

**Better IDE support.** Autocomplete, refactoring, and navigation work with TypeScript in a way they don't with JavaScript. Renaming a property across 50 files takes seconds instead of an hour. Refactoring a function signature updates all callers automatically. The productivity improvement compounds over time.

**Faster onboarding.** New developers can understand the codebase faster because types serve as documentation. A function signature `function processUser(input: UserInput): ProcessedUser` communicates more than a JSDoc comment ever could. New team members reported feeling productive 2-3 weeks faster after the TypeScript migration.

**Code quality.** The codebase was more maintainable after one year than the JavaScript version was after three months, surprisingly. The type system prevented the gradual decay that JavaScript codebases experience — the "I'll just add another property to this object" pattern that produces undocumented, untracked state.

**The cost** was four months of migration effort and a permanent increase in build time. The migration cost about 20% of our engineering capacity during those four months. Build time increased by about 30 seconds for the type-checking pass. The benefits have continued to compound for years.

Migrate incrementally. Don't rewrite. Accept temporary `any`. The long-term benefits are worth the short-term pain. In 2026, starting a new TypeScript project is the default. If you're still on JavaScript, the migration path is well-understood. There's no reason to delay.
