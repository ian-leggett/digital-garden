---
title: "Try Catch"
tags:
  - python
description: ""
date: 2025-05-29
---


Example of catching a key error

```python
a_dictionary = {"key": "value"}

try:

print(a_dictionary['something'])

except KeyError:

print("That key does not exist")
```


Example of catching a key error in more detail

```python
a_dictionary = {"key": "value"}

try:

print(a_dictionary['something'])

except KeyError as error_message:

print(f"The {error_message} does not exist")
```


Example of catching a file error

```python
try:

file = open("some_file.txt")

except FileNotFoundError:

print("File does not exist")
```

