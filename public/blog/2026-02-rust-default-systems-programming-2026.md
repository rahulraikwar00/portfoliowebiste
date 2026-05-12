---
title: Why Rust is Now the Default for Systems Programming
date: February 3, 2026
slug: rust-default-systems-programming-2026
---

In February 2026, the Linux kernel officially declared the Rust experiment over. Linus Torvalds merged a patch titled "The experiment is done, i.e. Rust is here to stay." After years of debate on the LKML — some of it heated — Rust became the kernel's second official language alongside C.

This wasn't a surprise to anyone watching. But it's worth understanding how we got here and what it means.

## The Linux Kernel Adoption

Rust was first merged into the Linux kernel in 2022 for device drivers. The appeal was obvious: drivers are where most kernel bugs live, and most kernel vulnerabilities come from memory safety issues. Rust eliminates entire classes of bugs — use-after-free, buffer overflows, null pointer dereferences — at compile time.

The transition wasn't smooth. Greg Kroah-Hartman pushed hard for Rust adoption, arguing that it lets maintainers focus on "real bugs — logic issues, race conditions" instead of memory corruption. Other maintainers resisted, saying the kernel didn't need another language. Linus settled it decisively: "If you as a maintainer feel that you control who or what can use your code, you are wrong."

Linux 7.0, shipping now, includes significant Rust driver infrastructure enhancements including DMA API support, dev_printk for all device types, and generic I/O back-ends for Rust drivers. There's even a sample Rust SoC driver in the tree.

## Beyond the Kernel

Rust's dominance extends well beyond Linux. The 2025 USENIX ATC conference featured ASTERINAS, a Linux-compatible OS kernel written almost entirely in safe Rust, supporting over 210 Linux system calls with performance on par with C. The project demonstrated that Rust OS kernels have a TCB (trusted computing base) of just 14% of the codebase, versus 43-66% for other Rust OS projects.

In production, companies are using Rust for:
- **CLI tools:** `ripgrep`, `bat`, `fd`, `delta` — replacing classic Unix tools with faster, safer alternatives
- **Infrastructure:** Cloudflare uses Rust extensively in their edge network. Dropbox rewrote their core sync engine in Rust
- **Embedded systems:** Rust's zero-cost abstractions map well to resource-constrained environments
- **WebAssembly:** Rust is the primary language for WASM targets, used in Cloudflare Workers and Fermyon Spin

## Why It Won

The technical reasons are well understood: memory safety without garbage collection, zero-cost abstractions, fearless concurrency. But the real reason Rust won is simpler: it made writing correct systems code easier than the alternative.

C and C++ require expert-level discipline to avoid memory bugs. Even Linux's top C maintainers introduce vulnerabilities. Rust bakes safety into the compiler. You don't need to remember to check every buffer bound — the compiler does it for you.

The borrow checker has a learning curve, but the consensus in 2026 is that it's worth it. Companies report significantly fewer production incidents after migrating critical paths to Rust.

## What This Means

If you're starting a new systems-level project in 2026, Rust should be your default choice. C remains necessary for legacy code and extremely constrained environments. C++ still dominates game development and large existing codebases. But for new work — CLI tools, network services, kernels, embedded systems — Rust is the pragmatic default.

The Linux kernel's adoption was the final validation. When the most conservative software project in the world bets on you, you've arrived.
