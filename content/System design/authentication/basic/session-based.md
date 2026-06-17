---
title: "Session-Based Authentication"
description: "How server-side session authentication works, cookie security flags, scaling considerations, and common attack vectors"
tags: [system-design, authentication, security, http, cookies]
draft: false
date: 2026-06-05
lastmod: 2026-06-05
---

## How It Works

The server creates a session record after a successful login and hands the client an opaque session ID via a cookie. Every subsequent request carries the cookie; the server looks up the session to identify the caller.

```
Client                                    Server
  |                                          |
  |  POST /login {user, password}            |
  |  ---------------------------------------->
  |                                          |  verify credentials ✓
  |                                          |  sessions[sid] = {userId, roles, expiry}
  |  <-- Set-Cookie: sid=abc123; HttpOnly ---|
  |                                          |
  |  GET /dashboard                          |
  |  Cookie: sid=abc123                      |
  |  ---------------------------------------->
  |                                          |  lookup sessions[abc123] → valid ✓
  |  <-- 200 OK -----------------------------|
  |                                          |
  |  POST /logout                            |
  |  Cookie: sid=abc123                      |
  |  ---------------------------------------->
  |                                          |  delete sessions[abc123]
  |  <-- 200 + Set-Cookie: sid=; Max-Age=0 --|
```

The session ID itself carries no information — it is a random lookup key. The actual user data lives entirely on the server.

## Cookie Security Flags

All three flags should be set in production:

| Flag | Effect | Without it |
|---|---|---|
| `HttpOnly` | JS cannot read the cookie (`document.cookie`) | XSS can steal the session ID |
| `Secure` | Cookie only sent over HTTPS | Exposed on plain HTTP connections |
| `SameSite=Lax` | Cookie not sent on cross-site POST | CSRF attacks become trivially easy |

```http
Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600
```

`SameSite=Strict` blocks the cookie on all cross-site navigations (including links from other sites). Use `Lax` for most apps; `Strict` for high-security flows like banking.

## Session Lifecycle

```
Login ──► Create session ──► Regenerate ID ──► Issue cookie
                                  │
                         (prevents fixation)

Request ──► Validate session ──► Check expiry ──► Slide idle timer
                  │
             Renew cookie if
             expiry is close

Logout ──► Delete session server-side ──► Expire cookie client-side
```

**Always regenerate the session ID after privilege escalation** (login, sudo, role change). Reusing the pre-login session ID enables session fixation.

## Session Storage

| Store | Pros | Cons |
|---|---|---|
| **In-memory (process)** | Zero latency | Lost on restart; doesn't scale across instances |
| **Database** | Durable; easy to audit and revoke | DB hit per request; add an index on session ID |
| **Redis / Memcached** | Fast; TTL-native; shared across instances | Extra infrastructure dependency |

In-memory is fine for single-instance apps or prototypes. Use Redis for anything that runs more than one instance.

## Expiry: Two Timers

Use both together:

- **Idle timeout** — reset on each request. Session expires if the user goes quiet (e.g., 30 min).
- **Absolute timeout** — session expires regardless of activity (e.g., 8 h). Forces re-authentication for long-running sessions.

Idle-only expiry means a session technically never expires as long as the user keeps clicking.

## Scaling: Sticky Sessions vs Shared Store

```
Without shared store:

  Request 1 ──► Instance A (session lives here) ──► 200 OK
  Request 2 ──► Instance B (no session)          ──► 401

Options:
  1. Sticky sessions (load balancer pin) — simple, but defeats horizontal scaling and fails on instance restart
  2. Shared session store (Redis) — preferred; any instance can validate any session
```

## Security Considerations

**Session fixation** — attacker sets a known session ID before the victim logs in, then reuses it. Fix: always issue a new session ID on login.

**Session hijacking** — attacker steals the cookie via XSS, network sniffing, or log leakage. Fix: `HttpOnly` + `Secure` flags; scrub cookie values from logs.

**CSRF** — attacker tricks the browser into sending a state-changing request with the victim's cookie. Fix: `SameSite=Lax` covers most cases; add a CSRF token for `SameSite=None` scenarios.

**Session enumeration** — short or sequential IDs are guessable. Fix: use ≥128 bits of CSPRNG randomness; never use user IDs or timestamps as session IDs.

## Trade-offs

| | |
|---|---|
| **Instant revocation** | Delete the server-side record and the session is dead immediately — unlike JWTs which remain valid until expiry |
| **Stateful** | Server must store and look up session data on every request; adds latency and a scaling concern |
| **Familiar browser model** | Cookies are managed automatically by the browser; no token-handling logic in JS needed |
| **Not great for APIs** | Native mobile and server-to-server callers don't have a cookie jar; use tokens instead |
| **CSRF surface** | Cookies are sent automatically by browsers, including from other origins — requires SameSite / CSRF tokens |
| **Single-device logout only** | Logging out on one device doesn't invalidate sessions on others unless you store all session IDs per user |

## When to Use

- Traditional web apps with server-rendered pages
- Apps that need hard logout guarantees (e.g., banking, admin panels)
- Scenarios where the user base is browser-only

## When NOT to Use

- **REST/GraphQL APIs consumed by mobile or third-party clients** — cookies don't translate well; use [[api-key-authentication]] or JWT
- **Stateless infrastructure** — serverless functions with no shared store have no place to keep session state
- **Cross-domain single sign-on** — cookies are origin-scoped; use OAuth 2.0 / OpenID Connect instead
- **High-read, latency-sensitive paths** — a session store lookup on every request adds RTT; a self-verifying token (JWT) avoids it at the cost of revocability

See also: [[basic-auth]], [[api-key-authentication]], [[overview]]
