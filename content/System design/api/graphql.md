---
title: "GraphQL APIs"
description: "Query language for APIs that lets clients request exactly the data they need — solves over/under-fetching from REST."
tags: [system-design, api]
draft: false
date: 2026-05-21
lastmod: 2026-05-21
---

## Overview

GraphQL is a query language and runtime for APIs, developed at Facebook to solve the problem of mobile clients needing different data shapes from the same backend. Unlike [[RESTful APIs]] where the server defines the response shape, GraphQL lets the client specify exactly which fields it wants — no more, no less.

**Why it exists:** REST APIs often require multiple round-trips to fetch related data (N+1 requests), or return far more data than the client needs. GraphQL collapses this to a single request with a typed, client-driven shape.

## Core Concepts

### Schema and Type System

The schema is the contract between client and server. Everything is strongly typed.

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type Order {
  id: ID!
  total: Float!
  status: OrderStatus!
}

enum OrderStatus {
  PENDING
  SHIPPED
  DELIVERED
}
```

- `!` — non-nullable field
- `[Type!]!` — non-nullable list of non-nullable items
- `ID` — scalar for unique identifiers (serialised as String)
- **Scalars:** `String`, `Int`, `Float`, `Boolean`, `ID` — plus custom scalars (e.g. `DateTime`)

The schema is introspectable — clients can query the schema itself (`__schema`, `__type`), enabling tools like GraphiQL and code generators.

### Queries and Mutations

**Query** — read-only, safe to retry:

```graphql
query GetUserOrders($userId: ID!) {
  user(id: $userId) {
    name
    orders {
      id
      total
      status
    }
  }
}
```

**Mutation** — write operation, returns the modified resource:

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    total
    status
  }
}
```

**Subscription** — real-time updates over WebSocket:

```graphql
subscription OnOrderUpdated($orderId: ID!) {
  orderUpdated(id: $orderId) {
    status
  }
}
```

All operations go to a single endpoint (`POST /graphql`). Variables are passed as JSON alongside the query string — never interpolated into the query (prevents injection).

### Request / Response Flow

```
Client                          GraphQL Server
  |                                  |
  |── POST /graphql ────────────────>|
  |   { query, variables }           |── parse & validate query
  |                                  |── resolve fields (resolvers)
  |                                  |── fetch from DB / services
  |<─────────────────────────────── 200 OK (always)
  |   {                              |
  |     "data": { ... },             |
  |     "errors": [ ... ]            |   ← partial success possible
  |   }                              |
```

HTTP status is **always 200** — errors are in the response body.

### Handling Errors

GraphQL distinguishes two error types:

| Type | Where | Meaning |
|---|---|---|
| **Request errors** | `errors[]`, `data: null` | Invalid query, auth failure — whole request failed |
| **Field errors** | `errors[]`, `data` partially populated | One resolver failed; other fields still returned |

```json
{
  "data": {
    "user": {
      "name": "Alice",
      "orders": null
    }
  },
  "errors": [
    {
      "message": "Not authorised to view orders",
      "path": ["user", "orders"],
      "extensions": { "code": "FORBIDDEN" }
    }
  ]
}
```

Always include a machine-readable `extensions.code` — clients should not parse `message` strings. Never expose stack traces or internal error details in production.

## Best Practices

### Schema Design

- **Design schema around the client's needs**, not the DB shape — it's a product API, not a database API
- Use **input types** for mutations: `createUser(input: CreateUserInput!)` not `createUser(name: String!, email: String!)`
- **Paginate lists** — never return unbounded arrays. Use cursor-based pagination (Relay spec) for scalability:

```graphql
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
}
```

- **Avoid deeply nested mutations** — keep mutations flat and return the affected resource

### Performance

| Problem | Solution |
|---|---|
| **N+1 queries** | Use DataLoader to batch + deduplicate resolver DB calls |
| **Over-fetching at resolver level** | Use query analysis to project only requested columns to DB |
| **Expensive queries** | Set query depth limits, complexity limits, and timeouts |
| **Caching** | GraphQL isn't cache-friendly by default — use persisted queries + CDN, or field-level caching with `@cacheControl` |

### Security

- **Disable introspection in production** if the API is not public — it exposes your full schema
- **Authenticate before resolving** — validate tokens at the gateway, not in each resolver
- **Rate limit by query complexity**, not just request count

## Trade-offs vs REST

| | GraphQL | REST |
|---|---|---|
| **Client flexibility** | Client controls shape | Server controls shape |
| **Caching** | Hard — single endpoint, POST by default | Easy — GET requests cache at CDN/browser |
| **Tooling** | Excellent (code-gen, playground) | Universal |
| **Best for** | Multiple clients with different data needs, complex graphs | Simple CRUD, public APIs, high-volume reads |
| **Versioning** | Schema evolution (add fields, deprecate with `@deprecated`) | URL versioning (`/v2/`) |

Use GraphQL when you have many clients (mobile, web, third-party) with divergent data requirements. Prefer [[RESTful APIs]] for public APIs or when HTTP caching is critical.
