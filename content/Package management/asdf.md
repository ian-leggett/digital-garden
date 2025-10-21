---
title: "ASDF Version Manager"
description: "Essential asdf commands for managing multiple runtime versions"
tags: [asdf, version-manager, python, nodejs, ruby, devops]
draft: false
date: 2025-10-21
lastmod: 2025-10-21
---

## Core Concepts

ASDF is a universal version manager for multiple programming languages and tools. Manage Python, Node.js, Ruby, and more with a single tool.

- **Single Tool**: Manage all language versions in one place
- **Per-Project**: Different versions per project directory
- **Plugin-Based**: Extensible with community plugins
- **Shell Integration**: Works with bash, zsh, fish

## Installation

```bash
# macOS with Homebrew
brew install asdf

# Add to shell profile (~/.zshrc or ~/.bashrc)
echo '. /opt/homebrew/opt/asdf/libexec/asdf.sh' >> ~/.zshrc

# Reload shell
source ~/.zshrc

# Verify installation
asdf --version
```

## Essential Commands

### Plugin Management

```bash
# List all available plugins
asdf plugin list all

# Add a plugin
asdf plugin add python
asdf plugin add nodejs
asdf plugin add ruby

# List installed plugins
asdf plugin list

# Update a plugin
asdf plugin update python

# Update all plugins
asdf plugin update --all

# Remove a plugin
asdf plugin remove python
```

### Installing Versions

```bash
# List available versions
asdf list all python
asdf list all nodejs

# Install specific version
asdf install python 3.11.0
asdf install nodejs 20.0.0

# Install latest version
asdf install python latest
asdf install nodejs latest

# List installed versions
asdf list python
asdf list nodejs

# List all installed versions (all languages)
asdf list
```

### Setting Versions

```bash
# Set global version (all projects)
asdf global python 3.11.0
asdf global nodejs 20.0.0

# Set local version (current directory only)
asdf local python 3.11.0
asdf local nodejs 20.0.0

# Set shell version (current terminal session)
asdf shell python 3.11.0

# Show current version
asdf current python
asdf current nodejs

# Show all current versions
asdf current
```

### Uninstalling Versions

```bash
# Uninstall specific version
asdf uninstall python 3.10.0
asdf uninstall nodejs 18.0.0

# Uninstall all versions of a tool
asdf plugin remove python
asdf plugin add python  # Add back if needed
```

## Common Workflow

```bash
# 1. Add plugin for language
asdf plugin add python

# 2. List available versions
asdf list all python

# 3. Install desired version
asdf install python 3.11.0

# 4. Set as global default
asdf global python 3.11.0

# 5. Verify version
python --version
```

## Project Setup

### Creating .tool-versions File

```bash
# Set local versions (creates .tool-versions file)
cd my-project
asdf local python 3.11.0
asdf local nodejs 20.0.0

# .tool-versions content:
# python 3.11.0
# nodejs 20.0.0
```

### Using .tool-versions

```bash
# Clone project with .tool-versions
git clone https://github.com/user/project.git
cd project

# Install all versions from .tool-versions
asdf install

# Versions automatically used when in directory
python --version  # Uses version from .tool-versions
```

## Popular Plugins

### Python

```bash
asdf plugin add python
asdf install python 3.11.0
asdf global python 3.11.0

# Verify
python --version
pip --version
```

### Node.js

```bash
asdf plugin add nodejs
asdf install nodejs 20.0.0
asdf global nodejs 20.0.0

# Verify
node --version
npm --version
```

### Ruby

```bash
asdf plugin add ruby
asdf install ruby 3.2.0
asdf global ruby 3.2.0

# Verify
ruby --version
gem --version
```

### Terraform

```bash
asdf plugin add terraform
asdf install terraform 1.6.0
asdf global terraform 1.6.0

# Verify
terraform --version
```

## Version Resolution

ASDF checks for versions in this order:

1. **Shell version** - `asdf shell python 3.11.0`
2. **Local version** - `.tool-versions` in current directory
3. **Parent directories** - `.tool-versions` in parent folders
4. **Global version** - `~/.tool-versions`

```bash
# Example directory structure
~/projects/
  ├── .tool-versions (python 3.10.0)  # Global for all projects
  └── my-app/
      └── .tool-versions (python 3.11.0)  # Local for this project
```

## Managing Multiple Versions

```bash
# Install multiple Python versions
asdf install python 3.10.0
asdf install python 3.11.0
asdf install python 3.12.0

# List installed versions
asdf list python

# Switch between versions per project
cd project-a
asdf local python 3.10.0

cd ../project-b
asdf local python 3.11.0

# Verify different versions
cd project-a && python --version  # 3.10.0
cd project-b && python --version  # 3.11.0
```

## Useful Commands

```bash
# Show where asdf is installed
asdf where python

# Show install path for version
asdf where python 3.11.0

# Reshim after installing packages
asdf reshim python

# Show current versions and paths
asdf current

# Get help
asdf help
asdf help plugin
asdf help install
```

## Configuration

### Global Config (~/.asdfrc)

```bash
# Create config file
cat > ~/.asdfrc << EOF
legacy_version_file = yes
use_release_candidates = no
always_keep_download = no
EOF
```

### Legacy Version Files

```bash
# Enable support for .python-version, .node-version, etc.
echo "legacy_version_file = yes" >> ~/.asdfrc

# Now asdf will read .python-version files
echo "3.11.0" > .python-version
asdf current python  # Uses 3.11.0
```

## Troubleshooting

```bash
# Reshim if commands not found
asdf reshim python
asdf reshim nodejs

# Update asdf
brew upgrade asdf  # macOS

# Update all plugins
asdf plugin update --all

# Check asdf installation
which asdf
asdf --version

# Check shims directory
ls ~/.asdf/shims/

# Verify shell integration
echo $PATH | grep asdf
```

## Common Issues

```bash
# Command not found after install
asdf reshim python

# Wrong version being used
asdf current python  # Check which version is active
asdf where python    # Check installation path

# Plugin install fails
asdf plugin update python
asdf plugin remove python
asdf plugin add python

# Clear downloads and reinstall
rm -rf ~/.asdf/downloads/*
asdf install python 3.11.0
```

## Best Practices

```bash
# Always use .tool-versions in projects
cd my-project
asdf local python 3.11.0
git add .tool-versions
git commit -m "Add .tool-versions"

# Keep plugins updated
asdf plugin update --all

# Use specific versions (not 'latest')
asdf install python 3.11.0  # Good
asdf install python latest  # Avoid in production

# Document versions in README
echo "Python 3.11.0" >> README.md
echo "Node.js 20.0.0" >> README.md
```

## ASDF vs Other Version Managers

```bash
# Instead of:
pyenv install 3.11.0      # Python only
nvm install 20.0.0        # Node.js only
rbenv install 3.2.0       # Ruby only

# Use asdf for all:
asdf install python 3.11.0
asdf install nodejs 20.0.0
asdf install ruby 3.2.0
```

## Related Topics

- [[pyenv]] - Python version management alternative
- [[venv]] - Python virtual environments
- [[docker]] - Container-based environment isolation
