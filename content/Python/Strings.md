---
title: "Strings"
tags:
  - python
description: ""
date: 2025-05-29
---

# Python String Methods

Python strings are immutable sequences of Unicode characters. Here are some of the most useful string methods with examples:

## Common String Methods

### upper / lower / title
Convert case of the string.
```python
s = "Hello World"
s.upper()    # 'HELLO WORLD'
s.lower()    # 'hello world'
s.title()    # 'Hello World'
```

### strip / lstrip / rstrip
Remove whitespace (or other characters) from ends.
```python
s = "  hello  "
s.strip()    # 'hello'
s.lstrip()   # 'hello  '
s.rstrip()   # '  hello'
```

### replace
Replace substrings.
```python
s = "hello world"
s.replace("world", "Python")  # 'hello Python'
```

### split / join
Split a string into a list, or join a list into a string.
```python
s = "a,b,c"
parts = s.split(",")  # ['a', 'b', 'c']
"-".join(parts)        # 'a-b-c'
```

### find / index
Find the position of a substring.
```python
s = "hello world"
s.find("world")   # 6 (returns -1 if not found)
s.index("world")  # 6 (raises ValueError if not found)
```

### startswith / endswith
Check if a string starts or ends with a substring.
```python
s = "hello.py"
s.startswith("hello")   # True
s.endswith(".py")       # True
```

### isdigit / isalpha / isalnum
Check string content.
```python
"123".isdigit()   # True
"abc".isalpha()   # True
"abc123".isalnum() # True
```

### Formatting Strings
```python
name = "Alice"
age = 30
f"{name} is {age} years old"  # 'Alice is 30 years old'
"{} is {} years old".format(name, age)
```

See the [Python documentation](https://docs.python.org/3/library/stdtypes.html#string-methods) for more string methods and details.
