---
title: "Basic Authentication"
description: "How HTTP Basic Authentication works and when to use it"
tags: [system-design, authentication, security, http]
draft: false
date: 2026-06-05
lastmod: 2026-06-05
---

## How It Works

The client sends credentials on every request inside the `Authorization` header, Base64-encoded.

```
Authorization: Basic <base64(username:password)>
```

Base64 is encoding, not encryption — it is trivially reversible. **Always use HTTPS.**

```
Client                              Server
  |                                   |
  |  GET /resource                    |
  |  Authorization: Basic dXNlcjpwYXNz|  valid credentials
  |  -------------------------------->|
  |                                   |  decode → verify ✓
  |  <-- 200 OK ----------------------|
  |                                   |
  |  GET /resource                    |
  |  Authorization: Basic d3Jvbmc=    |  wrong password
  |  -------------------------------->|
  |                                   |  decode → verify ✗
  |  <-- 401 Unauthorized ------------|
  |  WWW-Authenticate: Basic realm="."|
  |                                   |
  |  GET /resource                    |
  |  (no Authorization header)        |  missing credentials
  |  -------------------------------->|
  |                                   |
  |  <-- 401 Unauthorized ------------|
  |  WWW-Authenticate: Basic realm="."|
```

## Key Properties

| Property | Detail |
|---|---|
| **Stateless** | No session; credentials sent with every request |
| **Simple** | Natively supported by browsers and HTTP clients |
| **No logout** | Credentials are cached by the browser until the tab closes |
| **Credential exposure** | Visible in logs and proxies if not using TLS |

## Trade-offs

| | |
|---|---|
| **Simple to implement** | No token issuance, expiry logic, or key management |
| **Universally supported** | Every HTTP client and browser handles it out of the box |
| **Credentials on every request** | Higher exposure surface — a single intercepted request leaks the password |
| **No revocation** | You can't invalidate a session; changing the password is the only option |
| **No expiry** | Credentials are valid indefinitely until rotated |
| **Browser UX is poor** | The native browser prompt is unstyled and offers no logout mechanism |
| **Not suitable for third-party access** | Requires sharing the actual password; use OAuth for delegated access |

## When to Use It

- Internal tooling or admin panels behind TLS
- Service-to-service calls where simplicity outweighs the overhead of tokens
- Quick prototyping before a proper auth system is in place

Prefer [[overview#Common Mechanisms|token-based schemes]] (JWT, API keys) for public-facing APIs.

## Timing Attacks

When comparing credentials server-side, use a constant-time comparison to prevent timing attacks:

```python
# Python
import secrets
secrets.compare_digest(supplied, expected)
```

```go
// Go
subtle.ConstantTimeCompare([]byte(supplied), []byte(expected))
```

A naive `==` check short-circuits on the first mismatched byte, leaking information about how close a guess was.
