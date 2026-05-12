---
title: Kubernetes Security Context for Developers
date: February 10, 2020
slug: k8s-security-context-2020
---

A Kubernetes security context defines the privileges and access controls for a pod or container. It's how you say "this container should run as non-root, with a read-only filesystem, and can't escalate privileges." Every production deployment should define one. Most don't. I've audited dozens of production Kubernetes deployments, and the majority run containers as root with full capabilities. This is the security equivalent of leaving your front door open.

## The Basics

Security contexts are configured in the Pod or Container spec. Container-level settings override pod-level settings.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    seccompProfile:
      type: RuntimeDefault
  containers:
  - name: app
    image: myapp:latest
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop: ["ALL"]
      readOnlyRootFilesystem: true
      runAsUser: 1000
      runAsGroup: 3000
```

This configuration represents the "restricted" security posture recommended by Kubernetes Pod Security Standards. Every line serves a purpose.

## What Each Setting Does

**`runAsNonRoot: true`** — This is the single most important security setting for containers. It prevents the container from running as root. If the container image tries to start as root, the pod won't start. This creates a hard safety boundary — you can't accidentally deploy a container that runs as root.

Why does this matter? Most base images (Node, Python, Ubuntu) run as root by default. A root container with full capabilities has the same privileges on the host kernel as root on the host. If an attacker exploits a vulnerability in your application, they get root access. If they can escape the container, they have root on the host. Running as non-root dramatically reduces the blast radius.

The challenge: many Docker images aren't designed to run as non-root. They expect to write to the filesystem, bind to privileged ports (<1024), or access files owned by root. You may need to rebuild images with a non-root user configured. Node.js images, for example, should use the `node` user that comes with the official image. Most application frameworks work fine as non-root once you configure file permissions correctly.

**`allowPrivilegeEscalation: false`** — Prevents the container from gaining more privileges than its parent process. This is always false for non-root containers, but setting it explicitly documents your intent. Even if a vulnerability allows code execution, the attacker can't escalate to root.

**`capabilities: drop: ["ALL"]`** — Linux capabilities provide fine-grained privileges. CAP_NET_RAW allows raw sockets. CAP_SYS_ADMIN allows mounting filesystems. CAP_DAC_OVERRIDE bypasses file permissions. Most applications need exactly zero capabilities. Dropping all of them removes entire classes of kernel attacks.

**`readOnlyRootFilesystem: true`** — The container filesystem is read-only. The application writes to a temporary directory, a Kubernetes emptyDir volume, or a PersistentVolumeClaim. This prevents attackers from modifying binaries, writing malicious scripts, or planting persistent malware. It also prevents accidental log flooding that fills the disk.

For Node.js applications, you need to ensure that temporary file operations (npm cache, temp directories) go to a writable volume. Set the `TMPDIR` environment variable to a writable path. Configure logging to write to stdout/stderr (which Kubernetes captures) instead of files.

**`seccompProfile: type: RuntimeDefault`** — Enables the container runtime's default seccomp profile. This restricts the system calls available to the container. The default profile blocks around 40 dangerous syscalls including `mount`, `pivot_root`, `bpf`, and `kexec`. Seccomp is your last line of defense against kernel exploits that rely on specific system calls.

## Why This Matters

Most container images run as root by default. A root container with unlimited capabilities has full access to the host kernel. If an attacker exploits a vulnerability in the application, they get root on the container, and potentially root on the host.

The Capital One breach in 2019 started with a SSRF vulnerability in a web application. If that application had been running with the security context above, the attacker would have reached a dead end — read-only filesystem, no capabilities, non-root user. Instead, they exploited the metadata service and exfiltrated data from S3.

Security contexts don't prevent all attacks. But they reduce the blast radius dramatically. A non-root container with dropped capabilities and read-only filesystem is much harder to exploit than a root container with full access.

## Pod Security Standards

Kubernetes defines three Pod Security Standard levels:

- **Privileged.** Unrestricted. Use only for system-level components like CNI plugins and CSI drivers.
- **Baseline.** Minimum restrictions. Prevents known privilege escalations. Allows root, allows writable filesystem, drops dangerous capabilities.
- **Restricted.** Maximum security. Enforces runAsNonRoot, read-only root filesystem, all capabilities dropped, seccomp default.

Use `Restricted` for all application workloads. Use `Baseline` for workloads that need limited access (like monitoring agents). Avoid `Privileged` unless absolutely necessary.

Apply these as admission controllers using Pod Security Admission (built into Kubernetes since 1.23) or OPA Gatekeeper for more fine-grained control. PSA can enforce the restricted profile across namespaces, making violations blocking errors instead of audit logs.

## Practical Migration

Audit your current pods: `kubectl get pods -o json | jq '.items[].spec.securityContext'` will show you what's configured. Most teams find nothing configured.

Start with the settings that don't break things: `seccompProfile: RuntimeDefault` rarely causes issues. Then drop capabilities. Then set `runAsNonRoot: true` — this will break some images, but those are the images you need to fix.

The effort is hours of configuration. The benefit is preventing attacks that could take weeks to recover from. Every production deployment deserves this investment.
