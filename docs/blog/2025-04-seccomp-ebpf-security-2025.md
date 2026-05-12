---
title: Seccomp and eBPF for Cloud-Native Security
date: April 5, 2025
slug: seccomp-ebpf-security-2025
---

Seccomp and eBPF are both Linux kernel security technologies, but they work at different levels. Seccomp filters system calls — it creates a static allowlist of syscalls a process can make. eBPF runs sandboxed programs in the kernel to observe and control system behavior dynamically. Together, they form the foundation of cloud-native security in 2026. Understanding both helps you build more secure container deployments.

## The Linux Kernel Security Model

The Linux kernel exposes hundreds of system calls to user-space processes. Each syscall is a potential attack vector. A container breakout typically involves exploiting an application vulnerability to execute a syscall that grants kernel access — like `mount`, `pivot_root`, or `bpf`. Seccomp and eBPF address this from different angles.

**Seccomp** acts as a static filter. You define a profile that lists allowed syscalls at container startup. Any syscall not in the profile is blocked — either the process is killed or the syscall returns an error. This is enforced at the kernel level, before the syscall is executed. Seccomp is simple, predictable, and effective.

**eBPF** acts as a dynamic observer. You load custom programs into the kernel that execute on events — syscalls, network packets, function entries. These programs can observe behavior, collect data, filter events, or modify behavior. eBPF is more flexible than seccomp but requires more configuration.

## Seccomp

In Kubernetes, the default seccomp profile (`RuntimeDefault`) blocks around 40 dangerous syscalls including `clone`, `mount`, `pivot_root`, and `bpf`. This prevents container breakout attacks that rely on these syscalls. The profile is reasonable — it blocks known-dangerous syscalls while allowing normal application operations.

Since Kubernetes 1.24, seccomp profiles are GA and can be configured per pod or per container level. The `securityContext.seccompProfile` field accepts `RuntimeDefault`, `Localhost` (for custom profiles), or `Unconfined` (not recommended).

The `RuntimeDefault` profile should be the minimum for all workloads. It blocks the most dangerous syscalls without breaking common applications. For higher security, create custom profiles that only allow the syscalls your application actually needs. Use tools like `inspektor-gadget` or `falco` to observe which syscalls your application makes in production, then create a custom profile that allows only those.

## eBPF

eBPF goes further than seccomp. It lets you load custom programs into the kernel that fire on events — system calls, network packets, function entries. These programs can observe, filter, or modify behavior in real time. eBPF programs are verified by the kernel before loading, ensuring they terminate and don't crash the kernel.

Tools like Falco use eBPF to detect runtime threats. When a process opens a sensitive file, creates a network connection to a known malicious IP, or executes a shell in a container, Falco generates an alert. Cilium uses eBPF for network security — it enforces network policies at the kernel level without iptables overhead, providing better performance and scalability.

## How They Work Together

Seccomp and eBPF are complementary. Seccomp sets static boundaries on what syscalls are available. eBPF provides dynamic visibility and control within those boundaries. Think of seccomp as the guardrails — it defines the allowed paths. eBPF as the traffic camera — it watches what happens on those paths and alerts or blocks suspicious behavior.

A secure container stack uses both. Enable `seccompProfile: RuntimeDefault` on all workloads today. Then add Falco for runtime threat detection and Cilium for network policy enforcement. Kubernetes v1.36 makes seccomp GA and enabled by default. If you're on an older version, enable it manually. The security benefit far outweighs the configuration effort — it's a one-line YAML change that blocks an entire class of kernel attacks.
