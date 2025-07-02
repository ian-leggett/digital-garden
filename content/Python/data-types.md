---
title: "Data Types"
description: "A comprehensive guide to Python's built-in data types including numeric types, collections, and special types with practical examples."
tags:
  - python
  - programming
  - data-types
  - basics
  - reference
date: 2025-06-30
lastmod: 2025-06-30
draft: false
---

# Python Data Types

Python has several built-in data types that are essential for programming. Here's a comprehensive overview of the most commonly used ones.

> [!info] Overview
> Python's type system is dynamic but strong. Variables don't need explicit type declarations, but every value has a specific type that determines what operations can be performed on it.

## Basic Data Types

### 1. Numeric Types

#### Integer (`int`)
- Whole numbers without decimal points
- Can be positive, negative, or zero
- No size limit (only limited by available memory)

```python
age = 25
temperature = -10
big_number = 1000000000000000000000
```

#### Float (`float`)
- Numbers with decimal points
- Uses double precision (64-bit)

```python
price = 19.99
pi = 3.14159
scientific = 1.5e-4  # 0.00015
```

#### Complex (`complex`)
- Numbers with real and imaginary parts
- Format: `a + bj` where `j` is the imaginary unit

```python
z1 = 3 + 4j
z2 = complex(2, -1)  # 2 - 1j
```

### 2. Boolean (`bool`)
- Represents `True` or `False`
- Subclass of `int` (`True` = 1, `False` = 0)

```python
is_active = True
is_complete = False
result = 5 > 3  # True
```

### 3. String (`str`)
- Sequence of characters
- Immutable and ordered
- Created with single, double, or triple quotes

```python
name = "Alice"
message = 'Hello World'
multiline = """This is a
multiline string"""

# String methods
text = "python programming"
print(text.upper())        # PYTHON PROGRAMMING
print(text.capitalize())   # Python programming
print(text.split())        # ['python', 'programming']
```

## Collection Types

### 4. List (`list`)
- Ordered, mutable collection
- Can contain different data types
- Allow duplicates

```python
fruits = ["apple", "banana", "cherry"]
mixed = [1, "hello", 3.14, True]
nested = [[1, 2], [3, 4], [5, 6]]

# Common operations
fruits.append("orange")     # Add item
fruits.remove("banana")     # Remove item
fruits[0] = "grape"        # Modify item
print(len(fruits))         # Get length
```

### 5. Tuple (`tuple`)
- Ordered, immutable collection
- Can contain different data types
- Allow duplicates

```python
coordinates = (10, 20)
colors = ("red", "green", "blue")
single_item = (42,)  # Note the comma for single item

# Tuple unpacking
x, y = coordinates
print(f"x: {x}, y: {y}")  # x: 10, y: 20
```

### 6. Set (`set`)
- Unordered, mutable collection
- No duplicates allowed
- Useful for mathematical operations

```python
unique_numbers = {1, 2, 3, 4, 5}
colors = {"red", "green", "blue"}

# Set operations
set1 = {1, 2, 3}
set2 = {3, 4, 5}
print(set1.union(set2))        # {1, 2, 3, 4, 5}
print(set1.intersection(set2)) # {3}
print(set1.difference(set2))   # {1, 2}
```

### 7. Dictionary (`dict`)
- Unordered, mutable collection of key-value pairs
- Keys must be immutable and unique
- Values can be any data type

```python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}

# Accessing and modifying
print(person["name"])          # Alice
person["age"] = 31            # Update value
person["email"] = "alice@example.com"  # Add new key-value pair

# Dictionary methods
print(person.keys())          # dict_keys(['name', 'age', 'city', 'email'])
print(person.values())        # dict_values(['Alice', 31, 'New York', 'alice@example.com'])
print(person.items())         # dict_items([...])
```

## Special Types

### 8. NoneType (`None`)
- Represents the absence of a value
- Often used as a default value or placeholder

```python
result = None
data = [1, 2, None, 4]

def get_user(user_id):
    if user_id == 1:
        return {"name": "Alice"}
    return None  # User not found
```

## Type Checking and Conversion

### Checking Types
```python
x = 42
print(type(x))              # <class 'int'>
print(isinstance(x, int))   # True
print(isinstance(x, str))   # False
```

### Type Conversion
```python
# String to number
num_str = "123"
num_int = int(num_str)      # 123
num_float = float(num_str)  # 123.0

# Number to string
age = 25
age_str = str(age)          # "25"

# List to tuple and vice versa
my_list = [1, 2, 3]
my_tuple = tuple(my_list)   # (1, 2, 3)
back_to_list = list(my_tuple)  # [1, 2, 3]

# String to list
text = "hello"
char_list = list(text)      # ['h', 'e', 'l', 'l', 'o']
```

## Mutable vs Immutable

> [!warning] Important Concept
> Understanding mutability is crucial for avoiding bugs and writing efficient Python code.

### Immutable Types
- `int`, `float`, `complex`, `bool`, `str`, `tuple`
- Cannot be changed after creation
- Modifying creates a new object

```python
text = "hello"
text_id = id(text)
text = text.upper()  # Creates new string object
print(id(text) != text_id)  # True - different object
```

### Mutable Types
- `list`, `dict`, `set`
- Can be modified in place
- Same object, different content

```python
my_list = [1, 2, 3]
list_id = id(my_list)
my_list.append(4)  # Modifies existing object
print(id(my_list) == list_id)  # True - same object
```

## Quick Reference

> [!tip] Cheat Sheet
> Use this table for quick lookups when choosing the right data type for your needs.

| Type | Mutable | Ordered | Duplicates | Syntax Example |
|------|---------|---------|------------|----------------|
| `int` | No | - | - | `42` |
| `float` | No | - | - | `3.14` |
| `str` | No | Yes | Yes | `"hello"` |
| `list` | Yes | Yes | Yes | `[1, 2, 3]` |
| `tuple` | No | Yes | Yes | `(1, 2, 3)` |
| `set` | Yes | No | No | `{1, 2, 3}` |
| `dict` | Yes | No* | No (keys) | `{"a": 1}` |
| `bool` | No | - | - | `True` |
| `None` | No | - | - | `None` |

*Dictionaries maintain insertion order as of Python 3.7+

## Related Topics

- [[Testing]] - Learn about testing Python code with different data types
- [[Python package management/pip]] - Managing Python packages and dependencies
- [[Virtual environment/venv]] - Setting up isolated Python environments

> [!note] Next Steps
> Once you're comfortable with these basic data types, explore more advanced topics like custom classes, type hints, and data structures from the `collections` module.