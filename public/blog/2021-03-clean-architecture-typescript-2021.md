---
title: Clean Architecture in TypeScript
date: March 8, 2021
slug: clean-architecture-typescript-2021
---

Clean Architecture separates software into layers with a dependency rule: inner layers don't know about outer layers. The domain layer has no dependency on frameworks, databases, or external APIs. Use cases orchestrate domain logic. Interface adapters translate between use cases and external systems. I've applied this pattern in several TypeScript projects over the years, and my take has evolved significantly from the strict interpretation I started with.

## The Structure

```
src/
├── domain/          # Entities, value objects, domain events
├── application/     # Use cases, ports (interfaces)
├── infrastructure/  # Database, HTTP, message queue implementations
└── presentation/    # Controllers, request/response handling
```

The dependency rule: `presentation` -> `application` -> `domain`. Nothing depends on `infrastructure`. The `application` layer defines interfaces (ports), and `infrastructure` implements them.

This structure enforces a specific kind of discipline. When you're tempted to import a database driver in a use case, the folder structure stops you. When a controller directly instantiates a repository, it violates the direction of dependencies. The architecture makes violations visible, which is its primary value.

## What Works

**Testability.** Business logic is pure TypeScript with no framework dependencies. You test it without mocking databases or HTTP. The infrastructure layer implementations are tested separately with integration tests. This separation means your unit tests run in milliseconds and don't require database connections. Your integration tests are explicit about what infrastructure they need.

I've found that the testability benefit is real but comes with a cost. Testing the application layer requires creating mock implementations of every port interface. For a service with three dependencies (repository, message queue, email service), you need three mock objects per test. This boilerplate adds up. Using a factory function pattern helps:

```typescript
function createUserService(mocks?: Partial<UserServiceDependencies>) {
  const deps = {
    userRepo: new MockUserRepo(),
    emailService: new MockEmailService(),
    auditLog: new MockAuditLog(),
    ...mocks,
  }
  return new UserService(deps)
}
```

**Framework independence.** The domain and application layers don't import Express, Prisma, or any framework. You can swap Express for Fastify without touching business logic. You can swap Prisma for Drizzle without touching use cases. We did this migration — Prisma to Drizzle — and changed exactly two files: the repository implementation and the dependency injection configuration. The use cases didn't change at all.

**Boundary clarity.** The architecture forces you to make explicit decisions about where things belong. Is this a business rule (domain)? A workflow (application)? A technical detail (infrastructure)? This clarity is invaluable for onboarding new team members. They can look at the folder structure and understand the system's architecture without reading documentation.

## What Doesn't

**Boilerplate.** Clean Architecture generates more files than simpler patterns. Each use case typically gets its own file with input/output types, a handler function, and tests. For a project with 50 use cases, that's 150+ files for the application layer alone. For small projects, this overhead outweighs the benefits. If your application is a CRUD API with simple business logic, a controller that directly calls a repository is cleaner than the layered abstraction.

**TypeScript generics complexity.** Clean Architecture patterns often involve generic repository interfaces, mapper types, and use case contracts. The type signatures become complex. `Repository<T, ID>` with `findById`, `findAll`, `save`, `delete` methods, where `T` extends `Entity<ID>`. Teams spend time on type gymnastics that don't deliver business value. Keep interfaces simple. A repository interface with five methods is better than a generic interface that requires advanced TypeScript knowledge to use.

**Premature abstraction.** If you only have one implementation of a repository, the interface adds complexity without benefit. Extract interfaces when you actually have multiple implementations (in-memory for tests, PostgreSQL for production), not when you anticipate them. YAGNI applies to clean architecture too.

## The Balance

Clean Architecture works well for medium-to-large applications with complex business logic and multiple delivery mechanisms (API, CLI, background jobs). For simple CRUD applications, it's overkill.

My evolved approach: apply the dependency rule (domain doesn't depend on infrastructure) but skip the full five-layer structure for simple projects. Use a three-layer structure instead:

```
src/
├── domain/       # Business logic, no framework imports
├── api/          # Routes, controllers, request handling
└── data/         # Database access, external APIs
```

The `api` and `data` layers can import from `domain`, but `domain` imports nothing. This gives you 80% of the benefit with 20% of the boilerplate. You can always add more layers later when the need justifies it.

The principles (dependency inversion, separation of concerns) are valuable. The strict structure is optional. Apply the dependency rule. Keep domain logic decoupled from frameworks. But don't create interfaces for every dependency unless you have multiple implementations.
