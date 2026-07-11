# Amar Auto Clone — Tech Stack, Architecture & Phased Roadmap

> **⚙️ FINAL overrides (2026-07-11, see [07-decisions-and-deployment.md](07-decisions-and-deployment.md)):** DB = **MySQL/MariaDB** (not Postgres; tenant isolation via Prisma middleware, no RLS). GPS = **owner's external GPS server API via an adapter** (no self-ingest, no TimescaleDB, no raw-ping storage; Redis short-TTL cache for live). Hosting = **Contabo Cloud VPS 10 + CloudPanel, Singapore**. Where the text below says Postgres/TimescaleDB/Hetzner-DO, read the override.

## Guiding principle
Everything the ad promises is **one vehicle-agnostic double-entry accounting core** with vertical presets on top. Build the core ledger + multi-tenancy correctly once; GPS, inventory, rental, charging are all just modules writing into that same `Transaction`/`Ledger` spine. Reuse the owner's existing Node/TS/Prisma/PostgreSQL/React muscle memory — do not introduce a second language on the backend.

---

## 1. Recommended Stack (component by component)

### Backend framework — **NestJS (Node + TypeScript)**
- The owner already writes Node/TS. NestJS gives the module boundaries a multi-tenant, multi-module SaaS needs (Accounts, Vehicles, Drivers, GPS, Billing as isolated modules), first-class DI for testability, built-in validation (`class-validator`), guards for role/tenant enforcement, and a Swagger/OpenAPI generator you get for free — which becomes your mobile app's contract.
- If the team prefers minimalism over structure, **Fastify + tsoa** is the lighter alternative, but for a product this broad NestJS's structure pays for itself by Phase 2.
- Expose a **REST API** (not GraphQL) — simpler for a low-literacy-market mobile app, trivial to cache, and the device/GPS webhooks and bKash callbacks are REST anyway.

### ORM — **Prisma** (keep it)
- Already in the owner's stack. Use Prisma Migrate for schema evolution.
- **Multi-tenancy:** use a single database with a mandatory `ownerAccountId` (tenant) column on every tenant-scoped table, enforced by a Prisma **client extension / middleware** that auto-injects the tenant filter on every query. Do NOT rely on developers remembering to add `where: { ownerAccountId }`. Add Postgres **Row-Level Security** as a defense-in-depth backstop.
- Prisma's weak spot is heavy double-entry aggregation and time-series GPS. Drop to **raw SQL / Prisma `$queryRaw`** for ledger balance rollups and reporting; that's fine and expected.

### Auth / OTP
- **Phone + OTP is the primary credential** (matches the product). Flow: phone → send OTP → verify → issue JWT (access + refresh). Add PIN and password as secondary/quick-login unlocks stored as Argon2 hashes.
- Roll your own OTP service (generate 6-digit, store hashed OTP in Redis with TTL + attempt counter + rate limit) rather than a paid identity provider — cheaper and you control the Bengali SMS copy.
- **JWT** with short-lived access tokens + rotating refresh tokens; support multi-device by storing refresh-token records per device.
- **SMS gateway for Bangladesh** (avoid Twilio — too expensive for BD OTP volume):
  - **SSL Wireless** (most trusted, bank-grade, masking/branded sender ID) — recommend for OTP + billing SMS.
  - Cheaper/bulk alternatives: **Reve Systems, Alpha SMS (sms.net.bd), MIMSMS, bulksmsbd, greenweb**.
  - Wrap the gateway behind an `SmsProvider` interface so you can fail over between two providers (OTP delivery reliability is a churn driver).

### Web frontend — **React + TypeScript + Vite**, **TanStack Query**, **Tailwind + shadcn/ui**
- Owner already runs React. Vite for fast builds. **TanStack Query** for server-state/caching. **React Hook Form + Zod** for the heavy data-entry forms. **Recharts** or **ECharts** for analytics/fuel charts (ECharts handles Bengali labels and large series better).
- Admin/marketplace moderation panel is just another route-set in the same app gated by the platform-admin role.

### Mobile framework — **React Native + Expo** ✅ (over Flutter)
Justification specific to this project:
- **Code & talent reuse:** the entire backend, types, and validation (Zod schemas) are TypeScript. With RN you share DTO types, validation logic, and even some business-rule utilities (due calculation, mileage) between web, mobile, and server. Flutter/Dart forces a second language and a duplicate model layer — real cost for a small team.
- **Expo** gives OTA updates (ship fixes without app-store review — huge for iterating in an emerging market), managed builds (EAS), push notifications, and easy access to camera (KYC/accident photos), microphone (voice entry), and location (GPS map) via well-maintained modules.
- Flutter's genuine edge is buttery 60fps custom UI and map rendering — not decisive here; this is a forms-and-ledgers app, not a game.
- **Bengali rendering:** both handle it, but verify complex-script shaping — bundle a known-good Bengali font (**Noto Sans Bengali / SolaimanLipi / Hind Siliguri**) rather than trusting device fonts.
- One caveat: the live-GPS map at 100+ vehicles refreshing every 10s is the one screen where RN needs care — use `react-native-maps` with clustering and throttle marker updates. Manageable.

### GPS ingestion (Autonemo-style device API)
Keep this **decoupled from the accounting API** — different scaling profile (high-write, low-value-per-write time series).
- **Ingestion service:** a separate lightweight Node/Fastify (or Go if throughput demands) listener. Two integration modes:
  1. **Pull/proxy from Autonemo's API** (fastest path — the product literally partners with Autonemo GPS): poll their device API or receive their webhooks, normalize to your `LocationPing` shape.
  2. **Direct TCP protocol server** (if you own devices): most Chinese trackers speak **GT06 / JT808 / Concox** protocols over raw TCP. Use **Traccar** (open-source GPS server, supports 200+ protocols) as your ingestion layer and read from its DB/API — this saves you writing protocol parsers. Highly recommended.
- **Storage / GPS:** *(override)* GPS telemetry is **not stored** — it's fetched live from the owner's external GPS server API through a `GpsProvider` adapter and cached in Redis (short TTL). No `LocationPing`, no TimescaleDB. Only `Vehicle.gpsDeviceId`/`gpsProvider` mapping + optional trip/geofence summaries live in MySQL.
- **Live delivery to app:** **WebSocket** (or MQTT via EMQX if you want device-grade pub/sub) pushing last-known positions; app subscribes only to the vehicles on screen. Compute geofence/overspeed/ignition alerts in a stream consumer, write `Reminder`/`Alert` rows, fan out push+SMS.

### File / PDF / Excel export
- **PDF (receipts, monthly P&L):** render an HTML template (Handlebars/React-to-HTML) → **Puppeteer** (headless Chromium) for pixel-perfect Bengali PDFs. Puppeteer handles Bengali fonts correctly where PDFKit struggles. For high volume, pre-warm a browser pool or use **Gotenberg** (Dockerized, stateless HTML→PDF microservice) — clean and scalable.
- Receipt "shareable image" → same template rendered to PNG.
- **Excel:** **ExcelJS** for styled `.xlsx` reports.
- Store generated files in **S3-compatible object storage** (see hosting) and hand out signed URLs for the shareable links.

### bKash payment integration
- Use **bKash PGW / Tokenized Checkout** (merchant account required). Flow: `Grant Token → Create Payment → Execute Payment → Query/Callback`. Handle the token caching (grant token ~1hr) and idempotency.
- Since billing is **postpaid**, at month-end you generate the invoice, send a **bKash payment link/SMS**, and reconcile via the execute/callback + a **Query Payment** cron for stragglers. Don't mark paid on redirect alone — confirm server-side.
- Wrap behind a `PaymentProvider` interface so **Nagad / Rocket** ("coming soon") slot in later.
- Never store bKash credentials client-side; all PGW calls are server-to-server.

### Hosting / VPS
- **Users are in Bangladesh → latency matters.** Best price/performance/latency: a VPS in **Singapore** (DigitalOcean SGP1, Linode/Akamai SG, or **AWS ap-southeast-1**) — ~30-60ms to BD, far cheaper and more reliable than most local hosts. For lowest possible latency/BDIX peering you could use a local provider (**ExonHost, Dhaka Colo, XeoNBD**) but reliability is uneven — start regional, add a BD edge/CDN later.
- **Low-cost concrete setup *(override)*:** **Contabo Cloud VPS 10** (4 vCPU / 8GB / 75GB NVMe, **Singapore**) managed by **CloudPanel**: a Node.js site for the NestJS API + a static/Node site for the React web (both nginx + Let's Encrypt), **MySQL** via CloudPanel, plus **Redis** and **Gotenberg (Docker)** installed on the box. BullMQ worker as a separate PM2 process. Static sites + VPN already run on this box (~5.5GB RAM free). Optional Cloudflare in front. Full guide: [07-decisions-and-deployment.md](07-decisions-and-deployment.md) §3.
- **Object storage:** Cloudflare R2 or Backblaze B2 (no egress fees) instead of S3.
- Scale path: split GPS ingestion + Postgres to their own boxes; move to managed Postgres when revenue justifies. Don't over-engineer with Kubernetes early.
- **Backups:** nightly `pg_dump` + WAL archiving to R2/B2; this maps to the product's "encrypted cloud backup" promise.

### Background jobs (reminders / SMS cron)
- **BullMQ** (Redis-backed) for job queues + repeatable/cron jobs — native to the Node stack, has delayed jobs, retries, dashboards (Bull Board).
- Jobs: daily driver-due SMS reminders, document-expiry reminders (route permit/fitness/insurance/tax token/registration), monthly postpaid invoice generation, bKash payment-link dispatch, payment reconciliation, service-due checks, budget-threshold alerts, offline-sync cleanup.
- Run the worker as a **separate process/container** from the API so heavy SMS/PDF batches don't block request latency.

### i18n Bengali
- **Bengali is the default locale, English secondary** (the product treats Bengali as native, not a translation). Structure the app **i18n-first from commit one** — retrofitting is painful.
- Web: **i18next / react-i18next**. Mobile: **i18next + react-i18next** (shared translation JSON with web) or **expo-localization**.
- Watch: **Bengali numerals** (০১২৩...) vs Western digits — decide policy and centralize a number/date formatter (use **Intl** with `bn-BD` locale, or `dayjs`/`date-fns` with Bengali locale). Currency = ৳ (BDT). Bundle a proper Bengali font everywhere including PDFs.

### Offline-first (mobile)
- Non-negotiable per the product ("entries queued locally, auto-sync on reconnect, eventual consistency"). This is the **hardest correctness problem** — design it early, don't bolt on.
- **Local store:** **WatermelonDB** (built for RN offline sync, SQLite-backed, observable, scales to large datasets) or SQLite + a sync layer. Alternatively **PowerSync** or **RxDB** if you want a managed sync engine.
- **Sync model:** each record gets a **client-generated UUID** (so offline creates don't collide), a `updatedAt`/version, and a **sync queue** of mutations. On reconnect, push queued mutations (idempotent, keyed by client UUID) then pull deltas. **Last-write-wins per field** is acceptable for this domain except money — for ledger entries treat them as **append-only immutable events** (you never edit a collection, you post a correcting entry), which sidesteps most merge conflicts. This is another reason the double-entry/event-sourced ledger design is the right core.
- Backdated entries + flagging fall out naturally from an append-only ledger with an `effectiveDate` separate from `createdAt`.

---

## 2. Core Architecture (one diagram in words)

```
[RN/Expo App] ─┐                          ┌─ BullMQ Workers (SMS, PDF, invoices, reminders)
[React Web]  ──┼─ REST API (NestJS) ──────┼─ MySQL/MariaDB (single tenant-scoped DB, Prisma-middleware isolation)
[Admin panel]─┘        │  │  │             ├─ Redis (OTP, cache, queues, GPS live-position cache)
                       │  │  └─ PaymentProvider → bKash PGW
                       │  └──── SmsProvider → SSL Wireless / fallback
                       └─ WebSocket/poll gateway (live positions/alerts)
[Owner's GPS server] ← GpsProvider adapter (getLive/getBulk/getHistory) ← REST API   (no raw-ping storage; Redis cache)
[Gotenberg] ← PDF/PNG receipts → R2/B2 object storage → signed shareable links
```

Everything tenant-scoped by `ownerAccountId`. Ledger is append-only. Modules are NestJS modules mapping 1:1 to the inventory's A–Q feature groups.

---

## 3. Phased Build Roadmap + Effort Estimates

Estimates assume a small team (≈2 backend, 1–2 frontend/mobile, part-time devops). Ranges are calendar time.

### **MVP — "what the ad promises" (≈8–12 weeks)**
Scope = the freemium hook + daily operations for a single owner:
- Auth: phone+OTP signup, PIN/password login, multi-device, JWT. (SSL Wireless integration.)
- Multi-tenant core + append-only double-entry ledger + category (khat) system.
- **Vehicle management** (mixed types, per-vehicle profile & P&L) — with **1 vehicle free** enforcement.
- **Driver management** + KYC + **daily deposit target** + **daily collection entry** (one-tap keypad, timestamped) + **auto driver-dues/shortfall calc** (dues in red).
- **Income/Expense** entry with categories; **Smart Dashboard** (today's collection/expense/profit/active count).
- **Digital receipt** (PDF/image + shareable link) via Gotenberg.
- **Basic reports:** money history, per-vehicle P&L, monthly PDF/Excel export.
- **SMS receipts/reminders** to drivers (BullMQ cron).
- **Bengali-first i18n** baked in.
- Web app + REST API complete; **mobile app MVP** (Expo) covering collection entry, dashboard, receipts — **offline queue for collections** from day one.
- Monetization scaffolding: plan model, free-tier gate (billing engine can be stubbed).

Deliverable: an owner can run daily collections, track driver dues, manage vehicles, see profit, share receipts — free for 1 vehicle. This alone is a shippable product.

### **Phase 2 — Monetization + operational depth (≈6–10 weeks)**
- **Postpaid billing engine**: month-end auto-invoice, usage line items, **bKash PGW** integration, payment-link SMS, 7-day window, **soft-lock** of paid features on non-payment, reconciliation cron.
- **Subscription plans** (single-vehicle free / multi-vehicle paid; monthly & prepay-term pricing).
- **Fuel & maintenance**: fuel log, auto KPL/cost-per-km, service records, **service + document-expiry reminders** (route permit/fitness/insurance/tax token/registration) via cron+SMS+push.
- **Rental/bookings**: booking calendar w/ double-booking prevention, customer CRM, rental invoice, hourly START/END billing.
- **Reports/analytics** expansion: charts, calendar report, budgets w/ thresholds.
- **Staff permissions** (manager/accountant roles).
- **Vehicle QR**: QR generation, passenger scan verification, anonymous messaging, complaints, bulk QR PDF.
- **Push notifications** (Expo).
- Harden **offline sync** across all entry types.

### **Phase 3 — Platform + hardware + verticals (≈10–16 weeks, parallelizable)**
- **Live GPS**: `GpsProvider` adapter over the **owner's own GPS server API** (no ingestion service, no TimescaleDB), Redis-cached live/bulk positions, WebSocket/poll live map (100+ vehicles, clustering), trip history/playback via provider, geofence/overspeed/ignition **alerts** (from provider or computed), tracker-to-vehicle mapping, **hardware order flow** (order→call→install→live, COD).
- **Inventory & parts**: stock, suppliers/credit, purchase/sale invoices, reorder & dead-stock reports.
- **Loans/installments/HP**, **party ledger** (paona/dena/advance), **charging station** module, **bus-association fund/member/route** accounting.
- **Auto marketplace** with admin moderation.
- **Voice entry** (mic → income/expense), **accident record** w/ photo→auto-expense, **achievements/gamification**, **encrypted cloud backup** surfaced to user, remaining **8 vertical presets**.
- **iOS** parity + store submission.

**Total to full feature parity:** roughly **6–9 months** with a small team; a compelling **MVP in ~2–3 months**.

---

## 4. Monetization Mechanics — "1 vehicle free forever" + postpaid bKash

**Free-tier gate (technical):**
- On `ownerAccount`, track `activeVehicleCount` and `plan`. Free tier = **exactly 1 vehicle's accounting** fully functional forever.
- When the owner adds a 2nd vehicle, they cross into **paid**. Two clean options — recommend **(a)**:
  - **(a) Grace + postpaid:** allow adding vehicles freely; the **first (oldest) vehicle stays free**, each **additional** vehicle accrues charges that appear on the month-end invoice. This matches "use first, pay at month-end, no upfront cost."
  - (b) Hard gate: block the 2nd vehicle until a plan is chosen (higher friction — avoid for an emerging market).
- **Billing calculation:** paid vehicles × plan rate, prorated for mid-month additions. Category-based pricing mirrors the GPS plan structure (light vehicles vs car/bus/truck/micro) if you want tiering; the accounting SaaS itself can be flat per extra vehicle.

**Postpaid cycle (automated via BullMQ cron):**
1. **Month-end:** generate `BillingInvoice` per account = sum of paid-vehicle charges (usage line items), `dueDate = +7 days`.
2. **Dispatch** bKash payment link + SMS + in-app notification.
3. **7-day window:** reminders on day 3 and day 6.
4. **On payment:** bKash execute + callback → mark paid → confirm via Query Payment cron (never trust redirect alone).
5. **Non-payment after grace:** **soft-lock paid features** (multi-vehicle views/paid modules become read-only or hidden) — **never delete data**; the free vehicle keeps working. Unlock instantly on payment.
6. **GPS hardware** billed separately: one-time ৳4,000 device + monthly ৳350/৳500 subscription by category, with prepay-term discounts (3/6/12-month) computed as `(base − discounted) × months`.

**Why postpaid works here:** zero signup friction (matches "no upfront cost, app install free"), the free single vehicle is a permanent acquisition funnel, and expansion revenue grows naturally as owners add vehicles — with a gentle soft-lock (not deletion) that preserves trust and lets lapsed users reactivate.

---

## Key risks to design around early (don't defer)
1. **Offline sync correctness on money** — solve via append-only ledger + client UUIDs from day one.
2. **Multi-tenant isolation** — MySQL has no RLS, so the **Prisma middleware is the ONLY backstop**: harden it, ban raw queries that skip it, add cross-tenant integration tests.
3. **OTP deliverability** — dual SMS provider failover; it's a top churn/signup-failure cause in BD.
4. **Bengali rendering everywhere** including PDFs — bundle fonts, test complex-script shaping on real low-end Android devices.
5. **GPS integration** — consume the owner's external GPS server via the `GpsProvider` adapter; cache live positions in Redis (short TTL) so the map doesn't hammer the provider; never store raw pings in MySQL.