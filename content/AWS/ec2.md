---
title: "AWS EC2 Fundamentals"
description: "EC2 core concepts, instance types, storage, networking and pricing for the Developer Associate exam"
tags: [aws, ec2, compute, networking, storage]
draft: false
date: 2026-03-24
lastmod: 2026-03-24
---

## Overview

EC2 (Elastic Compute Cloud) provides **resizable virtual machines** in the cloud. Region-specific; instances run inside a **VPC**.

---

## Instance Types

| Family | Use Case |
|---|---|
| `t3`, `t4g` | General purpose, burstable (T-series uses CPU credits) |
| `m6i`, `m7g` | General purpose, balanced |
| `c6i`, `c7g` | Compute optimised (CPU-heavy workloads) |
| `r6i`, `x2` | Memory optimised (in-memory DBs, caches) |
| `p4`, `g5` | GPU / ML inference |
| `i3`, `i4i` | Storage optimised (NVMe, high IOPS) |

Naming convention: `m5.xlarge` → family `m`, generation `5`, size `xlarge`.

---

## Purchasing Options

| Option | When to Use | Savings vs On-Demand |
|---|---|---|
| **On-Demand** | Short, unpredictable workloads | — |
| **Reserved (1 or 3 yr)** | Steady-state, predictable | Up to 72% |
| **Savings Plans** | Flexible commitment (compute or instance) | Up to 66–72% |
| **Spot** | Fault-tolerant, flexible timing | Up to 90% |
| **Dedicated Host** | Compliance/licensing (per-socket/core) | — |
| **Dedicated Instance** | Hardware not shared with other accounts | — |

> Exam tip: Spot instances are **interrupted with 2-minute warning**. Use for batch jobs, data processing. Not suitable for databases or critical apps.

---

## AMI (Amazon Machine Image)

- Template for launching instances (OS, pre-installed software, config)
- Region-specific; **copy across regions** if needed
- Types: AWS-provided, AWS Marketplace, custom (your own)
- Creating custom AMI: stop instance → create image → launches pre-configured instances

---

## User Data

- Shell script run **once** on first boot (as root)
- Used to install packages, pull config, bootstrap apps
- Accessible at `http://169.254.169.254/latest/user-data`
- Logs to `/var/log/cloud-init-output.log`

---

## Instance Metadata Service (IMDS)

- `http://169.254.169.254/latest/meta-data/`
- Returns instance ID, public IP, IAM role credentials, etc.
- **IMDSv2** (recommended): requires session-oriented token via `PUT` request before `GET`
- Disable IMDSv1 to prevent SSRF attacks

```bash
# IMDSv2 example
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id
```

---

## Storage

### EBS (Elastic Block Store)
- Network-attached, **AZ-specific** block storage
- Persists independently of instance lifecycle (by default)
- **Delete on termination**: root volume ON by default, extra volumes OFF by default

| Type | Use Case | Max IOPS |
|---|---|---|
| `gp3` | General purpose SSD (baseline 3000 IOPS, configurable) | 16,000 |
| `gp2` | Legacy general purpose (IOPS tied to size) | 16,000 |
| `io2 Block Express` | High-performance DBs | 256,000 |
| `st1` | Throughput-optimised HDD (big data, logs) | 500 MB/s |
| `sc1` | Cold HDD (infrequent access) | 250 MB/s |

- Snapshots are **incremental**, stored in S3 (not directly accessible)
- Snapshots can be copied cross-region or cross-account
- Encryption: encrypted AMI → encrypted volumes; encrypt an unencrypted volume via snapshot copy

### Instance Store
- Physically attached NVMe storage — **ephemeral** (lost on stop/terminate)
- Highest possible IOPS; suitable for temp data, caches, buffers

### EFS (Elastic File System)
- Managed NFS; **multi-AZ, multi-instance** concurrent access
- Scales automatically; pay per GB used
- Performance modes: `generalPurpose` (default), `maxIO`
- Throughput modes: `bursting`, `provisioned`, `elastic`

---

## Security Groups

- **Stateful** firewall at the instance/ENI level
- Rules are **allow-only** (no explicit deny)
- Default: all outbound allowed, all inbound denied
- Can reference other security groups as source/destination
- Changes apply **immediately**

> Exam tip: If connection times out → security group issue. If connection refused → app is not running or OS firewall.

---

## Key Pairs

- RSA or ED25519; private key downloaded **once** at creation
- Linux: used for SSH (`-i key.pem`); Windows: used to decrypt admin password
- Lost key → create new AMI, launch new instance with new key pair

---

## Elastic IP (EIP)

- Static public IPv4 address associated with your account
- Charged when **not attached** to a running instance
- Max 5 EIPs per region by default (soft limit)
- Prefer DNS / Load Balancer over EIP where possible

---

## Placement Groups

| Type | Behaviour | Use Case |
|---|---|---|
| **Cluster** | Same rack, same AZ | Ultra-low latency HPC, 10Gbps network |
| **Spread** | Different hardware, max 7 per AZ | Critical instances, max fault isolation |
| **Partition** | Groups of instances on separate racks | Hadoop, Kafka, Cassandra |

> Cluster placement group = highest network throughput but single point of failure for the rack.

---

## Elastic Network Interfaces (ENI)

- Virtual NIC; bound to an AZ
- Each instance has a primary ENI (`eth0`); additional ENIs can be attached/detached
- Carries: private IP, public IP, EIP, MAC address, security groups
- Use case: move ENI between instances for failover

---

## Auto Scaling Groups (ASG)

- Automatically adjusts instance count based on demand
- Requires a **Launch Template** (preferred over Launch Config)
- Key settings: `MinSize`, `MaxSize`, `DesiredCapacity`
- Scaling policies:
  - **Target Tracking** — maintain a metric (e.g., CPU at 50%)
  - **Step Scaling** — react to CloudWatch alarms with step adjustments
  - **Scheduled** — scale at known times
- **Cooldown period** (default 300s): prevents rapid back-to-back scaling
- Health checks: EC2 (default) or ELB; unhealthy instances terminated and replaced

---

## Load Balancers

| Type | Layer | Use Case |
|---|---|---|
| **ALB** | L7 (HTTP/HTTPS) | Path/host routing, microservices, gRPC, WebSocket |
| **NLB** | L4 (TCP/UDP/TLS) | Ultra-low latency, static IP, gaming, IoT |
| **GWLB** | L3 | Third-party virtual appliances (firewalls, IDS) |

- **Sticky sessions**: ALB uses application cookies or duration-based cookies
- **Cross-zone load balancing**: ALB on by default; NLB off by default (charges apply)
- **Connection Draining** (deregistration delay): allows in-flight requests to complete before deregistering (default 300s)
- Health checks are at the **target group** level

---

## Exam Traps

- EBS volumes are **AZ-locked**; use snapshots to move across AZs/regions
- Security groups are **stateful**; NACLs are **stateless** (must add both inbound and outbound rules)
- Spot instance interruption: 2-minute warning via instance metadata or EventBridge
- `t2/t3` burstable instances accumulate **CPU credits** when below baseline; throttled when credits exhausted
- Reserved Instances apply to **running instances** matching the attributes, not specific instances
- ALB can only route to **targets in the same region**
- User data runs as **root** and only on **first launch** by default
