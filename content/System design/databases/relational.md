---
title: "Relational Databases"
description: "Structured, ACID-compliant databases built on tables and SQL — the default choice when data relationships and consistency matter"
tags: [system-design, databases, sql, acid]
draft: false
date: 2026-05-20
lastmod: 2026-05-20
---

Data is stored in tables (rows + columns) with relationships between them. You query and manipulate data using SQL.

## Common Examples
- **PostgreSQL** — open source, feature-rich, great default choice
- **MySQL** — widely used, fast reads, popular in web stacks
- **SQLite** — embedded, file-based, no server needed (great for local/dev)
- **Oracle** — enterprise-grade, expensive, common in large corporations

## Key Concepts

**ACID** — the guarantee that makes relational DBs reliable:
- **A**tomicity — a transaction either fully succeeds or fully rolls back
- **C**onsistency — data always satisfies defined rules/constraints
- **I**solation — concurrent transactions don't interfere with each other
- **D**urability — committed data survives crashes

**Schema** — you define the structure upfront (columns, types, constraints). Changes require migrations.

**Indexes** — speed up reads on specific columns at the cost of slower writes and extra storage.

**Joins** — link data across tables using foreign keys. Powerful but can be slow at massive scale.

**Normalization** — splitting data into separate tables to avoid duplication. Keeps data consistent but increases join complexity.

## When to Use
- Data has clear relationships and structure
- You need strong consistency (e.g. financial transactions, user accounts)
- Complex queries across multiple entities

## When to Avoid
- Unstructured or highly variable data → consider a [[no-sql|document DB]]
- Massive write throughput at scale → consider [[no-sql|NoSQL]]
- Simple key-value lookups → a cache or key-value store is faster
