---
title: "Urls"
tags:
  - django
description: ""
date: 2025-05-29
---

## What are Django URLs?
Django URLs map URL patterns to view functions, determining what content is displayed when a user visits a specific URL in your application.

## Basic URL Configuration
```python
# myproject/urls.py (project-level URLs)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('books/', include('books.urls')),
    path('', include('core.urls')),
]

# books/urls.py (app-level URLs)
from django.urls import path
from . import views

urlpatterns = [
    path('', views.book_list, name='book_list'),
    path('<int:id>/', views.book_detail, name='book_detail'),
    path('create/', views.book_create, name='book_create'),
    path('<int:id>/update/', views.book_update, name='book_update'),
    path('<int:id>/delete/', views.book_delete, name='book_delete'),
]
```

## URL Patterns with Parameters
```python
# Capturing URL parameters
path('books/<int:id>/', views.book_detail),             # Captures an integer
path('books/<str:slug>/', views.book_detail_by_slug),   # Captures a string
path('books/<uuid:id>/', views.book_detail_by_uuid),    # Captures a UUID
path('books/<slug:slug>/', views.book_detail_by_slug),  # Captures a slug
path('archive/<int:year>/<int:month>/', views.archive), # Multiple parameters
```

## Path Converters
- `int`: Matches integers
- `str`: Matches any non-empty string, excluding '/'
- `slug`: Matches slug strings (letters, numbers, hyphens, underscores)
- `uuid`: Matches UUID strings
- `path`: Matches any non-empty string, including '/'

## URL Naming and Namespaces
```python
# books/urls.py
from django.urls import path
from . import views

app_name = 'books'  # Set the namespace

urlpatterns = [
    path('', views.book_list, name='list'),
    path('<int:id>/', views.book_detail, name='detail'),
]

# In a template:
# {% url 'books:list' %}  -> /books/
# {% url 'books:detail' id=1 %}  -> /books/1/
```

## Reversing URLs in Python Code
```python
from django.urls import reverse, reverse_lazy

# In a view function
def some_view(request):
    # Generates: '/books/1/'
    url = reverse('books:detail', kwargs={'id': 1})
    # OR
    url = reverse('books:detail', args=[1])
    return redirect(url)

# For class-based views (useful in attributes)
class BookCreateView(CreateView):
    model = Book
    success_url = reverse_lazy('books:list')
```

## URL Patterns with Regular Expressions
```python
# Using re_path for more complex patterns
from django.urls import path, re_path

urlpatterns = [
    path('books/', views.book_list),
    re_path(r'^books/(?P<isbn>\d{13})/$', views.book_by_isbn),
]
```

## Including URLs from Other Apps
```python
# myproject/urls.py
from django.urls import path, include

urlpatterns = [
    path('books/', include('books.urls')),
    path('authors/', include('authors.urls')),
    # Include with a prefix
    path('api/v1/', include('api.urls')),
]
```

## Best Practices
1. Use app-specific URL configurations
2. Always name your URL patterns
3. Use namespaces to avoid name collisions
4. Use appropriate path converters
5. Keep URLs clean and meaningful
6. Create RESTful URL patterns

This guide covers the essentials for working with Django URLs.