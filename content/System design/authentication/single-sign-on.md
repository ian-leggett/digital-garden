---
title: "Single Sign-On (SSO)"
description: "How SSO lets one login work across multiple apps, the SAML vs OIDC protocols that implement it, and the trade-offs of centralising auth"
tags: [system-design, authentication, security, sso, saml, oidc]
draft: false
date: 2026-06-12
lastmod: 2026-06-12
---

## What SSO Is

Single Sign-On lets a user authenticate once with an **Identity Provider (IdP)** and gain access to multiple independent applications (**Service Providers**, or SPs) without logging into each one separately.

```
                    ┌─────────────────────┐
                    │   Identity Provider  │
                    │   (Okta, Azure AD,   │
                    │    Keycloak, Google) │
                    └──────────┬──────────┘
                               │ one login,
                               │ trusted by all
              ┌────────────────┼────────────────┐
              │                │                 │
        ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
        │  App A    │    │  App B    │    │  App C    │
        │ (SP)      │    │ (SP)      │    │ (SP)      │
        └───────────┘    └───────────┘    └───────────┘
```

SSO is not a protocol itself — it's a *capability* delivered by an identity protocol. The two dominant ones are **SAML** (older, enterprise/XML-based) and **OIDC** (newer, JSON/REST-based, built on [[oauth2]]).

## How It Works (Protocol-Agnostic Flow)

```
1. User visits App B (hasn't logged in there yet)
2. App B redirects user to the IdP
3. IdP checks for an existing session cookie
     a. Session exists → IdP issues a token/assertion immediately (silent)
     b. No session → IdP shows login form, user authenticates
4. IdP redirects back to App B with a signed token/assertion
5. App B validates it, creates its own local session
6. User is logged into App B without entering credentials again
```

The key mechanism is the **IdP session cookie**. Step 3a is what makes subsequent logins "single sign-on" — the user already proved their identity once, and the IdP vouches for them silently on every other app.

## SAML vs OIDC

| | SAML 2.0 | OIDC |
|---|---|---|
| **Format** | XML assertions, signed with XML-DSig | JWTs (ID tokens), signed JWS |
| **Transport** | HTTP redirect/POST bindings, browser-only | OAuth 2.0 redirects, works for browser + mobile + API |
| **Typical users** | Enterprise SaaS (Workday, Salesforce, ADP) | Modern web/mobile apps, consumer "Login with Google" |
| **Identity claims** | `<AttributeStatement>` (email, groups, roles) | JWT claims (`sub`, `email`, `groups`) |
| **Discovery** | Metadata XML exchanged out-of-band | `.well-known/openid-configuration` |
| **Setup overhead** | Higher — XML metadata, certificate exchange per SP | Lower — client ID/secret + discovery URL |

Most enterprise IdPs (Okta, Azure AD, Ping) support both. New integrations should default to OIDC unless the SP only supports SAML — common with legacy enterprise software.

## SAML Flow (SP-Initiated)

```
Browser                  Service Provider (SP)         Identity Provider (IdP)
   |                            |                              |
   |  GET /app                  |                              |
   |--------------------------->|                              |
   |  <-- redirect with         |                              |
   |      SAMLRequest (signed)  |                              |
   |------------------------------------------------------->  |
   |                                                            |  user authenticates
   |                                                            |  (or has session)
   |  <-- HTTP POST SAMLResponse (signed XML assertion) -------|
   |                            |                              |
   |  POST SAMLResponse         |                              |
   |--------------------------->|                              |
   |                            |  validate signature ✓        |
   |                            |  extract NameID + attributes |
   |                            |  create local session        |
   |  <-- session cookie -------|                              |
```

The assertion contains a `NameID` (the user identifier, format-dependent — email, persistent opaque ID, etc.) plus attribute statements (groups, roles, department) that the SP maps to its own permission model.

## OIDC-Based SSO

Covered in detail in [[oidc]]. The short version: each app runs its own Authorization Code + PKCE flow against the shared IdP. The first app to authenticate triggers a login prompt; every subsequent app's redirect to `/authorize` finds the IdP session cookie already set and returns an ID token silently — no second login.

```
App A: GET /authorize → IdP shows login → user authenticates → IdP sets session cookie
App B: GET /authorize → IdP sees session cookie → ID token issued silently
```

## Just-in-Time (JIT) Provisioning

SSO assertions/tokens typically include enough identity data (email, name, groups) for the SP to create a local user record on first login, rather than requiring a separate account-creation step:

```
First login via SSO:
  assertion.email → no matching user in SP's DB
  → create user record, map groups → roles
  → proceed as normal
```

This is standard for enterprise SSO — admins manage users centrally in the IdP, and SPs provision accounts automatically as people log in.

## Logout

SSO logout is harder than SSO login — logging out of one app doesn't end the IdP session or other apps' sessions by default.

| Mechanism | How it works | Reliability |
|---|---|---|
| **Local logout** | SP destroys its own session only | Simple, but other apps stay logged in |
| **SP-initiated (front-channel)** | Redirect to IdP's logout endpoint, which redirects to each SP's logout URL via the browser | Depends on browser following every redirect — breaks if a tab is closed mid-chain |
| **Back-channel (SAML SLO / OIDC back-channel logout)** | IdP sends a direct server-to-server logout request to each SP | More reliable, no browser dependency, but requires every SP to expose a logout endpoint |

In practice, "logout everywhere" is rarely fully reliable across more than a handful of SPs — most real deployments accept that local logout + short session expiry is the practical floor.

## Trade-offs

| | |
|---|---|
| **One credential, many apps** | Users remember one password (or use a hardware key/passkey once); fewer weak/reused passwords |
| **Centralised access control** | Disabling a user in the IdP revokes access to every connected app — critical for offboarding |
| **Centralised MFA** | MFA enforced once at the IdP, not reimplemented per app |
| **Single point of failure** | If the IdP is down, login is down everywhere. Mitigate with IdP redundancy and existing local sessions surviving an outage |
| **Logout complexity** | "Logged out everywhere" is hard to guarantee — see above |
| **Integration cost** | SAML metadata/cert exchange or OIDC client registration is required per SP; not zero-config |

## When to Use

- **Multiple internal tools** — employees access HR, ticketing, wikis, cloud consoles through one corporate identity (Okta, Azure AD)
- **B2B SaaS with enterprise customers** — customers want their employees to log in with their own company IdP ("SSO" as a sales requirement, usually means SAML)
- **Consumer apps wanting social login** — "Continue with Google/Apple" reduces signup friction (OIDC)

## When NOT to Use

- **Single standalone app with no other systems to federate with** — plain [[session-based-authentication]] or local accounts are simpler with no IdP dependency
- **Offline or air-gapped systems** — SSO requires reachability to the IdP for the initial token issuance
- **Machine-to-machine auth** — use OAuth 2.0 Client Credentials ([[oauth2]]), not SSO, which is a human-login pattern

See also: [[oidc]], [[oauth2]], [[token-based/jwt]], [[basic/session-based]], [[overview]]
