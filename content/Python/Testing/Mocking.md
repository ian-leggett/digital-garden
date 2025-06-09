---
title: "Mocking"
tags:
  - python
  - testing
  - mocking
  - pytest
description: ""
date: 2025-05-29
---


### Mocks

```python
@mock.patch("filepath.some_fnc")
def test_master_dataset_approval_with_email_sent(self, some_mock_name):
```

**Important! You must point to where the function is being called and NOT where its created.**

