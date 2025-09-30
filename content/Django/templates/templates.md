---
title: "Django Template Functions and Request Methods"
tags:
  - django
  - python
  - templates
  - request
description: "Useful template functions and request methods in Django"
date: 2025-06-12
---

This guide covers practical template functions and request-related methods commonly used in Django templates.

## Template Tags and Filters

### Basic Template Tags

```django
{# Variables #}
{{ variable }}
{{ object.attribute }}
{{ dictionary.key }}
{{ list.0 }}  {# Access the first item in a list #}

{# Conditional statements #}
{% if user.is_authenticated %}
    Hello, {{ user.username }}!
{% elif user.is_anonymous %}
    Please log in.
{% else %}
    Welcome, guest!
{% endif %}

{# For loops #}
{% for item in items %}
    {{ forloop.counter }}: {{ item.name }}
    {% empty %}
    No items found.
{% endfor %}

{# Include other templates #}
{% include "path/to/template.html" %}

{# Template inheritance #}
{% extends "base.html" %}

{% block content %}
    Page-specific content here
{% endblock %}
```

### Useful Built-in Filters

```django
{# String manipulation #}
{{ value|length }}  {# Get length of string #}
{{ value|default:"Default Value" }}  {# Default value if empty #}
{{ value|default_if_none:"Default Value" }}  {# Default if None #}
{{ value|escape }}  {# Escape HTML characters #}
{{ value|linebreaks }}  {# Convert newlines to <p> tags #}

{# String formatting #}
{{ value|lower }}  {# Convert to lowercase #}
{{ value|upper }}  {# Convert to uppercase #}
{{ value|title }}  {# Titlecase #}
{{ value|capfirst }}  {# Capitalize first letter #}
{{ value|truncatechars:50 }}  {# Truncate to 50 chars #}
{{ value|truncatewords:10 }}  {# Truncate to 10 words #}
{{ value|slugify }}  {# Convert to slug #}

{# Dates and times #}
{{ date|date:"Y-m-d" }}  {# Format date #}
{{ date|time:"H:i" }}  {# Format time #}
{{ date|timesince }}  {# Time since date #}
{{ date|timeuntil }}  {# Time until date #}

{# HTML and URLs #}
{{ value|safe }}  {# Mark as safe HTML #}
{{ value|escape }}  {# Escape HTML #}
{{ value|linebreaks }}  {# Convert newlines to <p> tags #}
{{ value|urlize }}  {# Convert URLs to clickable links #}
{{ value|truncatechars_html:100 }}  {# Truncate HTML content #}

{# Numbers #}
{{ value|floatformat:2 }}  {# Format with 2 decimal places #}
{{ value|add:10 }}  {# Add 10 to value #}
{{ value|pluralize }}  {# Add 's' if value != 1 #}
{{ value|pluralize:"y,ies" }}  {# Custom pluralization #}

{# Lists and Dicts #}
{{ value|join:", " }}  {# Join list items with commas #}
{{ value|length }}  {# Get length #}
{{ value|dictsort:"name" }}  {# Sort dict by key #}
{{ value|first }}  {# Get first item #}
{{ value|last }}  {# Get last item #}
```

## Request Methods in Templates

The request object is automatically available in templates when using Django's RequestContext.

```django
{# User information #}
{{ request.user.username }}
{{ request.user.email }}
{{ request.user.is_authenticated }}
{{ request.user.is_staff }}

{# Request path and URL #}
{{ request.path }}  {# Current path, e.g., "/products/42/" #}
{{ request.get_full_path }}  {# Path with query string #}
{{ request.build_absolute_uri }}  {# Full URL with domain #}

{# HTTP methods and headers #}
{{ request.method }}  {# "GET", "POST", etc. #}
{{ request.is_secure }}  {# True if HTTPS #}
{{ request.is_ajax }}  {# True if X-Requested-With header is XMLHttpRequest #}

{# Query parameters #}
{{ request.GET.param_name }}
{{ request.GET.search }}  {# Get the "search" query parameter #}
{{ request.GET.urlencode }}  {# URL-encoded query string #}
```

## Common Template Patterns

### Active Navigation Links

```django
<a href="{% url 'home' %}" class="{% if request.path == '/' %}active{% endif %}">Home</a>
<a href="{% url 'about' %}" class="{% if request.path == '/about/' %}active{% endif %}">About</a>
```
### Query String Manipulation

```django
{# Preserve all query params except page #}
<a href="?{% for key, value in request.GET.items %}{% if key != 'page' %}{{ key }}={{ value }}&{% endif %}{% endfor %}page=1">First</a>

{# Add or replace a query parameter #}
<a href="?{{ request.GET.urlencode }}&sort=price">Sort by Price</a>
```

### Form with CSRF Protection

```django
<form method="post" action="{% url 'contact' %}">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Send</button>
</form>
```
### Conditional Classes

```django
<div class="alert {% if message.level == 40 %}alert-error{% elif message.level == 30 %}alert-warning{% else %}alert-info{% endif %}">
    {{ message }}
</div>
```

### Paginated Results

```django
{% if is_paginated %}
<div class="pagination">
    {% if page_obj.has_previous %}
        <a href="?page={{ page_obj.previous_page_number }}">Previous</a>
    {% endif %}
    
    <span class="current">
        Page {{ page_obj.number }} of {{ page_obj.paginator.num_pages }}
    </span>
    
    {% if page_obj.has_next %}
        <a href="?page={{ page_obj.next_page_number }}">Next</a>
    {% endif %}
</div>
{% endif %}
```

