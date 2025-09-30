---
title: "Django Custom Template Filters"
tags:
  - django
  - python
  - templates
  - filters
description: "How to create and use custom template filters in Django"
date: 2025-06-12
---

Template filters are a powerful way to transform and format data directly in your Django templates. While Django provides many built-in filters, you can create custom ones to handle specific formatting needs for your application.

## Setting Up Custom Filters

First, create a `templatetags` package in your Django app:

```markdown
myapp/ ├── init.py ├── models.py ├── views.py ├── templatetags/ │ ├── init.py │ └── custom_filters.py
```

## Basic Custom Filter Example

Here's a simple custom filter that converts a price to a formatted currency string:

```python
# myapp/templatetags/custom_filters.py
from django import template
from decimal import Decimal

register = template.Library()

@register.filter(name='currency')
def currency(value):
    """
    Format a number as currency with dollar sign and two decimal places
    
    Usage: {{ product.price|currency }}
    """
    try:
        value = float(value)
        return f"${value:.2f}"
    except (ValueError, TypeError):
        return ""
```

Usage in template:

```django
{% load custom_filters %}
<p>Regular price: {{ product.price|currency }}</p>
```
## Filter with Arguments
Filters can also accept arguments to customize their behavior:

```python
@register.filter(name='discount')
def discount(price, percent):
    """
    Apply a percentage discount to a price
    
    Usage: {{ product.price|discount:20 }}
    """
    try:
        price = float(price)
        percent = float(percent)
        discounted = price * (1 - percent/100)
        return f"${discounted:.2f}"
    except (ValueError, TypeError):
        return ""
```

Usage in template:

```django
{% load custom_filters %}

<p>Regular price: {{ product.price|currency }}</p>
<p>Sale price (20% off): {{ product.price|discount:20 }}</p>
```

## Date Formatting Filter

```python
@register.filter(name='smart_date')
def smart_date(date_value):
    """
    Format date in a user-friendly way:
    - Today: "Today at 3:45 PM"
    - Yesterday: "Yesterday at 3:45 PM"
    - This year: "June 15 at 3:45 PM"
    - Other years: "June 15, 2024 at 3:45 PM"
    
    Usage: {{ post.created_at|smart_date }}
    """
    from django.utils import timezone
    import datetime
    
    if not date_value:
        return ""
    
    now = timezone.now()
    date_value = timezone.localtime(date_value)
    
    # Today
    if date_value.date() == now.date():
        return f"Today at {date_value.strftime('%I:%M %p')}"
    
    # Yesterday
    yesterday = now.date() - datetime.timedelta(days=1)
    if date_value.date() == yesterday:
        return f"Yesterday at {date_value.strftime('%I:%M %p')}"
    
    # This year
    if date_value.year == now.year:
        return f"{date_value.strftime('%B %d')} at {date_value.strftime('%I:%M %p')}"
    
    # Other years
    return f"{date_value.strftime('%B %d, %Y')} at {date_value.strftime('%I:%M %p')}"
```