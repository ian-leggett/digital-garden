---
title: "Django Function-Based Views"
tags:
  - django
  - python
  - views
  - crud
description: "How to implement function-based views in Django for CRUD operations"
date: 2025-06-10
---

# Django Function-Based Views

Function-based views (FBVs) are the simplest way to implement request handlers in Django. This guide demonstrates how to implement CRUD (Create, Read, Update, Delete) operations using function-based views with a Book/Author example.

## Basic View Structure

A function-based view in Django:
1. Takes an `HttpRequest` object as its first parameter
2. Returns an `HttpResponse` object
3. Can be decorated with various decorators for added functionality

## Setting Up Models

First, let's define our models:

```python
# models.py
from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    publication_date = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.title
```

### CRUD Operations for Books

#### Create a Book

```python
# views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Book
from .forms import BookForm

def book_create(request):
    if request.method == 'POST':
        form = BookForm(request.POST)
        if form.is_valid():
            book = form.save()
            messages.success(request, f'Book "{book.title}" has been created successfully!')
            return redirect('book_detail', pk=book.pk)
    else:
        form = BookForm()
    
    return render(request, 'books/book_form.html', {'form': form, 'action': 'Create'})
````

#### Read a book

```python
# List view
def book_list(request):
    books = Book.objects.all().order_by('title')
    return render(request, 'books/book_list.html', {'books': books})

# Detail view
def book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        messages.error(request, 'Book not found')
        return redirect('book_list')
    
    return render(request, 'books/book_detail.html', {'book': book})
````

#### Update a book

```python
def book_update(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        messages.error(request, 'Book not found')
        return redirect('book_list')
    
    if request.method == 'POST':
        form = BookForm(request.POST, instance=book)
        if form.is_valid():
            form.save()
            messages.success(request, f'Book "{book.title}" has been updated successfully!')
            return redirect('book_detail', pk=book.pk)
    else:
        form = BookForm(instance=book)
    
    return render(request, 'books/book_form.html', {'form': form, 'book': book, 'action': 'Update'})

````

#### Delete a book

```python
def book_delete(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        messages.error(request, 'Book not found')
        return redirect('book_list')
    
    if request.method == 'POST':
        book.delete()
        messages.success(request, f'Book "{book.title}" has been deleted successfully!')
        return redirect('book_list')
    
    return render(request, 'books/book_confirm_delete.html', {'book': book})

```

## URL Configuration
```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Book URLs
    path('books/', views.book_list, name='book_list'),
    path('books/create/', views.book_create, name='book_create'),
    path('books/<int:pk>/', views.book_detail, name='book_detail'),
    path('books/<int:pk>/update/', views.book_update, name='book_update'),
    path('books/<int:pk>/delete/', views.book_delete, name='book_delete'),
    
    # Similar patterns for Author views
]
```

## Search Functionality
````python
def book_search(request):
    query = request.GET.get('q', '')
    if query:
        results = Book.objects.filter(
            Q(title__icontains=query) | 
            Q(author__name__icontains=query) |
            Q(isbn__icontains=query)
        ).distinct()
    else:
        results = Book.objects.none()
    
    return render(request, 'books/search_results.html', {
        'results': results,
        'query': query
    })
````

## Best Practices for Function-Based Views

- **Keep views concise**: Each view should focus on a single responsibility
- **Use decorators**: Use Django's built-in decorators like `@login_required` to add functionality
- **Handle errors gracefully**: Use try/except blocks to handle not-found errors
- **Validate data**: Always validate form data before saving
- **Use messages framework**: Provide feedback to users with Django's messages framework
- **Redirect after POST**: Always redirect after successful form submission to prevent duplicate submissions

## Commonly Used Decorators
````python
from django.contrib.auth.decorators import login_required, permission_required

@login_required
def book_create(request):
    # Only logged-in users can access this view
    # ...

@permission_required('books.add_book')
def book_create(request):
    # Only users with specific permissions can access this view
    # ...
    ````