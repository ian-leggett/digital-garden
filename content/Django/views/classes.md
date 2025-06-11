---
title: "Django Class-Based Views"
tags:
  - django
  - python
  - views
  - crud
  - class-based-views
description: "How to implement class-based views in Django for CRUD operations"
date: 2025-06-10
---

# Django Class-Based Views

Django's class-based views (CBVs) provide an object-oriented approach to organizing view logic. They encapsulate common patterns and reduce code duplication for CRUD operations.

## Basic Model Setup

Using our Book/Author example:

```python
# models.py
from django.db import models
from django.urls import reverse

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('author-detail', kwargs={'pk': self.pk})

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    publication_date = models.DateField()
    isbn = models.CharField(max_length=13, unique=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.title
```

## CRUD Operations for Books

### List View (Read multiple objects)

````python
# views.py
from django.views.generic import ListView
from .models import Book

class BookListView(ListView):
    model = Book
    template_name = 'books/book_list.html'
    context_object_name = 'books'
    paginate_by = 10
    
    def get_queryset(self):
        """Customize the queryset"""
        return Book.objects.all().order_by('title')
````

### Detail View (Read a single object)

```python
from django.views.generic import DetailView

class BookDetailView(DetailView):
    model = Book
    template_name = 'books/book_detail.html'
    context_object_name = 'book'
    
    def get_context_data(self, **kwargs):
        """Add additional context"""
        context = super().get_context_data(**kwargs)
        context['related_books'] = Book.objects.filter(
            author=self.object.author
        ).exclude(pk=self.object.pk)[:5]
        return context
```

### Create View

```python
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy
from django.contrib.messages.views import SuccessMessageMixin
from .models import Book
from .forms import BookForm

class BookCreateView(SuccessMessageMixin, CreateView):
    model = Book
    form_class = BookForm
    template_name = 'books/book_form.html'
    success_url = reverse_lazy('book-list')
    success_message = "%(title)s was created successfully"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['action'] = 'Create'
        return context
````

### Update View

```python
from django.views.generic.edit import UpdateView

class BookUpdateView(SuccessMessageMixin, UpdateView):
    model = Book
    form_class = BookForm
    template_name = 'books/book_form.html'
    success_message = "%(title)s was updated successfully"
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['action'] = 'Update'
        return context
```

### Delete View

```python
from django.views.generic.edit import DeleteViewfrom django.views.generic.edit import DeleteView
from django.contrib import messages

class BookDeleteView(DeleteView):
    model = Book
    template_name = 'books/book_confirm_delete.html'
    success_url = reverse_lazy('book-list')
    context_object_name = 'book'
    
    def delete(self, request, *args, **kwargs):
        book = self.get_object()
        messages.success(request, f'Book "{book.title}" was deleted successfully')
        return super().delete(request, *args, **kwargs)
```

### Just inheriting the View class for more control
```python
```python
from django.views import View
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Book
from .forms import BookForm

class BookFormView(View):
    """A view that handles both displaying and processing a form for creating books"""
    
    template_name = 'books/book_form.html'
    
    def get(self, request):
        """Handle GET requests: display a blank form"""
        form = BookForm()
        return render(
            request,
            self.template_name,
            {'form': form, 'action': 'Create'}
        )
    
    def post(self, request):
        """Handle POST requests: process form data"""
        form = BookForm(request.POST)
        
        if form.is_valid():
            # Save the new book
            book = form.save()
            messages.success(
                request, 
                f'Book "{book.title}" was created successfully!'
            )
            return redirect('book-detail', pk=book.pk)
        else:
            # Form is invalid, re-display it
            return render(
                request,
                self.template_name,
                {'form': form, 'action': 'Create'}
            )

```

## URL Configuration

```python
# urls.py# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Book URLs
    path('books/', views.BookListView.as_view(), name='book-list'),
    path('books/<int:pk>/', views.BookDetailView.as_view(), name='book-detail'),
    path('books/create/', views.BookCreateView.as_view(), name='book-create'),
    path('books/<int:pk>/update/', views.BookUpdateView.as_view(), name='book-update'),
    path('books/<int:pk>/delete/', views.BookDeleteView.as_view(), name='book-delete'),
]
```

## JSON Response with Class-Based Views
```python
from django.http import JsonResponse
from django.views import View

class BookAPIView(View):
    def get(self, request, pk=None):
        if pk:
            try:
                book = Book.objects.get(pk=pk)
                data = {
                    'id': book.id,
                    'title': book.title,
                    'author': book.author.name,
                    'isbn': book.isbn,
                    'publication_date': book.publication_date.isoformat()
                }
                return JsonResponse(data)
            except Book.DoesNotExist:
                return JsonResponse({'error': 'Book not found'}, status=404)
        else:
            books = Book.objects.all().order_by('title')[:20]
            data = [{
                'id': book.id,
                'title': book.title,
                'author': book.author.name
            } for book in books]
            return JsonResponse({'books': data})
```

## When to Use Class-Based Views vs. Function-Based Views

### Class-Based Views Are Best For:
- Standard CRUD operations that follow common patterns
- Views that require multiple HTTP method handlers (GET, POST, etc.)
- When you want to use inheritance to share functionality
- Complex views that benefit from mixins

### Function-Based Views Are Best For:
- Simple operations with minimal logic
- One-off views with unique requirements
- When you prefer straightforward procedural code
- When team members are new to Django