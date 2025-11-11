---
title: "Python Type Hints and Annotations"
description: "Guide to using type hints and annotations for better code clarity and tooling support"
tags: [python, type-hints, annotations, static-typing, mypy]
draft: false
date: 2025-11-11
lastmod: 2025-11-11
---

## Core Concepts

Type hints provide optional static type information to Python code. They improve code readability, enable better IDE support, and help catch errors early.

- **Optional**: Type hints don't affect runtime behavior
- **Documentation**: Makes code intent clear
- **Tooling**: Enables static analysis and better IDE features
- **Gradual Typing**: Add types incrementally to existing code

## Basic Type Annotations

### Simple Types

```python
# Basic type annotations
name: str = "Alice"
age: int = 30
price: float = 99.99
is_active: bool = True

# Function annotations
def greet(name: str) -> str:
    return f"Hello, {name}!"

def add_numbers(x: int, y: int) -> int:
    return x + y

# No return value
def print_message(message: str) -> None:
    print(message)
```

### Variable Annotations

```python
# Variable annotations without assignment
name: str
age: int
scores: list

# Later assignment
name = "Bob"
age = 25
scores = [85, 92, 78]

# Class attributes
class User:
    name: str
    age: int
    
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
```

## Collection Types

### Lists and Dictionaries

```python
from typing import List, Dict, Tuple, Set

# Generic collections
names: List[str] = ["Alice", "Bob", "Charlie"]
ages: Dict[str, int] = {"Alice": 30, "Bob": 25}
coordinates: Tuple[float, float] = (10.5, 20.3)
tags: Set[str] = {"python", "programming"}

# Function with collection types
def process_scores(scores: List[int]) -> float:
    return sum(scores) / len(scores)

def get_user_info(users: Dict[str, int]) -> List[str]:
    return [name for name, age in users.items() if age >= 18]
```

### Modern Generic Syntax (Python 3.9+)

```python
# Python 3.9+ built-in generics
names: list[str] = ["Alice", "Bob"]
ages: dict[str, int] = {"Alice": 30}
coordinates: tuple[float, float] = (10.5, 20.3)

def process_items(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}
```

## Optional and Union Types

### Optional Types

```python
from typing import Optional

# Optional is shorthand for Union[Type, None]
def find_user(user_id: int) -> Optional[str]:
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)

# Equivalent using Union
from typing import Union

def find_user_alt(user_id: int) -> Union[str, None]:
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)

# Modern syntax (Python 3.10+)
def find_user_modern(user_id: int) -> str | None:
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)
```

### Union Types

```python
from typing import Union

# Multiple possible types
def process_id(user_id: Union[int, str]) -> str:
    return str(user_id)

# Modern syntax (Python 3.10+)
def process_id_modern(user_id: int | str) -> str:
    return str(user_id)

# Multiple return types
def divide(x: float, y: float) -> Union[float, str]:
    if y == 0:
        return "Cannot divide by zero"
    return x / y
```

## Function Annotations

### Advanced Function Types

```python
from typing import Callable, Any

# Function that takes a function as parameter
def apply_operation(x: int, y: int, operation: Callable[[int, int], int]) -> int:
    return operation(x, y)

def add(a: int, b: int) -> int:
    return a + b

result = apply_operation(5, 3, add)  # 8

# Function with *args and **kwargs
def process_data(*args: int, **kwargs: str) -> Dict[str, Any]:
    return {
        "args_sum": sum(args),
        "kwargs": kwargs
    }
```

### Overloaded Functions

```python
from typing import overload

@overload
def process(x: int) -> int: ...

@overload
def process(x: str) -> str: ...

def process(x):
    if isinstance(x, int):
        return x * 2
    elif isinstance(x, str):
        return x.upper()
    else:
        raise TypeError("Unsupported type")
```

## Class Annotations

### Class Type Hints

```python
from typing import ClassVar, List

class User:
    # Class variable
    total_users: ClassVar[int] = 0
    
    # Instance variables
    def __init__(self, name: str, age: int):
        self.name: str = name
        self.age: int = age
        self.friends: List[str] = []
        User.total_users += 1
    
    def add_friend(self, friend: str) -> None:
        self.friends.append(friend)
    
    def get_info(self) -> Dict[str, Union[str, int]]:
        return {"name": self.name, "age": self.age}
```

### Generic Classes

```python
from typing import TypeVar, Generic

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: List[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
    
    def pop(self) -> T:
        return self._items.pop()
    
    def is_empty(self) -> bool:
        return len(self._items) == 0

# Usage
int_stack: Stack[int] = Stack()
int_stack.push(1)
int_stack.push(2)

str_stack: Stack[str] = Stack()
str_stack.push("hello")
str_stack.push("world")
```

## Protocol and Structural Typing

### Protocol Definition

```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None:
        print("Drawing a circle")

class Rectangle:
    def draw(self) -> None:
        print("Drawing a rectangle")

def render_shape(shape: Drawable) -> None:
    shape.draw()

# Both Circle and Rectangle implement the Drawable protocol
render_shape(Circle())
render_shape(Rectangle())
```

## Type Aliases

### Creating Type Aliases

```python
from typing import Dict, List, Tuple

# Simple aliases
UserId = int
UserName = str
Score = float

# Complex aliases
UserData = Dict[str, Union[str, int, bool]]
Coordinates = Tuple[float, float]
ScoreBoard = Dict[UserId, Score]

# Using aliases
def create_user(user_id: UserId, name: UserName) -> UserData:
    return {
        "id": user_id,
        "name": name,
        "active": True
    }

def update_scores(scores: ScoreBoard, user_id: UserId, score: Score) -> None:
    scores[user_id] = score
```

### NewType for Distinct Types

```python
from typing import NewType

# Create distinct types
UserId = NewType('UserId', int)
ProductId = NewType('ProductId', int)

def get_user(user_id: UserId) -> str:
    return f"User {user_id}"

def get_product(product_id: ProductId) -> str:
    return f"Product {product_id}"

# Usage
user_id = UserId(123)
product_id = ProductId(456)

get_user(user_id)      # OK
get_product(product_id)  # OK
# get_user(product_id)   # Type checker will warn
```

## Literal Types

```python
from typing import Literal

# Constrain values to specific literals
def set_mode(mode: Literal["read", "write", "append"]) -> None:
    print(f"Mode set to: {mode}")

# Usage
set_mode("read")    # OK
set_mode("write")   # OK
# set_mode("delete")  # Type checker will warn

# With multiple types
def process_data(data: str, format: Literal["json", "xml", "csv"]) -> Dict[str, Any]:
    if format == "json":
        import json
        return json.loads(data)
    # ... handle other formats
```

## Type Checking

### Using mypy

```bash
# Install mypy
pip install mypy

# Check file
mypy my_script.py

# Check with strict mode
mypy --strict my_script.py

# Configuration in mypy.ini
[mypy]
python_version = 3.9
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
```

### Type Ignoring

```python
# Ignore type checking for specific line
result = some_untyped_function()  # type: ignore

# Ignore with comment
result = some_untyped_function()  # type: ignore[call-arg]

# Ignore for entire file
# mypy: ignore-errors
```

## Runtime Type Checking

### Using isinstance()

```python
from typing import Union

def process_value(value: Union[int, str]) -> str:
    if isinstance(value, int):
        # Type checker knows value is int here
        return str(value * 2)
    elif isinstance(value, str):
        # Type checker knows value is str here
        return value.upper()
    else:
        # This should never happen with proper typing
        raise TypeError("Unexpected type")
```

### Type Guards

```python
from typing import TypeGuard

def is_string_list(val: List[Any]) -> TypeGuard[List[str]]:
    return all(isinstance(x, str) for x in val)

def process_strings(items: List[Any]) -> None:
    if is_string_list(items):
        # Type checker knows items is List[str] here
        for item in items:
            print(item.upper())  # No type error
```

## Best Practices

### Gradual Typing

```python
# Start with critical functions
def calculate_tax(amount: float, rate: float) -> float:
    return amount * rate

# Add types to public APIs
class APIClient:
    def get_user(self, user_id: int) -> Dict[str, Any]:
        # Implementation
        pass

# Use Any for complex untyped code initially
from typing import Any

def legacy_function(data: Any) -> Any:
    # Complex legacy code
    return processed_data
```

### Documentation Integration

```python
def calculate_distance(
    point1: Tuple[float, float], 
    point2: Tuple[float, float]
) -> float:
    """
    Calculate Euclidean distance between two points.
    
    Args:
        point1: First point as (x, y) coordinates
        point2: Second point as (x, y) coordinates
    
    Returns:
        Distance between the points
    """
    x1, y1 = point1
    x2, y2 = point2
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
```

## Common Patterns

### Factory Functions

```python
from typing import TypeVar, Type

T = TypeVar('T')

def create_instance(cls: Type[T], *args, **kwargs) -> T:
    return cls(*args, **kwargs)

# Usage
user = create_instance(User, "Alice", 30)
# Type checker knows user is of type User
```

### Configuration with TypedDict

```python
from typing import TypedDict

class UserConfig(TypedDict):
    name: str
    age: int
    email: str
    active: bool

def process_config(config: UserConfig) -> None:
    print(f"Processing user: {config['name']}")
    # Type checker validates dictionary structure

# Usage
config: UserConfig = {
    "name": "Alice",
    "age": 30,
    "email": "alice@example.com",
    "active": True
}
process_config(config)
```

## Related Topics

- [[pydantic]] - Runtime data validation using type hints
- [[dataclasses]] - Structured data classes with type annotations
- [[functions]] - Function definition and parameter handling
