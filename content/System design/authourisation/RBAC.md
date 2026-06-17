---
title: "Role-Based Access Control (RBAC)"
description: "How RBAC assigns permissions via roles instead of individual users, role hierarchies, common pitfalls, and when ABAC fits better"
tags: [system-design, authorisation, security, rbac]
draft: false
date: 2026-06-12
lastmod: 2026-06-12
---

## What RBAC Is

RBAC grants permissions to **roles**, then assigns roles to users. Access decisions check "does this user's role permit this action?" rather than maintaining a permission list per user.

```
User ──assigned to──► Role ──grants──► Permissions
                                            │
                                            ├── orders:read
                                            ├── orders:write
                                            └── orders:delete

alice ──► admin   ──► orders:read, orders:write, orders:delete, users:manage
bob   ──► editor  ──► orders:read, orders:write
carol ──► viewer  ──► orders:read
```

Adding a user to a role grants every permission that role holds. Revoking access is one operation — remove the role — instead of hunting down every individual grant.

## Core Model

```
Permission = (resource, action)   e.g. ("orders", "delete")
Role       = set of permissions   e.g. admin = {orders:*, users:manage}
User       = set of roles         e.g. alice = {admin}

Check: user has access if ANY of user's roles contains the required permission
```

```python
ROLES = {
    "viewer": {"orders:read"},
    "editor": {"orders:read", "orders:write"},
    "admin":  {"orders:read", "orders:write", "orders:delete", "users:manage"},
}

def can(user, permission):
    return any(permission in ROLES[role] for role in user.roles)

can(alice, "orders:delete")  # True  — alice has 'admin'
can(bob, "orders:delete")    # False — 'editor' lacks it
```

## Role Hierarchies

Roles can inherit from other roles to avoid duplicating permission sets:

```
        admin
          │ inherits
        editor
          │ inherits
        viewer ──► orders:read

editor = viewer + {orders:write}
admin  = editor + {orders:delete, users:manage}
```

A user assigned `admin` implicitly gets every permission from `editor` and `viewer`. Most RBAC implementations (AWS IAM managed policies, Kubernetes ClusterRoles, Django groups) support this via inheritance or policy aggregation rather than copy-pasting permission lists.

## Where Roles Are Checked

```
Request → Authentication (who is this?) → Authorisation (RBAC check) → Handler
                                                    │
                                          load user's roles
                                          look up required permission for this route
                                          roles ∩ permission → allow/deny
```

```python
@require_permission("orders:delete")
def delete_order(request, order_id):
    ...
```

Roles are typically loaded once at login and embedded in the session or JWT (`"roles": ["editor"]`), avoiding a DB lookup on every request. The trade-off: role changes don't take effect until the token/session refreshes.

## Static vs Dynamic Roles

| | Static (most common) | Dynamic |
|---|---|---|
| **Definition** | Roles and permissions defined in code/config | Roles/permissions stored in DB, editable at runtime |
| **Example** | `admin`, `editor`, `viewer` hardcoded | Org admins create custom roles via UI |
| **Flexibility** | Low — code change to add a role | High — but adds complexity and a permission-management UI |
| **Use when** | Fixed set of user types (most apps) | Multi-tenant B2B where each customer needs custom roles |

## Common Pitfalls

**Role explosion** — when roles start encoding combinations of department + resource + action (`east-region-orders-editor`, `west-region-orders-editor`...), you've outgrown RBAC. This is the signal to move to [[ABAC]], where the region is an attribute rather than baked into the role name.

**Permission checks scattered everywhere** — checking `user.roles` inline across the codebase makes audits hard. Centralise checks behind a single function/decorator (`can(user, permission)`, `@require_permission(...)`) so the permission model can change without touching every call site.

**Confusing roles with groups** — a "group" is often an org/team membership (which team you're on), while a "role" is what you're allowed to do (admin/editor/viewer). Conflating them means every new team requires duplicating the full role set.

**Stale roles in long-lived tokens** — if roles are embedded in a JWT with a long expiry, a revoked admin role stays valid until the token expires. Keep role-bearing tokens short-lived, or check roles against the DB for sensitive actions.

## Trade-offs

| | |
|---|---|
| **Simple to reason about** | "What can an editor do?" has one answer, checkable in one place |
| **Easy bulk changes** | Promote/demote a user by changing one role assignment |
| **Auditable** | "Who can delete orders?" = "who has a role containing `orders:delete`?" |
| **Coarse-grained** | Can't express "edit only your own orders" or "only during business hours" without extra logic |
| **Role explosion at scale** | Many resource/context combinations lead to a combinatorial blow-up of roles |

## When to Use

- **Most internal admin tools and SaaS apps** — a handful of well-defined user types (admin, member, viewer) covers 80% of access needs
- **Compliance-driven access** — auditors understand "role X can do Y" far more easily than attribute expressions
- **Kubernetes, cloud IAM, Django/DRF permissions** — RBAC is the default model these frameworks ship with

## When NOT to Use

- **Access depends on relationships or context** — "users can edit their own posts," "only during business hours," "only for resources in their region" — use [[ABAC]] or add a resource-ownership check on top of RBAC
- **Per-resource sharing (Google Docs–style "share with these specific people")** — use [[ACL]], which grants permissions on individual resources rather than resource types
- **Highly dynamic, customer-defined permission sets at scale** — pure RBAC's role explosion becomes unmanageable; ABAC policies scale better

See also: [[ABAC]], [[ACL]], [[../authentication/token-based/jwt]]
