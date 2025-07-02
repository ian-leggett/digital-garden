---
title: "Numbers"
description: "Essential guide to numeric types and operations in Python including integers, floats, and mathematical functions."
tags: [python, numbers, math, arithmetic]
draft: false
date: 2025-06-30
lastmod: 2025-06-30
---

# Python Numbers

Python provides three numeric types: integers, floating-point numbers, and complex numbers. Each serves specific use cases in numerical computing.

## Numeric Types

### Integers
Whole numbers with unlimited precision:

```python
age = 25
population = 1_000_000  # Underscores for readability
binary = 0b1010        # Binary: 10
hex_value = 0xFF       # Hexadecimal: 255
```

### Floats
Decimal numbers with 64-bit precision:

```python
price = 19.99
scientific = 1.5e-4    # 0.00015
pi = 3.14159
```

### Complex Numbers
Numbers with real and imaginary components:

```python
z = 3 + 4j
print(z.real)      # 3.0
print(z.imag)      # 4.0
print(abs(z))      # 5.0
```

## Arithmetic Operations

```python
# Basic operations
result = 10 + 5        # Addition: 15
result = 10 - 3        # Subtraction: 7
result = 4 * 6         # Multiplication: 24
result = 15 / 4        # Division: 3.75
result = 15 // 4       # Floor division: 3
result = 15 % 4        # Modulo: 3
result = 2 ** 8        # Exponentiation: 256
```

## Mathematical Functions

### Built-in Functions
```python
abs(-42)               # 42
min([1, 5, 3])         # 1
max([1, 5, 3])         # 5
sum([1, 2, 3, 4])      # 10
round(3.14159, 2)      # 3.14
```

### Math Module
```python
import math

math.sqrt(16)          # 4.0
math.ceil(3.2)         # 4
math.floor(3.8)        # 3
math.log(100, 10)      # 2.0
math.sin(math.pi/2)    # 1.0
```

## Number Formatting

```python
number = 1234.5678

f"{number:.2f}"        # "1234.57"
f"{number:,.2f}"       # "1,234.57"
f"{number:.2e}"        # "1.23e+03"

# Percentage
rate = 0.1234
f"{rate:.1%}"          # "12.3%"
```

## Type Conversion

```python
int("123")             # 123
float("3.14")          # 3.14
str(42)                # "42"

# Base conversions
bin(42)                # "0b101010"
hex(42)                # "0x2a"
int("101010", 2)       # 42 (binary to decimal)
```

## Precision Considerations

Float precision can cause unexpected results:

```python
0.1 + 0.2              # 0.30000000000000004

# For exact decimal arithmetic
from decimal import Decimal
Decimal("0.1") + Decimal("0.2")  # Decimal('0.3')
```

## Common Patterns

### Number Validation
```python
def is_number(value):
    try:
        float(value)
        return True
    except ValueError:
        return False
```

### Range Checking
```python
def clamp(value, min_val, max_val):
    return max(min_val, min(value, max_val))

# Usage
score = clamp(105, 0, 100)  # 100
```

### Random Numbers
```python
import random

random.randint(1, 10)      # Random integer 1-10
random.uniform(0, 1)       # Random float 0-1
random.choice([1, 2, 3])   # Random element
```

## Related Topics

- [[data-types]] - Overview of Python data types
- [[Testing]] - Testing numerical calculations