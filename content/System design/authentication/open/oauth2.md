---
title: "OAuth 2.0"
description: "How OAuth 2.0 delegated authorisation works, the four active grant types, token lifecycle, and common security pitfalls"
tags: [system-design, authentication, security, oauth, tokens]
draft: false
date: 2026-06-05
lastmod: 2026-06-05
---

## What OAuth 2.0 Is (and Isn't)

OAuth 2.0 is an **authorisation** framework — it lets a user grant a third-party application limited access to their resources without sharing their password.

It is **not** an authentication protocol. It answers "what is this app allowed to do?" not "who is this user?" For authentication, add [[openid-connect]] on top.

```
Without OAuth                    With OAuth
─────────────────                ──────────────────────────────
App asks for your                App asks for permission to
  Gmail password         →         read your Gmail contacts
You share it                     You approve in Google's UI
App has full access              App gets a scoped token
                                 Your password never shared
```

## Roles

| Role | Also called | Responsibility |
|---|---|---|
| **Resource Owner** | User | Grants permission to their resources |
| **Client** | App | Requests access on behalf of the user |
| **Authorization Server** | IdP / AS | Authenticates the user, issues tokens |
| **Resource Server** | API | Holds the protected resources; validates tokens |

The Authorization Server and Resource Server are often the same service (e.g. Google), but they are logically distinct.

## Grant Types

RFC 9700 (2025) deprecates Implicit and Resource Owner Password. Four grants remain active:

### 1. Authorization Code + PKCE

The standard flow for apps with a user present. PKCE is now **required** for all public clients (SPAs, mobile) and recommended for confidential clients too.

```
Client                        Auth Server               Resource Server
  |                               |                           |
  |  Generate code_verifier       |                           |
  |  code_challenge = S256(verifier)                          |
  |                               |                           |
  |  GET /authorize               |                           |
  |  ?client_id=...               |                           |
  |  &redirect_uri=...            |                           |
  |  &scope=read:contacts         |                           |
  |  &state=random_csrf_token     |                           |
  |  &code_challenge=...          |                           |
  |  &code_challenge_method=S256  |                           |
  |  ----------------------------►|                           |
  |                               |  user logs in & approves  |
  |  ◄-- redirect to              |                           |
  |     /callback                 |                           |
  |     ?code=AUTH_CODE           |                           |
  |     &state=random_csrf_token  |                           |
  |                               |                           |
  |  verify state matches ✓       |                           |
  |                               |                           |
  |  POST /token                  |                           |
  |  { code, redirect_uri,        |                           |
  |    code_verifier }            |                           |
  |  ----------------------------►|                           |
  |                               |  verify S256(verifier)    |
  |                               |    == code_challenge ✓    |
  |  ◄-- { access_token,          |                           |
  |        refresh_token,         |                           |
  |        expires_in }           |                           |
  |                               |                           |
  |  GET /contacts                |                           |
  |  Authorization: Bearer <token>|---------------------------►
  |                               |                           | verify token ✓
  |  ◄────────────────────────────|---------------------------◄ 200 OK
```

**PKCE** (Proof Key for Code Exchange) prevents authorization code interception: only the client that generated `code_verifier` can exchange the code for tokens.

### 2. Client Credentials

Machine-to-machine. No user involved — the client authenticates as itself.

```
Client                              Auth Server
  |                                     |
  |  POST /token                        |
  |  { grant_type: client_credentials,  |
  |    client_id, client_secret,        |
  |    scope: "reports:read" }          |
  |  ----------------------------------►|
  |                                     |  authenticate client ✓
  |  ◄-- { access_token, expires_in } --|
```

Use for: backend services, cron jobs, CI pipelines. There is no refresh token — just re-authenticate when the token expires.

### 3. Device Authorization

For devices with no browser or limited input (TVs, CLI tools, IoT).

```
Device                 Auth Server              User's Phone/Browser
  |                        |                           |
  |  POST /device/code     |                           |
  |  ───────────────────►  |                           |
  |  ◄── device_code,      |                           |
  |       user_code,        |                           |
  |       verification_uri  |                           |
  |                         |                           |
  |  Display: "Go to        |                           |
  |  example.com/activate   |  user visits URL ────────►|
  |  Enter code: ABCD-1234" |  enters user_code ───────►|
  |                         |  approves ───────────────►|
  |                         |                           |
  |  poll POST /token       |                           |
  |  (every 5s)  ─────────►|                           |
  |  ◄── { access_token }  |  (once approved)          |
```

### 4. Refresh Token

Not a standalone grant — used alongside Authorization Code to get new access tokens without re-prompting the user.

```
Client                              Auth Server
  |                                     |
  |  POST /token                        |
  |  { grant_type: refresh_token,       |
  |    refresh_token: <token> }         |
  |  ----------------------------------►|
  |                                     |  validate + rotate ✓
  |  ◄-- { new access_token,            |
  |         new refresh_token }         |
```

Always rotate refresh tokens on use. If a reused token is detected, invalidate the entire token family — it indicates theft.

## Scopes

Scopes define what access the client is requesting. They are strings agreed between the AS and RS.

```
scope=read:contacts write:calendar offline_access
       ─────────────────────────────  ───────────────
       resource-specific permissions  request refresh token
```

**Principle of least privilege:** request only what you need. Users are more likely to approve a narrow scope, and a leaked token does less damage.

## Token Types

| Token | Lifetime | Stored server-side | Purpose |
|---|---|---|---|
| **Authorization code** | Seconds (one-time use) | No | Exchanged for tokens at the token endpoint |
| **Access token** | Minutes (5–60 min) | No | Sent to the Resource Server on every request |
| **Refresh token** | Days–weeks | Yes | Used to get new access tokens without re-auth |

Access tokens are typically JWTs so the Resource Server can verify them without calling the AS. See [[token-based/jwt]].

## Security Checklist

| Concern | Mitigation |
|---|---|
| CSRF on the callback | Generate a random `state` param; verify it matches on return |
| Code interception | PKCE — bind the code to the originating client |
| Open redirect | Exact-match `redirect_uri` — never allow prefix or wildcard matching |
| Token leakage in logs | Tokens in the fragment (`#`) are not sent to servers; avoid query params |
| Overprivileged tokens | Request minimum scopes; short expiry limits blast radius |
| Refresh token theft | Rotate on use; detect reuse and invalidate the whole family |
| Weak client secret | ≥256-bit random secret; rotate periodically |

## Trade-offs

| | |
|---|---|
| **No password sharing** | The user's credentials never leave the Authorization Server |
| **Granular scopes** | Users see exactly what they're granting; tokens carry only what's needed |
| **Revocable access** | Revoke a token at the AS without changing the user's password |
| **Complex flow** | More moving parts than API keys or Basic Auth; harder to debug |
| **Multiple round-trips** | Authorization Code flow requires redirects and a token exchange before the API call |
| **AS is a single point of failure** | If the Authorization Server is down, no new tokens can be issued |
| **Not authentication** | OAuth alone doesn't tell you who the user is — add OIDC for that |

## Deprecated Flows — Do Not Use

**Implicit flow** — tokens returned in the URL fragment, visible in browser history and server logs. Replaced by Authorization Code + PKCE. Deprecated in RFC 9700.

**Resource Owner Password Credentials (ROPC)** — client collects the user's password and sends it to the AS. Defeats the core purpose of OAuth (no password sharing) and removes phishing resistance. Deprecated in RFC 9700.

## When to Use

- **Third-party integrations** — letting another app act on a user's behalf ("Connect with Google", "Post to Slack")
- **Microservices** — Client Credentials for service-to-service calls with scoped access
- **Mobile / SPA** — Authorization Code + PKCE for browser and native app clients
- **Delegated admin** — granting a tool limited access to manage resources without full admin rights

## When NOT to Use

- **First-party login to your own app** — your app and auth server are the same entity; OAuth adds complexity with no benefit. Use [[session-based-authentication]] or direct JWT issuance
- **Simple M2M with no scopes** — if both services are internal and owned by you, [[api-key-authentication]] is simpler
- **When you need to know who the user is** — OAuth access tokens identify what is allowed, not who is asking. Use OpenID Connect (OIDC) for identity

See also: [[token-based/jwt]], [[session-based-authentication]], [[api-key-authentication]], [[overview]]
