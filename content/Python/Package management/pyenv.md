
---
title: "pyenv - Python Version Management"
description: "Essential guide to managing multiple Python versions with pyenv including installation, usage, and common commands."
tags: [python, pyenv, version-management, package-management]
draft: false
date: 2025-07-01
lastmod: 2025-07-01
---

Simple tool for managing multiple Python versions on your system.

## Installation

```bash
# macOS
brew install pyenv

# Add to shell profile (~/.zshrc or ~/.bashrc)
echo 'export PATH="$HOME/.pyenv/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
source ~/.zshrc
```

## Basic Commands

```bash
# List available Python versions
pyenv install --list

# Install Python version
pyenv install 3.11.0

# List installed versions
pyenv versions

# Set global Python version
pyenv global 3.11.0

# Set local Python version for current directory
pyenv local 3.10.0

# Show current Python version
pyenv version
```

## Common Workflow

```bash
# Install latest Python
pyenv install 3.11.0

# Set as global default
pyenv global 3.11.0

# Verify installation
python --version
which python
```

## Project-Specific Versions

```bash
# Navigate to project directory
cd my-project

# Set Python version for this project
pyenv local 3.10.0

# Creates .python-version file
# Automatically switches when entering directory
```

## Troubleshooting

```bash
# If Python version doesn't switch
eval "$(pyenv init -)"

# Fix brew conflicts
alias brew='env PATH="${PATH//$(pyenv root)\/shims:/}" brew'

# Rehash after installing packages
pyenv rehash
```

## Related Topics

- [[pip]] - Python package management
- [[Virtual environments]] - Isolated Python environments
