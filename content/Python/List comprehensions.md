---
title: "List Comprehensions"
tags:
  - python
description: ""
date: 2025-05-29
---


 **Square numbers**

```python
numbers = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
squared_numbers = [n*n for n in numbers]
print(squared_numbers)
```

**Get even numbers**

```python
list_of_strings = ['9', '0', '32', '8', '2', '8', '64', '29', '42', '99']
numbers = [int(n) for n in list_of_strings]
result = [num for num in numbers if num % 2 ==0 ]
print(result)
```

**Compare two files**

Files one has: 3,6,5,8,33,12,7,4,72,2,42,13
File two has: 3,6,13,5,7,89,12,3,33,34,1,344,42

```python
with open("file1.txt") as file1:
 list1 = file1.readlines()

with open("file2.txt") as file2:
 list2 = file2.readlines()

result = [int(num) for num in list1 if num in list2]

print(result)
```

