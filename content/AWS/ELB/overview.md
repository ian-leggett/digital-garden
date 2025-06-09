---
title: "Overview"
tags:
  - aws
  - infrastructure
description: ""
date: 2025-05-29
---

# AWS Elastic Load Balancing (ELB)

## Overview
- **Load Balancing** distributes incoming application traffic across multiple targets
- Improves application availability and fault tolerance
- AWS offers several types of managed load balancers
- Integrates with EC2, ECS, Lambda, and other AWS services
- Automatically scales based on application traffic

## Types of Load Balancers

### Application Load Balancer (ALB)
- **Layer 7** load balancer (HTTP/HTTPS)
- Advanced request routing based on content
- Supports path-based routing, host-based routing, and HTTP header routing
- Ideal for microservices and container-based applications
- Supports WebSockets and HTTP/2
- Native integration with AWS WAF

### Network Load Balancer (NLB)
- **Layer 4** load balancer (TCP/UDP/TLS)
- Ultra-high performance and low latency
- Can handle millions of requests per second
- Preserves source IP address
- Static IP addresses for each AZ
- Ideal for TCP applications that need extreme performance

### Gateway Load Balancer (GWLB)
- **Layer 3/4** load balancer for appliances
- Enables deployment of third-party virtual appliances
- Used for firewalls, intrusion detection, deep packet inspection
- Transparent network gateway and load balancer in one

### Classic Load Balancer (CLB)
- Legacy load balancer (being phased out)
- Layer 4 and basic Layer 7 functionality
- Not recommended for new implementations
- Limited features compared to newer load balancers

## ALB Components

### Listeners
- Process to check for connection requests
- Configured with a protocol and port
- Contains rules to route requests to target groups
- Every ALB needs at least one listener

### Rules
- Determine how requests are routed to targets
- Consists of a priority, actions, and conditions
- Path pattern conditions (/images/*, /api/*)
- Host header conditions (example.com)
- HTTP header and method conditions
- Query string parameters
- Source IP address

### Target Groups
- Logical grouping of targets (EC2 instances, IP addresses, Lambda functions, containers)
- Health check settings defined at target group level
- Routing algorithm (round robin by default)
- Can register targets with multiple target groups
- Supports dynamic port mapping with ECS

## Key Features

### Health Checks
- Regularly tests all registered targets
- Sends requests to configured endpoint
- Marks unhealthy targets and stops routing traffic to them
- Customizable check intervals, thresholds, and timeouts
- Detailed health check logs in CloudWatch

### Sticky Sessions
- Route requests from same client to same target
- Implemented using cookies
- Application-based stickiness (application cookie)
- Duration-based stickiness (load balancer cookie)
- Can reduce performance if not properly configured

### Security Features
- Integration with AWS Certificate Manager for TLS/SSL
- Support for SNI (Server Name Indication)
- Connection draining/deregistration delay
- Security groups to control inbound/outbound traffic
- Access logs to S3 buckets

### Advanced Request Routing
- Content-based routing using HTTP headers
- Path-based routing for different microservices
- Host-based routing for multiple domains
- Query string parameter-based routing
- HTTP method-based routing

## Integration with AWS Services

### Auto Scaling
- Automatically registers/deregisters instances with load balancer
- Seamless scaling during traffic spikes
- Integrates with target tracking scaling policies

### Amazon ECS/EKS
- Dynamic port mapping for containers
- Service discovery integration
- Blue/green deployments with CodeDeploy

### AWS Lambda
- ALB can invoke Lambda functions directly
- Serverless HTTP endpoints without managing servers
- Multi-header values and binary payload support

### AWS Certificate Manager (ACM)
- Free SSL/TLS certificates
- Automatic certificate renewal
- Easy HTTPS configuration

## Monitoring and Logging

### CloudWatch Metrics
- Request counts, healthy host counts
- Latency, surge queue length
- HTTP status code counts
- Integration with CloudWatch alarms

### Access Logs
- Detailed logs of all requests sent to S3
- Include client IP, request path, latency, response code
- Useful for application analysis and security auditing
- Can be analyzed with Athena

### Request Tracing
- X-Amzn-Trace-Id header for request tracking
- Integration with AWS X-Ray for distributed tracing
- End-to-end visibility of requests

## Exam Tips
- **ALB vs NLB**: Understand when to use each (HTTP/HTTPS vs TCP/UDP)
- **Target Groups**: Know how to configure them for different scenarios
- **Routing Rules**: Understand path-based and host-based routing
- **Health Checks**: Know how to configure and troubleshoot
- **Sticky Sessions**: Understand cookie-based session affinity
- **Security**: Know about SSL/TLS termination and security groups
- **Cross-Zone Load Balancing**: Enabled by default on ALB, optional on NLB
- **Connection Draining**: Now called "deregistration delay"
- **Dynamic Ports**: Understand how they work with ECS

## Common Scenarios
- Choose **ALB** for HTTP/HTTPS applications needing content-based routing
- Choose **NLB** for TCP/UDP applications requiring high performance or static IPs
- Use **path-based routing** to direct traffic to different services (/api, /images)
- Use **host-based routing** for multiple domains on the same ALB
- Configure **health checks** to match application requirements
- Enable **access logs** for troubleshooting and security analysis
- Use **sticky sessions** for stateful applications
- Implement **HTTPS** using ACM certificates