---
title: "Essential Git Commands"
description: "A concise guide to the most useful Git commands for everyday development"
tags: ["git", "version-control", "development", "workflow"]
draft: false
date: 2025-12-16
---

# Essential Git Commands

A quick reference for the most commonly used Git commands in daily development work.

## Setup & Configuration

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# View configuration
git config --list
```

## Repository Basics

```bash
# Initialize a new repository
git init

# Clone an existing repository
git clone <repository-url>

# Check repository status
git status

# View commit history
git log --oneline --graph --all
```

## Making Changes

```bash
# Stage specific files
git add <file>

# Stage all changes
git add .

# Commit staged changes
git commit -m "Your commit message"

# Stage and commit in one step
git commit -am "Your commit message"

# Amend the last commit
git commit --amend
```

## Branching

```bash
# List all branches
git branch

# Create a new branch
git branch <branch-name>

# Switch to a branch
git switch <branch-name>

# Create and switch to a new branch
git switch -c <branch-name>

# Delete a branch
git branch -d <branch-name>

# Force delete a branch
git branch -D <branch-name>
```

## Remote Operations

```bash
# List remote repositories
git remote -v

# Add a remote
git remote add origin <repository-url>

# Fetch changes from remote
git fetch origin

# Pull changes from remote
git pull origin <branch-name>

# Push changes to remote
git push origin <branch-name>

# Push and set upstream
git push -u origin <branch-name>
```

## Merging & Rebasing

```bash
# Merge a branch into current branch
git merge <branch-name>

# Rebase current branch onto another
git rebase <branch-name>

# Continue rebase after resolving conflicts
git rebase --continue

# Abort rebase
git rebase --abort
```

## Undoing Changes

```bash
# Discard changes in working directory
git restore <file>

# Unstage a file
git restore --staged <file>

# Reset to a specific commit (keep changes)
git reset --soft <commit-hash>

# Reset to a specific commit (discard changes)
git reset --hard <commit-hash>

# Revert a commit (creates new commit)
git revert <commit-hash>
```

## Stashing

```bash
# Stash current changes
git stash

# List all stashes
git stash list

# Apply most recent stash
git stash apply

# Apply and remove most recent stash
git stash pop

# Drop a specific stash
git stash drop stash@{0}
```

## Viewing Changes

```bash
# Show changes in working directory
git diff

# Show changes in staged files
git diff --staged

# Show changes in a specific commit
git show <commit-hash>

# Show file changes in a commit
git show <commit-hash> --stat
```

## Useful Shortcuts

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# View commit history with details
git log -p -2

# Search commits by message
git log --grep="search term"

# Show who changed each line of a file
git blame <file>

# Create an alias
git config --global alias.sw switch
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

## Best Practices

- **Commit often**: Make small, focused commits
- **Write clear messages**: Use imperative mood ("Add feature" not "Added feature")
- **Pull before push**: Always pull the latest changes before pushing
- **Branch for features**: Create separate branches for new features
- **Review before commit**: Use `git diff` to review changes before committing
- **Keep history clean**: Use rebase for feature branches, merge for integration

## Common Workflows

### Feature Branch Workflow
```bash
# Create feature branch
git switch -c feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push -u origin feature/new-feature

# After review, merge to main
git switch main
git pull origin main
git merge feature/new-feature
git push origin main
```

### Fix Conflicts
```bash
# When merge conflict occurs
# 1. Open conflicted files and resolve
# 2. Stage resolved files
git add <resolved-file>

# 3. Complete the merge
git commit
```

---

*For more advanced Git operations, consult the [official Git documentation](https://git-scm.com/doc).*
