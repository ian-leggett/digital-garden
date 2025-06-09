---
title: "Manage.Py"
tags:
  - django
description: ""
date: 2025-05-29
---

### Create superuser

```bash
python manage.py createsuperuser
```

### Common manage.py Commands

**Run the development server:**
```bash
python manage.py runserver
```
**Apply database migrations:**
```bash
python manage.py migrate
```
**Create new migrations based on model changes:**
```bash
python manage.py makemigrations
```
**Check for problems in your project:**
```bash
python manage.py check
```
**Open the Django shell:**
```bash
python manage.py shell
```
**Show all available commands:**
```bash
python manage.py help
```
**Show SQL for a migration:**
```bash
python manage.py sqlmigrate app_name migration_number
```
**Collect static files:**
```bash
python manage.py collectstatic
```
**Create a new app:**
  ```bash
  python manage.py startapp app_name
  ```

See the [Django documentation](https://docs.djangoproject.com/en/stable/ref/django-admin/) for more commands and details.

