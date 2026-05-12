---
title: The State of Python in 2025 — What's Actually Happening
date: March 30, 2025
slug: python-state-2025
---

Python keeps growing, but the interesting changes are internal to the language and ecosystem. The 2025 Python Developers Survey (conducted by the PSF and JetBrains) shows 86% of respondents use Python as their main language. Data science crossed a milestone — 51% of Python developers now work in data exploration and processing. Web development usage ticked back up to 46% after declining for several years. But the big story is infrastructure changes.

## The GIL Is Finally Optional

Python 3.14, released in late 2025, makes free-threaded builds officially supported. PEP 703 delivered optional GIL removal. What does this mean in practice? If you enable `python3.14t` (the free-threaded build), Python can use multiple CPU cores for thread-bound workloads. Single-thread overhead dropped from ~40% in 3.13 to single digits on common platforms. Multi-threaded CPU workloads see up to 3.1x speedups without changing any code.

The catch: many C-extensions aren't thread-safe yet. NumPy 2.3.0 proved the transition is possible, but most libraries are still catching up. Importing a non-thread-safe extension can re-enable the GIL. If you're doing CPU-bound work in pure Python, the gains are real and immediate. If you're waiting on library support, track `python3.14t` wheel availability for your key dependencies.

## Rust Is Python's Performance Co-Pilot

The PSF survey revealed that between one-quarter and one-third of all native code uploaded to PyPI for new projects uses Rust. Rust usage for binary extensions grew from 27% to 33% year over year. Tools like `uv` (Astral's Rust-powered package manager) overtook `pip` in CI usage for major projects — Wagtail reported 66% uv vs 34% pip. `uv` is 10-100x faster than pip as a drop-in replacement for dependency resolution and package installation.

## Ecosystem Challenges

The PSF faces real financial pressure. The budget is roughly $5M annually with 14 employees. PyCon has run at a loss for three years. The board voted to withdraw from a $1.5M NSF grant over incompatible terms. The community responded with $150K+ in donations, but institutional funding gaps remain. If your organization relies on Python commercially, consider PSF sponsorship or supporting membership. The PSF maintains PyPI (which serves tens of billions of downloads per month), CPython, pip, and the broader Python infrastructure. That infrastructure depends on sustainable funding.

## What to Do in 2026

Test Python 3.14 free-threaded builds for CPU-bound workloads. Plan migration from Python 3.10 (EOL October 2026). Try `uv` for package management — the speed difference is dramatic and it works as a drop-in replacement. Track free-threading wheel availability for your key dependencies. And consider supporting the PSF if you can — the foundation that maintains the tools you depend on needs funding to continue doing so.
