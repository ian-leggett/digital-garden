---
title: "API Key Authentication"
description: "How API key authentication works, how to implement it securely, and when to prefer it over other schemes"
tags: [system-design, authentication, security, api]
draft: false
date: 2026-06-05
lastmod: 2026-06-05
---

## How It Works

The client includes a long-lived secret in every request. The server looks up the key, identifies the caller, and decides whether to allow the request.

```
Client                                   Server
  |                                         |
  |  GET /data                              |
  |  X-Api-Key: sk_live_abc123...           |
  |  -------------------------------------> |
  |                                         |  hash(key) → lookup → ✓
  |  <-- 200 OK ----------------------------|
  |                                         |
  |  GET /data                              |
  |  X-Api-Key: invalid_key                 |
  |  -------------------------------------> |
  |                                         |  hash(key) → lookup → ✗
  |  <-- 401 Unauthorized -----------------|
```

The key is typically passed in a header (`X-Api-Key` or `Authorization: Bearer <key>`). Avoid query strings — keys appear in server logs and browser history.

## Key Properties

| Property | Detail |
|---|---|
| **Stateless** | No session to manage; each request is self-contained |
| **Long-lived** | Valid until explicitly revoked; no built-in expiry |
| **Opaque** | Carries no claims — the server must look up what the key is allowed to do |
| **Identifying** | Maps to a client/account, enabling per-key rate limiting and audit logs |

## Key Format

A well-designed key has three parts:

```
sk_live_4a7bF3xQpR2mN8...
^^  ^^^^  ^^^^^^^^^^^^^^^^
|   env   random bytes (≥128 bits entropy)
prefix
```

- **Prefix** (`sk_`, `ghp_`, `pk_`) enables secret scanning in CI/code hosts to auto-detect leaks
- **Environment segment** (`live` vs `test`) prevents test keys reaching production
- **Random suffix** — use a CSPRNG; `base62` or `base58` keeps it URL-safe

128 bits of entropy (22+ base62 chars) is the practical minimum for brute-force resistance.

## Storing Keys Server-Side

Never store the raw key. Treat it like a password.

```
┌─────────────────────────────────────────────────┐
│ Key issuance                                    │
│  1. Generate random bytes                       │
│  2. Return full key to client (only time shown) │
│  3. Store: hash(key) + prefix + metadata        │
└─────────────────────────────────────────────────┘
```

Use a fast hash (SHA-256 is fine — keys have high entropy, rainbow tables don't apply). bcrypt/argon2 are unnecessary and add latency on every request.

```python
import hashlib, secrets

raw_key = "sk_live_" + secrets.token_urlsafe(32)
key_hash = hashlib.sha256(raw_key.encode()).hexdigest()

# Store key_hash, never raw_key
# Return raw_key to the user once
```

Store alongside the hash: a display hint (first 8 chars), creation date, last-used timestamp, scopes, and owner ID.

## Scoping

Keys should carry the minimum permissions needed. Model scopes explicitly:

```
read:orders        — GET /orders only
write:orders       — POST/PATCH/DELETE /orders
admin              — everything
```

Broad `admin` keys for all integrations is a common mistake — a compromised CI key shouldn't be able to delete production data.

## Security Checklist

| Concern | Mitigation |
|---|---|
| Key leak in logs | Use headers, not query params; scrub `X-Api-Key` from access logs |
| Key leak in source control | Prefix enables GitHub/GitLab secret scanning |
| Compromised key | Revoke instantly; design for easy rotation from day one |
| Brute force | Rate limit by IP on auth failures; ≥128 bits entropy makes guessing infeasible |
| Over-privileged key | Scope keys to the minimum required permissions |
| No audit trail | Log key prefix + timestamp + endpoint on every request |

## Trade-offs

| | |
|---|---|
| **Simple to implement** | No OAuth flow, no token exchange, no refresh logic |
| **Easy to distribute** | A string the client pastes into their config |
| **Good for M2M** | Ideal for server-to-server integrations where there is no human user |
| **No expiry by default** | Long-lived keys increase blast radius if leaked; mitigate with rotation policy |
| **Opaque** | Server must do a DB lookup per request (vs JWT which self-verifies); cache the hash lookup to keep latency down |
| **No delegated access** | The key owner must share it directly — use OAuth for third-party integrations |
| **Credential, not identity** | Maps to an account, not a user session; poor fit for interactive login flows |

## When to Use

- Service-to-service / machine-to-machine calls
- Public API products where developers register for access
- Webhooks — the receiver validates an `X-Webhook-Secret` header
- Internal tooling where OAuth overhead isn't justified

## When NOT to Use

- **End-user authentication** — use sessions or JWTs instead; API keys have no concept of a logged-in user
- **Third-party delegated access** — use OAuth 2.0; you should not ask users to share their key with another app
- **Short-lived credentials** — if the key needs to expire automatically (e.g., temporary access), use signed short-lived tokens instead
- **Browser clients** — keys embedded in frontend JS are public; use OAuth PKCE or session cookies

## Rotation

Design rotation in from the start. A common pattern is dual-key validity:

```
1. Issue new key (both old and new are valid)
2. Client updates their config
3. Revoke old key after a grace period
```

Never force a hard cutover — callers need time to rotate without downtime.

## Caching the Lookup

A DB hit on every request is expensive at scale. Cache the hash → metadata mapping:

```
request key → sha256 → cache.get(hash)
                          hit  → use metadata
                          miss → db.get(hash) → cache.set(hash, ttl=60s)
```

Short TTL (30–60 s) means a revoked key stops working quickly without hammering the DB.

See also: [[basic-auth]], [[overview]]
