---
title: "FastAPI Basics"
description: "Essential guide to building APIs with FastAPI"
tags: [fastapi, python, api, web-framework, rest]
draft: false
date: 2025-10-13
lastmod: 2025-10-13
---

## Core Concepts

FastAPI is a modern Python web framework for building APIs. It's fast, easy to use, and includes automatic interactive documentation.

- **Fast**: High performance, on par with NodeJS and Go
- **Type Hints**: Uses Python type hints for validation
- **Auto Docs**: Automatic interactive API documentation
- **Async Support**: Built-in async/await support

## Installation

```bash
# Install FastAPI and uvicorn (ASGI server)
pip install fastapi uvicorn

# Or with uv
uv add fastapi uvicorn
```

## Basic API

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

# Run with: uvicorn main:app --reload
```

## Request Methods

```python
@app.get("/items")
def get_items():
    return {"items": ["item1", "item2"]}

@app.post("/items")
def create_item(name: str, price: float):
    return {"name": name, "price": price}

@app.put("/items/{item_id}")
def update_item(item_id: int, name: str):
    return {"item_id": item_id, "name": name}

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    return {"deleted": item_id}
```

## Request Body with Pydantic

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    description: str = None

@app.post("/items")
def create_item(item: Item):
    return {"name": item.name, "price": item.price}
```

## Query Parameters

```python
@app.get("/items")
def get_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

# Optional parameters
@app.get("/search")
def search(q: str = None):
    if q:
        return {"query": q}
    return {"query": "No query provided"}
```

## Path Parameters

```python
@app.get("/users/{user_id}/items/{item_id}")
def get_user_item(user_id: int, item_id: int):
    return {"user_id": user_id, "item_id": item_id}

# With enum
from enum import Enum

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"

@app.get("/models/{model_name}")
def get_model(model_name: ModelName):
    return {"model_name": model_name}
```

## Response Models

```python
class UserResponse(BaseModel):
    username: str
    email: str

@app.post("/users", response_model=UserResponse)
def create_user(username: str, email: str, password: str):
    # password not included in response
    return {"username": username, "email": email}
```

## Status Codes

```python
from fastapi import status

@app.post("/items", status_code=status.HTTP_201_CREATED)
def create_item(item: Item):
    return item

@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int):
    return None
```

## Error Handling

```python
from fastapi import HTTPException

@app.get("/items/{item_id}")
def get_item(item_id: int):
    if item_id > 100:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"item_id": item_id}
```

## Dependency Injection

```python
from fastapi import Depends

def get_db():
    db = {"connected": True}
    return db

@app.get("/users")
def get_users(db = Depends(get_db)):
    return {"db_status": db["connected"]}
```

## Async Endpoints

```python
@app.get("/async-items")
async def get_async_items():
    await asyncio.sleep(1)
    return {"items": ["item1", "item2"]}
```

## Running the Application

```bash
# Development with auto-reload
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000

# With workers
uvicorn main:app --workers 4
```

## Interactive Documentation

FastAPI automatically generates interactive API docs:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

## Quick Example: Complete API

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# In-memory database
items = {}

class Item(BaseModel):
    name: str
    price: float

@app.get("/")
def root():
    return {"message": "Item API"}

@app.get("/items")
def list_items():
    return items

@app.post("/items/{item_id}")
def create_item(item_id: int, item: Item):
    if item_id in items:
        raise HTTPException(status_code=400, detail="Item exists")
    items[item_id] = item
    return item

@app.get("/items/{item_id}")
def get_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_id]

@app.delete("/items/{item_id}")
def delete_item(item_id: int):
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    del items[item_id]
    return {"deleted": item_id}
```

## Related Topics

- [[asyncio]] - Async programming in Python
- [[pydantic]] - Data validation with Pydantic models
- [[apis]] - REST API design principles