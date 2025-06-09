---
title: "EFS"
tags:
  - aws
  - infrastructure
description: ""
date: 2025-05-29
---

# AWS Elastic File System (EFS)

## Overview
- **EFS** is a fully managed, scalable, elastic NFS file system for AWS Cloud
- Supports the Network File System version 4 (NFSv4) protocol
- Can be accessed simultaneously by thousands of EC2 instances
- Automatically grows and shrinks as files are added and removed
- Regional service that can be accessed across multiple Availability Zones
- Pay only for the storage you use (no pre-provisioning required)

## Storage Classes

### Standard Storage Classes
- **EFS Standard**: Default storage class with highest availability and durability
- **EFS Standard-Infrequent Access (Standard-IA)**: Lower cost for files not accessed daily

### One Zone Storage Classes
- **EFS One Zone**: Data stored in a single AZ, lower cost than Standard (20% less)
- **EFS One Zone-IA**: Lowest cost option for infrequently accessed files in a single AZ
- One Zone classes have lower availability (99.9% vs 99.99%)

## Key Features

### Elastic Scaling
- Automatically scales up to petabytes without disruption
- No need to provision or manage capacity
- Pay only for what you use (no overprovisioning)
- Can accommodate thousands of concurrent connections

### Performance Modes
- **General Purpose**: Default mode, ideal for latency-sensitive use cases
- **Max I/O**: Higher throughput and operations per second, but with higher latency
- IOPS and throughput scale with file system size

### Throughput Modes
- **Bursting Throughput**: Scales with file system size (baseline of 50 KB/s per GB)
- **Provisioned Throughput**: Set specific throughput regardless of storage size
- **Elastic Throughput**: Automatically scales throughput based on workload needs

### Lifecycle Management
- Automatically moves files between storage classes based on access patterns
- Configurable lifecycle policies (e.g., move to IA storage after 30 days)
- Optimizes costs without changing application access patterns

## Security and Access

### Access Control
- **IAM**: Controls who can administer the file system
- **Security Groups**: Controls network access to EFS mount targets
- **NFS-level permissions**: Standard POSIX permissions (user, group, other)
- **EFS Access Points**: Simplified access management for applications

### Encryption
- **Encryption at rest**: Using AWS KMS keys
- **Encryption in transit**: Using TLS
- Enforce encryption with file system policies

## Operations and Integration

### Mounting
- Uses standard Linux NFS mount commands
- Amazon EFS mount helper simplifies mounting (includes TLS support)
- Supports automatic mounting via /etc/fstab
- AWS Systems Manager can automate mounting process

### Backup and Recovery
- Native integration with AWS Backup
- Point-in-time snapshots
- Incremental backups to optimize costs
- Cross-region backup support

### AWS Service Integrations
- **AWS Lambda**: Can access EFS for persistent storage
- **Amazon ECS/EKS**: Shared storage for containerized applications
- **AWS Fargate**: Persistent storage for serverless containers
- **Amazon EC2**: Cross-AZ file system access

## Performance Considerations
- **Latency**: Single-digit milliseconds for most operations
- **Throughput**: Scales with file system size in Bursting mode
- **IOPS**: Limited by throughput and chosen performance mode
- **Parallelism**: Distributes I/O across many threads for best performance

## Exam Tips
- **Cross-AZ Availability**: EFS Standard can be accessed from multiple AZs in a region
- **Storage Tiers**: Understand when to use Standard vs IA vs One Zone
- **Access Methods**: Know the difference between mount targets and access points
- **Performance Modes**: Understand when to use General Purpose vs Max I/O
- **Throughput Modes**: Know the difference between Bursting, Provisioned, and Elastic
- **Linux-Only**: EFS is only directly mountable on Linux systems (not Windows)
- **Regional Service**: EFS operates at the region level, unlike EBS (AZ level)
- **Data Transfer**: Data transferred between AZs incurs charges
- **Encryption Requirements**: Encryption can be enforced at file system creation

## Common Scenarios
- Choose **EFS Standard** for production shared file systems requiring high availability
- Choose **One Zone** for cost-sensitive workloads with lower availability requirements
- Use **IA storage classes** for files that are accessed less than once per week
- Use **Access Points** when multiple applications need restricted access to the same file system
- Choose **Max I/O** mode for highly parallelized workloads (big data, media processing)
- Use **Provisioned Throughput** when workloads need consistent performance regardless of size