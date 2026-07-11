# ⚙️ ফাইনাল টেক সিদ্ধান্ত + ডেপ্লয়মেন্ট গাইড (Decision Log)

> **তারিখ: ২০২৬-০৭-১১ — এই ফাইলই authoritative।** অন্য ডকে (01/03/05) কোথাও PostgreSQL / TimescaleDB / Hetzner-DO লেখা থাকলে **এই সিদ্ধান্ত সেটাকে override করে।**

## সিদ্ধান্ত সারাংশ

| বিষয় | আগের প্ল্যান | **ফাইনাল সিদ্ধান্ত** | কেন |
|---|---|---|---|
| Database | PostgreSQL | **MySQL / MariaDB** | CloudPanel native support; owner-এর existing setup |
| GPS telemetry | নিজে ingest + TimescaleDB | **External GPS provider API** (owner-এর নিজের GPS server) | owner-এর already GPS server আছে (speedotrack/takatrack) — ping DB-তে রাখতে হবে না |
| Hosting | Hetzner/DO + Docker Compose | **Contabo Cloud VPS 10 + CloudPanel** (Singapore) | 4 vCPU/8GB/75GB NVMe, সস্তা, static site+VPN পাশে চলছে |

⇒ TimescaleDB বাদ পড়ায় MySQL-এ আর কোনো scale-blocker নাই।

---

## ১. MySQL মাইগ্রেশন (Postgres → MySQL)

### Prisma datasource
```prisma
datasource db {
  provider = "mysql"          // ছিল "postgresql"
  url      = env("DATABASE_URL")   // mysql://user:pass@host:3306/amarauto
}
```
বাকি স্কিমা (docs/03) প্রায় অপরিবর্তিত — `@db.Decimal`, enum, `Json`, cuid PK, সব relation/index MySQL-এ চলে।

### Postgres-only ৪টা জিনিস → MySQL-এ app-layer workaround

| Postgres feature | MySQL-এ | সমাধান (app-code) |
|---|---|---|
| **Row-Level Security (RLS)** — tenant isolation backstop | নাই | **Prisma middleware/client-extension** যে প্রতি query-তে `organizationId` auto-inject করে। কোনো dev যেন `where: {organizationId}` ভুলেও বাদ না দেয়। একটাই enforcement layer, তাই discipline + code review লাগবে। |
| **`EXCLUDE USING gist`** — booking double-book রোধ | নাই | Booking create-এ **transaction + `SELECT ... FOR UPDATE`** দিয়ে overlap check: একই `vehicleId`-তে time-range overlap থাকলে reject। |
| **partial unique index** (`WHERE endDate IS NULL` — এক গাড়ির এক active assignment) | নাই | app-layer check: নতুন assignment-এর আগে পুরনো active (`endDate=null`) close করো; normal index রাখো। |
| **`LocationPing` partition / TimescaleDB** | দরকার নাই | GPS external provider থেকে আসে → **`LocationPing` টেবিলই বাদ**। (নিচে GPS সেকশন) |

### MySQL config নোট
- Engine **InnoDB** (transaction + FK), charset **`utf8mb4`** (বাংলা + ইমোজি), collation `utf8mb4_unicode_ci`।
- Money = `DECIMAL(12,2)` / `DECIMAL(14,2)` — float কখনো না।
- Timezone: DB `UTC`; app-এ Asia/Dhaka-তে convert।

---

## ২. GPS — External Provider Adapter (owner-এর নিজের server)

Owner-এর GPS server per-vehicle API দেয় → **নিজে ingest/TimescaleDB বানানোর দরকার নাই**। অ্যাপ শুধু ঐ API consume করে।

### DB-তে যা রাখবে (mapping মাত্র)
```prisma
model Vehicle {
  // ...
  gpsDeviceId  String?   // owner-এর GPS server-এর imei / device id
  gpsProvider  String?   // "takatrack" (future multi-provider)
}
```
raw ping **রাখবে না**। (আগের `GpsDevice`/`LocationPing`/`GpsTrip` টেবিল দরকার হলে শুধু summary/geofence config-এর জন্য ছোট আকারে; ping না।)

### Adapter interface (provider swap সহজ রাখতে)
```ts
interface GpsProvider {
  getLive(deviceId: string): Promise<Position>
  getBulk(deviceIds: string[]): Promise<Position[]>          // ১০০+ গাড়ি এক ম্যাপে
  getHistory(deviceId: string, from: Date, to: Date): Promise<TrackPoint[]>
}
type Position = { lat: number; lng: number; speedKph: number; heading?: number; ts: Date; ignition?: boolean }
```
`TakatrackProvider implements GpsProvider` — provider বদলালে (Autonemo/Traccar/অন্য) শুধু নতুন adapter, বাকি অ্যাপ একই।

### ফ্লো
```
মোবাইল/ওয়েব → NestJS API (/gps/live, /gps/history)
                 │  Redis cache (last position, TTL ৫–১০s → provider load কম)
                 ▼
           GpsProvider adapter → owner-এর GPS server API
```
- **Live/bulk:** cache miss হলে provider কল, ফল Redis-এ ৫–১০s রাখো।
- **History/playback:** provider-এর history endpoint সরাসরি।
- **Alert (geofence/overspeed/ignition):** provider দিলে consume; নাহলে position দেখে BullMQ worker-এ compute।

### Scaffold-এর আগে owner-এর কাছ থেকে দরকার
1. GPS server **base URL + auth** (API key / token / login?)
2. **live position endpoint** — imei দিয়ে? single না bulk?
3. **response format** (lat/lng/speed/time JSON shape)
4. **platform** — GPS51 / Traccar / custom? (exact API জানতে)

---

## ৩. Contabo VPS 10 + CloudPanel ডেপ্লয়মেন্ট গাইড

**VPS:** Contabo Cloud VPS 10 — 4 vCPU / 8GB RAM / 75GB NVMe / 200Mbit / unlimited। **Region: Singapore** (BD-এর কাছে, latency কম)। Auto-backup ON।

### একই box-এ কি কি চলবে
| সার্ভিস | কিভাবে | RAM (আনু.) |
|---|---|---|
| NestJS API | CloudPanel **Node.js site** (subdomain `api.myauto...`) + PM2 + nginx + Let's Encrypt SSL | ~300–500MB |
| React ওয়েব | build → **static/Node site** (`app.myauto...`), nginx serve | build-time only |
| MySQL | CloudPanel UI-তে **নতুন DB + আলাদা user** (static site-এর DB থেকে isolated) | ~0.5–1GB |
| Redis | VPS-এ `apt install redis` (CloudPanel manage করে না) — OTP + BullMQ + GPS cache | ~100–200MB |
| BullMQ worker + cron | আলাদা **PM2 process** (SMS, বিল, reminder) | ~150MB |
| Gotenberg (রসিদ PDF) | **Docker container**, internal port | ~200–300MB |
| CloudPanel + nginx | আছে | ~200MB |
| static site + VPN (আগের) | আছে | ~200MB |
| **মোট** | | **~২–২.৫GB → ৫.৫GB ফাঁকা** ✅ |

### Port / conflict
- Node app internal port (3000/3001) → nginx reverse proxy 443। VPN (WireGuard 51820 / OpenVPN 1194) ৮০/৪৪৩ না নিলে conflict নাই।
- MySQL (3306) + Redis (6379) **শুধু localhost** — বাইরে expose করবে না (firewall)।

### সেটআপ ধাপ (high-level)
1. CloudPanel-এ **Node.js site** তৈরি → domain `api.myauto...` → SSL issue।
2. **MySQL DB + user** তৈরি (CloudPanel Databases)।
3. VPS-এ Redis install + Docker install (Gotenberg-এর জন্য)।
4. Git deploy → `npm ci && prisma migrate deploy && npm run build` → PM2 start (API + worker আলাদা process)।
5. React build → static site-এ upload / serve।
6. Gotenberg `docker run` (restart=always)।
7. Env: `DATABASE_URL`, `REDIS_URL`, `JWT` keys, SMS gateway, bKash, GPS provider creds।
8. Backup: Contabo auto-backup + nightly `mysqldump` → offsite (R2/B2)।

### ঝুঁকি + সমাধান
- একই box-এ crash/spike → static+VPN-এ চাপ। ⇒ PM2 **memory limit** (`max_memory_restart`), nginx rate-limit, MySQL slow-query log।
- ইউজার বাড়লে ⇒ API/DB আলাদা VPS-এ সরাও (PM2/Docker portable, migration সহজ)।

---

## এক লাইনে ফাইনাল
**MySQL (InnoDB, utf8mb4) + external GPS provider adapter + Contabo VPS 10/CloudPanel (Singapore)।** Postgres-only ৪টা feature app-code-এ handle। GPS ping DB-তে না — owner-এর server API থেকে live।
