# Working with Python Virtual Environments

Virtual environments are isolated Python environments that allow you to install packages without affecting your system Python installation. This isolation helps manage project dependencies and avoid version conflicts.

## Creating a Virtual Environment

Create a new virtual environment in your project directory:

```bash
python -m venv venv
```

Source the venv

```bash
source venv/bin/activate
```


Install Requirements

```bash
pip install -r requirements.txt
```



Freeze the dependencies

```bash
pip freeze > requirements.txt
```

Troubleshooting

```bash
brew install pyenv
alias brew='env PATH="${PATH//$(pyenv root)\/shims:/}" brew'
pyenv install <version>
pyenv global <version>

If it doesn't set the new python version run:
eval "$(pyenv init -)"
```


