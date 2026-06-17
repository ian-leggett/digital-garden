---
title: "SQL & NoSQL Injection"
description: "How injection attacks work in relational and document databases, and the defences that actually stop them"
tags: [system-design, security, sql, nosql, databases]
draft: false
date: 2026-06-17
lastmod: 2026-06-17
---

Injection attacks occur when user-supplied input is interpreted as part of a query rather than as data. The attacker alters the query's logic — reading data they shouldn't, bypassing authentication, or modifying records.

---

## SQL Injection

### How it works

```sql
-- Vulnerable: string concatenation
query = "SELECT * FROM users WHERE username = '" + username + "'"

-- Attacker input: ' OR '1'='1' --
SELECT * FROM users WHERE username = '' OR '1'='1' --'
-- Returns all rows — authentication bypassed
```

The `--` comments out the rest of the original query. The `OR '1'='1'` makes the WHERE clause always true.

### Blind injection

Many real attacks produce no visible error. The attacker infers data through:

- **Boolean-based:** compare `AND 1=1` (normal response) vs `AND 1=2` (empty/different response)
- **Time-based:** `AND SLEEP(5)` — a 5-second delay confirms the injection point works

No error message does not mean no vulnerability.

### UNION attacks

```sql
-- Original: SELECT name, email FROM users WHERE id = 1
-- Injected:
SELECT name, email FROM users WHERE id = 1
UNION SELECT username, password FROM admin_users --
```

Even a `SELECT`-only endpoint can leak data from unrelated tables via UNION. Read-only queries are not safe from injection.

### Second-order injection

Data is stored safely but later used unsafely in another query:

```python
# Step 1: username stored correctly via parameterised query
register(username="admin'--")

# Step 2: admin panel later interpolates the stored value
query = f"SELECT * FROM logs WHERE user = '{username}'"
# → WHERE user = 'admin'--'  (rest of query commented out)
```

The injection point and execution point are different — static analysis and basic testing often miss this.

---

## Defences Against SQL Injection

### Parameterised queries (primary defence)

```python
# Vulnerable
cursor.execute(f"SELECT * FROM users WHERE username = '{username}'")

# Safe — input is always treated as data, never as SQL
cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
```

The database driver handles escaping. The query structure is fixed before input is ever provided.

### ORMs — with caveats

ORMs parameterise by default, but most provide raw query escape hatches that bypass those protections:

```python
# Django ORM — safe
User.objects.filter(username=username)

# Django raw() — vulnerable if you interpolate input
User.objects.raw(f"SELECT * FROM users WHERE username = '{username}'")
```

Using an ORM is not sufficient if raw/query methods are used carelessly.

### Least privilege

The database user your application connects with should have only the permissions it needs:
- App user: `SELECT`, `INSERT`, `UPDATE`, `DELETE` on app tables only
- No `DROP`, `CREATE`, or access to system tables
- Admin operations use a separate connection

### Suppress verbose errors in production

```
# Bad — leaks schema, table names, column names to attacker
ERROR: column "pasword" does not exist in relation "users" at character 42

# Good — generic message, detail logged server-side
{"error": "An unexpected error occurred"}
```

Verbose database errors are reconnaissance. Log the detail; never return it.

---

## NoSQL Injection

NoSQL databases accept structured query objects rather than strings, but they are not immune — injection works by smuggling query operators through user input.

### MongoDB operator injection

```js
// Vulnerable: user input merged directly into query object
db.users.find({
  username: req.body.username,
  password: req.body.password
})

// Attacker sends JSON body:
// { "username": { "$ne": null }, "password": { "$ne": null } }

// Resulting query: find where username != null AND password != null
// → matches all documents, bypassing authentication
```

MongoDB operators (`$ne`, `$gt`, `$in`, `$where`, etc.) are injected by supplying objects instead of scalar values.

### `$where` — arbitrary JavaScript execution

The `$where` operator evaluates a JavaScript string server-side:

```js
// Extremely dangerous if user input reaches this
db.users.find({ $where: `this.username == '${username}'` })
// Input: ' || '1'=='1  → matches all documents
// Input: '; sleep(5000); //  → timing attack
```

`$where` is essentially server-side code execution. Disable it at the MongoDB level (`--noscripting`) unless you have a specific need for it.

### Other NoSQL databases

| Database | Injection vector |
|---|---|
| MongoDB | Operator injection (`$ne`, `$where`), JSON body parsing |
| Elasticsearch | Query DSL injection via user-controlled `query` objects |
| Redis | `EVAL` with Lua scripts containing user input |
| CouchDB | View/map function injection |

The pattern is the same: anywhere user input is embedded in a structured query object without validation, operators or logic can be injected.

### Defences Against NoSQL Injection

**Validate and type-check input** — reject anything that isn't the expected scalar type:

```js
// Reject if username is not a string
if (typeof req.body.username !== 'string') {
  return res.status(400).json({ error: 'Invalid input' })
}
```

**Schema validation** — use a library (Joi, Zod, Pydantic) to enforce input shape before it reaches the database layer.

**Avoid `$where` and server-side scripting** — there is almost always a safer alternative using standard query operators.

**Use an ODM with built-in sanitisation** — Mongoose (MongoDB) escapes operators by default in many contexts, but still validate at the boundary.

---

## Comparison

| | SQL Injection | NoSQL Injection |
|---|---|---|
| Attack vector | String concatenation into query | Object/operator injection |
| Bypasses auth | Yes | Yes |
| Data exfiltration | Yes (UNION, blind) | Yes (operator abuse) |
| Code execution | Rare (xp_cmdshell, UDFs) | Yes (`$where`, `EVAL`) |
| Primary defence | Parameterised queries | Input type validation + schema enforcement |

---

## When to Be Most Vigilant

- Any query parameter, form field, or header that reaches a database query
- Search endpoints — often use dynamic query construction
- Admin panels that query by user-supplied identifiers
- APIs that accept raw filter/sort objects from the client (e.g. `?filter={"price":{"$gt":0}}`)
- Anywhere stored data is later reused in a query (second-order)
