Pip compile. Compile requirements.txt like package.lock, makes sure all dependencies are compatible with each other.

```bash
pip-compile requirements.ini
```

Upgrade a package

```bash
pip-compile requirements.ini --upgrade-package sentry-sdk==2.8.0
```

```bash
pip install --upgrade package_name
```

## Installing Packages

To install a package using pip:

```bash
pip install package_name
```

To install a specific version:

```bash
pip install package_name==1.2.3
```

To install packages from a requirements file:

```bash
pip install -r requirements.txt
```

## Uninstalling Packages

To uninstall a package:

```bash
pip uninstall package_name
```

## Listing Installed Packages

To list all installed packages:

```bash
pip list
```

To show details about a specific package:

```bash
pip show package_name
```

## Freezing Requirements

To generate a requirements.txt file with all installed packages:

```bash
pip freeze > requirements.txt
```

## Checking for Outdated Packages

To see which packages are outdated:

```bash
pip list --outdated
```

## Upgrading pip

To upgrade pip itself:

```bash
pip install --upgrade pip
```

