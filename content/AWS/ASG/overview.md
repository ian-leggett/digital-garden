---
title: "Overview"
tags:
  - aws
  - infrastructure
description: ""
date: 2025-05-29
---

# AWS Auto Scaling Groups (ASG)

## Overview
- Auto Scaling Groups automatically adjust the number of EC2 instances to match demand
- Core component of AWS elasticity and high availability architecture
- Helps maintain application availability and optimize costs by scaling resources as needed

## Key Components

### Launch Templates/Configurations
- **Launch Templates** (newer, recommended): Define the instance configuration including AMI, instance type, security groups, and user data
- **Launch Configurations** (legacy): Similar functionality but less flexible and cannot be modified after creation
- Contains all information needed to launch instances (AMI ID, instance type, key pair, security groups, etc.)

### Auto Scaling Group
- Controls when and where EC2 instances are launched
- Defines minimum, maximum, and desired capacity
- Configures which VPC and subnets to use for instances
- Determines health check settings and grace periods

### Scaling Policies
- Rules that define when and how to scale instances
- Can be based on metrics, schedules, or predictive scaling

## Scaling Types

### Dynamic Scaling
- **Target Tracking**: Maintains a specific metric value (e.g., 70% CPU utilization)
- **Step Scaling**: Adds or removes instances based on alarm thresholds
- **Simple Scaling**: Basic scaling based on a single CloudWatch alarm

### Predictive Scaling
- Uses machine learning to forecast load and scale proactively
- Analyzes historical workload patterns
- Particularly useful for predictable workload patterns

### Scheduled Scaling
- Scales based on known traffic patterns (e.g., business hours, special events)
- Sets specific capacity at specific times

## ASG Lifecycle Hooks
- Pause instances in specific states for custom actions:
  - Pending state: Before instance enters service
  - Terminating state: Before instance is terminated
- Use cases: Install software, retrieve data before termination

## Integration with AWS Services

### Elastic Load Balancing (ELB)
- Distributes traffic across instances in an ASG
- New instances are automatically registered with the load balancer
- Unhealthy instances are automatically replaced

### CloudWatch
- Provides metrics for scaling decisions
- Triggers alarms that invoke scaling policies
- Custom metrics can be used for specialized scaling scenarios

### AWS Lambda
- Can be triggered by lifecycle hooks
- Useful for instance customization or cleanup

## Best Practices
- Use Launch Templates instead of Launch Configurations
- Set appropriate cooldown periods to prevent rapid scaling
- Implement gradual scaling policies to avoid capacity spikes
- Use instance weighting for mixed instance types
- Test scaling policies before production deployment

## Exam Tips
- Know the difference between Launch Templates and Launch Configurations
- Understand the types of scaling policies and when to use each
- Remember ASG termination policies (default: oldest launch configuration, closest to billing hour)
- Understand how health checks work (EC2 and ELB health checks)
- Know how to interpret CloudWatch metrics for auto scaling
- Understand warm pools for applications with long initialization times

## Common Scenarios
- Web applications with variable traffic patterns
- Batch processing with predictable schedules
- Microservices requiring high availability
- Cost optimization through right-sizing and scale-in during low-demand periods