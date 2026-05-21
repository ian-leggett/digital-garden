---
title: "RESTful APIs"
description: "Architectural style for distributed hypermedia systems using HTTP — the dominant pattern for web APIs."
tags: [system-design, api]
draft: false
date: 2026-05-21
lastmod: 2026-05-21
---

## Overview

REST (Representational State Transfer) is an architectural style, not a protocol. It uses HTTP verbs and stateless request/response cycles to expose resources. A "RESTful" API honours a set of constraints that make it predictable, scalable, and cache-friendly.

## Core Concepts

### The 6 Constraints

| Constraint | What it means |
|---|---|
| **Stateless** | Each request carries all context — no server-side session state |
| **Client–Server** | UI and data storage concerns are separated |
| **Cacheable** | Responses must declare whether they can be cached |
| **Uniform Interface** | Resources identified by URIs; manipulation through representations |
| **Layered System** | Client can't tell if it's talking to origin or intermediary (proxy, CDN) |
| **Code on Demand** *(optional)* | Server can send executable code (e.g. JavaScript) |

Statelessness is the most important — it's what enables horizontal scaling with no shared session store.

### Resource Modeling and URL Design

Model **nouns**, not verbs. The HTTP method carries the action.

```
# Good — resources as nouns
GET    /orders
GET    /orders/{id}
POST   /orders
PUT    /orders/{id}
DELETE /orders/{id}

# Bad — verbs in the path
POST   /createOrder
GET    /getOrder?id=123
POST   /deleteOrder
```

**Hierarchy reflects ownership:**

```
/users/{userId}/orders          ← orders belonging to a user
/users/{userId}/orders/{id}     ← specific order
/orders/{id}/items              ← items within an order
```

Keep nesting shallow — two levels max. If a resource makes sense standalone, give it a top-level path too.

**Versioning:** prefix with `/v1/` in the path. Header-based versioning (`Accept: application/vnd.api+json;version=2`) is cleaner in theory but harder to test and cache.

### HTTP Methods

| Method | Semantics | Idempotent | Safe |
|---|---|---|---|
| GET | Read | Yes | Yes |
| POST | Create | No | No |
| PUT | Replace (full) | Yes | No |
| PATCH | Partial update | No* | No |
| DELETE | Remove | Yes | No |

*PATCH is idempotent if the patch document is deterministic.

Use `PUT` when the client controls the resource ID (e.g. UUID assigned client-side). Use `POST` when the server assigns the ID.

### Status Codes and Error Handling

```
2xx — Success
  200 OK           — GET, PUT, PATCH succeeded
  201 Created      — POST succeeded; include Location header
  204 No Content   — DELETE succeeded; no body

4xx — Client error (don't retry without fixing the request)
  400 Bad Request  — malformed syntax, validation failure
  401 Unauthorized — missing or invalid credentials
  403 Forbidden    — authenticated but not authorised
  404 Not Found    — resource doesn't exist
  409 Conflict     — state conflict (e.g. duplicate create)
  422 Unprocessable Entity — valid syntax, invalid semantics
  429 Too Many Requests    — rate limited

5xx — Server error (safe to retry with backoff)
  500 Internal Server Error
  503 Service Unavailable  — include Retry-After header
```

**Error response body** — be consistent:

```json
{
  "error": "VALIDATION_FAILED",
  "message": "email is required",
  "field": "email"
}
```

Never return `200 OK` with an error body — it breaks clients and monitoring.

## Request/Response Flow

```
Client                        API Gateway / Origin
  |                                  |
  |── GET /orders/42 ───────────────>|
  |   Authorization: Bearer <token>  |
  |                                  |── authenticate
  |                                  |── authorise
  |                                  |── fetch resource
  |<─────────────────────────────── 200 OK
  |   Content-Type: application/json |
  |   Cache-Control: max-age=60      |
  |   { "id": 42, ... }              |
```

## Trade-offs

| vs. | RESTful APIs | Alternative |
|---|---|---|
| **GraphQL** | Simple, cacheable, easy to debug | One endpoint, client controls shape — better for complex querying or many clients with different data needs |
| **gRPC** | Human-readable, universal tooling | Binary protocol, lower latency, strong typing — better for internal service-to-service |
| **SOAP** | Lightweight, no schema required | Strict contract via WSDL — better for enterprise/legacy integrations |

REST is the default for public APIs and browser clients. Prefer [[gRPC]] for internal microservice communication where performance matters.
