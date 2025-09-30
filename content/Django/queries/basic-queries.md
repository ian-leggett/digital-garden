---
title: "Basic queries in Django"
tags:
  - django
description: ""
date: 2025-05-29
---

Django's ORM allows you to interact with your database using Python code instead of raw SQL. Here are some common query operations you can perform using Django's QuerySet API.

### Filter by string match 

```bash
SomeTable.objects.filter(memorable_name__contains="some_string").first()
```

### Filter by exact match

```bash
SomeTable.objects.filter(field_name="value")
```

### Filter by case-insensitive match`

```bash
SomeTable.objects.filter(field_name__iexact="value")
```

### Filter by greater than or less than

```bash
SomeTable.objects.filter(age__gt=18)
SomeTable.objects.filter(age__lt=65)
```

### Filter by date range

```bash
from datetime import date
SomeTable.objects.filter(created_at__range=[date(2024, 1, 1), date(2024, 12, 31)])
```

### Order results

```bash
SomeTable.objects.order_by('-created_at')  # Descending
SomeTable.objects.order_by('created_at')   # Ascending
```

### Get distinct values

```bash
SomeTable.objects.values('field_name').distinct()
```

### Count results

```bash
SomeTable.objects.filter(active=True).count()
```

### Exclude results

```bash
SomeTable.objects.exclude(status='inactive')
```

### Get or create an object

```bash
obj, created = SomeTable.objects.get_or_create(field_name="value")
```

### Update or create an object

```bash
obj, created = SomeTable.objects.update_or_create(
    field_name="value",
    defaults={"other_field": "new_value"}
)
```
