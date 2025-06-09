---
title: "Overview"
tags:
  - aws
  - infrastructure
description: ""
date: 2025-05-29
---

## EC2

[Instance types](https://aws.amazon.com/ec2/instance-types/)
Comprehensive list of [all Instances](https://instances.vantage.sh/) 

Example of instance: **m5.2xlarge**

**m**: instance class
**5**: generation (AWS impoves them over time)
**2xlarge**: size of the instance class (the large the more cpu/memory) 

## General purpose instances such as t2.micro

- Great for a diversity of workloads such as web servers or code repositories
- Balance between
	- Compute
	- Memory
	- Networking

## Compute Optimised such as c7g.medium

- Great for compute-intensive tasks that require high performance processors
	- Batch processing
	- Media transcoding
	- High performance web servers
	- High performance computing
	- Machine learning 

## Memory Optimised such as r7g.medium

- Fast performance for workloads that process large data sets in memory
	- High performance, relational/non-relational databases
	- Distributed web scale cache stores
	- In-memory databases optimised for BI (Business Intelligence)
	- Applications performing real-time processing of big unstructured data

## Storage Optimised such as i4g.large

- Great for storage-intensive tasks that require high, sequential read and write access to large data sets on local storage
	- High frequency online transaction processing (OLTP) systems
	- Relational & NoSQL databases
	- Cache for in-memory databases (for example Redis)
	- Data warehousing applications
	- Distributed file systems


## Purchasing options - Resort analogy

- **On demand**: coming and staying in resort whenever we like, we pay the full price 
- **Reserved**: like planning ahead and if we plan to stay for a long time, we may get a good discount. 
- **Savings Plans**: pay a certain amount per hour for certain period and stay in any room type (e.g., King, Suite, Sea View, …) 
- **Spot instances**: the hotel allows people to bid for the empty rooms and the highest bidder keeps the rooms. You can get kicked out at any time
- **Dedicated Hosts**: We book an entire building of the resort
- **Capacity Reservations**: you book a room for a period with full price even you don’t stay in it