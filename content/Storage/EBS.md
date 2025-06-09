# AWS Elastic Block Store (EBS)

## Overview
- **EBS** is a block-level storage service for EC2 instances
- Provides persistent block storage volumes that can be attached to EC2 instances
- Independent lifecycle from EC2 instances (persists after instance termination)
- Automatically replicated within a single Availability Zone (AZ)
- Cannot be shared across multiple AZs (use EFS for that)

## Volume Types

### General Purpose SSD (gp2/gp3)
- **gp3**: Baseline 3,000 IOPS and 125 MiB/s throughput
- **gp2**: Baseline 3 IOPS/GB, burst up to 3,000 IOPS
- Good for boot volumes, dev/test environments, and low-latency applications
- **gp3** offers independent IOPS and throughput scaling

### Provisioned IOPS SSD (io1/io2)
- **io2 Block Express**: Up to 64,000 IOPS, 1,000 MB/s throughput, 4GB-64TB
- **io1/io2**: Up to 64,000 IOPS (16,000 for io1), high performance, 99.999% durability
- Used for I/O-intensive workloads, databases (SQL, NoSQL)
- Highest durability and performance

### Throughput Optimized HDD (st1)
- Low-cost HDD volume
- 500 IOPS baseline, burst to 500 MiB/s throughput
- Good for big data, data warehouses, log processing
- Cannot be a boot volume

### Cold HDD (sc1)
- Lowest cost HDD volume
- 250 IOPS baseline, burst to 250 MiB/s throughput
- Good for infrequently accessed data, lowest storage cost
- Cannot be a boot volume

## Key Features

### Snapshots
- Point-in-time copies of EBS volumes stored in S3
- Incremental (only changed blocks are saved)
- Can copy snapshots across regions and AZs
- Can create AMIs from snapshots
- Can encrypt unencrypted volumes via snapshot

### Encryption
- AES-256 encryption with AWS KMS
- Minimal impact on latency
- Encrypts data at-rest, in-transit, and all snapshots
- No direct way to encrypt an unencrypted volume (must use snapshot workflow)

### Multi-Attach (io1/io2 only)
- Attach a single EBS volume to multiple EC2 instances in the same AZ
- Each instance has full read/write permissions
- Limited to 16 EC2 instances
- Must use cluster-aware file system (not XFS, EXT4, etc.)

## Operations and Sizing

### Modifications
- Can modify volume type, size, IOPS, and throughput without detaching
- Elastic Volumes feature allows for dynamic changes
- Can take several hours to complete modifications

### Performance
- **IOPS**: I/O operations per second (reads/writes)
- **Throughput**: Amount of data transferred (MB/s)
- **Latency**: Time between request and completion (ms)
- Pre-warming new volumes created from snapshots recommended for optimal performance

## Exam Tips
- **Data Persistence**: EBS volumes persist independently of EC2 instances
- **AZ Limitation**: EBS volumes are AZ-specific, cannot be attached to instances in different AZs
- **Default Deletion**: By default, root EBS volumes are deleted when the instance terminates
- **Snapshot Consistency**: For application-consistent snapshots, pause I/O or use AWS Backup
- **Encryption**: All data between EC2 instance and EBS volume is encrypted in transit
- **Performance**: Instance type can limit EBS performance (EBS-optimized instances recommended)
- **RAID**: Can use RAID 0 for higher performance or RAID 1 for increased fault tolerance

## Common Scenarios
- Choose **gp3** for most general workloads
- Choose **io2** for mission-critical applications requiring high durability
- Choose **st1** for high-throughput, sequential workloads
- Choose **sc1** for archived data with infrequent access
- Use **snapshots** for backups and disaster recovery
- Use **encryption** for compliance and security requirements