---
title: "JWT Authentication"
description: "How JSON Web Tokens work, their structure, signing algorithms, common vulnerabilities, and when to use them"
tags: [system-design, authentication, security, jwt, tokens]
draft: false
date: 2026-06-05
lastmod: 2026-06-05
---

## How It Works

The server issues a signed token after login. The client stores it and sends it with every request. The server verifies the signature — no database lookup required.

```
Client                                        Server
  |                                              |
  |  POST /login {user, password}                |
  |  -------------------------------------------->
  |                                              |  verify credentials ✓
  |                                              |  sign payload → JWT
  |  <-- { token: "eyJ..." } --------------------|
  |                                              |
  |  GET /orders                                 |
  |  Authorization: Bearer eyJ...               |
  |  -------------------------------------------->
  |                                              |  verify signature ✓
  |                                              |  read claims (no DB hit)
  |  <-- 200 OK ----------------------------------|
```

The signature is cryptographic proof the server issued the token and it hasn't been tampered with. A valid signature means the claims inside can be trusted.

## Token Structure

A JWT is three Base64URL-encoded JSON objects joined by dots:

```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9   ← Header
.eyJzdWIiOiJ1c3IxMjMiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MTcwMDAwMDB9  ← Payload
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature
```

**Header**
```json
{ "alg": "RS256", "typ": "JWT" }
```

**Payload (claims)**
```json
{
  "sub": "usr123",
  "role": "admin",
  "iat": 1717000000,
  "exp": 1717003600
}
```

**Signature**
```
RS256: RSASSA-PKCS1-v1_5(SHA256(base64url(header) + "." + base64url(payload)), privateKey)
```

The payload is encoded, not encrypted. Anyone can decode it — never put secrets inside a JWT.

## Standard Claims

| Claim | Meaning | Notes |
|---|---|---|
| `sub` | Subject — who the token is about | Typically a user ID |
| `iss` | Issuer — who signed it | Validate this on receipt |
| `aud` | Audience — intended recipient | Validate this to prevent token reuse across services |
| `exp` | Expiry (Unix timestamp) | Always set; reject tokens past this |
| `iat` | Issued at | Useful for detecting tokens issued before a password reset |
| `jti` | JWT ID | Unique ID; required if you need a revocation blocklist |

## Signing Algorithms

| Algorithm | Type | Use When |
|---|---|---|
| **HS256** | HMAC-SHA256 (symmetric) | Single service — issuer and verifier share the same secret |
| **RS256** | RSA-SHA256 (asymmetric) | Multiple services — issuer holds private key; verifiers get the public key |
| **ES256** | ECDSA-SHA256 (asymmetric) | Same as RS256 but smaller signatures and faster verification |

Prefer **RS256 or ES256** for distributed systems. With HS256, every service that verifies tokens must hold the signing secret — meaning any of them could also forge tokens.

## Token Storage

| Location | XSS risk | CSRF risk | Notes |
|---|---|---|---|
| `localStorage` | High — JS can read it | None | Easy to implement; don't use for sensitive apps |
| `sessionStorage` | High — JS can read it | None | Cleared on tab close; same XSS risk |
| `HttpOnly` cookie | None — JS blocked | Present | Combine with `SameSite=Lax`; best default |
| In-memory (JS var) | Low — not persisted | None | Lost on refresh; suitable for SPAs with refresh token flow |

The "JWTs should never be in cookies" claim is a myth. An `HttpOnly; Secure; SameSite=Lax` cookie is safer than `localStorage`.

## Refresh Token Pattern

Short-lived access tokens + long-lived refresh tokens limit the blast radius of a stolen token:

```
┌────────────────────────────────────────────────────┐
│ Access token  │ Short-lived (5–15 min)              │
│               │ Sent on every API request           │
│               │ Stateless — no DB lookup            │
├────────────────────────────────────────────────────┤
│ Refresh token │ Long-lived (days/weeks)             │
│               │ Stored server-side (allows revoke)  │
│               │ Only sent to /token endpoint        │
└────────────────────────────────────────────────────┘

Access token expires
  └──► POST /token  { refreshToken }
         └──► validate refresh token in DB ✓
              └──► issue new access token + rotate refresh token
```

Rotate the refresh token on every use (refresh token rotation). If a reused token is detected, invalidate the entire family — it signals a stolen token.

## Revocation Problem

JWTs are stateless — a valid token stays valid until `exp`, even after logout or a password change.

Mitigations (in order of complexity):

1. **Short expiry** (5–15 min) — limits the window without infrastructure overhead
2. **`iat` check** — reject tokens issued before a known event (e.g., store `passwordChangedAt` per user; reject tokens with `iat < passwordChangedAt`)
3. **`jti` blocklist** — store revoked JTIs in Redis with TTL = token expiry; check on every request. Adds a DB/cache lookup, giving up statelessness for revocability.

Pick based on your tolerance: short expiry for most apps, `iat` check for post-logout invalidation, blocklist for hard real-time revocation.

## Common Vulnerabilities

**`alg: none` attack** — some early libraries accepted unsigned tokens when `alg` was set to `none`. Always explicitly specify the expected algorithm on verification; never accept what the token header claims.

```python
# Wrong — trusts the header
jwt.decode(token, key)

# Correct — pins the algorithm
jwt.decode(token, key, algorithms=["RS256"])
```

**Algorithm confusion (RS256 → HS256)** — if a library falls back to HS256, an attacker can sign a token with the server's *public* key (which is public) and it will verify. Again: pin the algorithm.

**Weak secret (HS256)** — short or guessable HMAC secrets can be brute-forced offline once any token is intercepted. Use ≥256 bits of random secret.

**Sensitive data in payload** — the payload is Base64-decoded in seconds. Never store passwords, PII, or internal system details in claims. Use JWE (JSON Web Encryption) if the payload must be confidential.

**Missing `aud` validation** — a token issued for Service A is accepted by Service B. Always validate `aud` to prevent token reuse across services.

## Trade-offs

| | |
|---|---|
| **Stateless verification** | No DB lookup to validate a token; scales horizontally without shared session store |
| **Self-contained** | Claims travel with the token; downstream services don't need to call back to an auth service |
| **No instant revocation** | A stolen token is valid until expiry unless you build a blocklist (which adds state back) |
| **Payload is public** | Base64 is not encryption; anything in the payload is readable by anyone with the token |
| **Clock skew sensitivity** | Expiry validation depends on system clocks being in sync; allow a small leeway (≤60 s) |
| **Larger than session cookies** | A JWT with several claims is 200–500 bytes; sent on every request |

## When to Use

- **Distributed / microservice architectures** — services can verify tokens independently without hitting a central auth store
- **API-first products** — mobile clients, SPAs, and third-party integrations where cookies aren't natural
- **Short-lived delegated access** — pass a scoped JWT to a downstream service for a single operation
- **Cross-domain auth** — tokens travel in headers, not cookies, so origin restrictions don't apply

## When NOT to Use

- **When you need hard logout** — use [[session-based-authentication]] if immediate revocation is non-negotiable (banking, healthcare)
- **As a session replacement in a monolith** — sessions are simpler, revocable, and have less attack surface for a single-server web app
- **To store server-side state** — bloated JWTs with dozens of claims are a sign the payload belongs in a DB, not a token
- **When the client is only a browser** — a server-rendered app has no need for JWTs; sessions are the right default

See also: [[session-based-authentication]], [[api-key-authentication]], [[overview]]
