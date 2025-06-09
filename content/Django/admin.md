---
title: "Admin"
tags:
  - django
description: ""
date: 2025-05-29
---

# Django Admin: Model Registration Guide

## Basic Registration
The simplest way to register a model with the Django admin:

```python
# myapp/admin.py
from django.contrib import admin
from .models import Book, Author

# Simple registration
admin.site.register(Book)
admin.site.register(Author)
```

## Custom ModelAdmin
Create a ModelAdmin class for more control:

```python
from django.contrib import admin
from .models import Book

class BookAdmin(admin.ModelAdmin):
    # Display columns in the change list
    list_display = ('title', 'author', 'published_date', 'is_available')
    
    # Filters in the right sidebar
    list_filter = ('is_available', 'genre', 'published_date')
    
    # Search configuration
    search_fields = ('title', 'author__name', 'isbn')
    
    # Fields to display when editing
    fields = ('title', 'author', 'published_date', 'description', 'genre', 'price')
    
    # Readonly fields for view/edit pages
    readonly_fields = ('created_at', 'updated_at')
    
    # Prepopulate the slug field based on the title
    prepopulated_fields = {'slug': ('title',)}

# Register with the custom admin class
admin.site.register(Book, BookAdmin)
```

## Using the @register Decorator
A more concise way to register models:

```python
from django.contrib import admin
from .models import Book, Author

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published_date')
    search_fields = ('title', 'isbn')

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'email')
```

## Customizing the Admin Interface
Common customization options:

```python
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    # Change list customization
    list_display = ('title', 'author', 'published_date', 'price')
    list_display_links = ('title',)  # Clickable fields
    list_editable = ('price',)       # Edit directly in the list
    list_per_page = 25               # Items per page
    
    # Fieldsets for organizing fields in groups
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'author', 'slug', 'published_date')
        }),
        ('Details', {
            'fields': ('description', 'genre', 'isbn', 'page_count')
        }),
        ('Pricing', {
            'fields': ('price', 'is_available')
        }),
    )
    
    # Add custom actions
    actions = ['mark_as_available', 'mark_as_unavailable']
    
    def mark_as_available(self, request, queryset):
        queryset.update(is_available=True)
    mark_as_available.short_description = "Mark selected books as available"
    
    def mark_as_unavailable(self, request, queryset):
        queryset.update(is_available=False)
    mark_as_unavailable.short_description = "Mark selected books as unavailable"
```

## Inline Models
Display related models on the same page:

```python
from django.contrib import admin
from .models import Author, Book

class BookInline(admin.TabularInline):  # or admin.StackedInline
    model = Book
    extra = 1  # Number of empty forms to display
    fields = ('title', 'published_date', 'price')

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'email')
    inlines = [BookInline]
```

## Admin Site Customization
Customize the overall admin site:

```python
# myproject/admin.py
from django.contrib import admin

# Customize admin site header, title and index title
admin.site.site_header = "Book Store Admin"
admin.site.site_title = "Book Store Admin Portal"
admin.site.index_title = "Welcome to Book Store Admin Portal"
```

## Best Practices
1. Always create custom ModelAdmin classes for complex models
2. Use fieldsets to organize fields logically
3. Configure list_display for useful column display
4. Add search_fields for quicker record finding
5. Use list_filter for common filtering operations
6. Add custom actions for batch operations
7. Use inlines for related model editing
8. Set up readonly_fields for auto-generated fields

This guide covers the essentials for working with Django's admin model registration.