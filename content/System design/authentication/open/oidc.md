---
title: "OpenID Connect (OIDC)"
description: "How OpenID Connect adds an identity layer on top of OAuth 2.0, what the ID token contains, and how to validate it correctly"
tags: [system-design, authentication, security, oidc, oauth, tokens]
draft: false
date: 2026-06-05
lastmod: 2026-06-05
---

## What OIDC Is

OpenID Connect is a thin identity layer built on top of [[oauth2]]. OAuth 2.0 answers "what can this app do?" — OIDC answers "who is the user?"

It adds one new token type (the ID token) and a standard set of claims to the OAuth 2.0 flow.

```
OAuth 2.0 alone                   OAuth 2.0 + OIDC
────────────────────              ──────────────────────────────
Issues: access_token        →     Issues: access_token
                                          + id_token
Tells you: what's allowed         Tells you: what's allowed
                                           + who the user is
```

You do not need a separate `/userinfo` call to know the user's identity — it's in the ID token itself.

## The ID Token

The ID token is a signed JWT issued alongside the access token. It is for the **client** to consume — not to send to the Resource Server.

```json
{
  "iss": "https://accounts.google.com",
  "sub": "118290929849263...",
  "aud": "your_client_id",
  "exp": 1717003600,
  "iat": 1717000000,
  "nonce": "n-0S6_WzA2Mj",
  "email": "user@example.com",
  "email_verified": true,
  "name": "Jane Smith",
  "picture": "https://..."
}
```

### Required Claims

| Claim | Meaning |
|---|---|
| `iss` | Issuer — the Identity Provider's URL. Must match the expected IdP. |
| `sub` | Subject — stable, unique user ID at this IdP. Use this as your internal user key. |
| `aud` | Audience — must equal your `client_id`. Reject tokens meant for others. |
| `exp` | Expiry — reject tokens past this timestamp. |
| `iat` | Issued at — used to detect stale tokens. |
| `nonce` | Echoed back from your login request. Validates replay prevention (see below). |

`sub` is the right field to use as a user identifier — not `email`, which can change or be shared across providers.

## Flow

OIDC uses the same Authorization Code + PKCE flow as OAuth 2.0 with two additions: the `openid` scope and a `nonce` parameter.

```
Client                           Identity Provider (IdP)
  |                                       |
  |  GET /authorize                       |
  |  ?scope=openid profile email          |  ← "openid" scope triggers OIDC
  |  &nonce=random_value                  |  ← bound to this request
  |  &code_challenge=...   (PKCE)         |
  |  &state=csrf_token                    |
  |  ------------------------------------►|
  |                                       |  user authenticates
  |  ◄── redirect ?code=AUTH_CODE         |
  |                                       |
  |  POST /token                          |
  |  { code, code_verifier }              |
  |  ------------------------------------►|
  |                                       |
  |  ◄── {                                |
  |        access_token,                  |
  |        id_token,         ← new        |
  |        refresh_token,                 |
  |        expires_in                     |
  |      }                                |
  |                                       |
  |  validate id_token (see below) ✓      |
  |  read sub → look up/create user       |
```

## Validating the ID Token

Validation is mandatory before trusting any claim:

```
1. Decode the JWT header → get "kid" (key ID)
2. Fetch IdP's JWKS endpoint → find the matching public key
3. Verify signature
4. Check iss matches the expected IdP
5. Check aud contains your client_id
6. Check exp > now
7. Check nonce matches what you sent
8. Optionally check iat is recent (clock skew tolerance ≤ 60s)
```

Never skip nonce validation — it prevents replay attacks where a captured ID token is reused to authenticate a different session.

## Discovery Document

Every OIDC-compliant IdP publishes a discovery document at a well-known URL:

```
GET https://accounts.google.com/.well-known/openid-configuration
```

It returns the endpoints and supported algorithms you need:

```json
{
  "issuer": "https://accounts.google.com",
  "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
  "token_endpoint": "https://oauth2.googleapis.com/token",
  "userinfo_endpoint": "https://openidconnect.googleapis.com/v1/userinfo",
  "jwks_uri": "https://www.googleapis.com/oauth2/v3/certs",
  "id_token_signing_alg_values_supported": ["RS256"]
}
```

Use the discovery document at startup rather than hardcoding endpoints — IdPs rotate key locations.

## Standard Scopes

| Scope | Claims returned |
|---|---|
| `openid` | `sub` — required to trigger OIDC |
| `profile` | `name`, `given_name`, `family_name`, `picture`, `locale` |
| `email` | `email`, `email_verified` |
| `phone` | `phone_number`, `phone_number_verified` |
| `address` | `address` (structured object) |
| `offline_access` | Grants a refresh token for long-lived sessions |

Request only what you need. Users see the scope list on the consent screen.

## UserInfo Endpoint

If you need claims not included in the ID token, call the UserInfo endpoint with the access token:

```
GET /userinfo
Authorization: Bearer <access_token>

→ { "sub": "118290...", "email": "user@example.com", ... }
```

The `sub` in the UserInfo response must match the `sub` in the ID token — validate this. But prefer putting required claims in the ID token to avoid the extra round-trip.

## ID Token vs Access Token

A common mistake: using the access token as proof of identity.

| | ID Token | Access Token |
|---|---|---|
| **For** | The client — to know who the user is | The Resource Server — to authorise API calls |
| **Contains** | Identity claims (`sub`, `email`, etc.) | Scopes, not necessarily user identity |
| **Validate at** | Your app, immediately after login | The API on every request |
| **Send to API?** | No | Yes |

The access token's format is not standardised by OIDC — it may or may not be a JWT, and its claims are IdP-specific.

## Single Sign-On (SSO)

OIDC enables SSO across multiple apps sharing the same IdP. After the user authenticates once, subsequent logins to other apps get an ID token silently (via the IdP session cookie) without re-prompting.

```
User logs into App A via IdP
  → IdP creates session cookie

User visits App B (also uses same IdP)
  → App B redirects to IdP
  → IdP sees session cookie → auto-issues ID token
  → User is logged into App B without re-entering credentials
```

### Logout

Logging out of one app does not automatically log out others. Two mechanisms exist:

- **RP-initiated logout** — the client redirects to the IdP's `end_session_endpoint`. Clears the IdP session, which prevents new silent logins.
- **Back-channel logout** — IdP POSTs a logout token to each registered app's logout URI. Allows apps to destroy local sessions server-side. More reliable but requires each app to expose a logout endpoint.

## Trade-offs

| | |
|---|---|
| **Standardised identity** | No custom `/me` endpoint per provider; `sub`, `email`, `name` are consistent |
| **Separation of concerns** | Your app never handles passwords; the IdP owns credential storage and MFA |
| **SSO across apps** | One login, many apps — better UX and centralised session management |
| **IdP dependency** | If the IdP is down, login is down. Mitigate with fallback IdPs or local session caching. |
| **Complexity** | PKCE + nonce + JWKS validation + discovery is more moving parts than a simple username/password |
| **Sub portability** | `sub` is IdP-scoped — the same user on Google vs GitHub has different `sub` values. Link accounts explicitly. |

## When to Use

- **"Login with Google/GitHub/Microsoft"** — standard social login
- **Enterprise SSO** — employees authenticate once via corporate IdP (Okta, Azure AD, Keycloak)
- **Multi-app platforms** — shared identity across a suite of services
- **Outsourcing auth** — you want the IdP to handle passwords, MFA, and account recovery

## When NOT to Use

- **Simple internal APIs with no user login** — use [[api-key-authentication]] or Client Credentials from [[oauth2]]
- **You control both client and server and want full ownership** — direct [[session-based-authentication]] or JWT issuance is simpler with no IdP dependency
- **You only need authorisation, not identity** — [[oauth2]] alone is sufficient

See also: [[oauth2]], [[token-based/jwt]], [[session-based-authentication]], [[overview]]
