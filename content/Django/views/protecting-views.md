---
title: "Protecting Django Views"
tags:
  - django
  - python
  - authentication
  - security
  - views
description: "How to restrict access to Django views for authenticated users and permissions"
date: 2025-06-11
---

# Protecting Django Views

Securing views is essential for controlling access to your application's resources. Django provides several built-in methods to protect views based on authentication status and permissions.

## Function-Based View Protection

For function-based views, Django provides decorators that can be applied to restrict access.

### Basic Authentication Check

The simplest way to protect a view is using the `@login_required` decorator:

```python
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def profile_view(request):
    """Only authenticated users can access this view"""
    return render(request, 'accounts/profile.html')
```

By default, this redirects unauthenticated users to settings.LOGIN_URL (typically '/accounts/login/'). You can specify a custom login URL:

```python
@login_required(login_url='/login/')
def profile_view(request):
    return render(request, 'accounts/profile.html')
```

#### Permission-Based Protection
To check for specific permissions:

```python
from django.contrib.auth.decorators import permission_required

@permission_required('app.view_model') # Requires 'view_model' permission 
def restricted_view(request):
    """Only users with 'app.view_model' permission can access this view"""
    return render(request, 'app/restricted.html')
```

You can also specify how to handle unauthorized access:

```python
@permission_required('app.change_model', raise_exception=True)  # Returns 403 Forbidden
def edit_model_view(request, pk):
    # View implementation
    pass
```

#### Multiple Decorators

You can apply multiple decorators for layered protection:

```python
@login_required
@permission_required('app.delete_model')
def delete_model_view(request, pk):
    # View implementation
    pass
```

## Class-Based View Protection

Class-based views use mixins for access control.

### Basic Authentication Check

```python
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

class ProfileView(LoginRequiredMixin, TemplateView):
    """Only authenticated users can access this view"""
    template_name = 'accounts/profile.html'
    login_url = '/login/'  # Optional: custom login URL
    redirect_field_name = 'next'  # Optional: custom redirect field
```
#### Permission-Based Protection

```python
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.views.generic import DetailView
from .models import Project

class ProjectDetailView(PermissionRequiredMixin, DetailView):
    """Only users with specific permissions can access this view"""
    model = Project
    template_name = 'projects/detail.html'
    permission_required = 'projects.view_project'
    # For multiple permissions (must have ALL):
    # permission_required = ('projects.view_project', 'projects.change_project')
```

#### User-Specific Access

```python
from django.views.generic import UpdateView
from django.core.exceptions import PermissionDenied

class ArticleUpdateView(LoginRequiredMixin, UpdateView):
    model = Article
    template_name = 'articles/update.html'
    fields = ['title', 'content']
    
    def dispatch(self, request, *args, **kwargs):
        """Check that the user is the author before proceeding"""
        obj = self.get_object()
        if obj.author != request.user:
            raise PermissionDenied("You are not the author of this article")
        return super().dispatch(request, *args, **kwargs)
```

#### Custom User Test Mixin

Create your own access control mixins for reusable logic:

```python
from django.contrib.auth.mixins import UserPassesTestMixin

class UserIsAuthorMixin(UserPassesTestMixin):
    """Mixin to verify the current user is the author of an object"""
    
    def test_func(self):
        obj = self.get_object()
        return obj.author == self.request.user

class ArticleUpdateView(LoginRequiredMixin, UserIsAuthorMixin, UpdateView):
    model = Article
    template_name = 'articles/update.html'
    fields = ['title', 'content']
    # Raises 403 Forbidden if user is not the author
```

## Best Practices
- Layer your protection: Apply both authentication and permission checks
- Use decorators/mixins consistently: Don't mix protection methods across similar views
- Set proper error responses: Configure how unauthorized access is handled
- Check object-level permissions: Verify user can access specific objects, not just view types
- Test thoroughly: Ensure protection works as expected in all scenarios