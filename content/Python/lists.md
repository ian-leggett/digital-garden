---
title: "Lists"
description: "Essential guide to Python list operations, methods, and patterns"
tags: [python, data-structures, collections]
draft: false
date: 2025-07-02
lastmod: 2025-07-02
---

# Python Lists
Lists are one of the most versatile and commonly used data structures in Python. They allow you to store ordered collections of items, which can be of mixed types. Lists are mutable, meaning you can change their content after creation.

## Creation and Initialization

```python
# Empty list
numbers = []
names = list()

# With initial values
fruits = ['apple', 'banana', 'cherry']
matrix = [[1, 2], [3, 4]]

# Using comprehensions
squares = [x**2 for x in range(5)]
evens = [x for x in range(10) if x % 2 == 0]
```

## Access and Modification

```python
items = ['a', 'b', 'c', 'd']

# Indexing (0-based)
first = items[0]        # 'a'
last = items[-1]        # 'd'

# Slicing
subset = items[1:3]     # ['b', 'c']
reversed_list = items[::-1]  # ['d', 'c', 'b', 'a']

# Modification
items[0] = 'z'          # ['z', 'b', 'c', 'd']
items[1:3] = ['x', 'y'] # ['z', 'x', 'y', 'd']
```

## Essential Methods

### Adding Elements
```python
items = [1, 2, 3]

items.append(4)         # [1, 2, 3, 4]
items.insert(0, 0)      # [0, 1, 2, 3, 4]
items.extend([5, 6])    # [0, 1, 2, 3, 4, 5, 6]
```

### Removing Elements
```python
items = ['a', 'b', 'c', 'b']

items.remove('b')       # Removes first 'b'
popped = items.pop()    # Removes and returns last item
popped = items.pop(0)   # Removes and returns item at index 0
del items[1]            # Removes item at index 1
items.clear()           # Removes all items
```

### Finding and Counting
```python
items = [1, 2, 3, 2, 4]

index = items.index(2)      # 1 (first occurrence)
count = items.count(2)      # 2
exists = 3 in items         # True
```

### Sorting and Reversing
```python
numbers = [3, 1, 4, 1, 5]

numbers.sort()              # Modifies original: [1, 1, 3, 4, 5]
sorted_copy = sorted(numbers)  # Returns new list
numbers.reverse()           # Modifies original
```

## Common Patterns

### Iteration
```python
items = ['x', 'y', 'z']

# Basic iteration
for item in items:
    print(item)

# With index
for i, item in enumerate(items):
    print(f"{i}: {item}")

# Multiple lists
list1 = [1, 2, 3]
list2 = ['a', 'b', 'c']
for num, letter in zip(list1, list2):
    print(f"{num}: {letter}")
```

### Filtering and Transformation
```python
numbers = [1, 2, 3, 4, 5, 6]

# List comprehensions
evens = [x for x in numbers if x % 2 == 0]
squared = [x**2 for x in numbers]

# Built-in functions
filtered = list(filter(lambda x: x > 3, numbers))  # [4, 5, 6]
mapped = list(map(lambda x: x * 2, numbers))       # [2, 4, 6, 8, 10, 12]
```

### Aggregation
```python
numbers = [1, 2, 3, 4, 5]

total = sum(numbers)        # 15
maximum = max(numbers)      # 5
minimum = min(numbers)      # 1
length = len(numbers)       # 5
all_positive = all(x > 0 for x in numbers)  # True
any_even = any(x % 2 == 0 for x in numbers) # True
```

## Performance Considerations

### Time Complexity
- Access by index: O(1)
- Append: O(1) amortized
- Insert at beginning: O(n)
- Remove by value: O(n)
- Search: O(n)

### Memory Efficiency
```python
# Use generators for large datasets
squares_gen = (x**2 for x in range(1000000))  # Memory efficient

# Preallocate when size is known
result = [None] * 1000  # Better than repeated appends
```

## Common Pitfalls

### Mutable Default Arguments
```python
# Wrong
def add_item(item, items=[]):
    items.append(item)
    return items

# Correct
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### Shallow vs Deep Copy
```python
import copy

original = [[1, 2], [3, 4]]
shallow = original.copy()       # Changes to nested objects affect both
deep = copy.deepcopy(original)  # Complete independence
```

## Related Topics
- [[Python data-types]] - Overview of Python's built-in data types
- [[Python strings]] - String manipulation and methods
- [[Python Package management]] - Managing dependencies for data processing libraries