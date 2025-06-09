---
title: "Views"
tags:
  - django
description: ""
date: 2025-05-29
---

# Django Views: Essential Guide

## What are Django Views?
Django views handle HTTP requests and return HTTP responses. They contain the logic that processes user requests and renders the appropriate templates or returns data.

## Example Form Class
```python
# forms.py
from django import forms
from .models import Book, Author

class BookForm(forms.ModelForm):
    # Custom field not in the model
    notify_author = forms.BooleanField(required=False, initial=False, 
                                      help_text="Send notification email to the author")
    
    # Override a model field to customize
    published_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date'})
    )
    
    # Custom validation
    def clean_title(self):
        title = self.cleaned_data.get('title')
        if title and len(title) < 3:
            raise forms.ValidationError("Title must be at least 3 characters long")
        return title.strip()
    
    # Custom validation across fields
    def clean(self):
        cleaned_data = super().clean()
        published_date = cleaned_data.get('published_date')
        is_available = cleaned_data.get('is_available')
        
        # Logic validation example
        if published_date and is_available is False:
            self.add_error('is_available', 
                         "Published books should be marked as available")
        
        return cleaned_data
    
    class Meta:
        model = Book
        fields = ['title', 'author', 'published_date', 'description', 
                 'genre', 'isbn', 'price', 'is_available']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'genre': forms.Select(),
        }
        labels = {
            'isbn': 'ISBN Number',
            'is_available': 'In Stock',
        }
        help_texts = {
            'price': 'Enter price in USD',
            'isbn': '13-digit ISBN number without dashes',
        }
```

## Function-Based Views (FBVs)
```python
# views.py
from django.shortcuts import render, get_object_or_404, redirect
from .models import Book
from .forms import BookForm

def book_list(request):
    books = Book.objects.all()
    return render(request, 'books/book_list.html', {'books': books})

def book_detail(request, id):
    book = get_object_or_404(Book, id=id)
    return render(request, 'books/book_detail.html', {'book': book})

def book_create(request):
    if request.method == 'POST':
        form = BookForm(request.POST)
        if form.is_valid():
            book = form.save()
            return redirect('book_detail', id=book.id)
    else:
        form = BookForm()
    
    return render(request, 'books/book_form.html', {'form': form})
```

## Class-Based Views (CBVs)
```python
# views.py
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Book, Author
from .forms import BookForm

# READ operations
class BookListView(ListView):
    model = Book
    template_name = 'books/book_list.html'
    context_object_name = 'books'
    paginate_by = 10
    
    def get_queryset(self):
        # Filter books by query parameters
        queryset = Book.objects.filter(is_available=True)
        
        # Search functionality
        search_query = self.request.GET.get('search', '')
        if search_query:
            queryset = queryset.filter(title__icontains=search_query)
            
        # Filter by genre
        genre = self.request.GET.get('genre', '')
        if genre:
            queryset = queryset.filter(genre=genre)
            
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['genres'] = Book.GENRE_CHOICES
        context['search_query'] = self.request.GET.get('search', '')
        return context

class BookDetailView(DetailView):
    model = Book
    template_name = 'books/book_detail.html'
    context_object_name = 'book'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Get related books by same author
        context['related_books'] = Book.objects.filter(
            author=self.object.author
        ).exclude(pk=self.object.pk)[:4]
        return context

# CREATE operation
class BookCreateView(LoginRequiredMixin, CreateView):
    model = Book
    form_class = BookForm
    template_name = 'books/book_form.html'
    login_url = '/login/'
    
    def form_valid(self, form):
        # Set the current user as author if using User model
        # form.instance.user = self.request.user
        return super().form_valid(form)
    
    def get_success_url(self):
        return reverse_lazy('book_detail', kwargs={'pk': self.object.pk})
    
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        # Add extra data to form
        # kwargs['user'] = self.request.user
        return kwargs

# UPDATE operation
class BookUpdateView(LoginRequiredMixin, UpdateView):
    model = Book
    form_class = BookForm
    template_name = 'books/book_form.html'
    
    def get_success_url(self):
        return reverse_lazy('book_detail', kwargs={'pk': self.object.pk})
    
    def form_valid(self, form):
        # You can perform additional actions before saving
        form.instance.updated_by = self.request.user.username
        return super().form_valid(form)
    
    def get_queryset(self):
        # Limit which objects can be updated
        # For example, only allow users to edit their own books
        # return Book.objects.filter(author__user=self.request.user)
        return Book.objects.all()

# DELETE operation
class BookDeleteView(LoginRequiredMixin, DeleteView):
    model = Book
    template_name = 'books/book_confirm_delete.html'
    success_url = reverse_lazy('book_list')
    
    def delete(self, request, *args, **kwargs):
        # Custom logic before deletion
        book = self.get_object()
        # Log deletion or perform other actions
        # models.DeletionLog.objects.create(
        #     content_object=book,
        #     deleted_by=request.user.username
        # )
        return super().delete(request, *args, **kwargs)
    
    def get_queryset(self):
        # Limit which objects can be deleted
        # return Book.objects.filter(author__user=self.request.user)
        return Book.objects.all()

# Multiple models in a single view
class AuthorBooksView(DetailView):
    model = Author
    template_name = 'books/author_detail.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['books'] = self.object.books.all()
        return context
```

## Connecting URLs to Views
```python
# urls.py
from django.urls import path
from . import views

# For Function-Based Views
urlpatterns = [
    path('books/', views.book_list, name='book_list'),
    path('books/<int:id>/', views.book_detail, name='book_detail'),
    path('books/create/', views.book_create, name='book_create'),
]

# For Class-Based Views
urlpatterns = [
    path('books/', views.BookListView.as_view(), name='book_list'),
    path('books/<int:pk>/', views.BookDetailView.as_view(), name='book_detail'),
    path('books/create/', views.BookCreateView.as_view(), name='book_create'),
    path('books/<int:pk>/update/', views.BookUpdateView.as_view(), name='book_update'),
    path('books/<int:pk>/delete/', views.BookDeleteView.as_view(), name='book_delete'),
]
```

## Context Data
```python
# Function-Based Views
def book_list(request):
    context = {
        'books': Book.objects.all(),
        'total_books': Book.objects.count(),
        'page_title': 'Book List'
    }
    return render(request, 'books/book_list.html', context)

# Class-Based Views
class BookListView(ListView):
    model = Book
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_books'] = self.get_queryset().count()
        context['page_title'] = 'Book List'
        return context
```

## HTTP Methods and Request Handling
```python
def book_edit(request, id):
    book = get_object_or_404(Book, id=id)
    
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            form.save()
            return redirect('book_detail', id=book.id)
    else:
        form = BookForm(instance=book)
    
    return render(request, 'books/book_form.html', {'form': form})
```

## Custom Mixins for CBVs
```python
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin

class AuthorRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        book = self.get_object()
        return self.request.user == book.author.user

class BookUpdateView(LoginRequiredMixin, AuthorRequiredMixin, UpdateView):
    model = Book
    form_class = BookForm
    login_url = '/login/'  # Redirect if not logged in
```

## API Views
```python
from django.http import JsonResponse

def book_api(request, id):
    book = get_object_or_404(Book, id=id)
    data = {
        'id': book.id,
        'title': book.title,
        'author': book.author.name,
        'published_date': book.published_date.isoformat(),
        'is_available': book.is_available
    }
    return JsonResponse(data)

# With Django REST Framework
from rest_framework import viewsets
from .serializers import BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
```

## Decorators for Function-Based Views
```python
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.http import require_http_methods, require_POST
from django.views.decorators.cache import cache_page

@login_required(login_url='/login/')
def profile(request):
    return render(request, 'profile.html')

@permission_required('books.add_book')
def book_create(request):
    # Only users with book creation permission can access
    # ...

@require_http_methods(["GET", "POST"])
def book_edit(request, id):
    # Only GET and POST methods allowed
    # ...

@require_POST
def book_delete(request, id):
    # Only POST method allowed
    # ...

@cache_page(60 * 15)  # Cache for 15 minutes
def book_list(request):
    # Result will be cached
    # ...
```

## Best Practices
1. Use CBVs for standard CRUD operations
2. Use FBVs for complex custom logic
3. Keep views focused on a single responsibility
4. Reuse code with mixins and decorators
5. Properly handle form validation
6. Use get_object_or_404 to handle missing objects
7. Add appropriate authentication and permissions
8. Use Django's built-in security features

This guide covers the essentials for working with Django views.