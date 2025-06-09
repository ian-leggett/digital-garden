---
title: "Lists"
tags:
  - python
description: ""
date: 2025-05-29
---

# Python List Methods

Python lists are versatile and come with many useful methods. Here are some of the most common list methods with examples:

## Append
Add an item to the end of the list.
```python
my_list = [1, 2, 3]
my_list.append(4)  # [1, 2, 3, 4]
```

## Extend
Add all items from another iterable to the end of the list.
```python
my_list = [1, 2, 3]
my_list.extend([4, 5])  # [1, 2, 3, 4, 5]
```

## Insert
Insert an item at a given position.
```python
my_list = [1, 2, 3]
my_list.insert(1, 'a')  # [1, 'a', 2, 3]
```

## Remove
Remove the first occurrence of a value.
```python
my_list = [1, 2, 3, 2]
my_list.remove(2)  # [1, 3, 2]
```

## Pop
Remove and return item at given index (default last).
```python
my_list = [1, 2, 3]
item = my_list.pop()  # item=3, my_list=[1, 2]
```

## Index
Return the index of the first occurrence of a value.
```python
my_list = [1, 2, 3]
idx = my_list.index(2)  # idx=1
```

## Count
Count the number of occurrences of a value.
```python
my_list = [1, 2, 2, 3]
count = my_list.count(2)  # count=2
```

## Sort
Sort the list in place.
```python
my_list = [3, 1, 2]
my_list.sort()  # [1, 2, 3]
```

## Reverse
Reverse the elements of the list in place.
```python
my_list = [1, 2, 3]
my_list.reverse()  # [3, 2, 1]
```

## Copy
Return a shallow copy of the list.
```python
my_list = [1, 2, 3]
copy_list = my_list.copy()  # [1, 2, 3]
```

See the [Python documentation](https://docs.python.org/3/tutorial/datastructures.html#more-on-lists) for more details and advanced usage.
