---
title: "Comprehensions"
description: "Essential guide to list, dict, set comprehensions and generator expressions"
tags: [python, comprehensions, functional-programming, generators]
draft: false
date: 2025-07-08
lastmod: 2025-07-08
---

Comprehensions are a concise way to create lists, dictionaries, sets, and generators in Python. They allow you to generate collections in a single line of code, making your code more readable and efficient. This guide covers the essential patterns, syntax, and best practices for using comprehensions in Python

## List Comprehensions

### Basic Syntax
```python
# Basic pattern: [expression for item in iterable]
squares = [x**2 for x in range(5)]           # [0, 1, 4, 9, 16]
names = [name.upper() for name in ['alice', 'bob', 'charlie']]

# With condition: [expression for item in iterable if condition]
evens = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]
long_names = [name for name in names if len(name) > 3]

# Equivalent traditional loop
result = []
for x in range(10):
    if x % 2 == 0:
        result.append(x)
```

### Advanced Patterns
```python
# Multiple conditions
filtered = [x for x in range(20) if x % 2 == 0 if x % 3 == 0]  # [0, 6, 12, 18]

# Transform and filter
processed = [x.strip().title() for x in strings if x.strip()]

# Nested loops
pairs = [(x, y) for x in range(3) for y in range(3)]
# [(0, 0), (0, 1), (0, 2), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 2)]

# Flattening nested lists
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flattened = [item for row in matrix for item in row]  # [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### Conditional Expressions
```python
# Conditional expression: expression_if_true if condition else expression_if_false
signs = [1 if x > 0 else -1 if x < 0 else 0 for x in [-2, -1, 0, 1, 2]]

# Processing with fallbacks
safe_divide = [x/y if y != 0 else 0 for x, y in [(10, 2), (5, 0), (8, 4)]]

# Complex conditions
grades = ['A' if score >= 90 else 'B' if score >= 80 else 'C' if score >= 70 else 'F' 
          for score in [95, 85, 75, 65]]
```

## Dictionary Comprehensions

### Basic Patterns
```python
# Basic syntax: {key_expr: value_expr for item in iterable}
squares_dict = {x: x**2 for x in range(5)}    # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# From lists
names = ['alice', 'bob', 'charlie']
name_lengths = {name: len(name) for name in names}

# From key-value pairs
items = [('a', 1), ('b', 2), ('c', 3)]
dict_from_pairs = {k: v for k, v in items}
```

### Transformation and Filtering
```python
# Transform existing dictionary
original = {'a': 1, 'b': 2, 'c': 3}
doubled = {k: v * 2 for k, v in original.items()}

# Filter dictionary
large_values = {k: v for k, v in original.items() if v > 1}

# Invert dictionary
inverted = {v: k for k, v in original.items()}

# Conditional values
processed = {k: v if v > 0 else 0 for k, v in data.items()}
```

### Advanced Use Cases
```python
# Group by criteria
words = ['apple', 'banana', 'apricot', 'blueberry']
by_first_letter = {word[0]: [w for w in words if w[0] == word[0]] 
                   for word in words}

# Count occurrences
text = "hello world"
char_count = {char: text.count(char) for char in set(text) if char != ' '}

# Enumerate with custom keys
enum_dict = {f"item_{i}": value for i, value in enumerate(['a', 'b', 'c'])}
```

## Set Comprehensions

### Basic Operations
```python
# Basic syntax: {expression for item in iterable}
unique_squares = {x**2 for x in range(10)}    # {0, 1, 4, 9, 16, 25, 36, 49, 64, 81}

# Remove duplicates while transforming
words = ['apple', 'Banana', 'APPLE', 'banana']
normalized = {word.lower() for word in words}  # {'apple', 'banana'}

# Filter and transform
positive_evens = {x for x in range(-10, 11) if x > 0 and x % 2 == 0}
```

### Practical Applications
```python
# Extract unique elements
data = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
unique_values = {x for x in data}

# File extensions
filenames = ['doc.txt', 'image.jpg', 'script.py', 'data.csv', 'photo.jpg']
extensions = {filename.split('.')[-1] for filename in filenames}

# Valid email domains
emails = ['user@gmail.com', 'admin@company.com', 'test@gmail.com']
domains = {email.split('@')[1] for email in emails if '@' in email}
```

## Generator Expressions

### Memory-Efficient Processing
```python
# Generator expression: (expression for item in iterable)
squares_gen = (x**2 for x in range(1000000))  # Memory efficient

# Use with built-in functions
total = sum(x**2 for x in range(100))
maximum = max(x for x in data if x > 0)
any_negative = any(x < 0 for x in numbers)

# Chain operations
processed = (x.strip().upper() for x in lines if x.strip())
filtered_results = (process(item) for item in processed if validate(item))
```

### Lazy Evaluation
```python
# Generator doesn't execute until consumed
expensive_gen = (expensive_function(x) for x in large_dataset)

# Consume partially
first_five = list(itertools.islice(expensive_gen, 5))

# Use in loops (memory efficient)
for result in (process(item) for item in huge_dataset):
    if result.meets_criteria():
        handle_result(result)
        break  # Can stop early
```

## Nested Comprehensions

### Matrix Operations
```python
# Create matrix
matrix = [[i + j for j in range(3)] for i in range(3)]
# [[0, 1, 2], [1, 2, 3], [2, 3, 4]]

# Matrix transpose
transposed = [[row[i] for row in matrix] for i in range(len(matrix[0]))]

# Filter matrix elements
filtered_matrix = [[cell for cell in row if cell > 1] for row in matrix]
```

### Complex Data Structures
```python
# Nested dictionary
students = ['Alice', 'Bob', 'Charlie']
subjects = ['Math', 'Science', 'English']
grades = {student: {subject: 0 for subject in subjects} for student in students}

# Process nested lists
data = [['a', 'b'], ['c', 'd'], ['e', 'f']]
processed = [[item.upper() for item in sublist] for sublist in data]

# Conditional nesting
conditional_nested = [
    [x for x in range(i) if x % 2 == 0] 
    for i in range(5) 
    if i > 1
]
```

## Performance Considerations

### Speed Comparisons
```python
import timeit

# List comprehension vs traditional loop
def traditional_loop():
    result = []
    for x in range(1000):
        if x % 2 == 0:
            result.append(x**2)
    return result

def list_comp():
    return [x**2 for x in range(1000) if x % 2 == 0]

# list_comp() is typically 2-3x faster
```

### Memory Usage
```python
# Memory hungry - creates entire list
large_list = [x**2 for x in range(1000000)]

# Memory efficient - generator
large_gen = (x**2 for x in range(1000000))

# Use generator when you don't need the full list
total = sum(x**2 for x in range(1000000))  # No intermediate list created
```

### When Not to Use Comprehensions
```python
# Too complex - use regular loops
# Don't do this:
result = [complex_function(x, y, z) for x in data1 
          for y in data2 if condition1(x, y) 
          for z in data3 if condition2(x, y, z) 
          if final_condition(x, y, z)]

# Do this instead:
result = []
for x in data1:
    for y in data2:
        if condition1(x, y):
            for z in data3:
                if condition2(x, y, z):
                    processed = complex_function(x, y, z)
                    if final_condition(x, y, z):
                        result.append(processed)
```

## Common Patterns

### Data Processing
```python
# Clean and process text
texts = ['  Hello World  ', '  Python Programming  ', '  Data Science  ']
cleaned = [text.strip().title() for text in texts if text.strip()]

# Extract numeric values
mixed_data = ['123', 'abc', '456', '789', 'def']
numbers = [int(x) for x in mixed_data if x.isdigit()]

# Parse configuration
config_lines = ['key1=value1', 'key2=value2', '# comment', 'key3=value3']
config = {line.split('=')[0]: line.split('=')[1] 
          for line in config_lines 
          if '=' in line and not line.startswith('#')}
```

### Functional Programming Patterns
```python
# Map-filter-reduce patterns
data = [1, 2, 3, 4, 5]

# Map: transform each element
mapped = [x * 2 for x in data]

# Filter: select elements
filtered = [x for x in data if x > 2]

# Reduce: aggregate (using sum)
total = sum(x for x in data)

# Combine operations
result = sum(x**2 for x in data if x % 2 == 0)
```

### Data Validation
```python
# Validate and clean user input
user_emails = ['user@example.com', 'invalid-email', 'admin@site.org', '']
valid_emails = [email.lower() for email in user_emails 
                if '@' in email and '.' in email.split('@')[1]]

# Extract valid phone numbers
phone_inputs = ['123-456-7890', '555.123.4567', 'not-a-phone', '(555) 123-4567']
clean_phones = [re.sub(r'\D', '', phone) for phone in phone_inputs 
                if len(re.sub(r'\D', '', phone)) == 10]
```

## Best Practices

### Readability Guidelines
```python
# Good: Simple and clear
squares = [x**2 for x in numbers]

# Good: Single condition
evens = [x for x in numbers if x % 2 == 0]

# Acceptable: Multiple conditions on separate lines
filtered = [
    process(item) 
    for item in data 
    if item.is_valid() 
    if item.priority > 5
]

# Avoid: Too complex
# complex_result = [f(x, y) for x in data1 for y in data2 if g(x) and h(y) if x > y]
```

### Error Handling
```python
# Safe comprehensions with error handling
def safe_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None

numbers = [safe_int(x) for x in mixed_data]
valid_numbers = [x for x in numbers if x is not None]

# Or use walrus operator (Python 3.8+)
valid_numbers = [num for x in mixed_data if (num := safe_int(x)) is not None]
```

### Naming and Documentation
```python
# Use descriptive names
user_ages = [user.age for user in users if user.is_active]

# Add comments for complex logic
# Extract valid product codes (format: ABC-123)
valid_codes = [
    code.upper() 
    for code in raw_codes 
    if re.match(r'^[A-Z]{3}-\d{3}$', code.upper())
]
```

## Related Topics
- [[Python lists]] - Understanding list operations and methods
- [[Python dictionaries]] - Working with key-value data structures
- [[Python sets]] - Set operations and unique collections
- [[Python strings]] - String manipulation in comprehensions