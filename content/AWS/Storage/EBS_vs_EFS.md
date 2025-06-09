---
title: "EBS_vs_EFS"
tags:
  - aws
  - infrastructure
description: ""
date: 2025-05-29
---

# AWS EBS vs EFS Comparison

## Storage Type
- **EBS**: Block-level storage (like a hard drive)
- **EFS**: File-level storage (NFS file system)

## Connection
- **EBS**: Attached to a single EC2 instance (exception: Multi-Attach for io1/io2)
- **EFS**: Can be mounted by thousands of EC2 instances simultaneously

## Availability
- **EBS**: Bound to a single Availability Zone
- **EFS**: Regional service, accessible across multiple AZs

## Use Cases
- **EBS**: Boot volumes, databases, applications needing high IOPS
- **EFS**: Shared file systems, content management, web serving, data analytics

## Performance
- **EBS**: Optimized for low-latency, high IOPS (depending on volume type)
- **EFS**: Optimized for parallel access, scales with file system size

## Scaling
- **EBS**: Fixed capacity, must be manually resized
- **EFS**: Automatically scales as data is added/removed

## Pricing Model
- **EBS**: Pay for provisioned capacity regardless of usage
- **EFS**: Pay only for storage used, no pre-provisioning

## Data Persistence
- **EBS**: Persists independently of EC2 instance (unless set to delete on termination)
- **EFS**: Persists independently of any EC2 instance

## Supported OS
- **EBS**: Any OS supported by EC2
- **EFS**: Linux-based OS only (uses NFSv4 protocol)

## Backup
- **EBS**: Snapshots to S3
- **EFS**: AWS Backup, incremental backups

## Storage Classes
- **EBS**: Different volume types (gp2/gp3, io1/io2, st1, sc1)
- **EFS**: Standard and Infrequent Access (IA), One Zone and One Zone-IA

## Security
- **EBS**: Encryption at rest (KMS) and in transit
- **EFS**: Encryption at rest (KMS), in transit (TLS), IAM, security groups, POSIX permissions

## Key Differences Summary

| Feature | EBS | EFS |
|---------|-----|-----|
| **Service Type** | Block storage | File system storage |
| **Protocol** | Direct block-level access | NFS v4.1 |
| **Scope** | Single AZ | Regional (multiple AZs) |
| **Access** | Single instance (mostly) | Multiple instances |
| **Latency** | Lower latency | Higher latency |
| **Throughput** | Volume-specific | Scales with file system size |
| **Capacity** | Fixed (1 GiB - 64 TiB) | Dynamic (petabyte scale) |
| **Resizing** | Manual resizing | Automatic |
| **Boot Volume** | Can be used as boot volume | Cannot be used as boot volume |
| **Windows Support** | Yes | No (Linux only) |

## When to Choose EBS
- Need low-latency storage
- Running databases (MySQL, PostgreSQL, etc.)
- Boot volumes
- Applications requiring high IOPS
- Application-level consistency requirements

## When to Choose EFS
- Need shared file access across multiple instances
- Content management systems
- Web serving workloads
- Dev/test environments needing shared code
- Container storage
- Big data and analytics workloads

## Exam Tips
- **EBS is AZ-locked**: Snapshots needed to move across AZs
- **EFS is regional**: One file system can be accessed from all AZs in a region
- **EBS has fixed capacity**: You pay for what you provision
- **EFS is elastic**: You pay for what you use
- **EBS offers more performance options**: Choose according to workload requirements
- **EFS has lifecycle management**: Automatically move infrequently accessed files to lower-cost storage