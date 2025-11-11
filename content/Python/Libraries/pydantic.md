---
title: "Pydantic Data Validation"
description: "Data validation and settings management using Python type hints with Pydantic"
tags: [python, pydantic, validation, data-models, type-hints]
draft: false
date: 2025-11-11
lastmod: 2025-11-11
---

## Core Concepts

Pydantic uses Python type hints to validate data and provide helpful error messages. It's the foundation for FastAPI and many other Python libraries.

- **Type Safety**: Automatic data validation using type hints
- **JSON Serialization**: Easy conversion to/from JSON
- **Error Handling**: Clear validation error messages
- **Performance**: Fast validation with optional C extensions

## Installation

```bash
# Basic installation
pip install pydantic

# With email validation
pip install pydantic[email]

# Or with uv
uv add pydantic
```

## Basic Models

### Simple Model

```python
from pydantic import BaseModel

class User(BaseModel):
    name: str
    age: int
    email: str

# Create instance
user = User(name="Alice", age=30, email="alice@example.com")
print(user.name)  # Alice
print(user.age)   # 30
```

### Automatic Type Conversion

```python
# Pydantic converts compatible types
user = User(name="Bob", age="25", email="bob@example.com")
print(user.age)        # 25 (converted from string to int)
print(type(user.age))  # <class 'int'>
```

### Validation Errors

```python
from pydantic import ValidationError

try:
    user = User(name="Charlie", age="invalid", email="bad-email")
except ValidationError as e:
    print(e.json())  # JSON formatted errors
```

## Field Types

### Common Field Types

```python
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class Product(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    tags: List[str] = []
    created_at: datetime
    is_active: bool = True

# Usage
product = Product(
    name="Laptop",
    price=999.99,
    tags=["electronics", "computers"],
    created_at="2025-11-11T10:00:00"  # Auto-converted to datetime
)
```

### Enum Fields

```python
from enum import Enum
from pydantic import BaseModel

class Status(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"

class Order(BaseModel):
    id: int
    status: Status
    amount: float

order = Order(id=1, status="active", amount=100.0)
print(order.status)  # Status.ACTIVE
```

## Field Validation

### Field Constraints

```python
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    age: int = Field(ge=0, le=120)  # ge = greater equal, le = less equal
    email: str = Field(regex=r'^[^@]+@[^@]+\.[^@]+$')
    score: float = Field(gt=0, lt=100)  # gt = greater than, lt = less than

# Valid user
user = User(name="Alice", age=30, email="alice@example.com", score=85.5)
```

### Custom Validators

```python
from pydantic import BaseModel, validator

class User(BaseModel):
    name: str
    password: str

    @validator('name')
    def name_must_be_title_case(cls, v):
        if not v.istitle():
            raise ValueError('Name must be title case')
        return v

    @validator('password')
    def password_must_be_strong(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v

user = User(name="Alice", password="secretpassword123")
```

## JSON Handling

### To JSON

```python
user = User(name="Alice", age=30, email="alice@example.com")

# Convert to dictionary
user_dict = user.dict()
print(user_dict)

# Convert to JSON string
user_json = user.json()
print(user_json)
```

### From JSON

```python
# From dictionary
user_data = {"name": "Bob", "age": 25, "email": "bob@example.com"}
user = User(**user_data)

# From JSON string
json_str = '{"name": "Charlie", "age": 35, "email": "charlie@example.com"}'
user = User.parse_raw(json_str)

# From file
# user = User.parse_file('user.json')
```

## Nested Models

```python
class Address(BaseModel):
    street: str
    city: str
    country: str = "US"

class User(BaseModel):
    name: str
    age: int
    address: Address

# Create nested model
user = User(
    name="Alice",
    age=30,
    address={
        "street": "123 Main St",
        "city": "New York"
    }
)

print(user.address.city)  # New York
```

## Lists and Optional Fields

```python
from typing import List, Optional

class Team(BaseModel):
    name: str
    members: List[User]
    leader: Optional[User] = None
    tags: List[str] = []

# Create team
team = Team(
    name="Development",
    members=[
        {"name": "Alice", "age": 30, "email": "alice@example.com"},
        {"name": "Bob", "age": 25, "email": "bob@example.com"}
    ]
)
```

## Configuration

```python
class User(BaseModel):
    name: str
    email: str
    
    class Config:
        # Convert camelCase to snake_case
        alias_generator = lambda field_name: field_name.replace('_', '')
        
        # Allow field population by name or alias
        allow_population_by_field_name = True
        
        # Extra fields validation
        extra = "forbid"  # "allow", "ignore", or "forbid"

# Usage with camelCase
user = User(name="Alice", email="alice@example.com")
```

## Real-World Examples

### API Response Model

```python
from typing import List, Optional
from datetime import datetime

class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class UserResponse(APIResponse):
    data: User

# Usage
response = UserResponse(
    success=True,
    message="User created successfully",
    data={"name": "Alice", "age": 30, "email": "alice@example.com"}
)
```

### Database Model

```python
from typing import Optional
from datetime import datetime

class DatabaseModel(BaseModel):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class User(DatabaseModel):
    name: str
    email: str
    is_active: bool = True

# Convert to dict for database insert
user = User(name="Alice", email="alice@example.com")
db_data = user.dict(exclude={'id', 'created_at', 'updated_at'})
```

### Settings Management

```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    app_name: str = "My App"
    debug: bool = False
    database_url: str
    secret_key: str

    class Config:
        env_file = ".env"

# Loads from environment variables or .env file
settings = Settings()
```

## FastAPI Integration

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class CreateUser(BaseModel):
    name: str
    email: str
    age: int

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

@app.post("/users", response_model=UserResponse)
def create_user(user: CreateUser):
    # Pydantic automatically validates request body
    # and serializes response
    return UserResponse(
        id=1,
        name=user.name,
        email=user.email
    )
```

## Error Handling

```python
from pydantic import ValidationError

def safe_user_creation(user_data: dict):
    try:
        user = User(**user_data)
        return user
    except ValidationError as e:
        for error in e.errors():
            print(f"Field: {error['loc']}")
            print(f"Message: {error['msg']}")
            print(f"Type: {error['type']}")
        return None

# Invalid data
result = safe_user_creation({
    "name": "",
    "age": -5,
    "email": "invalid-email"
})
```

## Common Patterns

### Data Transfer Objects (DTO)

```python
class CreateUserDTO(BaseModel):
    name: str
    email: str
    password: str

class UpdateUserDTO(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None

class UserResponseDTO(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    
    class Config:
        orm_mode = True  # For SQLAlchemy integration
```

### Partial Updates

```python
def update_user(user_id: int, updates: UpdateUserDTO):
    # Only update fields that are provided
    update_data = updates.dict(exclude_unset=True)
    
    # Apply updates to existing user
    for field, value in update_data.items():
        setattr(existing_user, field, value)
```

## Performance Tips

```python
# Use model_validate for better performance
user_data = {"name": "Alice", "age": 30, "email": "alice@example.com"}
user = User.model_validate(user_data)

# Exclude fields during serialization
user_dict = user.dict(exclude={"password"})

# Include only specific fields
user_dict = user.dict(include={"name", "email"})
```

## Related Topics

- [[fastapi]] - Web framework that uses Pydantic
- [[data-types]] - Python type system and hints
- [[json]] - Working with JSON data in Python
