---
title: "API Protocols"
description: "HTTP versions, WebSockets, and gRPC — how they differ and when to reach for each"
tags: [system-design, api, networking, protocols]
draft: false
date: 2026-05-20
lastmod: 2026-05-20
---

## Overview

Protocol choice determines latency, connection overhead, and what communication patterns are possible. Most web APIs run on HTTP; the version and transport layer determine the performance ceiling.

## Core Concepts

### HTTP Versions

| Version | Transport | Key Improvement | Limitation |
|---------|-----------|-----------------|------------|
| HTTP/1.1 | TCP | Persistent connections (keep-alive) | Head-of-line blocking per connection |
| HTTP/2 | TCP | Multiplexing — multiple requests over one connection | TCP-level HOL blocking still present |
| HTTP/3 | QUIC (UDP) | Eliminates HOL blocking; faster handshake (0-RTT reconnect) | Less mature tooling, firewall issues with UDP |

**Head-of-line blocking:** In HTTP/1.1 a slow response blocks later requests in the same connection. HTTP/2 fixes this at the application layer but TCP still blocks if a packet is dropped. HTTP/3's QUIC moves to UDP and fixes it end-to-end.

### WebSockets

Full-duplex, persistent connection over a single TCP connection. Starts as an HTTP/1.1 upgrade request, then the protocol is switched.

- **Use when:** server needs to push data to the client without polling — chat, live scores, collaborative editing, stock tickers
- **Not for:** simple request/response — plain HTTP is simpler and more cacheable
- **Gotcha:** stateful connection means load balancers must use sticky sessions or a pub/sub layer (e.g. Redis) to fan out messages across servers

### gRPC

RPC framework built on HTTP/2. Payloads are binary Protobuf (not JSON), and the `.proto` file is the contract that generates typed client/server stubs.

```proto
service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
  rpc StreamUpdates (UserRequest) returns (stream UserResponse);
}
```

Supports four communication patterns:
| Pattern | Description |
|---------|-------------|
| Unary | Single request → single response (like REST) |
| Server streaming | Single request → stream of responses |
| Client streaming | Stream of requests → single response |
| Bidirectional streaming | Stream both ways simultaneously |

- **Use when:** internal microservice-to-microservice calls; you control both client and server; low-latency and type safety matter
- **Not for:** public APIs or browser clients (gRPC-Web needed; limited browser support)

### Long Polling vs SSE vs WebSockets

| Pattern | Direction | Connection | Use When |
|---------|-----------|------------|---------|
| Short polling | Client → Server | New request each time | Simple; acceptable latency |
| Long polling | Client → Server | Held open until data | Server push without WebSocket complexity |
| SSE (Server-Sent Events) | Server → Client | Persistent HTTP stream | One-way push (notifications, feeds) |
| WebSocket | Bidirectional | Persistent TCP | Full-duplex real-time (chat, gaming) |

SSE is simpler than WebSockets when you only need server-to-client push — it works over plain HTTP/2 and reconnects automatically.

## Trade-offs

| Protocol | Latency | Overhead | Browser Support | Best For |
|---------|---------|----------|-----------------|---------|
| HTTP/1.1 | Medium | Low | Universal | Simple APIs, maximum compatibility |
| HTTP/2 | Low | Low | Wide | Multiplexed REST, asset delivery |
| HTTP/3 | Lowest | Low | Growing | High-loss networks, mobile |
| WebSocket | Very low | Medium | Universal | Bidirectional real-time |
| gRPC | Very low | Low (binary) | Limited (gRPC-Web) | Internal services, streaming RPCs |
| SSE | Low | Low | Universal | Server-push only |

## HTTP Methods

| Method | Purpose |
|--------|---------|
| `GET` | Retrieve a resource — safe, idempotent, cacheable |
| `POST` | Create a resource — not idempotent |
| `PUT` | Replace a resource entirely — idempotent |
| `PATCH` | Partial update — not inherently idempotent |
| `DELETE` | Remove a resource — idempotent |
| `HEAD` | Same as GET but no response body — check existence/headers |
| `OPTIONS` | Discover allowed methods — used in CORS preflight |

## Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `204` | No Content (success, no body — common for DELETE) |
| `301` | Moved Permanently |
| `302` | Found (temporary redirect) |
| `304` | Not Modified (cache is valid) |
| `400` | Bad Request (malformed input) |
| `401` | Unauthorized (not authenticated) |
| `403` | Forbidden (authenticated but lacks permission) |
| `404` | Not Found |
| `409` | Conflict (e.g. duplicate resource) |
| `422` | Unprocessable Entity (valid syntax, invalid semantics) |
| `429` | Too Many Requests (rate limited) |
| `500` | Internal Server Error |
| `502` | Bad Gateway (upstream returned invalid response) |
| `503` | Service Unavailable (overloaded or down) |
| `504` | Gateway Timeout (upstream too slow) |

`401` = not authenticated. `403` = authenticated but not authorised.
