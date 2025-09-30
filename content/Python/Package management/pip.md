---
title: "pip - Python Package Management"
description: "Essential guide to using pip for installing, managing, and maintaining Python packages including requirements files and dependency management."
tags: [python, pip, package-management, dependencies]
draft: false
date: 2025-07-01
lastmod: 2025-07-01
---

Python's standard package installer for managing dependencies and libraries.

## Basic Package Operations

### Installing Packages
```bash
# Install latest version
pip install package_name

# Install specific version
pip install package_name==1.2.3

# Install with version constraints
pip install "package_name>=1.0,<2.0"

# Install from requirements file
pip install -r requirements.txt
```

### Uninstalling Packages
```bash
# Uninstall single package
pip uninstall package_name

# Uninstall multiple packages
pip uninstall package1 package2

# Uninstall from requirements file
pip uninstall -r requirements.txt
```

### Upgrading Packages
```bash
# Upgrade single package
pip install --upgrade package_name

# Upgrade pip itself
pip install --upgrade pip

# Upgrade all packages (use carefully)
pip list --outdated --format=freeze | grep -v '^\-e' | cut -d = -f 1 | xargs -n1 pip install -U
```

## Package Information

```bash
# List installed packages
pip list

# Show package details
pip show package_name

# List outdated packages
pip list --outdated

# Check package dependencies
pip show package_name | grep Requires
```

## Requirements Management

### Creating Requirements Files
```bash
# Generate requirements.txt
pip freeze > requirements.txt

# Generate with only top-level packages
pip list --format=freeze > requirements.txt
```

### Advanced Requirements
```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Install with extras
pip install "package_name[extra1,extra2]"

# Install from Git repository
pip install git+https://github.com/user/repo.git
```

## Dependency Management with pip-tools

```bash
# Install pip-tools
pip install pip-tools

# Create requirements.in file
echo "django>=4.0" > requirements.in

# Compile to requirements.txt
pip-compile requirements.in

# Upgrade specific package
pip-compile requirements.in --upgrade-package django==4.2.0

# Sync environment with requirements
pip-sync requirements.txt
```

## Virtual Environment Integration

```bash
# Install in current virtual environment
pip install package_name

# Show installation location
pip show -f package_name

# Install in user directory (avoid with venv)
pip install --user package_name
```

## Common Workflows

### New Project Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Upgrade pip
pip install --upgrade pip

# Install from requirements
pip install -r requirements.txt
```

### Development Workflow
```bash
# Install package in development mode
pip install -e .

# Install with development dependencies
pip install -e ".[dev]"

# Update requirements after adding packages
pip freeze > requirements.txt
```

## Troubleshooting

```bash
# Clear pip cache
pip cache purge

# Install without cache
pip install --no-cache-dir package_name

# Force reinstall
pip install --force-reinstall package_name

# Check pip configuration
pip config list

# Debug installation
pip install --verbose package_name
```

## Configuration

```bash
# Set default index URL
pip config set global.index-url https://pypi.org/simple/

# Add trusted host
pip config set global.trusted-host pypi.org

# Set timeout
pip config set global.timeout 60
```

## Security Best Practices

```bash
# Verify package integrity
pip install --require-hashes -r requirements.txt

# Check for security vulnerabilities
pip-audit

# Install from trusted sources only
pip install --trusted-host pypi.org package_name
```

## Related Topics

- [[pyenv]] - Python version management
- [[Virtual environments]] - Isolated Python environments
- [[Package management]] - Overview of Python packaging

