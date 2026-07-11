# docs/ — Amar Auto Clone build docs

Start at [../PLAN.md](../PLAN.md) (Bengali master plan). Deep detail lives here:

| File | Contents |
|---|---|
| [01-PRD-full-build-spec.md](01-PRD-full-build-spec.md) | Master PRD — features, roles, data model, API, stack, monetization, business logic |
| [02-feature-inventory.md](02-feature-inventory.md) | Deduplicated feature + entity inventory (from all amar-auto.com pages) |
| [03-data-model-prisma.md](03-data-model-prisma.md) | Production Prisma schema (40+ models) — **MySQL** provider |
| [04-rest-api-spec.md](04-rest-api-spec.md) | REST API surface the mobile app consumes |
| [05-architecture-and-roadmap.md](05-architecture-and-roadmap.md) | Tech stack, architecture, phased roadmap + estimates |
| [06-ui-ux-and-design-system.md](06-ui-ux-and-design-system.md) | Full UI/UX — mobile screens, web dashboard, admin panel, design system |
| [07-decisions-and-deployment.md](07-decisions-and-deployment.md) | **Final tech decisions (authoritative)** — MySQL, external GPS adapter, Contabo VPS 10 + CloudPanel deploy guide |

> **⚙️ Final stack (2026-07-11):** DB = **MySQL/MariaDB** · GPS = **owner's external GPS server API** (adapter) · Host = **Contabo VPS 10 + CloudPanel, Singapore**. Docs 01/03/05 carry override banners pointing to 07.

Compiled 2026-07-11 from a deep analysis of amar-auto.com (15 pages + homepage).
