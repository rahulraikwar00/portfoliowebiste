---
title: Docker Multistage Builds — A Practical Guide
date: November 10, 2020
slug: docker-multistage-builds-2020
---

Multistage builds are the most important Docker feature for producing small, secure production images. They let you use one Docker image for building your application and a different image for running it. The result: production images that contain only what's needed to run, not what's needed to build. If you're not using multistage builds in 2026, you're shipping images that are 5-10x larger than necessary.

## The Problem

A typical Node.js Docker image without multistage builds:

```dockerfile
FROM node:22
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

This produces an image that includes the full Node.js SDK, npm, source code, node_modules with dev dependencies, and build artifacts. Our production image was 1.2GB. Most of it was unnecessary for running the application. The base Node.js image alone is ~350MB. Add node_modules (200MB+), source code (50MB), and npm cache (~100MB). You're shipping gigabytes of data that serves no purpose at runtime.

The problems with large images go beyond disk usage. They take longer to push to registries, longer to pull on deployment, and have a larger vulnerability surface. Every package in node_modules is a potential CVE. Every tool in the base image is an attack vector. A 1.2GB image with 500+ packages has significantly more vulnerabilities than a 150MB image with 50 packages.

## The Solution

```dockerfile
# Build stage
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]
```

The production image is 150MB. No npm, no source code, no dev dependencies, no build tools. The `COPY --from=build` command copies only the artifacts you need from the build stage into the final stage. The build stage's layers are discarded — they exist only during the build process.

## Patterns That Work

**One build, one runtime stage.** The most common pattern. One stage compiles, the other runs. Works for compiled languages (Go, Rust) and transpiled ones (TypeScript, Sass). For Go, the build stage needs the Go SDK (~900MB) but the runtime stage can use `FROM scratch` or `FROM alpine` with just the compiled binary (~15MB). This gives you a 15MB production image for a Go service.

**Multiple build stages.** For monorepos with multiple services, use a shared base stage for dependencies and per-service build stages. Each service's runtime stage copies only its specific build output. This keeps each service image small while sharing the build infrastructure.

```dockerfile
# Shared dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Service A build
FROM deps AS build-a
COPY packages/a ./packages/a
RUN npm run build -w @project/a

# Service A runtime
FROM node:22-alpine
COPY --from=build-a /app/packages/a/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
```

**Distroless base images.** `gcr.io/distroless/nodejs22-debian12` contains only the runtime and its dependencies. No shell, no package manager, no utilities. The image is ~50MB. The tradeoff: debugging requires `kubectl exec` with a debug container or ephemeral container. For security-sensitive deployments, distroless images reduce the attack surface to almost nothing.

**Alpine vs Distroless vs Debian.** Alpine images are small (5MB base) but use musl libc instead of glibc. Most Node.js packages work fine, but native modules with C bindings occasionally have compatibility issues. Debian images are larger (50MB base) but more compatible — if you hit a weird native module error, switching to Debian often fixes it. Distroless images are smallest but hardest to debug.

## The Impact

Smaller images mean faster deployments, less storage, fewer vulnerabilities, and faster cold starts. A 200MB image vs a 1.2GB image deploys in seconds instead of minutes. The vulnerability surface is drastically smaller — the production image contains only the runtime and the application code, not build tools and dev dependencies.

In practice, multistage builds reduced our deployment times by about 60% (from 3 minutes to 1 minute to pull and start the image). Our registry storage costs dropped by 80%. And our security scan results went from hundreds of findings to dozens, because we eliminated all the build-time packages.

Make multistage builds your default pattern. The effort is minimal — a few extra lines in your Dockerfile — and the benefits compound across every deployment.
