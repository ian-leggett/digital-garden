---
title: "Django Session Authentication"
tags:
  - django
  - python
  - authentication
  - security
  - sessions
description: "How Django's session-based authentication system works"
date: 2025-06-11
---

Django provides a robust, secure session-based authentication system out of the box. This system handles user accounts, groups, permissions, and cookie-based user sessions.

## How It Works

1. **User Login**: User provides credentials (username/password)
2. **Verification**: Django verifies credentials against the database
3. **Session Creation**: Upon successful verification, Django creates a session
4. **Cookie Storage**: A session ID is stored in a cookie on the user's browser
5. **Subsequent Requests**: The session ID is sent with each request
6. **Authentication Check**: Django uses the session ID to identify the user

## Basic Setup

Django's authentication system is included by default. Ensure these apps are in `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    # ...
    'django.contrib.auth',  # Core authentication framework
    'django.contrib.contenttypes',  # Permission system dependency
    # ...
]
```
And these middleware classes are included:

```python
MIDDLEWARE = [
    # ...
    'django.contrib.sessions.middleware.SessionMiddleware',  # Manages sessions
    'django.contrib.auth.middleware.AuthenticationMiddleware',  # Associates users with requests
    # ...
]
```

## Authentication Views

Django provides ready-to-use views for authentication:

```python
# urls.py
from django.contrib.auth import views as auth_views
from django.urls import path

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='accounts/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    path('password-change/', auth_views.PasswordChangeView.as_view(), name='password_change'),
    path('password-change/done/', auth_views.PasswordChangeDoneView.as_view(), name='password_change_done'),
    # Other auth-related URLs...
]
```

## Custom Login View

If you need more control, create a custom login view:

```python
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            # Redirect to a success page
            return redirect('home')
        else:
            # Return an 'invalid login' error message
            return render(request, 'accounts/login.html', {'error': 'Invalid credentials'})
    
    return render(request, 'accounts/login.html')
```

## Protecting Views
from django.contrib.auth.decorators import login_required
``` python
@login_required
def profile_view(request):
    # Only authenticated users can access this view
    return render(request, 'accounts/profile.html')
```

Using mixins for class-based views:

```python
from django.contrib.auth.mixins import LoginRequiredMixinfrom django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

class ProfileView(LoginRequiredMixin, TemplateView):
    template_name = 'accounts/profile.html'
    login_url = '/login/'  # Redirect URL if not authenticated
```


## Accessing the Current User

In views:

```python
def some_view(request):
    if request.user.is_authenticated:
        # User is logged in
        username = request.user.username
    else:
        # User is not logged in
        username = 'Guest'
```

In templates:

```django
{% if user.is_authenticated %}
    <p>Welcome, {{ user.username }}!</p>
{% else %}
    <p>Welcome, Guest!</p>
{% endif %}
```

## Session Settings

Configure session behavior in settings.py:

```python
# Session cookie age in seconds (default: 2 weeks)
SESSION_COOKIE_AGE = 1209600

# Whether to expire the session when the user closes the browser
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# Whether to use a secure cookie for HTTPS connections
SESSION_COOKIE_SECURE = True  # Enable in production with HTTPS

# Prevent JavaScript from accessing the session cookie
SESSION_COOKIE_HTTPONLY = True
```

## Custom User Model

It's recommended to use a custom user model for new projects:

```python
# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add custom fields
    bio = models.TextField(blank=True)
    birth_date = models.DateField(null=True, blank=True)
    
    # Add any custom methods
    def get_full_name_with_username(self):
        return f"{self.get_full_name()} ({self.username})"
```

In settings.py, specify the custom user model:

```python
AUTH_USER_MODEL = 'myapp.User'
```

## Session Security Considerations

- Use HTTPS: Always use HTTPS in production to encrypt session cookies
- Session Expiry: Set appropriate session expiry times
- Password Validation: Use Django's password validation
- CSRF Protection: Django includes CSRF protection by default
- Secure Cookies: Enable secure cookies in production