---
title: "UV Package Management"
description: "Fast Python package manager and project management tool"
tags: [python, uv, package-management, dependencies, virtual-environments]
draft: false
date: 2025-10-13
lastmod: 2025-10-13
---

## Core Concepts

UV is an extremely fast Python package manager written in Rust. It manages projects, dependencies, and Python versions with a single tool.

- **Speed**: 10-100x faster than pip
- **All-in-One**: Package management, virtual environments, Python versions
- **Project-First**: Manages dependencies through pyproject.toml
- **Lock Files**: Ensures reproducible installations

## Installation

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# With Homebrew
brew install uv

# Verify installation
uv --version
```

## Basic Usage

### Adding Packages

```bash
# Add a package to your project
uv add requests

# Add specific version
uv add django==4.2.0

# Add multiple packages
uv add requests pandas numpy

# Add development dependency
uv add --dev pytest black ruff
```

### Removing Packages

```bash
# Remove a package
uv remove requests

# Remove development dependency
uv remove --dev pytest
```

## Project Management

### Creating Projects

```bash
# Initialize new project
uv init my-project
cd my-project

# Creates:
# my-project/
# ├── pyproject.toml
# ├── README.md
# ├── .python-version
# └── uv.lock
```

### Installing Dependencies

```bash
# Install all project dependencies
uv sync

# Install including dev dependencies
uv sync --dev

# Install from existing project
git clone https://github.com/user/project.git
cd project
uv sync
```

### Running Python with UV

```bash
# Run Python script
uv run script.py

# Run Python command
uv run python manage.py runserver

# Run with specific Python version
uv run --python 3.11 script.py
```

## Common Workflows

### Starting a New Project

```bash
# Create and setup project
uv init my-app
cd my-app

# Add dependencies
uv add flask requests

# Add dev dependencies
uv add --dev pytest black

# Dependencies are automatically added to pyproject.toml
```

### Working with Existing Project

```bash
# Clone and setup
git clone https://github.com/user/project.git
cd project

# Install all dependencies from lock file
uv sync
```

### Updating Dependencies

```bash
# Update a specific package
uv lock --upgrade-package requests

# Update all packages
uv lock --upgrade

# Sync after updating
uv sync
```

## Key Commands

### Package Operations

```bash
# Add package
uv add package

# Remove package
uv remove package

# Update lock file
uv lock

# Install from lock file
uv sync

# List installed packages
uv pip list
```

### Python Version Management

```bash
# Install Python version
uv python install 3.11

# List available versions
uv python list

# Pin project to Python version
uv python pin 3.11
```

## UV vs Traditional Tools

### Speed Comparison

```bash
# Traditional pip + venv
python -m venv .venv
pip install -r requirements.txt  # ~30 seconds

# UV
uv sync  # ~3 seconds
```

### Command Comparison

```bash
# Traditional → UV
pip install package         → uv add package
pip uninstall package       → uv remove package
pip install -r requirements → uv sync
pip freeze                  → uv pip freeze
python -m venv .venv       → uv venv (automatic)
```

## Project Configuration

### pyproject.toml

UV automatically manages your pyproject.toml when you add packages:

```toml
[project]
name = "my-app"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "flask>=3.0.0",
    "requests>=2.31.0",
]

[tool.uv]
dev-dependencies = [
    "pytest>=7.0.0",
    "black>=23.0.0",
    "ruff>=0.1.0",
]
```

### Lock Files

```bash
# UV automatically creates uv.lock when you add packages
uv add requests  # Creates/updates uv.lock

# Update lock file
uv lock

# Sync from lock file
uv sync
```

## Common Use Cases

### Web Development

```bash
# Django project
uv init django-app
cd django-app
uv add django
uv run django-admin startproject mysite .
uv run python manage.py runserver
```

### Data Science

```bash
# Data analysis project
uv init data-project
cd data-project
uv python pin 3.11
uv add pandas numpy matplotlib jupyter
uv run jupyter notebook
```

### API Development

```bash
# FastAPI project
uv init api-project
cd api-project
uv add fastapi uvicorn
uv run uvicorn main:app --reload
```

## Troubleshooting

### Common Issues

```bash
# UV not found after install
# Add to PATH in ~/.zshrc or ~/.bashrc
export PATH="$HOME/.cargo/bin:$PATH"

# Python version not found
uv python install 3.11

# Clear cache if issues persist
uv cache clean

# Reinstall dependencies
rm uv.lock
uv sync
```

### Migration from Pip

```bash
# Existing project with requirements.txt
uv init
uv add $(cat requirements.txt | grep -v "^#" | tr '\n' ' ')

# Or manually add each package
uv add package1 package2 package3
```

## Related Topics

- [[venv]] - Python virtual environments
- [[pip]] - Traditional Python package management
- [[pyproject]] - Modern Python project configuration
