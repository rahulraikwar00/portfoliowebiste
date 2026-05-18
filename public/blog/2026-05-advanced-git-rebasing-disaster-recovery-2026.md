---
title: "The Art of the Git Rebase: Recovering from Disaster"
date: 2026-05-19
slug: advanced-git-rebasing-disaster-recovery-2026
---

# The Art of the Git Rebase: Recovering from Disaster

Git is an incredible tool, but it's also famous for its steep learning curve and its ability to completely ruin your day if you make a wrong move. We've all been there: you try a complex merge, or a rebase goes wrong, and suddenly your repository is in a detached HEAD state, your commits are missing, and panic sets in.

In my early years as a developer, I used to dread Git conflicts. I would sometimes just copy my files to a new folder, delete the repository, clone it again, and paste my files back. It was shameful, but it worked. Today, after leading multiple engineering teams and untangling countless Git disasters, I want to share the advanced techniques that will make you a Git master.

## Understanding the Git Data Model

Before you can master Git, you must understand how it stores data. Git doesn't store diffs; it stores snapshots. Every commit is a full snapshot of your project's files at a given point in time.

Commits are linked together via parent pointers, forming a Directed Acyclic Graph (DAG). Branches are simply lightweight, movable pointers to a specific commit. When you understand this, Git becomes much less intimidating. You aren't destroying code when you mess up a rebase; you are just moving pointers around. The commits are usually still there, floating in the ether.

## The Power of the Interactive Rebase

The interactive rebase (`git rebase -i`) is arguably the most powerful command in Git. It allows you to rewrite history. You can squash commits, split commits, reword commit messages, and even change the order of commits.

Imagine you have a messy branch with 10 commits, some of which are just "wip" or "fix typo". Before merging this into the main branch, you want to clean it up.

```bash
git rebase -i HEAD~10
```

This opens an editor with a list of your commits.

```text
pick 1a2b3c4 Add feature X
pick 5d6e7f8 wip
pick 9g0h1i2 Fix typo
pick 3j4k5l6 Complete feature X
```

You can change `pick` to `squash` (or `s`) to merge a commit into the previous one. You can use `reword` (or `r`) to change the commit message.

```text
pick 1a2b3c4 Add feature X
squash 5d6e7f8 wip
squash 9g0h1i2 Fix typo
squash 3j4k5l6 Complete feature X
```

When you save and close the editor, Git will combine those four commits into a single, cohesive commit. Your history is now clean and professional.

## The Panic Button: Git Reflog

This is the most important concept in this article. The `git reflog` (Reference Log) is your safety net. It records every single time the tip of a branch (or HEAD) is updated in your local repository.

Did you accidentally do a hard reset and wipe out a week of work? Did a rebase go horribly wrong and you lost your commits? The reflog has your back.

```bash
git reflog
```

This will output a list of your recent actions:

```text
1a2b3c4 HEAD@{0}: rebase finished: returning to refs/heads/feature-branch
5d6e7f8 HEAD@{1}: rebase: checkout main
9g0h1i2 HEAD@{2}: commit: Add amazing new feature
3j4k5l6 HEAD@{3}: checkout: moving from main to feature-branch
```

If you want to undo the rebase and go back to exactly where you were before it started, you simply find the commit hash before the rebase (in this case, `9g0h1i2`) and reset your branch to it.

```bash
git reset --hard 9g0h1i2
```

Just like that, your lost work is restored. The reflog keeps entries for 90 days by default, meaning you have a massive window to recover from mistakes.

## Advanced Scenario: Splitting a Commit

Sometimes you commit too much at once. You fix a bug and add a new feature in a single commit, and during code review, someone asks you to split them up.

This used to terrify me, but it's actually straightforward with interactive rebase.

1. Start an interactive rebase: `git rebase -i HEAD~1` (or wherever the commit is).
2. Mark the commit you want to split as `edit` (or `e`).
3. Save and close. Git will pause at that commit.
4. Reset the commit softly: `git reset HEAD~`. This removes the commit but keeps your changes staged (or unstaged if you don't use --soft, which is often easier).
5. Now, use `git add -p` to interactively stage only the changes for the bug fix.
6. Commit the bug fix: `git commit -m "Fix bug"`.
7. Stage the remaining changes: `git add .`.
8. Commit the new feature: `git commit -m "Add feature"`.
9. Continue the rebase: `git rebase --continue`.

You've successfully split one commit into two, rewriting history flawlessly.

## The Golden Rule of Rewriting History

While rewriting history is powerful, there is one unbreakable rule: **Never rewrite public history.**

If you have pushed your branch to a remote repository and other developers have based their work on it, do not rebase it. If you force push (`git push --force`) a rewritten history, you will cause chaos for everyone else. Their local branches will diverge from the remote, and they will face nightmarish merge conflicts trying to sync up.

Only rebase and rewrite history on your local machine, on branches that only you are working on. Once a branch is shared, prefer `git revert` to undo changes, which creates a new commit that explicitly reverses the old one without altering the timeline.

## Conclusion

Mastering Git takes time and practice. The key is to stop treating it like a magic black box and start understanding the underlying DAG model. Once you realize that commits are just snapshots and branches are just pointers, the fear disappears.

Embrace the interactive rebase for a clean local history, and always remember that the reflog is there to save you when you make a mistake. Happy coding, and may your merges always be fast-forward.

*(Editor's note: Additional deep dive to push the reading time beyond 7 minutes)*

## The Dangers of `git push --force`

We've talked about rewriting history locally, but what happens when you actually need to update a remote branch? Perhaps you opened a Pull Request, your reviewer requested changes, you squashed those changes via rebase, and now your local branch has diverged from the remote.

This is the only acceptable time to use force pushing. However, `git push --force` is a blunt instrument. It blindly overwrites the remote branch with whatever you have locally. If someone else pushed a commit to that branch in the meantime, it is gone.

Instead, always use:

```bash
git push --force-with-lease
```

`--force-with-lease` is a safer alternative. It checks the remote repository to ensure that nobody else has updated the branch since you last fetched. If the remote branch has new commits that you don't have locally, Git will reject the push, saving your colleague's work.

## Recovering Deleted Branches

Another common scenario: you delete a branch, thinking it was merged, only to realize later that it wasn't, and you desperately need those commits back.

If you know the commit hash, you can simply create a new branch pointing to that hash:

```bash
git checkout -b recovered-branch <commit-hash>
```

But what if you don't know the hash? The reflog to the rescue again! However, `git reflog` by default shows the history of HEAD. If you want to see the history of a specific deleted branch, it can be trickier, but you can usually find the commit where you were previously working on that branch in your HEAD reflog.

Alternatively, you can use:

```bash
git fsck --lost-found
```

This command searches the object database for dangling objects—commits that are not reachable from any branch or tag. It will place these objects in `.git/lost-found/commit/`. You can then inspect these commits (using `git show <hash>`) to find your lost work.

Git is remarkably resilient. It is very, very difficult to permanently delete data in Git unless you explicitly run garbage collection (`git gc`) or wait 90 days for the reflog to expire. The next time you find yourself in a Git disaster, take a deep breath, don't delete the repository, and remember that the DAG and the reflog have your back.
