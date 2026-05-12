---
title: From GraphQL to tRPC — Why We Migrated
date: August 20, 2023
slug: graphql-to-trpc-migration-2023
---

GraphQL was the default choice for API development for years. It solved real problems — over-fetching, under-fetching, client-driven queries. But in practice, many teams discovered that GraphQL's complexity wasn't justified by the benefits. tRPC emerged as a simpler alternative, and by 2026, it's become the default for full-stack TypeScript projects. We migrated our main API from GraphQL to tRPC, and the experience changed how I think about API design.

## What tRPC Does Differently

tRPC gives you end-to-end type safety without a schema definition language. You write TypeScript functions on the server, and the client imports the types directly. No code generation. No GraphQL schema. No resolvers. No Apollo Client. The types flow from server to client at compile time.

```typescript
// Server
const appRouter = t.router({
  getUser: t.procedure
    .input(z.string())
    .query(({ input }) => db.user.find(input)),
})

// Client — fully typed, no codegen
const user = await trpc.getUser.query("123")
// user is typed as User
```

This eliminates an entire category of boilerplate. No more writing GraphQL types, matching resolvers to schema, generating TypeScript types, or maintaining separate client and server type definitions.

The key insight: if your frontend and backend are both TypeScript in the same repo, there's no reason to use a schema DSL. TypeScript's type system is powerful enough to define your API contract. tRPC leverages that so your types are derived from implementation, not maintained separately.

## Why We Moved

**Boilerplate reduction.** Our GraphQL implementation had: schema definition files, resolver implementations, TypeScript type generation script, generated type files (committed to git), client query definitions with fragments, and a type-safe client wrapper. tRPC eliminated everything except the server procedures and the client import. The API layer codebase shrunk by roughly 40%.

**No codegen step.** GraphQL code generation was a constant source of friction. Running the codegen script was a manual step that everyone forgot. CI sometimes caught type mismatches between the schema and the generated types, but by then the schema was already deployed. Outdated schemas, mismatched versions, CI failures when generated types diverged from actual resolver implementations — it was a constant tax on development velocity.

**Simpler deployment.** GraphQL servers needed caching strategies (response caching, query planning), query complexity analysis (depth limiting, cost analysis), and abuse prevention (rate limiting by query). tRPC maps to standard HTTP procedures. Caching is straightforward HTTP caching. Abuse prevention is handled at the framework level (Express/Fastify middleware). The operational complexity dropped significantly.

## When GraphQL Still Wins

tRPC is TypeScript-only. If your backend is in Go, Python, or Rust, tRPC doesn't help. GraphQL's language-agnostic schema makes sense for polyglot architectures. GraphQL also wins for public APIs — external developers benefit from self-documenting schemas, introspection queries, and GraphQL IDE tools. tRPC's type safety is internal-only.

Our migration was pragmatic: new endpoints as tRPC procedures alongside existing GraphQL resolvers. After about three months, we had migrated all active use cases to tRPC and deprecated the GraphQL schema. Not revolutionary — just fewer layers between the code and the database. The result was faster development velocity and fewer type-related bugs.
