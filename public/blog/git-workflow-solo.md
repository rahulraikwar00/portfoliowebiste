---
title: Git Workflow for Solo Developers
date: April 17, 2026
slug: git-workflow-solo
---

# Git Workflow for Solo Developers

A simple Git workflow for working alone on personal projects.

## The Basic Workflow

### Starting a new feature

```bash
# Make sure you're on main and up to date
git checkout main
git pull

# Create a new branch
git checkout -b feature/my-feature
```

### Making commits

```bash
# Stage your changes
git add .

# Commit with a message
git commit -m "Add user authentication"
```

### Keeping up to date

```bash
# Fetch the latest from origin
git fetch origin

# Pull main into your branch
git merge origin/main
```

Or use rebase for a cleaner history:

```bash
git rebase main
```

### Merging back

```bash
# Switch to main
git checkout main

# Merge your feature
git merge feature/my-feature

# Delete the branch (optional)
git branch -d feature/my-feature
```

## Writing Good Commit Messages

A good commit message has:

1. **Subject line** — Short description (under 50 chars)
2. **Body** — Explain what and why, not how

Example:

```
Add user authentication

- Implement login/logout with JWT
- Add password hashing with bcrypt
- Create auth middleware for protected routes

Closes #12
```

## When to Commit

- Commit early, commit often
- Each commit should be a logical unit
- Don't mix unrelated changes
- Run tests before committing

## Useful Commands

- `git status` — See what's changed
- `git diff` — View changes
- `git log --oneline` — Compact history
- `git stash` — Save changes temporarily
- `git stash pop` —恢复 stashed changes

## Undoing Things

```bash
# Unstage a file
git reset HEAD filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard changes to a file
git checkout -- filename

# Reset to a previous commit
git reset --hard commit-hash
```

## Branch Naming

A simple convention:

- `feature/description` — New features
- `fix/description` — Bug fixes
- `experiment/description` — Trying things out

## A Solo Workflow That Works

1. `main` is always deployable
2. Create a branch for each piece of work
3. Commit frequently with clear messages
4. Merge back when ready
5. Delete branches when done

This keeps things simple and prevents `main` from getting messy.