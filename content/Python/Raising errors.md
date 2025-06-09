---
title: "Raising Errors"
tags:
  - python
description: ""
date: 2025-05-29
---


Raising a simple value error

```python
height = int(input("Enter you height"))

if height > 100:
	raise ValueError("You can't enter a height greater than 100")
```
