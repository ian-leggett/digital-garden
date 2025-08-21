---
title: "Python Errors and Exceptions"
description: "Exception handling, custom exceptions, and error management patterns in Python"
tags: [python, exceptions, error-handling, debugging]
draft: false
date: 2025-08-19
lastmod: 2025-08-19
---

# Python Errors and Exceptions
In Python, errors and exceptions are used to handle unexpected situations that arise during program execution. Understanding how to manage exceptions is crucial for writing robust and maintainable code.

## Core Concepts

Python uses exceptions to handle errors and exceptional situations. Understanding exception handling is crucial for writing robust, maintainable code.

- **Exceptions**: Objects representing errors or unusual conditions
- **Exception Hierarchy**: All exceptions inherit from `BaseException`
- **Raising**: Triggering an exception with `raise`
- **Handling**: Catching exceptions with `try`/`except`

## Exception Hierarchy

### Built-in Exception Types

```python
# Common exceptions and their use cases
ValueError      # Invalid value for operation
TypeError       # Wrong type for operation
KeyError        # Missing dictionary key
IndexError      # List index out of range
FileNotFoundError  # File doesn't exist
AttributeError  # Object has no attribute
ZeroDivisionError  # Division by zero
ImportError     # Module import failure
```

### Exception Inheritance

```python
BaseException
 +-- SystemExit
 +-- KeyboardInterrupt
 +-- GeneratorExit
 +-- Exception
      +-- StopIteration
      +-- ArithmeticError
      |    +-- ZeroDivisionError
      +-- LookupError
      |    +-- IndexError
      |    +-- KeyError
      +-- ValueError
      +-- TypeError
      +-- OSError
           +-- FileNotFoundError
```

## Basic Exception Handling

### Try-Except Blocks

```python
# Basic exception handling
try:
    result = 10 / int(input("Enter a number: "))
    print(f"Result: {result}")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except ValueError:
    print("Please enter a valid number!")

# Multiple exceptions in one block
try:
    data = {"name": "Alice"}
    print(data["age"])
except (KeyError, TypeError) as e:
    print(f"Error accessing data: {e}")

# Catch all exceptions (use sparingly)
try:
    risky_operation()
except Exception as e:
    print(f"An error occurred: {e}")
```

### Else and Finally Clauses

```python
def process_file(filename):
    try:
        file = open(filename, 'r')
        data = file.read()
    except FileNotFoundError:
        print(f"File {filename} not found")
        return None
    except PermissionError:
        print(f"Permission denied for {filename}")
        return None
    else:
        # Executes only if no exception occurred
        print("File read successfully")
        return data
    finally:
        # Always executes
        if 'file' in locals() and not file.closed:
            file.close()
            print("File closed")
```

## Raising Exceptions

### Basic Raise Statements

```python
def validate_age(age):
    if not isinstance(age, int):
        raise TypeError("Age must be an integer")
    if age < 0:
        raise ValueError("Age cannot be negative")
    if age > 150:
        raise ValueError("Age seems unrealistic")
    return age

# Re-raising exceptions
def wrapper_function():
    try:
        validate_age("invalid")
    except (TypeError, ValueError) as e:
        print(f"Validation failed: {e}")
        raise  # Re-raise the same exception
```

### Exception Chaining

```python
def parse_config(config_string):
    try:
        return json.loads(config_string)
    except json.JSONDecodeError as e:
        raise ValueError("Invalid configuration format") from e

# Using raise from None to suppress context
def clean_error():
    try:
        risky_operation()
    except OriginalError:
        raise NewError("Clean error message") from None
```

## Custom Exceptions

### Creating Custom Exception Classes

```python
class ValidationError(Exception):
    """Raised when data validation fails"""
    pass

class DatabaseError(Exception):
    """Base class for database-related errors"""
    pass

class ConnectionError(DatabaseError):
    """Raised when database connection fails"""
    def __init__(self, host, port, message="Connection failed"):
        self.host = host
        self.port = port
        self.message = message
        super().__init__(f"{message}: {host}:{port}")

class QueryError(DatabaseError):
    """Raised when database query fails"""
    def __init__(self, query, error_code=None):
        self.query = query
        self.error_code = error_code
        super().__init__(f"Query failed: {query}")
```

### Exception Hierarchies

```python
class APIError(Exception):
    """Base exception for API-related errors"""
    def __init__(self, message, status_code=None, response=None):
        self.message = message
        self.status_code = status_code
        self.response = response
        super().__init__(message)

class ClientError(APIError):
    """4xx client errors"""
    pass

class ServerError(APIError):
    """5xx server errors"""
    pass

class RateLimitError(ClientError):
    """429 rate limit exceeded"""
    def __init__(self, retry_after=None):
        self.retry_after = retry_after
        super().__init__("Rate limit exceeded", status_code=429)

class NotFoundError(ClientError):
    """404 resource not found"""
    def __init__(self, resource):
        self.resource = resource
        super().__init__(f"Resource not found: {resource}", status_code=404)
```

## Common Exception Patterns

### Validation and Input Handling

```python
def safe_divide(a, b):
    """Safely divide two numbers with comprehensive error handling"""
    try:
        # Type validation
        if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
            raise TypeError("Both arguments must be numbers")
        
        # Value validation
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero")
        
        return a / b
    
    except (TypeError, ZeroDivisionError) as e:
        print(f"Division error: {e}")
        return None

def parse_user_input(user_input):
    """Parse and validate user input with specific error messages"""
    if not user_input.strip():
        raise ValueError("Input cannot be empty")
    
    try:
        value = int(user_input)
    except ValueError:
        raise ValueError(f"'{user_input}' is not a valid integer")
    
    if value < 1 or value > 100:
        raise ValueError("Value must be between 1 and 100")
    
    return value
```

### Resource Management

```python
class DatabaseConnection:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self.connection = None
    
    def __enter__(self):
        try:
            self.connection = connect_to_database(self.host, self.port)
            return self.connection
        except Exception as e:
            raise ConnectionError(self.host, self.port) from e
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.connection:
            try:
                self.connection.close()
            except Exception:
                pass  # Suppress cleanup errors

# Usage with context manager
try:
    with DatabaseConnection("localhost", 5432) as db:
        result = db.execute("SELECT * FROM users")
except ConnectionError as e:
    print(f"Database connection failed: {e}")
```

### Retry Logic with Exceptions

```python
import time
import random

def retry_with_backoff(func, max_attempts=3, backoff_factor=2):
    """Retry function with exponential backoff"""
    for attempt in range(max_attempts):
        try:
            return func()
        except (ConnectionError, TimeoutError) as e:
            if attempt == max_attempts - 1:
                raise  # Re-raise on final attempt
            
            wait_time = backoff_factor ** attempt + random.uniform(0, 1)
            print(f"Attempt {attempt + 1} failed: {e}. Retrying in {wait_time:.2f}s")
            time.sleep(wait_time)

def unreliable_api_call():
    """Simulate an unreliable API call"""
    if random.random() < 0.7:  # 70% chance of failure
        raise ConnectionError("API temporarily unavailable")
    return {"status": "success", "data": "response"}

# Usage
try:
    result = retry_with_backoff(unreliable_api_call)
    print(f"Success: {result}")
except ConnectionError as e:
    print(f"All retry attempts failed: {e}")
```

## Exception Information and Debugging

### Accessing Exception Details

```python
import traceback
import sys

def detailed_error_handler():
    try:
        problematic_function()
    except Exception as e:
        # Basic exception info
        print(f"Exception type: {type(e).__name__}")
        print(f"Exception message: {str(e)}")
        print(f"Exception args: {e.args}")
        
        # Traceback information
        exc_type, exc_value, exc_traceback = sys.exc_info()
        print("\nFull traceback:")
        traceback.print_exception(exc_type, exc_value, exc_traceback)
        
        # Formatted traceback as string
        tb_str = traceback.format_exc()
        print(f"\nTraceback as string:\n{tb_str}")

def extract_stack_info():
    """Extract and format stack information"""
    try:
        risky_operation()
    except Exception as e:
        tb = traceback.extract_tb(e.__traceback__)
        for frame in tb:
            print(f"File: {frame.filename}, Line: {frame.lineno}, Function: {frame.name}")
```

### Custom Exception Context

```python
class DetailedError(Exception):
    """Exception with additional context information"""
    def __init__(self, message, context=None, suggestions=None):
        self.message = message
        self.context = context or {}
        self.suggestions = suggestions or []
        super().__init__(message)
    
    def __str__(self):
        result = self.message
        if self.context:
            result += f"\nContext: {self.context}"
        if self.suggestions:
            result += f"\nSuggestions: {', '.join(self.suggestions)}"
        return result

# Usage
def process_data(data):
    if not data:
        raise DetailedError(
            "Data processing failed",
            context={"data_type": type(data), "data_length": len(data) if data else 0},
            suggestions=["Check input data", "Ensure data is not empty"]
        )
```

## Best Practices

### Exception Handling Guidelines

```python
# Good: Specific exception handling
def read_config_file(filename):
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Config file {filename} not found, using defaults")
        return get_default_config()
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON in config file: {e}")
    except PermissionError:
        raise PermissionError(f"No permission to read {filename}")

# Avoid: Catching all exceptions without handling
def bad_example():
    try:
        risky_operation()
    except:  # Too broad
        pass  # Silent failure is dangerous

# Good: Log and re-raise or handle specifically
def good_example():
    try:
        risky_operation()
    except SpecificError as e:
        logger.error(f"Expected error occurred: {e}")
        return default_value
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise  # Re-raise unexpected errors
```

### Error Messages and User Experience

```python
class UserFriendlyError(Exception):
    """Exception with user-friendly error messages"""
    def __init__(self, technical_msg, user_msg=None):
        self.technical_msg = technical_msg
        self.user_msg = user_msg or "An error occurred"
        super().__init__(technical_msg)

def validate_email(email):
    """Validate email with helpful error messages"""
    if not email:
        raise UserFriendlyError(
            "Email is required",
            "Please enter your email address"
        )
    
    if "@" not in email:
        raise UserFriendlyError(
            f"Invalid email format: {email}",
            "Please enter a valid email address (example@domain.com)"
        )

# Usage in application
def handle_user_input():
    try:
        email = get_user_email()
        validate_email(email)
    except UserFriendlyError as e:
        show_user_message(e.user_msg)  # Show friendly message
        log_error(e.technical_msg)     # Log technical details
```

### Performance Considerations

```python
# Prefer EAFP (Easier to Ask for Forgiveness than Permission)
def eafp_approach(data):
    """More Pythonic exception-based approach"""
    try:
        return data['key'].upper()
    except (KeyError, AttributeError):
        return "default"

# Avoid LBYL (Look Before You Leap) when exceptions are expected
def lbyl_approach(data):
    """Less efficient for expected cases"""
    if 'key' in data and hasattr(data['key'], 'upper'):
        return data['key'].upper()
    return "default"

# Use exceptions for exceptional cases, not control flow
def control_flow_with_exceptions():  # Avoid this
    try:
        return next(iter(sequence))
    except StopIteration:
        return None

def better_control_flow():  # Prefer this
    return sequence[0] if sequence else None
```

## Testing Exception Handling

### Unit Testing Exceptions

```python
import pytest
import unittest

class TestExceptionHandling(unittest.TestCase):
    def test_division_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            safe_divide(10, 0)
    
    def test_type_error_message(self):
        with self.assertRaisesRegex(TypeError, "must be numbers"):
            safe_divide("10", 5)

# Using pytest
def test_custom_exception():
    with pytest.raises(ValidationError) as exc_info:
        validate_age(-5)
    
    assert "negative" in str(exc_info.value)

def test_exception_chaining():
    with pytest.raises(ValueError) as exc_info:
        parse_config("invalid json")
    
    assert exc_info.value.__cause__ is not None
    assert isinstance(exc_info.value.__cause__, json.JSONDecodeError)
```

## Troubleshooting

### Common Exception Issues

```python
# Issue: Swallowing exceptions silently
try:
    risky_operation()
except Exception:
    pass  # Silent failure - avoid this

# Solution: At minimum, log the exception
import logging
logger = logging.getLogger(__name__)

try:
    risky_operation()
except Exception as e:
    logger.error(f"Operation failed: {e}", exc_info=True)
    raise  # Or handle appropriately

# Issue: Catching too broad exceptions
try:
    process_data()
except Exception:  # Too broad
    return default_value

# Solution: Catch specific exceptions
try:
    process_data()
except (ValueError, TypeError) as e:  # Specific exceptions
    logger.warning(f"Data processing issue: {e}")
    return default_value
```

### Debugging Exception Flow

```python
def debug_exception_context(func):
    """Decorator to add debugging context to exceptions"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            # Add context to exception
            print(f"Exception in {func.__name__}")
            print(f"Args: {args}")
            print(f"Kwargs: {kwargs}")
            print(f"Exception: {e}")
            raise
    return wrapper

@debug_exception_context
def problematic_function(data):
    return data['missing_key']
```

## Related Topics

- [[debugging]] - Debugging techniques and tools for error investigation
- [[testing]] - Unit testing patterns and exception testing strategies
- [[logging]] - Logging exceptions and error tracking in applications
