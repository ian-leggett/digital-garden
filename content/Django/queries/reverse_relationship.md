---
title: "Django ORM Reverse Relationships"
tags:
  - django
  - python
  - orm
  - database
  - queries
description: "How to use reverse relationships in Django's ORM with practical examples"
date: 2025-06-12
---

# Django ORM Reverse Relationships

Django's ORM makes it easy to navigate from one model to related models using reverse relationships. This guide demonstrates how to use these relationships effectively.

## Basic Model Setup

Let's use the following models for our examples:

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
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    published_date = models.DateField()
    isbn = models.CharField(max_length=13)
    
    def __str__(self):
        return self.title

class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=100)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Review by {self.user_name} for {self.book.title}"
```

## Accessing Related Objects (One-to-Many)

### Default Reverse Relationship

By default, Django creates a reverse relation using the model name in lowercase with _set suffix:

```python
# Get all books by an author
author = Author.objects.get(name="J.K. Rowling")
books = author.book_set.all()

# Print titles of all books by this author
for book in books:
    print(book.title)
```

### Custom Related Name

You can specify a custom name using the related_name parameter:

```python
# Updated model definition
class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(
        Author, 
        on_delete=models.CASCADE,
        related_name='books'  # Custom related name
    )
    # ... other fields ...

# Usage with custom related name
author = Author.objects.get(name="J.K. Rowling")
books = author.books.all()  # Much more intuitive than book_set
```

## Filtering with Reverse Relationships

### Basic Filtering
Find authors who have books published after a certain date:

```python
from django.db.models import Q
import datetime

# Authors with books published after 2020
authors = Author.objects.filter(books__published_date__gt=datetime.date(2020, 1, 1))

# Authors with books containing "Python" in the title
python_authors = Author.objects.filter(books__title__icontains="Python")
```

### Distinct Results
When filtering by related objects, you might get duplicate results. Use distinct() to avoid this:

```python
# Authors who have at least one book with a 5-star review
authors_with_five_star = Author.objects.filter(
    books__review__rating=5
).distinct()
```

## Annotations and Aggregations

Calculate statistics on related objects:

```python
from django.db.models import Count, Avg, Max

# Authors with their book count
authors_with_count = Author.objects.annotate(
    book_count=Count('books')
)

# Get the top 5 most prolific authors
top_authors = authors_with_count.order_by('-book_count')[:5]
for author in top_authors:
    print(f"{author.name} has written {author.book_count} books")

# Get average rating for each book
books_with_avg_rating = Book.objects.annotate(
    avg_rating=Avg('review__rating')
)

# Find the highest-rated book
highest_rated = books_with_avg_rating.order_by('-avg_rating').first()
print(f"Highest rated book: {highest_rated.title} ({highest_rated.avg_rating}/5)")
```

### Prefetching Related Objects
Optimize queries by prefetching related objects:

```python
# Without prefetch (causes N+1 query problem)
authors = Author.objects.all()
for author in authors:
    books = author.books.all()  # New query for each author

# With prefetch (efficient)
authors = Author.objects.prefetch_related('books')
for author in authors:
    books = author.books.all()  # No additional query

# Deeper relationships
authors = Author.objects.prefetch_related('books__review_set')
```

### Multi-level Relationships
Navigate through multiple relationships:

```python
# Find all reviews for books by a specific author
author = Author.objects.get(name="J.K. Rowling")
reviews = Review.objects.filter(book__author=author)

# Get all users who reviewed any of an author's books
user_names = Review.objects.filter(
    book__author__name="J.K. Rowling"
).values_list('user_name', flat=True).distinct()
```

## Many-to-Many Relationships
For many-to-many relationships, the reverse lookup works similarly:

```python
# Adding a many-to-many relationship to our models
class Tag(models.Model):
    name = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name

class Book(models.Model):
    # ... existing fields ...
    tags = models.ManyToManyField(Tag, related_name='books')

# Usage examples
fantasy_tag = Tag.objects.get(name="Fantasy")
fantasy_books = fantasy_tag.books.all()

# Books with multiple specific tags
mystery_and_thriller = Book.objects.filter(
    tags__name__in=["Mystery", "Thriller"]
).distinct()
```

## Practical Use Cases
Finding Orphaned Records
Find authors who haven't published any books:

```python
authors_without_books = Author.objects.filter(books__isnull=True)
```

### Complex Filtering
Find authors who have written both fantasy and sci-fi books:

```python
fantasy_scifi_authors = Author.objects.filter(
    books__tags__name="Fantasy"
).filter(
    books__tags__name="Science Fiction"
).distinct()
```

### Hierarchical Data
For nested relationships like reviews of books by an author:

```python
# Top-rated authors (based on average book ratings)
from django.db.models import Avg, Count

top_authors = Author.objects.annotate(
    avg_book_rating=Avg('books__review__rating'),
    review_count=Count('books__review')
).filter(
    review_count__gt=10  # Only include authors with more than 10 reviews
).order_by('-avg_book_rating')[:10]
```

## Performance Considerations

- Use select_related() and prefetch_related() to minimize database queries
- Add indexes to foreign key fields for better performance
- Use values() or values_list() when you only need specific fields
- Apply distinct() when filtering might return duplicate results
- Reverse relationships are a powerful feature of Django's ORM that allow you to navigate your data model intuitively and efficiently.