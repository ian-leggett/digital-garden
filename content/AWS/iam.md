---
title: "AWS IAM"
description: "AWS Identity and Access Management - key concepts for the Developer Associate exam"
tags: [aws, iam, security, authentication, authorization]
draft: false
date: 2026-03-24
lastmod: 2026-03-24
---

## Overview

IAM is a **global service** (not region-specific) that controls authentication and authorization for AWS resources. No additional charge for IAM.

---

## Core Components

### Users
- Represent a person or application with long-term credentials
- New users have **no permissions by default**
- Can have console password and/or programmatic access keys

### Groups
- Collection of users; policies attached to group apply to all members
- Users can belong to multiple groups
- **Groups cannot contain other groups**

### Roles
- Identity assumed temporarily by users, applications, or AWS services
- No long-term credentials — issues **temporary security tokens** via STS
- Key use cases: EC2 instance roles, Lambda execution roles, cross-account access

### Policies
- JSON documents defining permissions (`Effect: Allow|Deny`, `Action`, `Resource`)
- **Identity-based**: attached to users, groups, or roles
- **Resource-based**: attached directly to a resource (e.g., S3 bucket policy)
- **Explicit Deny always overrides Allow**

---

## Policy Evaluation Logic

1. Default **implicit deny** for everything
2. Evaluate all applicable policies
3. Any **explicit Deny** wins
4. If no Deny, an explicit **Allow** grants access
5. Otherwise, deny

> Exam tip: If a user has Allow in identity policy but Deny in resource policy → **access is denied**.

---

## IAM Policy Structure

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::my-bucket/*",
      "Condition": {
        "StringEquals": {"aws:RequestedRegion": "us-east-1"}
      }
    }
  ]
}
```

Key elements: `Version`, `Statement`, `Sid` (optional), `Effect`, `Principal` (resource-based only), `Action`, `Resource`, `Condition`.

---

## Security Features

### MFA (Multi-Factor Authentication)
- Enforce via IAM policy condition `aws:MultiFactorAuthPresent: true`
- Required for sensitive actions (e.g., deleting resources)

### IAM Credentials Report
- Account-level report listing all users and credential status
- Generated via Console or `generate-credential-report` CLI

### IAM Access Advisor
- Shows service permissions granted and **last accessed** date
- Use to apply least privilege

### Access Analyzer
- Identifies resources shared with external principals
- Validates policies against best practices

---

## Roles — Exam Focus Areas

### EC2 Instance Profile
- Attach an IAM role to EC2; credentials auto-rotated via **Instance Metadata Service**
- Access via `http://169.254.169.254/latest/meta-data/iam/security-credentials/<role>`
- **Never store credentials on EC2** — always use instance roles

### Lambda Execution Role
- Role assumed by Lambda to interact with AWS services
- Attach `AWSLambdaBasicExecutionRole` for CloudWatch Logs at minimum

### Cross-Account Access
- Create role in **target account**, add trust policy allowing **source account**
- Source account user calls `sts:AssumeRole`

### Service-Linked Roles
- Pre-defined roles for specific AWS services (e.g., `AWSServiceRoleForElasticLoadBalancing`)
- Cannot edit the trust policy

---

## STS — Security Token Service

- Issues **temporary credentials**: `AccessKeyId`, `SecretAccessKey`, `SessionToken`, `Expiration`
- Key API calls:
  - `AssumeRole` — assume a role in same or different account
  - `AssumeRoleWithWebIdentity` — for web identity federation (replaced by Cognito)
  - `AssumeRoleWithSAML` — for enterprise SSO
  - `GetSessionToken` — for MFA-protected API access

---

## IAM Best Practices (Exam Checklist)

| Practice | Detail |
|---|---|
| Root account | Only for initial setup; enable MFA, do not use daily |
| Least privilege | Grant only required permissions |
| Use roles | Prefer roles over long-term access keys for EC2/Lambda |
| Rotate credentials | Enforce key rotation policy |
| Use groups | Assign permissions to groups, not individual users |
| Enable MFA | Especially for privileged users |
| Use Conditions | Restrict by IP, region, MFA, time |

---

## Common Policy Conditions

```yaml
aws:SourceIp          # Restrict by IP/CIDR
aws:RequestedRegion   # Restrict to specific region
aws:MultiFactorAuthPresent  # Require MFA
aws:PrincipalTag      # Tag-based access control (ABAC)
s3:prefix, s3:delimiter  # S3-specific prefix control
```

---

## Attribute-Based Access Control (ABAC)

- Use **tags** on both principals and resources to define permissions
- Scales better than RBAC for large organizations
- Example: allow access when `aws:PrincipalTag/Team == aws:ResourceTag/Team`

---

## Permission Boundaries

- Set the **maximum permissions** an identity-based policy can grant
- Does not grant permissions itself — only limits them
- Use case: delegate permission management to developers without privilege escalation

```json
{
  "Effect": "Allow",
  "Action": "iam:CreateRole",
  "Resource": "*",
  "Condition": {
    "StringEquals": {"iam:PermissionsBoundary": "arn:aws:iam::123456789012:policy/DeveloperBoundary"}
  }
}
```

---

## Exam Traps

- IAM is **global** — roles/users/policies apply across all regions
- Access keys = programmatic access; never embed in code, use **Secrets Manager** or roles
- A role can be assumed by **multiple services** simultaneously
- **Resource-based policies** support cross-account without assuming a role (e.g., S3, SQS, Lambda)
- `sts:AssumeRoleWithWebIdentity` is legacy — prefer **Cognito Identity Pools**
- Permission boundary + identity policy = effective permissions are the **intersection**
