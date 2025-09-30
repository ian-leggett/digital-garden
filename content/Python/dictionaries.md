---
title: "Dictionaries"
description: "Essential guide to Python dictionary operations, methods, and patterns"
tags: [python, data-structures, key-value, mapping]
draft: false
date: 2025-07-02
lastmod: 2025-07-02
---

Dictionaries are one of the most powerful and flexible data structures in Python. They allow you to store key-value pairs, making it easy to look up values based on unique keys. This guide covers the essential operations, methods, and patterns for working with dictionaries in Python.

## Creation and Initialization

```python
# Empty dictionary
data = {}
data = dict()

# With initial values
person = {'name': 'Alice', 'age': 30, 'city': 'NYC'}
scores = dict(math=95, science=87, english=92)

# From sequences
keys = ['a', 'b', 'c']
values = [1, 2, 3]
mapping = dict(zip(keys, values))  # {'a': 1, 'b': 2, 'c': 3}

# Dictionary comprehension
squares = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

## Access and Modification

```python
data = {'name': 'Bob', 'age': 25}

# Access values
name = data['name']           # 'Bob' (raises KeyError if missing)
age = data.get('age')         # 25
height = data.get('height', 170)  # 170 (default value)

# Check existence
has_name = 'name' in data     # True
has_height = 'height' in data # False

# Modify values
data['age'] = 26              # Update existing
data['city'] = 'LA'           # Add new key
```

## Essential Methods

### Adding and Updating
```python
data = {'a': 1, 'b': 2}

# Update single values
data['c'] = 3                 # {'a': 1, 'b': 2, 'c': 3}
data.setdefault('d', 4)       # Adds only if key doesn't exist

# Update multiple values
data.update({'e': 5, 'f': 6})
data.update(g=7, h=8)         # Keyword arguments
```

### Removing Items
```python
data = {'a': 1, 'b': 2, 'c': 3}

# Remove and return value
value = data.pop('a')         # Returns 1, removes 'a'
value = data.pop('z', 0)      # Returns 0 (default) if 'z' not found

# Remove last inserted item (Python 3.7+)
key, value = data.popitem()

# Remove without returning
del data['b']                 # Raises KeyError if missing
data.clear()                  # Remove all items
```

### Accessing Keys, Values, and Items
```python
data = {'name': 'Alice', 'age': 30, 'city': 'NYC'}

keys = list(data.keys())      # ['name', 'age', 'city']
values = list(data.values())  # ['Alice', 30, 'NYC']
items = list(data.items())    # [('name', 'Alice'), ('age', 30), ('city', 'NYC')]
```

## Common Patterns

### Iteration
```python
data = {'a': 1, 'b': 2, 'c': 3}

# Iterate over keys
for key in data:
    print(key)

# Iterate over values
for value in data.values():
    print(value)

# Iterate over key-value pairs
for key, value in data.items():
    print(f"{key}: {value}")
```

### Safe Access and Defaults
```python
from collections import defaultdict

# Using get() with defaults
count = data.get('count', 0) + 1

# Using defaultdict
word_count = defaultdict(int)
for word in ['apple', 'banana', 'apple']:
    word_count[word] += 1  # No KeyError, defaults to 0

# Using setdefault for nested structures
nested = {}
nested.setdefault('users', []).append('alice')
```

### Filtering and Transformation
```python
data = {'a': 1, 'b': 2, 'c': 3, 'd': 4}

# Dictionary comprehensions
evens = {k: v for k, v in data.items() if v % 2 == 0}  # {'b': 2, 'd': 4}
squared = {k: v**2 for k, v in data.items()}           # {'a': 1, 'b': 4, 'c': 9, 'd': 16}

# Filter keys or values
filtered_keys = {k: v for k, v in data.items() if k in ['a', 'c']}
```

### Merging Dictionaries
```python
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}
dict3 = {'b': 20, 'e': 5}

# Python 3.9+ (dict union)
merged = dict1 | dict2        # {'a': 1, 'b': 2, 'c': 3, 'd': 4}
dict1 |= dict3                # In-place update

# Python 3.5+ (unpacking)
merged = {**dict1, **dict2, **dict3}

# Traditional method
merged = dict1.copy()
merged.update(dict2)
merged.update(dict3)
```

## Advanced Operations

### Nested Dictionary Access
```python
data = {
    'user': {
        'name': 'Alice',
        'profile': {
            'age': 30,
            'location': 'NYC'
        }
    }
}

# Safe nested access
age = data.get('user', {}).get('profile', {}).get('age')

# Using dict.get() chain
def get_nested(d, *keys):
    for key in keys:
        d = d.get(key, {})
    return d

age = get_nested(data, 'user', 'profile', 'age')
```

### Grouping and Aggregation
```python
from collections import defaultdict

# Group by category
items = [
    {'name': 'apple', 'category': 'fruit'},
    {'name': 'carrot', 'category': 'vegetable'},
    {'name': 'banana', 'category': 'fruit'}
]

grouped = defaultdict(list)
for item in items:
    grouped[item['category']].append(item['name'])

# Count occurrences
from collections import Counter
words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'banana']
counts = Counter(words)  # Counter({'banana': 3, 'apple': 2, 'cherry': 1})
```

## Performance Considerations

### Time Complexity
- Access/Insert/Delete: O(1) average case
- Worst case (hash collisions): O(n)
- Memory overhead: ~3x compared to lists

### Best Practices
```python
# Use dict comprehensions for better performance
result = {k: expensive_function(k) for k in keys}

# Avoid repeated key lookups
if key in data:
    value = data[key]  # Two lookups
    
# Better
try:
    value = data[key]  # One lookup
except KeyError:
    # handle missing key
    pass

# Or use get() for defaults
value = data.get(key, default_value)
```

## Common Pitfalls

### Modifying During Iteration
```python
data = {'a': 1, 'b': 2, 'c': 3}

# Wrong - modifies dict during iteration
for key in data:
    if data[key] % 2 == 0:
        del data[key]  # RuntimeError

# Correct - iterate over copy
for key in list(data.keys()):
    if data[key] % 2 == 0:
        del data[key]
```

### Mutable Values
```python
# Shared mutable values
default_config = {'options': []}
user1_config = default_config.copy()  # Shallow copy!
user1_config['options'].append('debug')  # Affects default_config too

# Correct - deep copy when needed
import copy
user1_config = copy.deepcopy(default_config)
```

## Related Topics
- [[Python lists]] - Working with ordered collections
- [[Python data-types]] - Overview of Python's built-in data types
- [[Python strings]] - String manipulation and formatting