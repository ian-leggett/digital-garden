---
title: "Annotated"
description: "Adding metadata to type hints with Annotated"
tags: [python, typing, annotated, type-hints, metadata]
draft: false
date: 2025-12-17
lastmod: 2025-12-17
---

## Overview

`Annotated` allows attaching metadata to type hints without affecting runtime type checking. The metadata can be used by validation libraries, documentation generators, or any tools that inspect type annotations.

```python
from typing import Annotated

# Type with metadata
UserId = Annotated[int, "Unique user identifier"]
```

## Basic Usage

### Adding Metadata

```python
from typing import Annotated

# Simple metadata
Username = Annotated[str, "Must be alphanumeric"]
Age = Annotated[int, "Must be between 0 and 150"]

# Multiple metadata items
Email = Annotated[str, "Valid email format", "Lowercase only"]

def create_user(
    username: Username,
    age: Age,
    email: Email
) -> None:
    pass
```

### Runtime Access

```python
from typing import Annotated, get_type_hints, get_args

UserId = Annotated[int, "Primary key", "Auto-increment"]

# Get annotations
hints = get_type_hints(create_user, include_extras=True)
# Returns: {'username': Annotated[str, ...], ...}

# Extract metadata
args = get_args(UserId)
# Returns: (int, 'Primary key', 'Auto-increment')
```

## Common Patterns

### Validation Constraints

```python
from typing import Annotated

# Pydantic-style constraints
PositiveInt = Annotated[int, "gt=0"]
BoundedStr = Annotated[str, "min_length=3", "max_length=50"]
EmailStr = Annotated[str, "format=email"]

# Custom constraint objects
class Range:
    def __init__(self, min_val: int, max_val: int):
        self.min = min_val
        self.max = max_val

Score = Annotated[int, Range(0, 100)]
```

### Documentation Metadata

```python
from typing import Annotated

class Doc:
    def __init__(self, description: str):
        self.description = description

UserId = Annotated[int, Doc("Unique identifier for user accounts")]
Timestamp = Annotated[float, Doc("Unix timestamp in seconds")]

def fetch_user(
    user_id: UserId,
    created_after: Timestamp
) -> dict:
    """Metadata available for auto-generated API docs"""
    pass
```

### FastAPI Integration

```python
from typing import Annotated
from fastapi import FastAPI, Query, Path, Body

app = FastAPI()

@app.get("/users/{user_id}")
def get_user(
    user_id: Annotated[int, Path(gt=0, description="User ID")],
    include_posts: Annotated[bool, Query(description="Include user posts")] = False
) -> dict:
    return {"user_id": user_id, "include_posts": include_posts}
```

### Pydantic v2 Usage

```python
from typing import Annotated
from pydantic import BaseModel, Field, StringConstraints

class User(BaseModel):
    username: Annotated[str, StringConstraints(min_length=3, max_length=50)]
    age: Annotated[int, Field(ge=0, le=150)]
    email: Annotated[str, Field(pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')]

user = User(username="alice", age=30, email="alice@example.com")
```

## Advanced Patterns

### Custom Validators

```python
from typing import Annotated, Any, get_type_hints, get_args

class Validator:
    def validate(self, value: Any) -> bool:
        raise NotImplementedError

class PositiveValidator(Validator):
    def validate(self, value: int) -> bool:
        return value > 0

def validate_args(func):
    hints = get_type_hints(func, include_extras=True)
    
    def wrapper(*args, **kwargs):
        # Extract and apply validators from Annotated metadata
        for arg_name, hint in hints.items():
            if hasattr(hint, '__metadata__'):
                validators = [m for m in hint.__metadata__ if isinstance(m, Validator)]
                # Apply validation logic
        return func(*args, **kwargs)
    
    return wrapper

@validate_args
def process_score(score: Annotated[int, PositiveValidator()]) -> None:
    pass
```

### Type Narrowing

```python
from typing import Annotated, Literal

# Combine with other type features
Status = Literal["active", "inactive", "pending"]
UserStatus = Annotated[Status, "Current user account status"]

# With unions
from typing import Union

Result = Annotated[Union[int, str], "Processing result"]
```

### Nested Annotations

```python
from typing import Annotated, List, Dict

# Annotated containers
UserIds = Annotated[List[int], "List of unique user IDs"]
Config = Annotated[Dict[str, str], "Application configuration"]

# Nested metadata
Matrix = Annotated[
    List[List[float]], 
    "2D matrix",
    "Must be rectangular"
]
```

## Inspecting Metadata

### Extracting Type and Metadata

```python
from typing import Annotated, get_origin, get_args

UserId = Annotated[int, "Primary key", "Auto-increment"]

# Get the actual type
origin = get_origin(UserId)  # typing.Annotated
args = get_args(UserId)  # (int, 'Primary key', 'Auto-increment')

base_type = args[0]  # int
metadata = args[1:]  # ('Primary key', 'Auto-increment')
```

### Type Checking

```python
from typing import Annotated, get_origin

def is_annotated(hint) -> bool:
    return get_origin(hint) is Annotated

UserId = Annotated[int, "metadata"]
assert is_annotated(UserId)  # True
assert not is_annotated(int)  # False
```

## Best Practices

### Clear Metadata Purpose

```python
from typing import Annotated

# Good: Specific, actionable metadata
UserId = Annotated[int, "Unique identifier, positive integer"]
Email = Annotated[str, "RFC 5322 compliant email address"]

# Avoid: Vague or redundant
Value = Annotated[int, "An integer"]  # Too vague
Name = Annotated[str, "A string"]  # Redundant
```

### Reusable Annotations

```python
from typing import Annotated

# Define once, reuse across codebase
PositiveInt = Annotated[int, "Must be positive"]
NonEmptyStr = Annotated[str, "Cannot be empty"]

class User:
    id: PositiveInt
    username: NonEmptyStr
    age: PositiveInt

def create_user(id: PositiveInt, username: NonEmptyStr) -> None:
    pass
```

### Backward Compatibility

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from typing import Annotated
else:
    try:
        from typing import Annotated
    except ImportError:
        # Fallback for Python < 3.9
        from typing_extensions import Annotated
```

## Common Use Cases

### API Documentation

Frameworks like FastAPI automatically extract metadata for OpenAPI schema generation:

```python
from typing import Annotated
from fastapi import Query

@app.get("/search")
def search(
    query: Annotated[str, Query(min_length=3, description="Search term")],
    limit: Annotated[int, Query(ge=1, le=100)] = 10
) -> list:
    pass
```

### Data Validation

Pydantic uses metadata for runtime validation:

```python
from typing import Annotated
from pydantic import BaseModel, Field

class Product(BaseModel):
    price: Annotated[float, Field(gt=0, description="Price in USD")]
    quantity: Annotated[int, Field(ge=0)]
```

### Custom Serialization

```python
from typing import Annotated
from datetime import datetime

class SerializeAs:
    def __init__(self, format: str):
        self.format = format

Timestamp = Annotated[datetime, SerializeAs("iso8601")]
DateOnly = Annotated[datetime, SerializeAs("yyyy-mm-dd")]
```

## Related Topics

- [[typing]] - Core Python type system
- [[type-hints]] - Basic type annotation syntax
- [PEP 593](https://peps.python.org/pep-0593/) - Annotated specification
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Usage in web frameworks
