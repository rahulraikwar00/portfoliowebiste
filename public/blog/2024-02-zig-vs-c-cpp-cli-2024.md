---
title: Why We Chose Zig Over C/C++ for Our CLI Tool
date: February 12, 2024
slug: zig-vs-c-cpp-cli-2024
---

We needed to build a cross-platform CLI tool for processing telemetry data. Performance mattered — we process millions of events per second. Memory safety mattered — a crash in production telemetry processing is not acceptable. Developer velocity mattered — we needed to iterate quickly. Our team had deep C++ experience, but we chose Zig anyway. Two years later, it was the right call for our use case.

## What Zig Does Differently

**No hidden control flow.** In C++, `operator new` can throw exceptions. Destructors run at surprising times during stack unwinding. RAII means allocation and deallocation happen implicitly, which is convenient until it's not — tracking when memory is freed requires understanding the entire lifetime of every object. In Zig, everything is explicit. Allocation takes an allocator parameter that you pass explicitly. There are no constructors or destructors. The control flow you see is the control flow that executes. This sounds tedious. In practice, it means bugs are obvious and resource lifetimes are always clear.

**Comptime.** Zig's compile-time function execution is genuinely novel and unlike anything in C or C++. You can run arbitrary code at compile time — generating lookup tables for protocol parsing, validating configuration at compile time, unrolling loops for performance-critical sections — without macros, templates, or code generation scripts. The syntax is the same as runtime Zig, so there's no separate compile-time language to learn.

**Cross-compilation.** Zig ships the full set of C/C++ headers for every target platform. Cross-compiling for Windows from Linux is `-target x86_64-windows` and it just works. No cross-compilation toolchain setup. No sysroot. No multiarch headaches. This alone saved us a week of CI configuration and eliminated the "it builds on my machine" problem for cross-platform builds.

**C interop.** Zig can import C headers directly using `@cImport` and `@cInclude`, so you call C libraries without writing binding code. For a CLI tool that needed to interface with system libraries (libcurl for HTTP, libpcap for packet capture), this meant we could gradually replace C code while keeping existing library integrations.

## Where Zig Struggles

**Ecosystem immaturity.** Zig's package manager is usable but sparse. The standard library covers basics (file I/O, networking, memory allocation) but doesn't have the breadth of Rust's ecosystem. If you need an HTTP client, JSON parser, or database driver, you might need to write it or wrap a C library. Our team invested about two weeks in building wrappers for the libraries we needed.

**Learning curve.** Zig is simpler than C++ but not simple. Ownership semantics, error union types, and comptime require mental effort. Experienced C++ developers pick it up in a week. Junior developers working on a C++ codebase might struggle longer with Zig's explicitness.

## The Verdict

Zig is the best choice for new systems-level CLI tools if you care about performance and can tolerate a smaller ecosystem. It replaces C for greenfield work and C++ for projects that value explicitness over convenience. Our CLI tool runs 30% faster than the C++ version it replaced, has fewer runtime bugs, and compiles in half the time. The ecosystem is the cost; the language is the benefit. For most projects, Rust is the safer choice — larger ecosystem, more libraries, more production validation. For projects that need maximum control and minimum hidden behavior, Zig is worth the ecosystem tradeoff.
