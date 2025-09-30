---
title: "Python Virtual Environments (venv)"
description: "Managing Python virtual environments for isolated project dependencies"
tags: [python, venv, virtual-environments, package-management, dependencies]
draft: false
date: 2025-09-30
lastmod: 2025-09-30
---

## Core Concepts

Virtual environments are isolated Python environments that allow you to install packages without affecting your system Python installation. This isolation helps manage project dependencies and avoid version conflicts.

- **Isolation**: Each project has its own package dependencies
- **Version Control**: Different projects can use different package versions
- **Clean System**: System Python remains unmodified
- **Reproducibility**: Easy to recreate environments across machines

## Creating Virtual Environments

### Basic Creation

Create a new virtual environment in your project directory:

```bash
# Create virtual environment
python -m venv venv

# Create with specific Python version
python3.11 -m venv venv

# Create with custom name
python -m venv my_project_env
```

### Activation and Deactivation

```bash
# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Deactivate (all platforms)
deactivate
```

### Verification

```bash
# Check which Python is being used
which python

# Check Python version
python --version

# Check pip location
which pip

# List installed packages
pip list
```

## Package Management

### Installing Packages

```bash
# Install single package
pip install requests

# Install specific version
pip install django==4.2.0

# Install from requirements file
pip install -r requirements.txt

# Install development dependencies
pip install -r requirements-dev.txt
```

### Requirements Files

```bash
# Freeze current dependencies
pip freeze > requirements.txt

# Create requirements with exact versions
pip freeze --all > requirements-exact.txt

# Install from requirements
pip install -r requirements.txt

# Upgrade packages from requirements
pip install -r requirements.txt --upgrade
```

### Example requirements.txt

```txt
# Production dependencies
django>=4.2.0,<5.0.0
requests==2.31.0
psycopg2-binary==2.9.7

# Development dependencies (use requirements-dev.txt)
pytest>=7.0.0
black==23.7.0
flake8==6.0.0
```

## Advanced Usage

### Multiple Environment Management

```bash
# Create environments for different projects
mkdir project1 && cd project1
python -m venv venv

mkdir project2 && cd project2
python -m venv venv

# Or use different names
python -m venv project1_env
python -m venv project2_env
```

### Environment Variables

```bash
# Create .env file for environment variables
echo "DEBUG=True" > .env
echo "DATABASE_URL=sqlite:///db.sqlite3" >> .env

# Load in Python (using python-dotenv)
pip install python-dotenv
```

```python
# In your Python code
from dotenv import load_dotenv
import os

load_dotenv()
debug = os.getenv('DEBUG', 'False').lower() == 'true'
```

### Shell Integration

```bash
# Add to shell profile for easier activation
echo 'alias activate="source venv/bin/activate"' >> ~/.bashrc

# Create function for quick environment creation
venv_create() {
    python -m venv venv
    source venv/bin/activate
    pip install --upgrade pip
}
```

## Best Practices

### Project Structure

```
my_project/
├── venv/                 # Virtual environment (don't commit)
├── src/                  # Source code
├── tests/               # Test files
├── requirements.txt     # Production dependencies
├── requirements-dev.txt # Development dependencies
├── .env                 # Environment variables (don't commit)
├── .gitignore          # Git ignore file
└── README.md           # Project documentation
```

### .gitignore for Python Projects

```gitignore
# Virtual environments
venv/
env/
ENV/
.venv/

# Environment variables
.env
.env.local

# Python cache
__pycache__/
*.pyc
*.pyo
*.pyd

# IDE files
.vscode/
.idea/
```

### Dependency Management

```bash
# Separate requirements files
requirements.txt          # Production only
requirements-dev.txt      # Development tools
requirements-test.txt     # Testing dependencies

# Pin major versions only
django>=4.2.0,<5.0.0     # Allow patch updates
requests~=2.31.0          # Compatible release

# Use pip-tools for dependency resolution
pip install pip-tools
pip-compile requirements.in
```

## Alternative Tools

### pipenv

```bash
# Install pipenv
pip install pipenv

# Create environment and install packages
pipenv install requests
pipenv install pytest --dev

# Activate shell
pipenv shell

# Install from Pipfile
pipenv install
```

### conda

```bash
# Create conda environment
conda create -n myproject python=3.11

# Activate environment
conda activate myproject

# Install packages
conda install numpy pandas
conda install -c conda-forge requests
```

### poetry

```bash
# Initialize project
poetry init

# Install dependencies
poetry add requests
poetry add pytest --group dev

# Activate shell
poetry shell
```

## Troubleshooting

### Common Issues

```bash
# Python version issues with pyenv
brew install pyenv
alias brew='env PATH="${PATH//$(pyenv root)\/shims:/}" brew'
pyenv install 3.11.0
pyenv global 3.11.0

# If Python version doesn't update
eval "$(pyenv init -)"

# Permission errors
pip install --user package_name

# Outdated pip
python -m pip install --upgrade pip

# Corrupted environment
rm -rf venv
python -m venv venv
```

### Environment Not Activating

```bash
# Check if virtual environment exists
ls -la venv/

# Recreate if corrupted
rm -rf venv
python -m venv venv

# Check Python path after activation
source venv/bin/activate
which python
```

### Package Installation Issues

```bash
# Clear pip cache
pip cache purge

# Install with no cache
pip install --no-cache-dir package_name

# Verbose installation for debugging
pip install -v package_name

# Check for conflicts
pip check
```

## Automation Scripts

### Project Setup Script

```bash
#!/bin/bash
# setup_project.sh

PROJECT_NAME=${1:-my_project}
PYTHON_VERSION=${2:-python3}

echo "Creating project: $PROJECT_NAME"
mkdir $PROJECT_NAME
cd $PROJECT_NAME

echo "Creating virtual environment..."
$PYTHON_VERSION -m venv venv
source venv/bin/activate

echo "Upgrading pip..."
pip install --upgrade pip

echo "Creating requirements files..."
touch requirements.txt
touch requirements-dev.txt
touch .env

echo "Creating .gitignore..."
cat > .gitignore << EOF
venv/
.env
__pycache__/
*.pyc
EOF

echo "Project setup complete!"
echo "To activate: source venv/bin/activate"
```

### Makefile for Common Tasks

```makefile
# Makefile
.PHONY: install install-dev test clean

venv:
	python -m venv venv
	source venv/bin/activate && pip install --upgrade pip

install: venv
	source venv/bin/activate && pip install -r requirements.txt

install-dev: venv
	source venv/bin/activate && pip install -r requirements-dev.txt

test:
	source venv/bin/activate && pytest

clean:
	rm -rf venv
	find . -type d -name __pycache__ -delete
	find . -name "*.pyc" -delete

freeze:
	source venv/bin/activate && pip freeze > requirements.txt
```

## Related Topics

- [[pip]] - Python package installer and management
- [[requirements]] - Managing project dependencies
- [[pyenv]] - Python version management


