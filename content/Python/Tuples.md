---
title: "Tuples"
tags:
  - python
description: ""
date: 2025-05-29
---

# Python Tuples

Tuples are immutable sequences in Python, often used to store collections of items that should not change.

## Creating a Tuple
```python
t = (1, 2, 3)
empty = ()
single = (1,)  # Note the comma for a single-element tuple
```

## Accessing Elements
```python
t = (10, 20, 30)
print(t[0])  # 10
print(t[-1]) # 30
```

## Tuple Unpacking
```python
t = (1, 2, 3)
a, b, c = t  # a=1, b=2, c=3
```

## Immutability
Tuples cannot be changed after creation:
```python
t = (1, 2, 3)
# t[0] = 10  # Raises TypeError
```

## Useful Tuple Methods
```python
t = (1, 2, 2, 3)
t.count(2)   # 2
t.index(3)   # 3
```

## When to Use Tuples
- When you need an immutable sequence
- As keys in dictionaries (if all elements are hashable)
- For returning multiple values from a function

## Example: Returning Multiple Values
```python
def min_max(nums):
    return (min(nums), max(nums))

result = min_max([1, 2, 3])  # (1, 3)
```

See the [Python documentation](https://docs.python.org/3/tutorial/datastructures.html#tuples-and-sequences) for more details.