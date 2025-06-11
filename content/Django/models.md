---
title: "Models"
tags:
  - django
description: ""
date: 2025-05-29
---

# Django Models

## What is a Model?
A Django model is a Python class that defines a database table structure, with each attribute representing a database field.

## Basic Models with Relationships
```python
from django.db import models
from django.utils.text import slugify

class Author(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    bio = models.TextField(blank=True)
    birth_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # This `__str__` method defines the string representation of a Django model instance.
    # When Django needs to display this model object (in the admin interface, console output, etc.),
    # it will use the value of the `name` field as the string representation.
    # This makes the object more readable in the Django admin and when debugging.
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']  # Default ordering by name
        verbose_name_plural = 'Authors'  # Display name in admin

class Book(models.Model):
    GENRE_CHOICES = [
        ('FICTION', 'Fiction'),
        ('NON_FICTION', 'Non-Fiction'),
        ('SCI_FI', 'Science Fiction'),
        ('FANTASY', 'Fantasy'),
        ('MYSTERY', 'Mystery'),
        ('OTHER', 'Other'),
    ]
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    published_date = models.DateField()
    description = models.TextField(blank=True)
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES, default='FICTION')
    price = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Set when created
    updated_at = models.DateTimeField(auto_now=True)      # Updated on save
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def is_new_release(self):
        """Check if the book was published in the last 30 days"""
        from datetime import date, timedelta
        return date.today() - self.published_date <= timedelta(days=30)
```

## Most Used Field Types
- `CharField`: For text with limited length (requires `max_length`)
- `TextField`: For longer text content
- `IntegerField`: For integer values
- `DateField`/`DateTimeField`: For dates/timestamps
- `BooleanField`: For True/False values
- `EmailField`: For storing emails with validation
- `ForeignKey`: For many-to-one relationships

## Common Field Options
```python
models.CharField(
    max_length=100,          # Required for CharField
    null=True,               # Allow NULL in database
    blank=True,              # Allow blank in forms
    default='Default value', # Default value
    unique=True              # Must be unique
)
```

## Relationships
```python
# Many-to-One (ForeignKey)
author = models.ForeignKey(
    'Author',
    on_delete=models.CASCADE  # Delete books when author is deleted
)

# Many-to-Many
categories = models.ManyToManyField('Category')

# One-to-One
details = models.OneToOneField('BookDetails', on_delete=models.CASCADE)
```

## Meta Options (Common)
```python
class Book(models.Model):
    # fields here...
    
    class Meta:
        ordering = ['-published_date']  # Default ordering
        verbose_name_plural = 'Books'   # Display name in admin
```

## Quick Tips
1. Always include a `__str__` method
2. Use related_name for reverse relationships
3. Choose appropriate on_delete behavior for ForeignKeys
4. Use custom methods for business logic
5. Create base abstract classes for common fields

This guide covers the essentials for working with Django models.