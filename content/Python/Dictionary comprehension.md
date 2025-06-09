---
title: "Dictionary Comprehension"
tags:
  - python
description: ""
date: 2025-05-29
---


Create a random score for each student

```python
import random

names = ["peter", "jane", "dave", "henry", "sarah"]

scores = {student.random.randint(1,100) for student in names}

print(scores)
```

