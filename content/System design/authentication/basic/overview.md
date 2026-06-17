---
title: "Overview"
description: "What authentication is and the common mechanisms used to implement it"
tags: [system-design, authentication, security]
draft: false
date: 2026-06-05
lastmod: 2026-06-05
---

## What is Authentication?

Authentication is the process of verifying that a user or system is who they claim to be. It answers the question: **"Are you really you?"**

It is distinct from **authorisation**, which determines what an authenticated identity is allowed to do.

```
Client                        Server
  |                              |
  |  -- credentials/token -->    |
  |                              |  verify identity
  |  <-- access granted/denied --| 
  |                              |
```

A successful authentication produces a **session or token** that the client presents on subsequent requests, so credentials don't need to be sent every time.

## Common Mechanisms

| Mechanism | How it works (short) |
|---|---|
| **Session cookies** | Server stores session state; browser sends a cookie on each request |
| **JWT** | Stateless signed token carrying claims; server verifies the signature |
| **OAuth 2.0** | Delegated authorisation flow; a third party issues tokens on behalf of a user |
| **OpenID Connect** | Identity layer on top of OAuth 2.0; adds a standardised ID token |
| **API keys** | Long-lived secret passed in headers; common for service-to-service calls |
| **Basic Auth** | Base64-encoded username + password in the `Authorization` header; always use over HTTPS |
| **mTLS** | Both client and server present certificates; common in internal/service mesh contexts |
| **Passkeys / WebAuthn** | Cryptographic key pair stored on device; replaces passwords entirely |
