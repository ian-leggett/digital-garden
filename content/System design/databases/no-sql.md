---
title: "NoSQL Databases"
description: "Types of NoSQL databases, the BASE consistency model, and when to choose NoSQL over relational"
tags: [system-design, databases, nosql, scalability]
draft: false
date: 2026-05-20
lastmod: 2026-05-20
---

"Not Only SQL" — a broad family of databases that drop the rigid table/schema model in favour of flexibility and scale. The right trade-off when [[relational|relational databases]] become a bottleneck or a poor fit.

## Types

### Document Stores
Store data as JSON-like documents. No fixed schema — each document can have different fields.
- **Examples:** MongoDB, Firestore, CouchDB
- **Use when:** Content varies per record (e.g. product catalogues, user profiles)

### Key-Value Stores
The simplest model — a dictionary/hashmap at massive scale. Extremely fast lookups.
- **Examples:** Redis, DynamoDB, Memcached
- **Use when:** Caching, session storage, leaderboards, feature flags

### Wide-Column Stores
Rows can have different columns. Optimised for huge volumes of writes and time-series data.
- **Examples:** Cassandra, HBase, BigTable
- **Use when:** Event logs, IoT sensor data, analytics at scale

### Graph Databases
Data is stored as nodes and edges. Makes traversing relationships fast and natural.
- **Examples:** Neo4j, Amazon Neptune
- **Use when:** Social networks, fraud detection, recommendation engines

## Key Concepts

**BASE** — the consistency model most NoSQL DBs follow (contrast with [[relational|ACID]]):
- **B**asically Available — system stays up even during failures
- **S**oft state — data may be temporarily inconsistent
- **E**ventual consistency — all nodes will *eventually* agree on the same value

**Schema-less** — no upfront structure definition. Faster to iterate, but discipline is needed to avoid messy data.

**Horizontal scaling** — designed to scale out across many machines (sharding), rather than scaling up to bigger hardware.

## When to Use
- High write throughput or massive data volume
- Flexible or evolving data structure
- Simple access patterns (lookup by key, time range)
- Geographic distribution / global low-latency reads

## When to Avoid
- You need complex joins or transactions across multiple records
- Strong consistency is non-negotiable (e.g. financial data) → use a [[relational|relational DB]]
