---
title: "Typing"
description: "Type annotations and static type checking in Python"
tags: [python, typing, type-hints, mypy]
draft: false
date: 2025-12-17
lastmod: 2025-12-17
---

## Overview

Python's `typing` module provides runtime support for type hints, enabling static type checking and improving code clarity. While Python remains dynamically typed at runtime, type hints serve as documentation and enable tools like `mypy` to catch type-related errors.

## Core Type Hints

### Basic Types

```python
from typing import List, Dict, Set, Tuple, Optional, Union

# Collections
names: List[str] = ["Alice", "Bob"]
scores: Dict[str, int] = {"Alice": 95, "Bob": 87}
unique_ids: Set[int] = {1, 2, 3}
coordinates: Tuple[float, float] = (10.5, 20.3)

# Optional and Union
user_id: Optional[int] = None  # Same as Union[int, None]
result: Union[int, str] = 42  # Can be either int or str
```

### Function Annotations

```python
def process_data(items: List[int], multiplier: float = 1.0) -> List[float]:
    return [item * multiplier for item in items]

def fetch_user(user_id: int) -> Optional[Dict[str, str]]:
    # Returns user dict or None if not found
    return None
```

## Advanced Type Features

### Generic Types

```python
from typing import TypeVar, Generic, List

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        self.items: List[T] = []
    
    def push(self, item: T) -> None:
        self.items.append(item)
    
    def pop(self) -> T:
        return self.items.pop()

# Usage
int_stack: Stack[int] = Stack()
str_stack: Stack[str] = Stack()
```

### Type Aliases

```python
from typing import List, Dict, Tuple

# Simple aliases
UserId = int
UserData = Dict[str, str]

# Complex aliases
Coordinates = Tuple[float, float]
UserMap = Dict[UserId, UserData]

def get_user(user_id: UserId) -> UserData:
    return {"name": "Alice", "email": "alice@example.com"}
```

### Callable Types

```python
from typing import Callable

# Function that takes (int, int) and returns int
Calculator = Callable[[int, int], int]

def apply_operation(x: int, y: int, operation: Calculator) -> int:
    return operation(x, y)

def add(a: int, b: int) -> int:
    return a + b

result = apply_operation(5, 3, add)
```

## Modern Python Typing (3.9+)

### Built-in Generic Types

```python
# Python 3.9+ allows lowercase built-in types
def process_items(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

coordinates: tuple[float, float] = (1.5, 2.5)
user_ids: set[int] = {1, 2, 3}
```

### Union Operator (3.10+)

```python
# Python 3.10+ union syntax
def get_value(key: str) -> int | str | None:
    return None

# Instead of Union[int, str, None]
result: int | str = 42
```

## Protocol and Structural Subtyping

```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None:
        ...

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

class Square:
    def draw(self) -> None:
        print("Drawing square")

def render(shape: Drawable) -> None:
    shape.draw()

# Works without explicit inheritance
render(Circle())
render(Square())
```

## Type Narrowing

### Using isinstance

```python
from typing import Union

def process_value(value: Union[int, str]) -> str:
    if isinstance(value, int):
        # Type checker knows value is int here
        return str(value * 2)
    else:
        # Type checker knows value is str here
        return value.upper()
```

### TypeGuard

```python
from typing import TypeGuard, List, Union

def is_string_list(items: List[Union[int, str]]) -> TypeGuard[List[str]]:
    return all(isinstance(item, str) for item in items)

data: List[Union[int, str]] = ["a", "b", "c"]
if is_string_list(data):
    # Type checker knows data is List[str] here
    result = [s.upper() for s in data]
```

## Common Patterns

### Class Attributes

```python
from typing import ClassVar

class Config:
    # Class variable shared across instances
    app_name: ClassVar[str] = "MyApp"
    
    # Instance variable
    instance_id: int
    
    def __init__(self, instance_id: int) -> None:
        self.instance_id = instance_id
```

### Overload

```python
from typing import overload, Union

@overload
def process(value: int) -> str: ...

@overload
def process(value: str) -> int: ...

def process(value: Union[int, str]) -> Union[str, int]:
    if isinstance(value, int):
        return str(value)
    return len(value)
```

### Literal Types

```python
from typing import Literal

Mode = Literal["read", "write", "append"]

def open_file(filename: str, mode: Mode) -> None:
    # mode must be one of the literal values
    pass

open_file("data.txt", "read")  # OK
open_file("data.txt", "delete")  # Type error
```

## Type Checking Tools

### Running mypy

```bash
# Install mypy
pip install mypy

# Check single file
mypy script.py

# Check entire project
mypy src/

# With configuration
mypy --strict src/
```

### mypy Configuration

```ini
# mypy.ini or setup.cfg
[mypy]
python_version = 3.10
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
```

## Common Pitfalls

### Mutable Default Arguments

```python
from typing import List, Optional

# Avoid
def bad_append(item: str, items: List[str] = []) -> List[str]:
    items.append(item)
    return items

# Correct
def good_append(item: str, items: Optional[List[str]] = None) -> List[str]:
    if items is None:
        items = []
    items.append(item)
    return items
```

### Forward References

```python
from __future__ import annotations

class Node:
    def __init__(self, value: int, next: Node | None = None) -> None:
        self.value = value
        self.next = next
```

## Related Topics

- [[type-hints]] - Basic type annotation syntax
- [[object-orientated-programming]] - Using types with classes
- [mypy Documentation](https://mypy.readthedocs.io/) - Official type checker docs
