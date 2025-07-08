---
title: "Loops"
description: "Essential guide to Python loops with lists, tuples, dictionaries, and unpacking patterns"
tags: [python, loops, iteration, unpacking, control-flow]
draft: false
date: 2025-07-08
lastmod: 2025-07-08
---

## For Loops with Lists

### Basic Iteration
```python
fruits = ['apple', 'banana', 'cherry']

# Simple iteration
for fruit in fruits:
    print(fruit)

# With index using enumerate
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# Start enumerate from different number
for i, fruit in enumerate(fruits, start=1):
    print(f"Item {i}: {fruit}")
```

### List Modification During Iteration
```python
numbers = [1, 2, 3, 4, 5, 6]

# Wrong: modifying list while iterating
# for num in numbers:
#     if num % 2 == 0:
#         numbers.remove(num)  # Skips elements!

# Correct: iterate over copy
for num in numbers[:]:  # Shallow copy
    if num % 2 == 0:
        numbers.remove(num)

# Better: use list comprehension or filter
numbers = [num for num in numbers if num % 2 != 0]
numbers = list(filter(lambda x: x % 2 != 0, numbers))
```

### Multiple Lists with zip
```python
names = ['Alice', 'Bob', 'Charlie']
ages = [25, 30, 35]
cities = ['NYC', 'LA', 'Chicago']

# Iterate over multiple lists
for name, age in zip(names, ages):
    print(f"{name} is {age} years old")

# Multiple lists (stops at shortest)
for name, age, city in zip(names, ages, cities):
    print(f"{name}, {age}, lives in {city}")

# Use zip_longest for different lengths
from itertools import zip_longest
for name, age in zip_longest(names, ages, fillvalue='Unknown'):
    print(f"{name}: {age}")
```

## For Loops with Tuples

### Basic Tuple Iteration
```python
coordinates = [(0, 0), (1, 2), (3, 4), (5, 6)]

# Iterate over tuples
for point in coordinates:
    print(f"Point: {point}")
    print(f"X: {point[0]}, Y: {point[1]}")

# Unpack tuples directly
for x, y in coordinates:
    print(f"X: {x}, Y: {y}")
```

### Advanced Tuple Unpacking
```python
# Three-element tuples
student_data = [('Alice', 25, 'CS'), ('Bob', 22, 'Math'), ('Charlie', 24, 'Physics')]

for name, age, major in student_data:
    print(f"{name} ({age}) studies {major}")

# Partial unpacking with *
records = [('Alice', 25, 'NYC', 'Engineer'), ('Bob', 30, 'LA', 'Designer', 'Remote')]

for name, age, *details in records:
    print(f"{name} ({age}): {', '.join(details)}")

# Ignore values with underscore
for name, _, major in student_data:  # Ignore age
    print(f"{name} studies {major}")
```

### Nested Tuples
```python
nested_data = [
    (('Alice', 'Smith'), (25, 'Engineer')),
    (('Bob', 'Jones'), (30, 'Designer'))
]

# Unpack nested tuples
for (first, last), (age, job) in nested_data:
    print(f"{first} {last}, {age}, {job}")

# Matrix operations
matrix = [(1, 2, 3), (4, 5, 6), (7, 8, 9)]
for row in matrix:
    for element in row:
        print(element, end=' ')
    print()  # New line after each row
```

## For Loops with Dictionaries

### Dictionary Keys, Values, and Items
```python
person = {'name': 'Alice', 'age': 30, 'city': 'NYC'}

# Iterate over keys (default)
for key in person:
    print(f"{key}: {person[key]}")

# Explicit keys iteration
for key in person.keys():
    print(f"Key: {key}")

# Iterate over values
for value in person.values():
    print(f"Value: {value}")

# Iterate over key-value pairs
for key, value in person.items():
    print(f"{key}: {value}")
```

### Advanced Dictionary Iteration
```python
# Multiple dictionaries
dict1 = {'a': 1, 'b': 2}
dict2 = {'c': 3, 'd': 4}

# Combine dictionaries in loop
for d in [dict1, dict2]:
    for key, value in d.items():
        print(f"{key}: {value}")

# Nested dictionaries
users = {
    'alice': {'age': 30, 'city': 'NYC'},
    'bob': {'age': 25, 'city': 'LA'}
}

for username, details in users.items():
    print(f"User: {username}")
    for key, value in details.items():
        print(f"  {key}: {value}")
```

### Dictionary Unpacking in Loops
```python
# List of dictionaries
employees = [
    {'name': 'Alice', 'dept': 'Engineering', 'salary': 80000},
    {'name': 'Bob', 'dept': 'Marketing', 'salary': 60000}
]

# Access dictionary values
for emp in employees:
    print(f"{emp['name']} works in {emp['dept']}")

# Using get() for safe access
for emp in employees:
    name = emp.get('name', 'Unknown')
    dept = emp.get('dept', 'Unknown')
    print(f"{name} works in {dept}")
```

## Advanced Unpacking Patterns

### Star Expressions
```python
# Unpacking with *
numbers = [1, 2, 3, 4, 5]
first, *middle, last = numbers
print(f"First: {first}, Middle: {middle}, Last: {last}")

# In function calls
def process_data(first, *others, last):
    print(f"First: {first}")
    print(f"Others: {others}")
    print(f"Last: {last}")

data = [1, 2, 3, 4, 5]
process_data(*data)  # Unpacks list as arguments
```

### Complex Unpacking
```python
# Mixed data structures
data = [
    ('Alice', {'age': 30, 'skills': ['Python', 'SQL']}),
    ('Bob', {'age': 25, 'skills': ['JavaScript', 'React']})
]

for name, info in data:
    age = info['age']
    skills = info['skills']
    print(f"{name} ({age}): {', '.join(skills)}")

# Unpack with walrus operator (Python 3.8+)
for item in data:
    if (name := item[0]) and (age := item[1]['age']) > 25:
        print(f"{name} is over 25")
```

### Enumerate with Unpacking
```python
pairs = [('a', 1), ('b', 2), ('c', 3)]

# Enumerate with tuple unpacking
for index, (letter, number) in enumerate(pairs):
    print(f"Index {index}: {letter} -> {number}")

# Start from different index
for i, (letter, number) in enumerate(pairs, start=1):
    print(f"Item {i}: {letter} = {number}")
```

## While Loops

### Basic While Loops
```python
# Counter-based loop
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1

# Condition-based loop
numbers = [1, 2, 3, 4, 5]
while numbers:  # While list is not empty
    number = numbers.pop()
    print(f"Processing: {number}")
```

### While Loops with Complex Conditions
```python
# Multiple conditions
x, y = 0, 10
while x < 5 and y > 5:
    print(f"x: {x}, y: {y}")
    x += 1
    y -= 1

# Sentinel values
user_input = []
while True:
    value = input("Enter value (or 'quit'): ")
    if value.lower() == 'quit':
        break
    user_input.append(value)
```

## Loop Control Statements

### Break and Continue
```python
# Break: exit loop early
for i in range(10):
    if i == 5:
        break
    print(i)  # Prints 0, 1, 2, 3, 4

# Continue: skip current iteration
for i in range(10):
    if i % 2 == 0:
        continue
    print(i)  # Prints 1, 3, 5, 7, 9

# Nested loops with break
for i in range(3):
    for j in range(3):
        if i == j == 1:
            break  # Only breaks inner loop
        print(f"({i}, {j})")
```

### Else Clause in Loops
```python
# Else clause executes if loop completes normally (no break)
for i in range(5):
    if i == 10:  # Never true
        break
    print(i)
else:
    print("Loop completed normally")  # This executes

# Practical example: searching
def find_item(items, target):
    for item in items:
        if item == target:
            print(f"Found {target}")
            break
    else:
        print(f"{target} not found")

find_item([1, 2, 3], 2)  # Found 2
find_item([1, 2, 3], 5)  # 5 not found
```

## Itertools for Advanced Iteration

### Common Itertools Functions
```python
import itertools

# Chain multiple iterables
list1 = [1, 2, 3]
list2 = [4, 5, 6]
for item in itertools.chain(list1, list2):
    print(item)  # 1, 2, 3, 4, 5, 6

# Cycle through values infinitely
colors = ['red', 'green', 'blue']
color_cycle = itertools.cycle(colors)
for i, color in enumerate(color_cycle):
    if i >= 10:  # Prevent infinite loop in example
        break
    print(color)

# Count with step
for i, value in enumerate(itertools.count(10, 2)):
    if i >= 5:
        break
    print(value)  # 10, 12, 14, 16, 18
```

### Grouping and Combinations
```python
import itertools

# Group consecutive elements
data = [1, 1, 2, 2, 2, 3, 1, 1]
for key, group in itertools.groupby(data):
    print(f"{key}: {list(group)}")

# Combinations and permutations
items = ['A', 'B', 'C']
for combo in itertools.combinations(items, 2):
    print(combo)  # ('A', 'B'), ('A', 'C'), ('B', 'C')

for perm in itertools.permutations(items, 2):
    print(perm)  # ('A', 'B'), ('A', 'C'), ('B', 'A'), ('B', 'C'), ('C', 'A'), ('C', 'B')
```

## Performance Considerations

### Efficient Iteration Patterns
```python
# Use direct iteration instead of indexing
numbers = [1, 2, 3, 4, 5]

# Slow: indexing
for i in range(len(numbers)):
    print(numbers[i])

# Fast: direct iteration
for number in numbers:
    print(number)

# When you need index, use enumerate
for i, number in enumerate(numbers):
    print(f"{i}: {number}")
```

### Memory-Efficient Loops
```python
# Use generators for large datasets
def process_large_file(filename):
    with open(filename) as file:
        for line in file:  # Memory efficient
            yield line.strip()

# Don't load everything into memory
for line in process_large_file('huge_file.txt'):
    process_line(line)

# Use itertools.islice for partial processing
for item in itertools.islice(huge_iterator, 1000):
    process_item(item)
```

## Common Patterns

### Data Processing Loops
```python
# Process CSV-like data
data = [
    'name,age,city',
    'Alice,30,NYC',
    'Bob,25,LA'
]

header, *rows = data
headers = header.split(',')

for row in rows:
    values = row.split(',')
    record = dict(zip(headers, values))
    print(f"Name: {record['name']}, Age: {record['age']}")
```

### Error Handling in Loops
```python
# Continue processing despite errors
items = ['1', '2', 'invalid', '4', 'also_invalid']

for item in items:
    try:
        number = int(item)
        print(f"Processed: {number}")
    except ValueError:
        print(f"Skipping invalid item: {item}")
        continue

# Collect errors for later analysis
errors = []
results = []

for item in items:
    try:
        result = process_item(item)
        results.append(result)
    except Exception as e:
        errors.append((item, str(e)))

print(f"Processed {len(results)} items, {len(errors)} errors")
```

### Batch Processing
```python
# Process items in batches
def batch_process(items, batch_size=100):
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        yield batch

large_dataset = list(range(1000))
for batch in batch_process(large_dataset, 50):
    print(f"Processing batch of {len(batch)} items")
    # Process batch
```

## Best Practices

### Readable Loop Code
```python
# Use descriptive variable names
for user in users:  # Not: for u in users
    process_user(user)

# Break complex loops into functions
def process_user_data(users):
    for user in users:
        if user.is_active():
            update_user_metrics(user)
            send_notification(user)

# Use early returns to reduce nesting
def find_user(users, user_id):
    for user in users:
        if user.id == user_id:
            return user
    return None  # Not found
```

### Loop Optimization
```python
# Cache expensive operations outside loops
expensive_result = expensive_function()
for item in items:
    process_item(item, expensive_result)  # Don't recalculate

# Use set for membership testing
valid_ids = {1, 5, 10, 15, 20}  # Set is O(1) lookup
for record in records:
    if record.id in valid_ids:  # Fast lookup
        process_record(record)

# Avoid repeated attribute access
items = get_items()
items_append = items.append  # Cache method
for data in source:
    items_append(process(data))
```

## Related Topics
- [[Python lists]] - List operations and methods
- [[Python tuples]] - Tuple unpacking and immutability
- [[Python dictionaries]] - Dictionary iteration patterns
- [[Python comprehensions]] - Alternative to explicit loops