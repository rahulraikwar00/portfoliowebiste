---
title: Podman as a Docker Alternative in 2023
date: March 10, 2023
slug: podman-docker-alternative-2023
---

Podman has been positioned as a Docker replacement since 2019. By 2023, it had reached maturity. By 2026, it's the default container manager for many Linux distributions (Fedora, RHEL, CentOS) and security-conscious teams. The architecture is fundamentally different from Docker, and for some use cases, that difference matters significantly.

## The Architecture Difference

Docker uses a client-server architecture. A central daemon (`dockerd`) runs as root, manages containers, and exposes a REST API. The `docker` CLI communicates with this daemon. This means all container operations go through a single, privileged background process. If the daemon crashes, all running containers are affected. If the daemon has a vulnerability, an attacker gains root access to the host.

Podman is daemonless. Each container is a child process of the `podman` command. No central daemon, no root-required background process, no single point of failure. Containers can run rootless by default — the container runs with the user's UID, not root. This is the architectural difference that drives all other differences.

On a technical level, Docker's daemon-based architecture means containers survive daemon restarts but depend on daemon availability. Podman's fork/exec model means each container is directly managed by the parent process. If you run `podman run` in a terminal and close the terminal, the container exits (unless you use `--detach`). This behaves more like a regular process than Docker's detached container model.

## Security Implications

The security difference is significant. A Docker daemon exploit gives root access to the host. A Podman exploit gives access to the user's permissions. In multi-tenant environments and CI/CD pipelines, this difference matters. Rootless Podman means a compromised container can't affect other users' containers or the host system.

Rootless containers use user namespaces to map the container's root user to the host's unprivileged user. Inside the container, you're root. Outside the container, you're a regular user with limited permissions. This mapping prevents the classic container escape scenarios where a process inside the container gains root access on the host.

For CI/CD pipelines, this is particularly valuable. Each build runs as a non-root user with limited permissions. A compromised dependency in a build pipeline can't affect the build host or access other CI jobs' data.

## Compatibility

`podman` aims to be a drop-in alias for `docker`. `alias docker=podman` works for most workflows. `docker-compose` equivalents exist (`podman-compose` and `podman play kube`). Dockerfiles work unchanged. Docker images work unchanged. The OCI format is the same.

The gaps that remain: Docker Compose v2 features (profiles, includes, `depends_on` conditions) that podman-compose doesn't fully support. Docker Swarm (Podman doesn't implement it). BuildKit-specific Dockerfile features. And some Docker CLI flags that Podman interprets differently.

For most development workflows, the compatibility is sufficient. I've been using `alias docker=podman` for three years without issues. The edge cases are rare and well-documented.

## Migration Considerations

The migration is low-risk. Install Podman, alias `docker` to `podman`, run your existing commands. If something breaks, the old Docker CLI is still available. The gotchas are Docker Compose v2 features, Docker Swarm, and buildkit features.

For production, the difference is smaller than it appears. Most Kubernetes clusters use containerd or CRI-O, not Docker or Podman. The choice between Docker and Podman for development doesn't affect production deployments. Both produce OCI-compliant images that run anywhere.

Switch if you care about security (rootless by default), work in multi-tenant environments, or want daemonless containers. Stay on Docker if you depend on Compose v2 features, Swarm, or buildkit-specific capabilities. For most developers, the choice is personal preference — both tools run the same containers.
