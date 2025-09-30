---
title: "Args and Kwargs in Python"
description: "Variable-length arguments and keyword arguments in Python functions"
tags: [python, functions, parameters, arguments]
draft: false
date: 2025-07-18
lastmod: 2025-07-18
---

In Python, `*args` and `**kwargs` are used to pass a variable number of arguments to functions. They allow for more flexible function signatures, enabling developers to create functions that can handle different numbers of positional and keyword arguments.

## Core Concepts

Args (`*args`) and kwargs (`**kwargs`) enable functions to accept variable numbers of arguments, providing flexibility in function design and API development.

- **`*args`**: Collects positional arguments into a tuple
- **`**kwargs`**: Collects keyword arguments into a dictionary
- **Order matters**: `function(positional, *args, **kwargs)`

## Basic Usage

### *args for Variable Positional Arguments

```python
def sum_numbers(*args):
    return sum(args)

# Usage
result = sum_numbers(1, 2, 3, 4, 5)  # Returns 15
print(sum_numbers())  # Returns 0 (empty tuple)
```

### **kwargs for Variable Keyword Arguments

```python
def create_profile(**kwargs):
    profile = {}
    for key, value in kwargs.items():
        profile[key] = value
    return profile

# Usage
user = create_profile(name="Alice", age=30, city="New York")
# Returns: {'name': 'Alice', 'age': 30, 'city': 'New York'}
```

### Combined Usage

```python
def process_data(operation, *args, **kwargs):
    print(f"Operation: {operation}")
    print(f"Args: {args}")
    print(f"Kwargs: {kwargs}")

# Usage
process_data("calculate", 1, 2, 3, method="sum", precision=2)
# Output:
# Operation: calculate
# Args: (1, 2, 3)
# Kwargs: {'method': 'sum', 'precision': 2}
```

## Common Patterns

### Function Decoration and Wrapping

```python
def timing_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function(n):
    time.sleep(n)
    return "Done"
```

### API Method Forwarding

```python
class DatabaseConnection:
    def __init__(self, connection):
        self.connection = connection
    
    def execute(self, query, *args, **kwargs):
        # Forward all arguments to the underlying connection
        return self.connection.execute(query, *args, **kwargs)
```

### Configuration Management

```python
def configure_logger(name, level="INFO", **kwargs):
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    # Handle additional configuration options
    if "filename" in kwargs:
        handler = logging.FileHandler(kwargs["filename"])
        logger.addHandler(handler)
    
    if "format" in kwargs:
        formatter = logging.Formatter(kwargs["format"])
        for handler in logger.handlers:
            handler.setFormatter(formatter)
    
    return logger
```

## Unpacking Arguments

### Unpacking Lists and Tuples with *

```python
def multiply(x, y, z):
    return x * y * z

numbers = [2, 3, 4]
result = multiply(*numbers)  # Equivalent to multiply(2, 3, 4)
```

### Unpacking Dictionaries with **

```python
def greet(name, greeting="Hello", punctuation="!"):
    return f"{greeting} {name}{punctuation}"

params = {"name": "Alice", "greeting": "Hi", "punctuation": "!!!"}
message = greet(**params)  # Equivalent to greet(name="Alice", greeting="Hi", punctuation="!!!")
```

## Advanced Usage

### Argument Validation

```python
def validate_and_process(*args, **kwargs):
    # Validate positional arguments
    if len(args) < 2:
        raise ValueError("At least 2 positional arguments required")
    
    # Validate keyword arguments
    required_keys = {"method", "timeout"}
    missing_keys = required_keys - set(kwargs.keys())
    if missing_keys:
        raise ValueError(f"Missing required parameters: {missing_keys}")
    
    return process_data(*args, **kwargs)
```

### Partial Function Application

```python
from functools import partial

def api_request(endpoint, method="GET", *args, **kwargs):
    # Make API request with given parameters
    return f"{method} {endpoint} with args={args} kwargs={kwargs}"

# Create specialized functions
get_user = partial(api_request, "/users", method="GET")
post_data = partial(api_request, method="POST")

# Usage
user_data = get_user(user_id=123, include_profile=True)
```

## Common Patterns in Libraries

### Class Initialization

```python
class ConfigurableClass:
    def __init__(self, required_param, *args, **kwargs):
        self.required_param = required_param
        self.optional_args = args
        
        # Set default values
        self.debug = kwargs.get("debug", False)
        self.timeout = kwargs.get("timeout", 30)
        
        # Store remaining kwargs for later use
        self.extra_config = {k: v for k, v in kwargs.items() 
                           if k not in ["debug", "timeout"]}
```

### Method Chaining

```python
class QueryBuilder:
    def __init__(self):
        self.conditions = []
    
    def where(self, *conditions, **kwargs):
        self.conditions.extend(conditions)
        for key, value in kwargs.items():
            self.conditions.append(f"{key} = {value}")
        return self
    
    def build(self):
        return " AND ".join(self.conditions)

# Usage
query = QueryBuilder().where("active = true", status="published", category="tech").build()
```

## Performance Considerations

### Argument Unpacking Cost

```python
# More efficient for known arguments
def process_known(a, b, c):
    return a + b + c

# Less efficient due to tuple/dict creation
def process_variable(*args):
    return sum(args)

# Use *args/**kwargs when flexibility is needed, not for performance
```

### Memory Usage

```python
def memory_efficient_processor(*args):
    # Process args iteratively to avoid creating large intermediate collections
    total = 0
    for arg in args:
        total += process_single(arg)
    return total

# Avoid creating large lists from *args unnecessarily
def avoid_this(*args):
    return sum(list(args))  # Unnecessary list creation
```

## Troubleshooting

### Common Errors

```python
# Error: Positional argument after keyword argument
# def wrong_order(**kwargs, *args):  # SyntaxError
def correct_order(*args, **kwargs):
    pass

# Error: Multiple values for argument
def func(a, b):
    pass

# This will raise TypeError
# func(1, 2, a=3)  # Multiple values for argument 'a'
```

### Debugging Tips

```python
def debug_wrapper(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        print(f"  args: {args}")
        print(f"  kwargs: {kwargs}")
        result = func(*args, **kwargs)
        print(f"  result: {result}")
        return result
    return wrapper
```

## Related Topics

- [[functions]] - Basic function definition and usage
- [[decorators]] - Function decoration patterns using *args/**kwargs
- [[data-types]] - Understanding tuples and dictionaries used by args/kwargs