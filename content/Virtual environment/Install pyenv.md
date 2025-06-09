
```bash
brew install pyenv
alias brew='env PATH="${PATH//$(pyenv root)\/shims:/}" brew'
pyenv install <version>
pyenv global <version>

If it doesn't set the new python version run:
eval "$(pyenv init -)"
```
