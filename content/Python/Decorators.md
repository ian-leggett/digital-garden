---
title: "Decorators"
tags:
  - python
description: ""
date: 2025-05-29
---


```python
# A simple decorator function
def decorator(func):
  
    def wrapper():
        print("Before calling the function.")
        func()
        print("After calling the function.")
    return wrapper

# Applying the decorator to a function
@decorator

def greet():
    print("Hello, World!")

greet()

# Output
#Before calling the function.
#Hello, World!
#After calling the function.

```

