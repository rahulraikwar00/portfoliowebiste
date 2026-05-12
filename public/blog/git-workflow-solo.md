---
title: Git Workflow for Solo Developers
date: April 17, 2026
slug: git-workflow-solo
---

A simple Git workflow for working alone on personal projects. When you're the only developer, you don't need the elaborate branching strategies that enterprise teams use (Git Flow, trunk-based development with feature flags, release trains). You need something simple that keeps your history clean and your main branch deployable.

## The Basic Workflow

### Starting a new feature

```bash
git checkout main
git pull
git checkout -b feature/my-feature
```

### Making commits

```bash
git add .
git commit -m "Add user authentication"
```

### Keeping up to date

```bash
git fetch origin
git merge origin/main
```

Or use rebase for a cleaner history:

```bash
git rebase main
```

### Merging back

```bash
git checkout main
git merge feature/my-feature
git branch -d feature/my-feature
```

## Writing Good Commit Messages

A good commit message has a subject line (short description under 50 chars) and a body that explains what and why, not how. The why is the most important part — six months later, you won't remember why you made a change, but the commit message should tell you.

Example:

```
Add user authentication

Implement login/logout with JWT. Add password hashing with bcrypt.
Create auth middleware for protected routes. Previously, the API
was completely open. This change adds authentication for all
routes except the health check endpoint.

Closes #12
```

The subject line helps you scan the history. The body helps you understand context. The prefix conventions (feat:, fix:, chore:, docs:) are useful for automated changelog generation but not essential for solo projects.

## When to Commit

Commit early, commit often. Each commit should be a logical unit of change. Don't mix unrelated changes in the same commit — if you fix a typo and add a feature in the same file, that's two commits. Run tests before committing. If you're using TypeScript, run the type checker before committing. The commit should be a coherent package that compiles and passes tests.

## Branch Naming

A simple convention: `feature/description` for new features, `fix/description` for bug fixes, `experiment/description` for things you might throw away. The prefix helps you find branches later. Delete branches after merging — `git branch -d feature/my-feature` keeps your branch list clean.

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

The `--soft` vs `--hard` distinction matters. `--soft` keeps your changes staged. `--hard` discards everything. For solo work, `--hard` is safe because nobody else depends on your commits. For shared branches, avoid rewriting history that others have based work on.

## A Solo Workflow That Works

Keep main always deployable. Create a branch for each piece of work. Commit frequently with clear messages. Merge back when ready. Delete branches when done. This keeps things simple and prevents main from getting messy. The whole point of a solo workflow is minimizing overhead — you don't need code review, you don't need release branches, you don't need hotfix branches. You just need a clean history and a deployable main branch.
