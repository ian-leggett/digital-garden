---
title: "SSH"
tags:
  - aws
  - infrastructure
description: ""
date: 2025-05-29
---


1. Specify the `.pem` file when logging in to SSH

```
ssh -i <path to pem file><filename>.pem <user>@<ip address of instance>
```

Example:

```
ssh -i EC2Tutorial.pem ec2-user@3.85.13.201
```


Changing permissions of the pem file

```
chmod 0400 EC2Tutorial.pem
```


