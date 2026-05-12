---
title: TypeScript 6.0 Breaking Changes and What They Mean
date: June 10, 2025
slug: typescript-6-breaking-changes-2025
---

TypeScript 6.0 shipped in March 2026, and it's a transitional release. The team is clearing the decks for TypeScript 7.0, which rewrites the compiler in Go for massive performance improvements. TypeScript 6.0 deprecates a lot of legacy baggage so 7.0 can ship clean.

Here's what actually changed and what you need to do.

## The Defaults That Changed

**`strict` is now true by default.** If you were already using strict mode, nothing changes. If you weren't, you'll need to either fix the new errors or explicitly set `"strict": false`. Most projects should fix the errors — they're real bugs your code has been hiding.

**`module` defaults to `esnext`.** ESM is the default module format. The `commonjs` output still works if you explicitly set it, but the TypeScript team is signaling that ESM is the future.

**`target` defaults to the latest ES version.** Currently `es2025`. The old default was `es3`. If you need to support old browsers, you'll need to set `target` explicitly now.

**`types` defaults to `[]`.** This is a performance win. Previously, TypeScript would automatically pull in `@types/*` packages from `node_modules`, which could include hundreds of declaration files you don't use. Now you need to explicitly list the types you need in `tsconfig.json`. Many projects see 20-50% build time improvements from this change alone.

## The Deprecations

TypeScript 6.0 deprecates a bunch of legacy options. They still work in 6.0 but will be removed in 7.0. You can temporarily suppress the warnings with `"ignoreDeprecations": "6.0"`.

- **`target: es5`** — If you're still targeting es5 in 2026, stop. Modern browsers support es2015+.
- **`--downlevelIteration`** — The only use case was es5 targeting, which is itself deprecated.
- **`--moduleResolution node`** (a.k.a. `node10`) — Use `node16`, `nodenext`, or `bundler` instead.
- **`--baseUrl`** — Use path mapping directly in `paths` instead.
- **`--esModuleInterop false`** — The default is now true and can't be changed.
- **`--outFile`** — Use a bundler.
- **AMD, System, UMD module targets** — Use ESM or CommonJS explicitly.
- **`module` keyword for namespaces** — Use `namespace` instead of `module` for namespace declarations.

## The Performance Story

The deprecations are boring but necessary. The interesting thing is why they're happening: TypeScript 7.0 is being written in Go (ported from the native Go implementation at `github.com/microsoft/typescript-go`). The Go port delivers 5-10x faster compilation for large codebases.

But a Go-based compiler can't carry decades of backward compatibility baggage. So 6.0 is the cleanup release. Upgrade now, fix the deprecations, and you'll be ready for the speed improvements in 7.0.

## Migration Checklist

1. Set `"ignoreDeprecations": "6.0"` if you need time to fix things
2. Replace `module` namespaces with `namespace`
3. Switch from `--moduleResolution node` to `bundler` or `node16`
4. Replace `--outFile` with a bundler
5. Drop `es5` target (use `es2015` minimum)
6. Move from `--baseUrl` to explicit `paths`
7. Audit your `types` field — list only what you need
8. Fix any new strict mode errors
9. Remove `--downlevelIteration`
10. Remove `--esModuleInterop false`

The migration is mechanical, not hard. A few hours of work for most projects, and you're ready for the 5x faster compiler coming in 7.0.
