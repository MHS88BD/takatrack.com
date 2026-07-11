# আমার অটো ক্লোন — সম্পূর্ণ মাস্টার প্ল্যান (UI সহ, এক ফাইলে সব)

> **এই এক ফাইলেই সব:** প্ল্যান + UI + PRD + ডেটা মডেল + API + আর্কিটেকচার + রোডম্যাপ।
> মূল লক্ষ্য: amar-auto.com এর পূর্ণ ক্লোন — প্রথমে **ওয়েব + REST API**, তারপর **মোবাইল অ্যাপ**। ১টি গাড়ি lifetime FREE + postpaid bKash।
> তারিখ: ২০২৬-০৭-১১ · আলাদা করে পড়তে চাইলে [docs/](docs/) ফোল্ডারে একই কনটেন্ট ভাগ করা আছে।

## সূচিপত্র (Table of Contents)
- [অংশ ১ — মাস্টার প্ল্যান (প্রতিযোগী + স্কোপ + রোডম্যাপ + ম্যানেজমেন্ট)](#০-বিস্তারিত-ডকের-ইনডেক্স)
- [অংশ ২ — UI/UX ও ডিজাইন সিস্টেম](#অংশ-২--uiux-ও-ডিজাইন-সিস্টেম)
- [অংশ ৩ — পূর্ণ PRD](#অংশ-৩--পূর্ণ-prd-ফিচাররোললজিক)
- [অংশ ৪ — ডেটা মডেল (Prisma)](#অংশ-৪--ডেটা-মডেল-prisma-স্কিমা)
- [অংশ ৫ — REST API](#অংশ-৫--rest-api-স্পেক)
- [অংশ ৬ — আর্কিটেকচার ও রোডম্যাপ](#অংশ-৬--আর্কিটেকচার-ও-রোডম্যাপ)
- [অংশ ৭ — ফিচার ইনভেন্টরি](#অংশ-৭--ফিচার-ইনভেন্টরি-raw)

---

## অংশ ১ — মাস্টার প্ল্যান



> এই ফাইল = পুরো প্রজেক্টের **একক সোর্স অব ট্রুথ**। প্রতিযোগী (amar-auto.com) তে কি আছে, আমরা কি বানাবো, কিভাবে বানাবো, কে ম্যানেজ করবে, UI কেমন হবে — সব এখানে + বিস্তারিত ডকে।
>
> **লক্ষ্য:** amar-auto.com এর সম্পূর্ণ ফিচার নিজে বানানো — প্রথমে **ওয়েব + REST API**, তারপর সেই API দিয়ে **মোবাইল অ্যাপ**।

তারিখ: ২০২৬-০৭-১১ · ভাষা: বাংলা-first (English technical terms রাখা হয়েছে)

---

### ০. বিস্তারিত ডকের ইনডেক্স

গভীর ডিটেইল আলাদা ফাইলে (এই প্ল্যান = সারাংশ + রোডম্যাপ):

| ফাইল | কি আছে |
|---|---|
| [docs/01-PRD-full-build-spec.md](docs/01-PRD-full-build-spec.md) | পূর্ণ PRD — ফিচার, রোল, ডেটা মডেল, API, স্ট্যাক, মনিটাইজেশন, বিজনেস লজিক (মাস্টার) |
| [docs/02-feature-inventory.md](docs/02-feature-inventory.md) | সব পেজ থেকে বের করা deduplicated ফিচার + entity ইনভেন্টরি |
| [docs/03-data-model-prisma.md](docs/03-data-model-prisma.md) | প্রোডাকশন PostgreSQL/Prisma স্কিমা (৪০+ টেবিল) |
| [docs/04-rest-api-spec.md](docs/04-rest-api-spec.md) | মোবাইল অ্যাপ যে REST API খাবে — endpoint by endpoint |
| [docs/05-architecture-and-roadmap.md](docs/05-architecture-and-roadmap.md) | টেক স্ট্যাক, আর্কিটেকচার, ফেজ রোডম্যাপ + এস্টিমেট |
| [docs/06-ui-ux-and-design-system.md](docs/06-ui-ux-and-design-system.md) | সম্পূর্ণ UI/UX — মোবাইল স্ক্রিন, ওয়েব ড্যাশবোর্ড, অ্যাডমিন প্যানেল, ডিজাইন সিস্টেম |

---

### ১. প্রোডাক্ট কি (এক লাইনে)

**একটি vehicle-agnostic double-entry হিসাব ইঞ্জিন**, যার উপরে **৮টি ভার্টিক্যাল প্রিসেট**। GPS, ইনভেন্টরি, রেন্টাল, চার্জিং — সব একই ledger-এ লেখে। বাংলা native, icon-driven, offline-first, postpaid bKash বিলিং, **১টি গাড়ি lifetime FREE**।

**টার্গেট ইউজার:** CNG/অটোরিকশা, রেন্ট-এ-কার, চার্জিং গ্যারেজ, বাস সমিতি, ট্রাক/ট্রান্সপোর্ট, বাইক রেন্টাল মালিক — যারা আজও কাগজ-কলম-মুখস্থে ব্যবসা চালায়।

---

### ২. amar-auto.com এ এখন কি কি আছে (প্রতিযোগী এনালাইসিস)

১৫টি পেজ + হোমপেজ এনালাইসিস করে পাওয়া গেছে। বিজ্ঞাপনের ৬ বুলেট আসলে পুরো প্রোডাক্টের ছোট অংশ (MVP)। আসল প্রোডাক্ট ~১০ মডিউল, ১৪৩ অ্যাপ স্ক্রিন।

| # | মডিউল | মূল ফিচার (তাদের) |
|---|---|---|
| A | **Auth/অনবোর্ডিং** | মোবাইল+OTP signup, PIN login, multi-device, ~৫ মিনিট সেটআপ |
| B | **হিসাব ও জমা** | Smart dashboard, দৈনিক জমা (এক ট্যাপ keypad), ডিজিটাল রসিদ (PDF+share link), double-entry ledger, backdated entry |
| C | **গাড়ি ও বহর** | মিশ্র fleet (অটো/CNG/বাইক/কার/বাস/ট্রাক), per-vehicle P&L, সার্ভিস হিস্ট্রি |
| D | **ড্রাইভার** | প্রোফাইল+KYC (NID), দৈনিক টার্গেট, **বকেয়া অটো-হিসাব (লাল রঙে)**, ছাড়/waiver, SMS রসিদ |
| E | **গাড়ি QR** | যাত্রী scan করে verify, নম্বর ছাড়া যোগাযোগ, অভিযোগ, bulk QR print |
| F | **ফুয়েল ও মেইনটেন্যান্স** | ফুয়েল লগ, auto KPL/cost-per-km, সার্ভিস রিমাইন্ডার, কাগজপত্র expiry alert (ফিটনেস/ইন্স্যুরেন্স/ট্যাক্স/রুট পারমিট/রেজিস্ট্রেশন) |
| G | **ইনভেন্টরি ও পার্টস** | পার্টস স্টক, সরবরাহকারী বাকি, ক্রয়/বিক্রয় ইনভয়েস, reorder/dead-stock রিপোর্ট |
| H | **রিপোর্ট ও বিশ্লেষণ** | আয়-ব্যয় চার্ট, P&L, **balance sheet + trial balance**, PDF/Excel export, budget, khat-wise |
| I | **লাইভ GPS** | রিয়েল-টাইম ম্যাপ (~১০s, ১০০+ গাড়ি), route history/playback, geofence/overspeed/ignition alert, remote engine lock, হার্ডওয়্যার অর্ডার (Autonemo GPS পার্টনার) |
| J | **চার্জিং ও ঋণ** | চার্জিং স্টেশন daily/monthly বিল+বাকি, loan/installment/hire-purchase |
| K | **রেন্টাল/বুকিং** | booking calendar (double-booking রোধ), customer CRM, rental invoice, ঘন্টাভিত্তিক START/END বিলিং |
| L | **পাওনা-দেনা লেজার** | ট্রাক/ট্রান্সপোর্ট per-client পাওনা/অগ্রিম/পরিশোধ running ledger |
| M | **বিলিং** | **Postpaid** — মাস শেষে auto invoice, bKash, ৭ দিন window, না দিলে soft-lock (ডেটা মুছে না), ১ গাড়ি free |
| N | **নোটিফিকেশন** | SMS রিমাইন্ডার, push, voice entry |
| O | **সাপোর্ট** | in-app ticket, contact form |
| P | **অটো মার্কেটপ্লেস** | পুরনো অটো/পার্টস বেচা-কেনা, admin-moderated feed |

**টেক ইঙ্গিত:** Autonemo GPS API পার্টনার · bKash পেমেন্ট গেটওয়ে · SMS গেটওয়ে · encrypted cloud backup · Android+iOS অ্যাপ + ওয়েব।

**মনিটাইজেশন (তাদের):** GPS হার্ডওয়্যার ৳৪,০০০ (one-time) + সাবস্ক্রিপশন বাইক/CNG ৳৩৫০/মাস, কার/বাস/ট্রাক ৳৫০০/মাস; prepay term ডিসকাউন্ট।

---

### ৩. আমরা কি বানাবো (স্কোপ)

**সব কিছু** — কিন্তু phase-এ ভাগ করে। বিজ্ঞাপনের ৬ বুলেট = MVP; বাকি = Phase 2/3.

মূল নীতি: **ledger + multi-tenancy core একবার ঠিকভাবে বানাও**; GPS/inventory/rental/charging সব একই `Transaction`/`Ledger` spine-এ module হিসেবে বসে।

ফিচার→phase ম্যাপ, ডেটা মডেল, API — [docs/01](docs/01-PRD-full-build-spec.md) সেকশন ২–৫ এ পূর্ণ।

#### ৩.১ ইউজার রোল
| রোল | লগইন? | কি করে |
|---|---|---|
| **মালিক (Owner)** | ✅ | tenant/account holder — full access, বিলিং, business-mode |
| **ম্যানেজার / হিসাবরক্ষক** | ✅ | staff, role-based permission |
| **Admin (platform)** | ✅ | মার্কেটপ্লেস moderation, tenant ম্যানেজ |
| **ড্রাইভার** | ❌ | managed entity — KYC, dues, SMS পায় |
| **কাস্টমার/যাত্রী/party** | ❌ | external — QR scan, রসিদ পায়, ledger-এ থাকে |

Auth: **phone+OTP primary**; PIN/password device convenience; JWT (access 15min + rotating refresh per device → multi-device)।

---

### ৪. টেক স্ট্যাক (সিদ্ধান্ত)

| স্তর | পছন্দ | কেন |
|---|---|---|
| Backend | **NestJS (Node+TS)** | মডুলার, owner-এর existing Node/TS দক্ষতা |
| ORM/DB | **Prisma + PostgreSQL** | Decimal money, RLS multi-tenancy |
| Auth/OTP | roll-your-own OTP (Redis) + SSL Wireless/BD SMS gateway | বাংলা SMS copy নিয়ন্ত্রণ, সস্তা |
| Web front | **React + Vite + TanStack Query + Tailwind + shadcn/ui** | দ্রুত, owner-এর React স্ট্যাক |
| Mobile | **React Native + Expo** (Android-first, পরে iOS) | কোড শেয়ার, দ্রুত, offline সাপোর্ট |
| GPS ingest | আলাদা service + **TimescaleDB** (Traccar/Autonemo style) | ১০s ping transactional DB-তে মেশানো যাবে না |
| PDF/Excel | **Gotenberg** (রসিদ PDF, বাংলা font embed) | shareable রসিদ |
| পেমেন্ট | **bKash PGW** (পরে Nagad/Rocket) | postpaid বিল |
| ব্যাকগ্রাউন্ড job | **BullMQ** cron (SMS, বিল, reminder, GPS alert) | reminder/reconciliation |
| Hosting | VPS (owner-এর existing VPS ইকোসিস্টেম) | খরচ কম |

আর্কিটেকচার ডিটেইল → [docs/05](docs/05-architecture-and-roadmap.md)।

---

### ৫. রোডম্যাপ + ম্যানেজমেন্ট (কে কি করবে)

ধরে নেওয়া টিম: ~২ backend, ১–২ frontend/mobile, part-time devops।

#### MVP — "বিজ্ঞাপন যা বলে" (≈৮–১২ সপ্তাহ) 🎯
freemium hook + একজন মালিকের দৈনিক অপারেশন:
- Auth (phone+OTP, PIN, multi-device, JWT)
- Multi-tenant core + append-only double-entry ledger + khat/category
- গাড়ি ম্যানেজমেন্ট (mixed type, per-vehicle P&L) + **১-গাড়ি-free enforcement**
- ড্রাইভার + KYC + দৈনিক টার্গেট + জমা entry (keypad) + **বকেয়া auto (লাল)**
- আয়/ব্যয় entry + Smart Dashboard
- ডিজিটাল রসিদ (PDF+link)
- basic রিপোর্ট (money history, per-vehicle P&L, PDF/Excel)
- SMS রসিদ/রিমাইন্ডার
- বাংলা i18n
- **ওয়েব + REST API সম্পূর্ণ** + **মোবাইল MVP** (জমা entry, dashboard, রসিদ, offline queue)
- বিলিং scaffolding (plan model + free-tier gate)

**ডেলিভারেবল:** মালিক দৈনিক জমা তোলে, বকেয়া দেখে, গাড়ি ম্যানেজ করে, লাভ দেখে, রসিদ share করে — ১ গাড়ি free। নিজেই একটা shippable প্রোডাক্ট।

#### Phase 2 — মনিটাইজেশন + গভীরতা (≈৬–১০ সপ্তাহ) 💰
- **Postpaid বিলিং ইঞ্জিন:** month-end auto-invoice, bKash PGW, payment-link SMS, ৭-দিন window, **soft-lock**, reconciliation cron
- সাবস্ক্রিপশন plan (free single / paid multi)
- ফুয়েল ও মেইনটেন্যান্স (KPL, সার্ভিস+কাগজ expiry reminder)
- রেন্টাল/বুকিং (calendar, CRM, invoice, ঘন্টা বিলিং)
- রিপোর্ট/analytics (chart, budget, balance sheet, trial balance)
- staff permission
- গাড়ি QR (verify, anonymous message, bulk print)
- push notification, offline sync সব entry-তে

#### Phase 3 — প্ল্যাটফর্ম + হার্ডওয়্যার + ভার্টিক্যাল (≈১০–১৬ সপ্তাহ, parallel) 🚀
- **Live GPS** (Traccar/Autonemo, TimescaleDB, WebSocket map, trip playback, geofence/overspeed/ignition alert, hardware order flow)
- ইনভেন্টরি ও পার্টস (stock, সরবরাহকারী credit, invoice, reorder/dead-stock)
- loan/installment/HP, party ledger, চার্জিং স্টেশন, বাস সমিতি fund
- অটো মার্কেটপ্লেস (admin moderation)
- voice entry, accident record→auto-expense, gamification, cloud backup UI, বাকি vertical preset
- **iOS** parity + store submit

| Phase | সময় | ফলাফল |
|---|---|---|
| MVP | ৮–১২ সপ্তাহ | Free single-vehicle daily-ops প্রোডাক্ট, shippable |
| Phase 2 | ৬–১০ সপ্তাহ | Revenue (bKash postpaid) + rental/fuel/QR |
| Phase 3 | ১০–১৬ সপ্তাহ | GPS hardware, inventory, vertical, marketplace, iOS |

**পূর্ণ feature parity:** ~৬–৯ মাস (ছোট টিম); compelling MVP ~২–৩ মাস।

---

### ৬. মনিটাইজেশন মেকানিক্স

- **১ গাড়ি free forever** = permanent acquisition funnel। `Vehicle.isBillable=false` (সবচেয়ে পুরনো ১টি গাড়ি)।
- ২য় গাড়ি যোগ = paid। **Grace + postpaid:** গাড়ি free-তে যোগ করা যায়, প্রথমটা free থাকে, বাকিগুলো month-end invoice-এ চার্জ হয় ("আগে ব্যবহার, মাস শেষে পেমেন্ট, no upfront cost")।
- **Postpaid cycle:** month-end invoice → bKash link + SMS → ৩/৬ দিনে reminder → payment callback + Query cron → soft-lock lift। না দিলে **soft-lock** (paid feature read-only, ডেটা মুছে না; free গাড়ি চলতে থাকে)।
- **GPS হার্ডওয়্যার আলাদা:** device one-time + monthly subscription by category।

ডিটেইল → [docs/01](docs/01-PRD-full-build-spec.md) সেকশন ৭।

---

### ৭. মূল বিজনেস লজিক (না বুঝলে ভুল হবে)

- **ড্রাইভার বকেয়া:** `shortfall = max(0, dailyTarget − collected − discount)`; `dailyTarget` entry-এর সময় snapshot (পরে টার্গেট বদলালে history বদলায় না); over-deposit হলে পুরনো dues-এ FIFO apply; live outstanding লাল রঙে → SMS। **zero manual arithmetic।**
- **P&L দুই স্তর:** (a) fast per-vehicle operational number (`GROUP BY vehicleId`), (b) authoritative double-entry ledger (`Σdebit=Σcredit`, trial balance)। এক transaction-এ দুটোই লেখা হয় যাতে diverge না করে।
- **Offline money correctness:** প্রতি record client-UUID + sync queue; ledger **append-only immutable** (collection edit করো না, correcting entry পোস্ট করো)।
- **GPS ingest decoupled:** আলাদা service, TimescaleDB, raw ping relational DB-তে না।

সব লজিক → [docs/01](docs/01-PRD-full-build-spec.md) সেকশন ৯।

---

### ৮. পরবর্তী স্টেপ (এখন কি করবো)

1. ✅ প্রতিযোগী এনালাইসিস + PRD + ডেটা মডেল + API স্পেক + আর্কিটেকচার — **done** (docs/01–05)
2. ✅ UI/UX + ডিজাইন সিস্টেম স্পেক — **docs/06** (তৈরি হচ্ছে)
3. ⬜ রেপো scaffold: NestJS API + Prisma migrate + React web + Expo app monorepo
4. ⬜ MVP স্প্রিন্ট ১: Auth (OTP) + multi-tenant + vehicle + driver + collection keypad + dues
5. ⬜ MVP স্প্রিন্ট ২: dashboard + receipt PDF + reports + SMS + free-tier gate + mobile offline
6. ⬜ MVP ডেপ্লয় → beta মালিক টেস্ট

> স্ক্যাফোল্ড শুরু করতে বললে আমি monorepo + Prisma schema + প্রথম API endpoint বসিয়ে দিতে পারি।



---

## অংশ ২ — UI/UX ও ডিজাইন সিস্টেম


## আমার অটো ক্লোন — UI/UX ও ডিজাইন সিস্টেম স্পেক

> Master UI document. Bengali-first · offline-first · low-literacy · icon-driven.
> তিন অংশ: (১) Design System — token/color/type/component, (২) Mobile App UI — স্ক্রিন+wireframe+nav, (৩) Web Dashboard + Platform Admin Panel UI।
> Grounding: [01-PRD-full-build-spec.md](01-PRD-full-build-spec.md), [02-feature-inventory.md](02-feature-inventory.md). Phase tags: **MVP** / **P2** / **P3** PRD §2 এর সাথে মেলে।

---

### Part I — Design System (shared: web shadcn/ui + mobile NativeWind)

## আমার অটো (Amar Auto) — Complete Design System
**Shared design tokens for Web (React + shadcn/ui) and Mobile (React Native + NativeWind)**
Version 1.0 · Bengali-first · Field-optimized · Offline-aware

> **North star:** A CNG driver's non-literate father can read the dashboard. Every meaning is carried by **icon + color + shape**, not text alone. Money that comes in is **green (জমা)**, money owed is **red (বাকি)**, and nothing important is ever conveyed by color alone.

---

### 0. Foundational Principles

| Principle | Implication for tokens/components |
|---|---|
| **Bengali is native** | Fonts, numerals, line-height, and letter-spacing are tuned for Bengali script first; Latin is the guest. |
| **Low-literacy redundancy** | Semantic color **always** pairs with an icon and/or a shape/label. Never color-only status. |
| **Field use (sunlight, one thumb, cheap phones)** | ≥ 4.5:1 text contrast, ≥ 48dp tap targets, big number-pad, high-contrast "outdoor" tuned palette. |
| **Offline-first** | A persistent sync/offline state layer (banner + per-row badges) is a first-class component. |
| **Money is sacred** | Currency uses tabular figures, fixed decimal, never floats; income/expense/due colors are locked and never reused for branding. |
| **One system, two runtimes** | A single JSON token source generates the shadcn CSS variables (HSL) and the NativeWind Tailwind theme. Component *specs* are shared; implementations differ. |

---

### 1. Bengali Typography

#### 1.1 Font recommendations (role → font)

| Role | Primary font | Why | Fallback stack |
|---|---|---|---|
| **UI / body / labels** | **Hind Siliguri** (400/500/600/700) | Purpose-built for Bengali UI at small sizes; excellent hinting on low-DPI Android; even color/rhythm; wide weight range. | `"Hind Siliguri", "Noto Sans Bengali", system-ui, sans-serif` |
| **Headings / display / stat numbers** | **Anek Bangla** (variable, 500–800) | Modern, slightly condensed, confident at large sizes for KPIs and screen titles; variable = 1 file, many weights. | `"Anek Bangla", "Hind Siliguri", sans-serif` |
| **Currency / tabular numerals (dashboards, ledger, tables)** | **Hind Siliguri** with `font-feature-settings: "tnum" 1, "lnum" 1` (Latin) OR native Bengali numerals rendered in Hind Siliguri | Hind Siliguri has even numeral widths → columns line up in ledgers. | `"Hind Siliguri", "Noto Sans Bengali"` |
| **Receipts / PDF / print / SMS-image** | **Noto Sans Bengali** (embed 400/700) | The most complete, license-clean (OFL) Bengali coverage; renders identically across PDF engines and OS; safe conjunct rendering. | Embed subset in PDF; never rely on system font. |
| **Monospace (IDs, IMEI, receipt no., part no.)** | **JetBrains Mono** / `ui-monospace` | Latin-only technical strings; unambiguous 0/O, 1/l. | `ui-monospace, "JetBrains Mono", monospace` |

> **Do NOT use** Baloo Da 2 as the body/UI font — its rounded display personality hurts legibility of dense conjuncts (যুক্তাক্ষর) at 13–15px and in ledgers. Reserve **Baloo Da 2** (or Anek) only for **marketing/onboarding illustration captions and the app wordmark**, not product chrome.

#### 1.2 Font loading

**Web**
- Self-host WOFF2 (do **not** hotlink Google Fonts — many BD users are on throttled data / behind CDNs that block Google). Serve from your own origin.
- Subset to **Bengali + Latin + Bengali numerals + currency (৳)** ranges to cut file size ~60%.
- `font-display: swap` for UI fonts; **`font-display: block` (max 3s) for the currency/number font** so amounts never flash in a fallback with different digit widths (prevents layout jump on KPIs).
- Preload the two critical weights:
```html
<link rel="preload" href="/fonts/hind-siliguri-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/hind-siliguri-600.woff2" as="font" type="font/woff2" crossorigin>
```
- Variable font for Anek Bangla (single file), static instances for Hind Siliguri (4 weights) — Hind ships as statics.

**Mobile (Expo/RN)**
- Bundle `.ttf` via `expo-font` / `useFonts`; hold splash until `fontsLoaded` (fonts are local → no FOUT, no layout shift, works offline).
```ts
useFonts({
  'HindSiliguri-Regular': require('./fonts/HindSiliguri-Regular.ttf'),
  'HindSiliguri-Medium':  require('./fonts/HindSiliguri-Medium.ttf'),
  'HindSiliguri-SemiBold':require('./fonts/HindSiliguri-SemiBold.ttf'),
  'HindSiliguri-Bold':    require('./fonts/HindSiliguri-Bold.ttf'),
  'AnekBangla-SemiBold':  require('./fonts/AnekBangla-SemiBold.ttf'),
  'AnekBangla-Bold':      require('./fonts/AnekBangla-Bold.ttf'),
});
```
- **PDF (receipts):** embed a subsetted **Noto Sans Bengali** into the PDF (e.g. pdf-lib/`react-pdf` `Font.register`, or a server-side Puppeteer/Playwright renderer with the font file present). Test conjuncts (স্ট, ক্ষ, ঞ্জ, র‍্য) and the ৳ sign at print resolution before shipping any receipt.

#### 1.3 Bengali vs Latin numeral policy

**Policy: locale-driven, default Bengali, stored as Latin.**

| Context | Displayed digits | Rationale |
|---|---|---|
| Currency amounts, dashboard KPIs, ledger, receipts, keypad | **Bengali numerals (০–৯)** by default | Native audience; matches every competitor and physical receipts drivers know. |
| The same, if user toggles `numeralSystem = 'en'` (Settings) | Latin (0–9) | Managers/accountants who prefer Latin; export compatibility. |
| **Machine/technical strings** — IMEI, part numbers, OTP input echo, IDs, API/JSON, CSV/Excel export, phone numbers for dialing | **Always Latin** | Interoperability, dialer, copy-paste, spreadsheets. |
| Charts axis ticks | Follow `numeralSystem` | Consistency with surrounding UI. |

Rules:
- **Store & compute in Latin/Decimal only.** Bengali numerals are a **render-time transform**, never a storage format.
- Provide one formatter used everywhere:
```ts
// format money: 1234.5 -> "১,২৩৪.৫০" (bn) or "1,234.50" (en) + ৳ prefix
formatCurrency(amount, { locale, numeralSystem }) // uses Intl.NumberFormat('bn-BD')
toBnDigits(str)  // 0-9,.,, -> ০-৯ (also converts grouping/decimal separators)
```
- **Currency symbol:** ৳ (BDT taka sign, U+09F3). Placement: `৳১,২৩৪` (symbol before, no space) in UI; `৳ 1,234.00` in receipts. Grouping is the **Indian/Bangladeshi lakh-crore system** via `Intl.NumberFormat('bn-BD')` (e.g. ১,২৩,৪৫৬) — do NOT hardcode Western 3-digit grouping.
- Bengali numerals in **Hind Siliguri render with consistent advance widths** → safe for right-aligned ledger columns. Right-align all money; left/start-align all Bengali text.

#### 1.4 Type scale (shared)

Base 16px. Bengali needs **more line-height** than Latin (tall conjuncts + reph/hasant marks). Minimum body line-height **1.6**; headings **1.3**.

| Token | size / line-height | weight | font | Use |
|---|---|---|---|---|
| `display` | 34 / 42 | 700 | Anek Bangla | Onboarding hero, big empty-state number |
| `h1` | 28 / 36 | 700 | Anek Bangla | Screen title |
| `h2` | 22 / 30 | 600 | Anek Bangla | Section header |
| `h3` | 18 / 26 | 600 | Hind Siliguri | Card title |
| `body-lg` | 16 / 26 | 400/500 | Hind Siliguri | Primary body, form labels |
| `body` | 15 / 24 | 400 | Hind Siliguri | Default text |
| `body-sm` | 13 / 20 | 400 | Hind Siliguri | Secondary/meta |
| `caption` | 12 / 18 | 500 | Hind Siliguri | Chips, timestamps, helper |
| `overline` | 11 / 16 | 600 (tracking +0.04em) | Hind Siliguri | Labels above stat |
| `kpi` | 30 / 34 | 700, `tnum` | Anek Bangla | Dashboard money figures |
| `kpi-sm` | 20 / 24 | 700, `tnum` | Hind Siliguri | Card money figures |
| `money-cell` | 15 / 22 | 500, `tnum` | Hind Siliguri | Ledger/table numeric cells |
| `mono` | 13 / 20 | 400 | JetBrains Mono | IDs, IMEI, receipt no. |

- Minimum interactive/body text: **never below 13px**; field-critical numbers ≥ 15px.
- `letter-spacing`: **0** for Bengali (never track Bengali; it breaks conjunct joining). Only `overline`/Latin caps get positive tracking.
- Numeric cells: `font-variant-numeric: tabular-nums;` + `text-align: end`.

---

### 2. Color System

#### 2.1 Semantic model

Colors are split into **Brand** (identity), **Financial** (locked meanings — never reused for decoration), **Status** (operational states), and **Neutrals**. Every semantic color has a `-fg` (text/icon on that surface) and, where used as a subtle background, a `-subtle` + `-subtle-fg` pair for AA-safe filled chips/rows.

**Locked financial semantics (memorize these — they are the product):**

| Meaning | Bengali | Token | Light | Dark |
|---|---|---|---|---|
| **Income / deposit / collection** | জমা / আয় | `income` (= success) | `#15803D` (green-700) | `#4ADE80` (green-400) |
| **Expense / due / owed / shortfall** | বাকি / খরচ / বকেয়া | `due` (= danger) | `#DC2626` (red-600) | `#F87171` (red-400) |
| **Expiry / overdue-soon / warning** | মেয়াদ / সতর্কতা | `warning` | `#B45309` (amber-700) | `#FBBF24` (amber-400) |
| **Discount / waiver / advance** | ছাড় / অগ্রিম | `info` (blue, neutral-positive) | `#1D4ED8` (blue-700) | `#60A5FA` (blue-400) |

> Rule: green = money in, red = money out/owed. **Brand color is deliberately NOT green or red** so branding never collides with financial meaning.

#### 2.2 Brand

Primary = **Trust Teal-Blue** (`#0E7490`-family, cyan-800/teal). Reads as trustworthy + techy, distinct from income-green and due-red, high-contrast on white and in sunlight.

| Token | Light | Dark |
|---|---|---|
| `primary` | `#0E7490` (cyan-800) | `#22D3EE` (cyan-400) |
| `primary-fg` | `#FFFFFF` | `#062A33` |
| `primary-hover` | `#0C6379` | `#67E8F9` |
| `primary-subtle` (bg) | `#ECFEFF` (cyan-50) | `#0B3B47` |
| `primary-subtle-fg` | `#0E7490` | `#A5F3FC` |
| `accent` (secondary CTA, highlights) | `#7C3AED` (violet-600) | `#A78BFA` |

#### 2.3 Full token table (light + dark)

| Token | Light | Dark | Notes |
|---|---|---|---|
| `background` | `#F8FAFC` | `#0B1220` | app canvas |
| `surface` / `card` | `#FFFFFF` | `#131C2B` | cards, sheets |
| `surface-2` (raised/muted panel) | `#F1F5F9` | `#1B2637` | keypad bg, table header |
| `foreground` (text) | `#0F172A` | `#E7ECF3` | primary text |
| `muted-fg` | `#475569` | `#94A3B8` | secondary text (AA on both) |
| `subtle-fg` | `#64748B` | `#7F8CA3` | meta/placeholder |
| `border` | `#E2E8F0` | `#26324A` | hairlines |
| `input-border` | `#CBD5E1` | `#334155` | field outline |
| `ring` (focus) | `#0E7490` | `#22D3EE` | focus ring = primary |
| `income` | `#15803D` | `#4ADE80` | jomā green |
| `income-subtle` / `-fg` | `#DCFCE7` / `#166534` | `#0F2A1B` / `#86EFAC` | income chip/row |
| `due` | `#DC2626` | `#F87171` | baki red |
| `due-subtle` / `-fg` | `#FEE2E2` / `#991B1B` | `#2A1416` / `#FCA5A5` | due chip/row (the RED dues) |
| `warning` | `#B45309` | `#FBBF24` | expiry |
| `warning-subtle` / `-fg` | `#FEF3C7` / `#92400E` | `#2A2113` / `#FDE68A` | expiry banner |
| `info` | `#1D4ED8` | `#60A5FA` | discount/advance/neutral-info |
| `info-subtle` / `-fg` | `#DBEAFE` / `#1E40AF` | `#12233F` / `#93C5FD` | |
| `destructive` | `#DC2626` | `#F87171` | = due (delete actions) |
| `overlay` | `rgba(2,6,23,.55)` | `rgba(0,0,0,.65)` | modal/sheet scrim |

All body text/background pairs meet **WCAG AA (≥4.5:1)**; large KPI text meets AA-large (≥3:1) at minimum, most meet 4.5:1. `muted-fg` verified ≥4.5:1 on both `surface` and `background`.

#### 2.4 Operational status colors (with mandatory icon/shape)

| Domain | State (Bn) | Color token | Icon (Lucide) | Shape/badge |
|---|---|---|---|---|
| **Run state** | RUNNING (চলছে) | `income` | `Navigation`/`Play` filled | solid dot ● pulsing |
| | STOPPED (থেমে আছে) | `subtle-fg` (gray) | `Square`/`Pause` | hollow dot ○ |
| **Vehicle op** | EMPTY / খালি | `subtle-fg` neutral | `CircleDashed` | outline chip |
| | RENTED / ভাড়ায় | `info` blue | `KeyRound` | solid chip |
| | BOOKED / বুকড | `warning` amber | `CalendarClock` | solid chip |
| **Billing / invoice** | PAID / পরিশোধিত | `income` | `CheckCircle2` | solid green chip |
| | PENDING / বাকি | `warning` | `Clock` | amber chip |
| | PARTIAL / আংশিক | `info` | `CircleDashed` (half) | striped chip |
| | OVERDUE / মেয়াদোত্তীর্ণ | `due` | `AlertTriangle` | red chip |
| | SOFT_LOCKED / লক | `due` on `surface-2` | `Lock` | red outline + lock icon (always icon, distinct from overdue) |
| **Sync** | SYNCED | `income` | `Check` | tiny check |
| | QUEUED / অপেক্ষমাণ | `warning` | `CloudOff`/`RefreshCw` | pulsing amber |
| | FAILED | `due` | `TriangleAlert` | red |

> Because ~status is life-or-death for low-literacy users: **shape + icon + color, all three.** A red/green colorblind user distinguishes দ্বারা icon (`AlertTriangle` vs `CheckCircle2`) and fill (solid vs hollow).

#### 2.5 Chart palette (categorical + sequential)

Categorical (expense categories, income sources) — colorblind-safe, distinct in light+dark:
```
c1 #0E7490 (teal)  c2 #7C3AED (violet)  c3 #EA580C (orange)
c4 #0891B2 (cyan)  c5 #CA8A04 (gold)    c6 #DB2777 (pink)
c7 #4D7C0F (olive) c8 #475569 (slate)
```
Financial dual-series charts must keep **income=green, expense/due=red** (do not recolor from categorical). Sequential (heatmap/intensity): single-hue teal ramp `#ECFEFF → #0E7490 → #164E63`. Follow the app's numeral system for axis ticks; ≥3:1 contrast for bars vs background. (See dataviz guidance for legend/tooltip/tick rules if building charts.)

---

### 3. Spacing, Radius, Elevation, Breakpoints, Tap Targets

#### 3.1 Spacing scale (4px base)
`0, 1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40, 12=48, 16=64` (px). Screen gutters: **16px mobile**, 24px tablet, 32px web. Card padding: 16 (mobile) / 20 (web). Stack gap between cards: 12–16.

#### 3.2 Radius
| Token | px | Use |
|---|---|---|
| `radius-sm` | 8 | chips, badges, inputs |
| `radius-md` | 12 | buttons, cards (default) |
| `radius-lg` | 16 | stat cards, sheets top corners |
| `radius-xl` | 24 | bottom-sheet grabber area, modals |
| `radius-pill` | 999 | keypad keys are `radius-lg`, FAB & filter chips pill |
| `radius-full` | 9999 | avatars, status dots |

Base `--radius: 12px` (shadcn derives sm/md/lg from it).

#### 3.3 Elevation
Field-friendly: rely on **border + subtle shadow**, not heavy blur (cheap screens smear). Dark mode uses lighter *surface* instead of shadow.

| Token | Light shadow | Dark |
|---|---|---|
| `e0` flat | none, 1px border | 1px border |
| `e1` card | `0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.10)` | border + `surface` lift |
| `e2` raised/menu | `0 4px 12px rgba(15,23,42,.10)` | `0 4px 16px rgba(0,0,0,.5)` |
| `e3` sheet/modal | `0 12px 32px rgba(15,23,42,.18)` | `0 16px 40px rgba(0,0,0,.6)` |
| `e-fab` | `0 6px 16px rgba(14,116,144,.35)` | `0 6px 16px rgba(34,211,238,.25)` |

#### 3.4 Breakpoints
| Name | min-width | Layout |
|---|---|---|
| `xs` | 0 | 1-col, bottom-nav (mobile app + small web) |
| `sm` | 480 | large phone, 2-col stat grid |
| `md` | 768 | tablet, 2–3 col, sidebar collapsible |
| `lg` | 1024 | web dashboard, persistent left sidebar + content |
| `xl` | 1280 | 3–4 col dashboards, side detail panel |
| `2xl` | 1536 | max-width 1440 content, wide tables |

Mobile app is effectively `xs`. Web dashboard designs at `lg`+ with a mobile-web fallback at `xs`.

#### 3.5 Tap targets (field-critical)
- **Minimum 48×48 dp** for any tap target (Android a11y). Primary field actions (keypad keys, জমা entry, START/END) = **56dp**.
- Keypad keys: **64dp tall** on phones ≥ sm, min 56dp on xs; 8px gap.
- Min 8px spacing between adjacent targets. FAB 56dp, bottom-nav items 56–64dp tall with icon+label.
- Form inputs: 52dp height on mobile. Do not place two destructive actions adjacent.

---

### 4. Component Library Spec + Token Blocks

#### 4.1 Design tokens — JSON (single source → generates both runtimes)

```json
{
  "$meta": { "name": "amar-auto", "version": "1.0" },
  "color": {
    "brand":   { "primary": { "light": "#0E7490", "dark": "#22D3EE" },
                 "primaryFg": { "light": "#FFFFFF", "dark": "#062A33" },
                 "accent": { "light": "#7C3AED", "dark": "#A78BFA" } },
    "financial": {
      "income": { "light": "#15803D", "dark": "#4ADE80" },
      "incomeSubtle": { "light": "#DCFCE7", "dark": "#0F2A1B" },
      "due":    { "light": "#DC2626", "dark": "#F87171" },
      "dueSubtle": { "light": "#FEE2E2", "dark": "#2A1416" },
      "warning":{ "light": "#B45309", "dark": "#FBBF24" },
      "warningSubtle": { "light": "#FEF3C7", "dark": "#2A2113" },
      "info":   { "light": "#1D4ED8", "dark": "#60A5FA" },
      "infoSubtle": { "light": "#DBEAFE", "dark": "#12233F" }
    },
    "neutral": {
      "background": { "light": "#F8FAFC", "dark": "#0B1220" },
      "surface":    { "light": "#FFFFFF", "dark": "#131C2B" },
      "surface2":   { "light": "#F1F5F9", "dark": "#1B2637" },
      "foreground": { "light": "#0F172A", "dark": "#E7ECF3" },
      "mutedFg":    { "light": "#475569", "dark": "#94A3B8" },
      "border":     { "light": "#E2E8F0", "dark": "#26324A" },
      "inputBorder":{ "light": "#CBD5E1", "dark": "#334155" },
      "ring":       { "light": "#0E7490", "dark": "#22D3EE" },
      "overlay":    { "light": "rgba(2,6,23,.55)", "dark": "rgba(0,0,0,.65)" }
    },
    "chart": ["#0E7490","#7C3AED","#EA580C","#0891B2","#CA8A04","#DB2777","#4D7C0F","#475569"]
  },
  "font": {
    "ui": "Hind Siliguri", "display": "Anek Bangla",
    "number": "Hind Siliguri", "mono": "JetBrains Mono", "pdf": "Noto Sans Bengali"
  },
  "radius": { "sm": 8, "md": 12, "lg": 16, "xl": 24, "pill": 999 },
  "space":  { "1":4,"2":8,"3":12,"4":16,"5":20,"6":24,"8":32,"10":40,"12":48,"16":64 },
  "tap":    { "min": 48, "action": 56, "key": 64, "input": 52 },
  "elevation": {
    "e1":"0 1px 3px rgba(15,23,42,.10)",
    "e2":"0 4px 12px rgba(15,23,42,.10)",
    "e3":"0 12px 32px rgba(15,23,42,.18)"
  }
}
```

#### 4.2 shadcn/ui CSS variables (web — `globals.css`, HSL for shadcn compatibility)

```css
:root {
  --background: 210 40% 98%;      /* #F8FAFC */
  --foreground: 222 47% 11%;      /* #0F172A */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;
  --muted: 210 40% 96%;          /* surface-2 #F1F5F9 */
  --muted-foreground: 215 25% 35%;/* #475569 */
  --primary: 192 82% 31%;        /* #0E7490 */
  --primary-foreground: 0 0% 100%;
  --secondary: 258 90% 66%;      /* accent violet */
  --secondary-foreground: 0 0% 100%;
  --border: 214 32% 91%;         /* #E2E8F0 */
  --input: 214 20% 80%;          /* #CBD5E1 */
  --ring: 192 82% 31%;
  --radius: 0.75rem;             /* 12px */

  /* financial semantics (custom, consumed by app + Tailwind) */
  --income: 142 72% 29%;         /* #15803D */
  --income-subtle: 141 79% 93%;  /* #DCFCE7 */
  --due: 0 72% 51%;              /* #DC2626 */
  --due-subtle: 0 86% 94%;       /* #FEE2E2 */
  --warning: 32 94% 36%;         /* #B45309 */
  --warning-subtle: 48 96% 89%;  /* #FEF3C7 */
  --info: 224 76% 48%;           /* #1D4ED8 */
  --info-subtle: 214 95% 93%;    /* #DBEAFE */
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;
}
.dark {
  --background: 222 47% 8%;      /* #0B1220 */
  --foreground: 213 27% 92%;
  --card: 218 34% 12%;           /* #131C2B */
  --card-foreground: 213 27% 92%;
  --popover: 218 34% 12%;
  --popover-foreground: 213 27% 92%;
  --muted: 218 30% 16%;          /* #1B2637 */
  --muted-foreground: 215 20% 65%;
  --primary: 187 85% 53%;        /* #22D3EE */
  --primary-foreground: 191 82% 12%;
  --secondary: 255 92% 76%;
  --border: 218 30% 22%;
  --input: 217 33% 27%;
  --ring: 187 85% 53%;
  --income: 142 69% 58%;         /* #4ADE80 */
  --income-subtle: 141 40% 12%;
  --due: 0 91% 71%;              /* #F87171 */
  --due-subtle: 0 40% 13%;
  --warning: 43 96% 56%;         /* #FBBF24 */
  --warning-subtle: 40 40% 12%;
  --info: 213 94% 68%;           /* #60A5FA */
  --info-subtle: 214 45% 15%;
  --destructive: 0 91% 71%;
  --destructive-foreground: 0 0% 100%;
}
```

**Tailwind (web) — `tailwind.config.ts` extend:**
```ts
theme: { extend: {
  colors: {
    background:'hsl(var(--background))', foreground:'hsl(var(--foreground))',
    card:{DEFAULT:'hsl(var(--card))', foreground:'hsl(var(--card-foreground))'},
    muted:{DEFAULT:'hsl(var(--muted))', foreground:'hsl(var(--muted-foreground))'},
    primary:{DEFAULT:'hsl(var(--primary))', foreground:'hsl(var(--primary-foreground))'},
    border:'hsl(var(--border))', input:'hsl(var(--input))', ring:'hsl(var(--ring))',
    income:{DEFAULT:'hsl(var(--income))', subtle:'hsl(var(--income-subtle))'},
    due:{DEFAULT:'hsl(var(--due))', subtle:'hsl(var(--due-subtle))'},
    warning:{DEFAULT:'hsl(var(--warning))', subtle:'hsl(var(--warning-subtle))'},
    info:{DEFAULT:'hsl(var(--info))', subtle:'hsl(var(--info-subtle))'},
  },
  borderRadius:{ lg:'var(--radius)', md:'calc(var(--radius) - 4px)', sm:'calc(var(--radius) - 6px)' },
  fontFamily:{
    sans:['"Hind Siliguri"','"Noto Sans Bengali"','system-ui','sans-serif'],
    display:['"Anek Bangla"','"Hind Siliguri"','sans-serif'],
    mono:['"JetBrains Mono"','ui-monospace','monospace'],
  },
}}
```

#### 4.3 NativeWind (mobile) — `tailwind.config.js`

NativeWind can't read runtime CSS vars for theme switching cleanly, so define **two named palettes** and switch class prefix (`dark:`) via `nativewind` dark mode (`darkMode: 'class'` driven by `useColorScheme`).
```js
module.exports = {
  darkMode: 'class',
  theme: { extend: {
    colors: {
      bg: '#F8FAFC', 'bg-dark':'#0B1220',
      surface:'#FFFFFF','surface-dark':'#131C2B',
      surface2:'#F1F5F9','surface2-dark':'#1B2637',
      fg:'#0F172A','fg-dark':'#E7ECF3',
      muted:'#475569','muted-dark':'#94A3B8',
      border:'#E2E8F0','border-dark':'#26324A',
      primary:'#0E7490','primary-dark':'#22D3EE',
      income:'#15803D','income-dark':'#4ADE80',
      'income-subtle':'#DCFCE7','income-subtle-dark':'#0F2A1B',
      due:'#DC2626','due-dark':'#F87171',
      'due-subtle':'#FEE2E2','due-subtle-dark':'#2A1416',
      warning:'#B45309','warning-dark':'#FBBF24',
      info:'#1D4ED8','info-dark':'#60A5FA',
    },
    fontFamily: {
      sans:['HindSiliguri-Regular'], medium:['HindSiliguri-Medium'],
      semibold:['HindSiliguri-SemiBold'], bold:['HindSiliguri-Bold'],
      display:['AnekBangla-Bold'], mono:['JetBrainsMono-Regular'],
    },
    borderRadius:{ sm:'8px', md:'12px', lg:'16px', xl:'24px' },
  }},
};
```
> Recommended: generate all three artifacts (2 + tokens) from the JSON via **Style Dictionary** so web CSS vars, NativeWind colors, and PDF theme never drift.

#### 4.4 Component specs

**Button** — variants `primary | secondary | outline | ghost | danger | income | success-ghost`; sizes `sm 40 / md 48 / lg 56` (height dp). Field primary CTA = `lg`, full-width, icon + label. Radius md. Loading = spinner replaces icon, label stays. Disabled = `surface-2` bg, `muted-fg`. `danger` uses `due`. Never icon-only for primary field actions (add label). Min touch 48.

**Number-pad / Keypad (signature component — জমা entry)**
- 3×4 grid: ১ ২ ৩ / ৪ ৫ ৬ / ৭ ৮ ৯ / `.` ০ ⌫. Keys 64dp, `radius-lg`, `surface`, 1px border, `e1`. Active/press = `primary-subtle` fill + scale 0.97 + **haptic (light impact)**.
- Digits rendered in **Bengali numerals** (per numeral policy) at `kpi-sm` weight 700; store Latin.
- Large amount display above pad: `kpi` size, `income` color while typing a deposit, right-aligned, ৳ prefix, live-grouped.
- Big confirm bar: full-width `income` button "জমা করুন" (Save deposit) 56dp. Optional quick-chips above pad for common target amounts (৳৫০০ / ৳৮০০ / ৳১০০০ / "টার্গেট").
- Backspace long-press = clear all. No keyboard focus needed (custom pad avoids OS keyboard for low-literacy speed).

**Cards**
- *Stat card:* `overline` label + optional icon, `kpi`/`kpi-sm` value, delta chip (▲ income / ▼ due colored). Radius lg, padding 16–20, `e1`. Money value colored by financial meaning (today's collection green, today's expense red-ish neutral, profit green/red by sign).
- *Vehicle card:* left = type icon in tinted circle (color by `VehicleType`), title = `registrationNo` (mono-ish tabular) + model, right = **run-state dot + op-status chip**. Footer row: today's income (green), due (red), driver name/avatar. Tap → vehicle profile. Show a subtle "FREE" ribbon on the 1 non-billable vehicle; lock icon overlay if `soft_locked`.
- *Driver card:* avatar (photo or initials), name, assigned vehicle chip, and **dues in RED** prominently (`due` color, `kpi-sm`) with `AlertTriangle` when > 0; deposit-today in green. CTA row: জমা (collect) primary, SMS reminder ghost.

**Tables (web + tablet)** — `surface-2` sticky header, `body-sm` 600 header, row height 48, zebra optional (`surface-2` at 40% in light). Money columns right-aligned tabular, colored by sign/meaning. Row status via leading colored bar (4px) + chip. Mobile collapses tables into cards (never horizontal-scroll critical financial data by default; provide an `overflow-x-auto` wrapper only for wide optional columns). Sort/filter icons ≥40dp.

**Forms / inputs** — height 52 (mobile) / 44 (web), `radius-sm`, `input-border`, focus = 2px `ring`. Label above (never placeholder-only — low literacy needs persistent labels + icon). Currency input: ৳ prefix adornment, numeric keypad `inputMode="decimal"`, tabular. Errors: `due` border + `due-fg` text + `AlertCircle` icon + Bengali message. Required marked with `*` and icon, not color-only. Selects prefer **large icon-tile pickers** (business mode, vehicle type, expense category) over dropdowns.

**Bottom sheet (mobile primary modal)** — top `radius-xl`, grabber handle, `e3`, scrim `overlay`. Snap points (40%/90%). Used for: collection entry, add expense, driver picker, receipt preview, filters. Title `h3`, close = swipe-down or ✕ ≥44dp. Primary action pinned to bottom, safe-area inset aware.

**Modal/dialog (web)** — centered, max-width 480, `radius-lg`, `e3`. Destructive confirms: red title icon + explicit consequence text in Bengali; primary button = `danger`, cancel = `outline`, cancel is default focus.

**Toast / snackbar** — top (mobile) / bottom-right (web), auto 4s, `e2`. Types: success (`income` + Check), error (`due` + AlertTriangle), warning, info. Includes icon always. Offline actions show "সংরক্ষিত — সিঙ্ক হবে" (saved, will sync) with cloud-off icon.

**Empty states** — friendly illustration + one-line Bengali guidance + one primary CTA. E.g. no vehicles: garage illustration + "আপনার প্রথম গাড়ি যোগ করুন" + big + button. Never a blank screen; always show the next action.

**Badges / chips** — `radius-sm` (status) / pill (filters). Height 24–28, `caption` 500, icon 14 + label. Filled `-subtle` bg + `-fg` text for AA. Status chips per the §2.4 table (icon mandatory). Count badges (unread QR scans) = filled `due` or `primary` circle with tabular number.

**Charts** — Recharts (web) / Victory or `react-native-svg` charts (mobile). Palette §2.5; income green / expense red locked; grid `border` color; tooltip on `surface` `e2`; axis labels `caption` `muted-fg` in app numeral system; donut center shows total. Min bar height and direct labels for low-literacy (prefer labeled bars + icons over legends).

**Offline banner (first-class)** — slim bar under header: amber (`warning-subtle`) "অফলাইন — ইন্টারনেট নেই" with `CloudOff`; when reconnecting → `info` "সিঙ্ক হচ্ছে…" spinner; success flash green then auto-hide. Queued-entry count shown ("৩টি এন্ট্রি অপেক্ষমাণ"). Per-row `QUEUED` badge on optimistic entries.

**Receipt template (PDF/image, shareable)** — A6/thermal-friendly width. Structure:
1. Header: business name (Anek Bangla bold) + logo + "রসিদ" + `receiptNo` (mono) + date/time (Bengali numerals).
2. Party line: driver/customer name + vehicle reg.
3. Amount block: বড় করে জমা amount (green) in `kpi`; below: target, discount (ছাড়), **due remaining in red**.
4. Ledger-style rows, tabular right-aligned ৳.
5. Footer: "যন্ত্রে তৈরি রসিদ" (machine-generated), share link/QR, powered-by.
- **Embed Noto Sans Bengali** (400+700) subset. Test ৳ + conjuncts at 203dpi thermal + screen. High contrast pure black on white (thermal has no color) — but the **screen/image variant** may use `income`/`due` colors. Provide both a color-image receipt (WhatsApp share) and a mono print receipt.

---

### 5. Iconography, Imagery, RTL, Accessibility

#### 5.1 Icon set
**Primary: Lucide** (`lucide-react` web / `lucide-react-native` mobile). Reasons: MIT, huge coverage, consistent 2px stroke, matches both runtimes, tree-shakeable. Style: **outline, 2px stroke, 24dp default (20 dense, 28 nav)**, `currentColor`. Status icons may be **filled** variants for emphasis (run-state dot, paid check). Keep one weight system app-wide.

**Per-module icon map:**

| Module | Bengali | Lucide icon |
|---|---|---|
| Dashboard | ড্যাশবোর্ড | `LayoutDashboard` |
| Collections / জমা | হিসাব ও জমা | `HandCoins` / `Wallet` |
| Vehicles | গাড়ি ও বহর | `Car` (+ type variants below) |
| Drivers | ড্রাইভার | `IdCard` / `UserRound` |
| Vehicle QR | গাড়ি QR | `QrCode` |
| Fuel | ফুয়েল | `Fuel` |
| Maintenance/Service | মেইনটেন্যান্স | `Wrench` |
| Documents/expiry | কাগজপত্র | `FileText` / `CalendarClock` |
| Inventory/Parts | ইনভেন্টরি | `Boxes` / `Package` |
| Reports | রিপোর্ট | `ChartColumn` / `ChartPie` |
| Live GPS | লাইভ GPS | `MapPin` / `Radar` |
| Charging | চার্জিং | `BatteryCharging` / `Zap` |
| Loans/Installments | ঋণ ও কিস্তি | `Landmark` / `CalendarClock` |
| Rental/Bookings | ভাড়া ও বুকিং | `CalendarCheck` / `KeyRound` |
| Party ledger | পাওনা-দেনা | `BookOpenText` / `Scale` |
| Billing/Subscription | বিলিং | `ReceiptText` / `CreditCard` |
| Notifications/SMS | নোটিফিকেশন | `Bell` / `MessageSquareText` |
| Support | সাপোর্ট | `LifeBuoy` / `Headset` |
| Marketplace | অটো বেচা-কেনা | `Store` / `Tag` |
| Settings | সেটিংস | `Settings` |
| Add / entry | যোগ | `Plus` (FAB) |
| Income | আয়/জমা | `ArrowDownToLine` (money in) green |
| Expense | খরচ | `ArrowUpFromLine` red |
| Due/alert | বাকি | `AlertTriangle` red |

**Vehicle-type sub-icons:** CNG/auto-rickshaw → custom 3-wheeler glyph (Lucide lacks it → add a small **custom SVG set** for `CNG`, `AUTO_RICKSHAW`, `E_BIKE`, `TRUCK`, `BUS`, `MICRO`; use `Car`, `Bike`, `Bus`, `Truck` where they exist). Keep custom icons on the same 24-grid, 2px stroke to match Lucide.

#### 5.2 Imagery
- Onboarding/empty-states: **flat vector illustrations** of Bangladeshi CNG/auto/bus/garage scenes; warm, optimistic, brand-teal + accent-violet + income-green accents. Diverse, respectful depiction of drivers/owners.
- Photos: driver KYC & vehicle docs are user content — show in rounded cards with graceful fallbacks (initials avatar for drivers, type-icon tile for vehicles).
- Never use text baked into raster images for UI copy (localization + accessibility).

#### 5.3 RTL
Bengali is **LTR** — the app is LTR. But build with **logical properties** (`margin-inline-start`, `ps-`/`pe-` in Tailwind, `flex-row` with `start/end`) so a future Urdu/Arabic market isn't a rewrite. Icons that imply direction (back chevron) stay LTR now; gate any mirroring behind `I18nManager.isRTL`. Numerals within Bengali text remain LTR runs.

#### 5.4 Accessibility (field + low-literacy)
- **Contrast:** all text ≥ AA 4.5:1 (verified in token table); status never color-only — **icon + shape + label** redundancy is mandatory (see §2.4).
- **Tap:** ≥48dp targets, 8dp spacing (§3.5).
- **Text scaling:** support OS font scaling up to 200%; layouts reflow (no fixed-height text rows for Bengali). Test at 130% (common on cheap large-DPI phones).
- **Screen readers:** every icon-only control has a Bengali `accessibilityLabel`/`aria-label`. Money announced with unit ("এক হাজার টাকা জমা"). Status chips announce state, not just color.
- **Focus:** visible 2px `ring` focus ring on web; logical tab order; keypad operable.
- **Motion:** respect `prefers-reduced-motion` — disable pulsing run-state dot, keep static icon.
- **Colorblind:** income/due distinguishable by icon (down-arrow vs up-arrow / check vs triangle) and position, verified against deuteranopia. Never the sole ▲/▼ color.
- **Haptics:** confirm on save, error buzz on failed sync — reinforces state non-visually.

---

### 6. Illustration & Tone Guidelines

**Voice (Bengali copy):**
- **Warm, respectful, plain.** Address the user politely (আপনি). Short sentences, verbs first ("গাড়ি যোগ করুন", "জমা করুন"). Avoid English loanwords where a common Bengali word exists, but keep familiar terms drivers actually use (মালিক, ড্রাইভার, জমা, বাকি, বকেয়া, রসিদ).
- **Numbers speak louder than words** — lead with the amount, support with one short label.
- **Encouraging, never scolding** on dues/overdue: state the fact + the action ("৳৫০০ বাকি — মনে করিয়ে দিন" not "You failed to collect").
- **Trust & transparency** framing everywhere (timestamps, "যন্ত্রে তৈরি রসিদ"): the product's value is anti-theft honesty.

**Illustration style:**
- Flat, geometric, 2–3 color (teal, violet, income-green), rounded forms echoing `radius-lg`. Consistent 2px linework to match icons. Human, hopeful, distinctly Bangladeshi (rickshaw silhouettes, garage, taka).
- Use illustration only for **onboarding, empty states, success milestones (achievements/gamification), and marketing** — never behind data. Keep product chrome clean and data-forward.
- Milestone/achievement art: celebratory but subtle (confetti on first জমা, first full month collected) — reinforces habit without noise.

**Tone by surface:** Dashboard = calm/data-forward. Onboarding = friendly/guiding. Errors/offline = reassuring ("চিন্তা নেই, সেভ হয়েছে"). Billing/soft-lock = firm but non-punitive, always showing the path to unlock.

---

#### Build order for a developer
1. Drop the **JSON tokens** (§4.1) into Style Dictionary → emit shadcn CSS vars (§4.2), NativeWind config (§4.3), and a PDF theme.
2. Self-host + preload **Hind Siliguri / Anek Bangla**, bundle in Expo, embed **Noto Sans Bengali** in the PDF pipeline.
3. Implement the shared **`formatCurrency` / `toBnDigits`** with the `numeralSystem` locale switch (§1.3).
4. Build the signature **Keypad + Collection bottom sheet**, **stat/vehicle/driver cards**, **status chip system (icon+shape+color)**, and the **offline banner** first — they carry the product's core loop.
5. Wire the **receipt template** with embedded Bengali font and test conjuncts + ৳ at thermal + screen resolution before any receipt ships.

All hex values in the token table meet WCAG AA for their intended text/background pairing in both light and dark modes; status is always conveyed by icon + shape + color together, never color alone.

---

### Part II — Mobile App UI (React Native / Expo)

## আমার অটো (Amar Auto) — Complete Mobile App UI/UX Spec

React Native / Expo · Android-first · Bengali-first (native, not translated) · Offline-first · Low-literacy · Icon-driven

Grounding: `docs/01-PRD-full-build-spec.md` (§2 feature inventory, §3 roles/auth, soft-lock 402) and `docs/02-feature-inventory.md` (§3 business rules). Phase tags below mirror the PRD: **MVP** = Phase 1, **P2** = Phase 2 (monetization/depth), **P3** = Phase 3 (platform/hardware/verticals).

---

### 0. Design Principles (drives every decision below)

| Principle | Concrete rule in this app |
|---|---|
| Bengali is native | Every label ships Bengali-primary. English gloss only in this doc `(like this)`, never in-app except a settings toggle. Numerals rendered as Bengali digits (০১২৩) with a settings switch to Latin. |
| Low-literacy first | Every actionable row carries an **icon + color**, not text alone. A user who cannot read must still complete daily জমা entry. |
| Minimal typing | Amounts via a big numeric keypad. Names/notes optional or via picker/voice. No free-text required to log a collection. |
| Large tap targets | Min 56dp height rows, 72dp primary action buttons, 88dp keypad keys. Nothing critical below 48dp. |
| Color = meaning | Green = money in / good (জমা, profit). **Red = dues/loss (বাকি)** — reserved, never decorative. Amber = warning/pending sync. Grey = disabled/locked. |
| Offline is the default assumption | Every write works offline and queues. A persistent sync chip is always visible. Never block the field worker on network. |
| One-thumb operation | Primary flows reachable bottom-half of screen; FAB and keypad thumb-reachable. |

Accessibility baseline: WCAG AA contrast, `accessibilityLabel` (Bengali) on all icons, dynamic font scale support up to 200%, haptic confirm on collection save, TalkBack pass required for MVP screens.

---

### 1. SCREEN INVENTORY (grouped by flow)

Legend: **[MVP]** ship Phase 1 · **[P2]** · **[P3]** · roles that can reach it in parens.

#### Flow 1 — Onboarding / Auth (OTP + PIN)
| # | Screen | Phase | Notes |
|---|---|---|---|
| 1.1 | Splash + offline bootstrap | MVP | Logo, loads cached session; routes to PIN/OTP/onboarding |
| 1.2 | Language pick (বাংলা / English) | MVP | Shown once; default বাংলা. Big two-button choice |
| 1.3 | Value-prop carousel (3 slides) | MVP | Icon-driven; "১টি গাড়ি সারাজীবন ফ্রি" is slide 3 |
| 1.4 | Phone number entry | MVP | Country locked +৮৮০, numeric keypad, big field |
| 1.5 | OTP verify (6-digit) | MVP | Auto-read SMS, resend timer, edit-number link |
| 1.6 | Business-mode select (8 presets) | MVP | Icon grid; sets vertical + default categories/labels |
| 1.7 | Owner profile quick-setup | MVP | Name + optional business name; skippable |
| 1.8 | Set PIN (create + confirm) | MVP | 4–6 digit; drives daily quick-login |
| 1.9 | First-vehicle wizard | MVP | "আপনার প্রথম গাড়ি যোগ করুন" — reg no + type; free-tier |
| 1.10 | First-driver + daily target wizard | MVP | Optional but nudged; sets `dailyCollectionTarget` |
| 1.11 | PIN quick-login (returning) | MVP | Default returning screen; biometric option |
| 1.12 | Password login (fallback) | MVP | Secondary; "PIN ভুলে গেছেন?" path |
| 1.13 | Forgot-PIN → OTP re-verify | MVP | Re-mint via phone OTP |
| 1.14 | Multi-device / active sessions list | P2 | Per-device remote logout |
| 1.15 | Staff invite accept (Manager/Accountant) | P2 | Phone+OTP into existing org |

#### Flow 2 — Home Dashboard
| # | Screen | Phase | |
|---|---|---|---|
| 2.1 | Smart Dashboard (today) | MVP | Collections/expenses/profit/active-vehicle count, live |
| 2.2 | Quick-add sheet (central +) | MVP | জমা / খরচ / গাড়ি / ড্রাইভার / আয় |
| 2.3 | Notifications center | P2 | Dues, doc expiry, sync errors, bill link |
| 2.4 | Global search | P2 | Driver/vehicle/receipt search |

#### Flow 3 — Collections & Accounts (হিসাব ও জমা)
| # | Screen | Phase | |
|---|---|---|---|
| 3.1 | Collection entry — driver select | MVP | Big avatar tiles, dues badge |
| 3.2 | Collection entry — keypad amount | MVP | Core screen; target/shortfall live |
| 3.3 | Collection confirm + discount (ছাড়) | MVP | Optional waiver, save |
| 3.4 | Collection success + receipt CTA | MVP | Share/SMS receipt |
| 3.5 | Add expense (খরচ) | MVP | Category grid + keypad + vehicle tag |
| 3.6 | Add income (non-collection) | MVP | Category + keypad |
| 3.7 | Backdated entry (date picker) | MVP | Flagged for audit banner |
| 3.8 | Money history / ledger log | MVP | Chronological, filter/search |
| 3.9 | General ledger / balance sheet | P2 | Double-entry, trial balance (accountant) |
| 3.10 | Voice entry (mic) | P3 | Hands-free income/expense |

#### Flow 4 — Drivers & Dues (ড্রাইভার)
| # | Screen | Phase | |
|---|---|---|---|
| 4.1 | Driver list + dues | MVP | Dues in RED, sortable by dues |
| 4.2 | Driver detail (ledger) | MVP | জমা/বাকি/ছাড় columns, running balance |
| 4.3 | Add/edit driver + KYC | MVP | NID, photo, profession, phone |
| 4.4 | Set daily target | MVP | Drives shortfall auto-calc |
| 4.5 | Dues repayment / settle | MVP | Reduce remaining balance |
| 4.6 | Send SMS reminder | MVP | Prefilled Bengali dues SMS |
| 4.7 | Driver-vehicle assignment | MVP | One active assignment/vehicle |

#### Flow 5 — Vehicles & Fleet (গাড়ি ও বহর)
| # | Screen | Phase | |
|---|---|---|---|
| 5.1 | Vehicle list / fleet grid | MVP | Status chips (খালি/ভাড়ায়/বুকড) |
| 5.2 | Vehicle profile + P&L | MVP | Per-vehicle income/expense/profit |
| 5.3 | Add vehicle (+ free-tier gate) | MVP | 2nd+ vehicle triggers paywall |
| 5.4 | Edit vehicle / docs | MVP | Reg, type, odometer, route |
| 5.5 | Fleet calendar (status board) | P2 | Empty/rented/booked/running |
| 5.6 | Accident record + photo | P3 | Auto-posts expense |

#### Flow 6 — Receipts
| # | Screen | Phase | |
|---|---|---|---|
| 6.1 | Digital receipt preview | MVP | PDF/image, share link |
| 6.2 | Share sheet (SMS/WhatsApp/link) | MVP | |
| 6.3 | Receipt history | P2 | Reissue/resend |

#### Flow 7 — Reports & Analytics (রিপোর্ট)
| # | Screen | Phase | |
|---|---|---|---|
| 7.1 | Reports home (P&L summary) | MVP | Period switch, per-vehicle P&L, export |
| 7.2 | Category-wise (খাতভিত্তিক) | P2 | Pie/bar |
| 7.3 | Calendar report | P2 | Day-by-day |
| 7.4 | Analytics trends (charts) | P2 | Income/expense/collection rate |
| 7.5 | Budget set + alert | P2 | Monthly threshold |
| 7.6 | Export (PDF/Excel) sheet | MVP | Monthly P&L PDF one-tap |

#### Flow 8 — Fuel & Maintenance (ফুয়েল ও মেইনটেন্যান্স)
| # | Screen | Phase | |
|---|---|---|---|
| 8.1 | Fuel log list + KPL | P2 | |
| 8.2 | Add fuel fill-up | P2 | Volume/price/odo → auto cost/KPL |
| 8.3 | Fuel analytics | P2 | City/highway, price trend |
| 8.4 | Maintenance dashboard | P2 | Reminders, cost totals |
| 8.5 | Add service record | P2 | Parts, next-due |
| 8.6 | Document expiry list | P2 | Route permit/fitness/insurance/tax/reg |

#### Flow 9 — Live GPS (লাইভ GPS)
| # | Screen | Phase | |
|---|---|---|---|
| 9.1 | Live map (all vehicles) | P3 | ~10s refresh, 100+ pins |
| 9.2 | Vehicle live detail | P3 | Speed, ignition, lock/unlock |
| 9.3 | Trip history + playback | P3 | |
| 9.4 | Geofence + alerts config | P3 | |
| 9.5 | Order GPS hardware flow | P3 | Order→Call→Install→Live, COD |

#### Flow 10 — Rental / Bookings (ভাড়া ও বুকিং)
| # | Screen | Phase | |
|---|---|---|---|
| 10.1 | Booking calendar | P2 | Availability, no double-book |
| 10.2 | New booking / rental invoice | P2 | Fare, অগ্রিম, বকেয়া |
| 10.3 | Hourly START(রিলিজ)/END(এন্ড) | P2 | Auto elapsed + surcharge |
| 10.4 | Customer CRM profile | P2 | Photo/ID/rental history |
| 10.5 | Trip handover (odometer) | P2 | |

#### Flow 11 — Charging / Loans / Party (verticals)
| # | Screen | Phase | |
|---|---|---|---|
| 11.1 | Charging daily collection | P3 | Per-customer daily rate, dues |
| 11.2 | Loans & installments | P3 | Given/taken/HP schedule |
| 11.3 | Party ledger (পাওনা-দেনা) | P3 | Truck/transport running ledger |
| 11.4 | Inventory & parts | P3 | Stock, suppliers, invoices |

#### Flow 12 — Billing & Subscription
| # | Screen | Phase | |
|---|---|---|---|
| 12.1 | Upgrade / paywall (free-tier gate) | MVP (gate) | Triggered by 2nd vehicle |
| 12.2 | Plan compare | P2 | 2-wheeler ৳350 / car-bus-truck ৳500 |
| 12.3 | Postpaid bill + bKash pay | P2 | Month-end invoice, 7-day window |
| 12.4 | Soft-lock banner / interstitial | P2 | HTTP 402, read stays open |
| 12.5 | Billing history | P2 | |

#### Flow 13 — QR (গাড়ি QR)
| # | Screen | Phase | |
|---|---|---|---|
| 13.1 | QR dashboard (scans/messages) | P2 | |
| 13.2 | Passenger messages inbox | P2 | Anonymous, complaints/lost-item |
| 13.3 | Bulk QR print / sticker | P2 | |

#### Flow 14 — Marketplace (অটো বেচা-কেনা)
| 14.1 | Feed | P3 | Admin-moderated |
| 14.2 | Post ad | P3 | Photos + map |

#### Flow 15 — Settings / Profile / Support
| # | Screen | Phase | |
|---|---|---|---|
| 15.1 | Settings home | MVP | Language, numerals, PIN, biometrics |
| 15.2 | Profile / business info | MVP | Business mode, bKash number |
| 15.3 | Staff & permissions | P2 | Manager/accountant scopes |
| 15.4 | Notification prefs | P2 | |
| 15.5 | Cloud backup status | P3 | |
| 15.6 | Support chat / ticket + call | P2 | 9AM–9PM, Fri closed |
| 15.7 | Legal / terms | MVP | |
| 15.8 | Sync queue / offline manager | MVP | Pending entries, retry, conflicts |

---

### 2. NAVIGATION MODEL

#### 2.1 Root

```
RootNavigator (auth gate on cached session + PIN)
├── AuthStack        (splash, lang, carousel, phone, OTP, mode, PIN, onboarding wizard)
├── AppTabs          (bottom tab bar — signed-in Owner/Manager/Accountant)
└── ModalStack       (quick-add sheets, paywall, receipt share, voice entry, soft-lock)
```

#### 2.2 Bottom tab bar (5 slots, center is the action)

```
┌──────────────────────────────────────────────────────────┐
│   হোম        ড্রাইভার      ➕        গাড়ি       রিপোর্ট     │
│   🏠         🧑‍✈️      (+)       🚗         📊         │
│  Home       Drivers    Quick    Vehicles   Reports        │
└──────────────────────────────────────────────────────────┘
```

- Tabs are **icon + Bengali label** (label always visible, low-literacy).
- Active tab: filled icon + green underline. Inactive: outline + grey.
- Center **+** is a raised FAB (72dp, green) — not a tab screen, opens the Quick-Add bottom sheet.
- Role variance: Accountant sees হোম/লেজার/➕/রিপোর্ট/আরও (no fleet-management writes if scope limited). Tab set is scope-driven.

#### 2.3 The central "+" Quick-Add (the money shot)

Tapping **+** opens a bottom sheet with 5 huge icon buttons; **জমা** is pre-focused and largest because it's the #1 daily action:

```
┌─────────────────────────────────────────┐
│              যোগ করুন                     │  ← "Add"
│                                           │
│   ┌─────────────┐   ┌─────────────┐       │
│   │     💰      │   │     🧾      │       │
│   │    জমা      │   │    খরচ      │       │
│   │  Collection │   │   Expense   │       │
│   └─────────────┘   └─────────────┘       │
│   ┌─────────────┐   ┌─────────────┐       │
│   │     ➕      │   │     🚗      │       │
│   │    আয়       │   │  নতুন গাড়ি  │       │
│   │   Income    │   │  New vehicle│       │
│   └─────────────┘   └─────────────┘       │
│   ┌─────────────────────────────┐         │
│   │   🎙️  বলে যোগ করুন (P3)      │         │  ← Voice entry
│   └─────────────────────────────┘         │
└─────────────────────────────────────────┘
```

- **জমা (Collection)** → Collection stack: DriverSelect → Keypad → Confirm → Success.
- Vehicle button honors free-tier gate → routes to paywall if `isBillable` would be triggered.
- Long-press **+** = shortcut straight to last driver's keypad (power-user, offline-friendly).

#### 2.4 Stack flows (per tab)

- **Home stack:** Dashboard → Notifications → Search → any entity detail.
- **Drivers stack:** List → Detail(ledger) → Repayment / SMS / Edit-KYC / Assign.
- **Vehicles stack:** List/Grid → Profile(P&L) → Add(gate) → Edit/Docs → Accident.
- **Reports stack:** Home → Category → Calendar → Analytics → Export.
- **"আরও" (More) menu** (overflow, reachable from Home header ☰): Fuel/Maintenance, GPS, Rental, Charging/Loans, Inventory, QR, Marketplace, Billing, Staff, Settings, Support. Keeps the tab bar to 5 while exposing all P2/P3 modules.

#### 2.5 Deep links / entry points

- SMS receipt link → public receipt view (no auth).
- Push "দ্বায় পরিশোধ করুন" → driver detail.
- bKash return → billing screen.
- QR scan (passenger, separate anon surface) → verify page.

---

### 3. ASCII WIREFRAMES — 10 key screens

Persistent element on every signed-in screen: the **sync chip** top-right of the header.
`● সিঙ্ক` (green dot = synced) · `⟳ ৩ অপেক্ষায়` (amber = 3 queued) · `⚠ অফলাইন` (grey/amber = no network).

---

#### 3.1 Dashboard (2.1) [MVP]

```
┌────────────────────────────────────────────┐
│ ☰   আমার অটো              ⟳ ২ অপেক্ষায়  🔔³ │  ← sync chip + notif badge
├────────────────────────────────────────────┤
│  আজ, ১১ জুলাই  ▾                            │  ← date/period switch
│                                            │
│  ┌────────────────────┐ ┌────────────────┐ │
│  │  💰 আজকের জমা       │ │ 🧾 আজকের খরচ    │ │
│  │  ৳ ৮,৪৫০           │ │ ৳ ১,২০০        │ │  (green)     (neutral)
│  └────────────────────┘ └────────────────┘ │
│  ┌────────────────────┐ ┌────────────────┐ │
│  │  📈 আজকের লাভ       │ │ 🚗 সচল গাড়ি     │ │
│  │  ৳ ৭,২৫০ (সবুজ)     │ │ ৪ / ৫          │ │
│  └────────────────────┘ └────────────────┘ │
│                                            │
│  ⚠ মোট বাকি: ৳ ৩,৬০০  (লাল)   ▸           │  ← total dues, RED, tap→drivers
│                                            │
│  আজকের জমা তোলা বাকি                        │  ← "collections still pending today"
│  ┌────────────────────────────────────┐    │
│  │ 🧑 করিম    গাড়ি ঢাকা-১১   ▸ জমা দিন │    │  ← quick collect CTA per driver
│  │ 🧑 রফিক    গাড়ি ঢাকা-৪২   ▸ জমা দিন │    │
│  └────────────────────────────────────┘    │
│                                            │
│  সাম্প্রতিক লেনদেন                          │  ← recent txns preview
│  💰 সেলিম  +৳ ২,০০০   সকাল ৯:১৫           │
│  🧾 তেল    −৳ ৫০০     সকাল ৮:৪০           │
├────────────────────────────────────────────┤
│ 🏠হোম  🧑‍✈️ড্রা.   (➕)   🚗গাড়ি  📊রিপোর্ট │
└────────────────────────────────────────────┘
```
Notes: Tiles are 2×2, tappable → drill-down. Total-dues bar is the single most prominent RED element. "জমা দিন" quick-actions let the owner start the keypad in one tap.

---

#### 3.2 Daily Collection — keypad entry (3.2) [MVP] ★ core screen

```
┌────────────────────────────────────────────┐
│ ←    জমা এন্ট্রি               ⚠ অফলাইন     │
├────────────────────────────────────────────┤
│  🧑 করিম মিয়া                              │  ← selected driver (from 3.1)
│  গাড়ি: ঢাকা মেট্রো-থ-১১-২২৩৪               │
│                                            │
│  দৈনিক লক্ষ্য:  ৳ ১,২০০                     │  ← daily target
│  আগের বাকি:    ৳ ৩০০  (লাল)                │  ← prior dues, RED
│  ┌────────────────────────────────────┐    │
│  │            ৳  ১,২০০                 │    │  ← BIG amount display (green)
│  └────────────────────────────────────┘    │
│  ঘাটতি: ৳ ০   ✅  (লক্ষ্য পূরণ)             │  ← live shortfall calc
│                                            │
│  ┌──────┐ ┌──────┐ ┌──────┐                │
│  │  ১   │ │  ২   │ │  ৩   │                │  ← 88dp keys
│  ├──────┤ ├──────┤ ├──────┤                │
│  │  ৪   │ │  ৫   │ │  ৬   │                │
│  ├──────┤ ├──────┤ ├──────┤                │
│  │  ৭   │ │  ৮   │ │  ৯   │                │
│  ├──────┤ ├──────┤ ├──────┤                │
│  │ ০০   │ │  ০   │ │  ⌫   │                │
│  └──────┘ └──────┘ └──────┘                │
│                                            │
│  ⚡ দ্রুত: [ +৫০০ ][ +১০০০ ][ লক্ষ্য পূরণ ] │  ← quick chips
│                                            │
│  ┌────────────────────────────────────┐    │
│  │        ✅  জমা নিশ্চিত করুন           │    │  ← 72dp green confirm
│  └────────────────────────────────────┘    │
└────────────────────────────────────────────┘
```
Notes: Shortfall recalculates on each keypress: `ঘাটতি = max(0, লক্ষ্য − জমা − ছাড়)`. If `জমা < লক্ষ্য`, the ঘাটতি line turns RED and shows "⚠ বাকি হবে: ৳X". "লক্ষ্য পূরণ" chip one-taps the exact target. No typing of names — driver preselected.

---

#### 3.3 Driver dues list (4.1) [MVP]

```
┌────────────────────────────────────────────┐
│ ←   ড্রাইভার ও বাকি          ● সিঙ্ক   🔍   │
├────────────────────────────────────────────┤
│  সাজান:  [ বাকি বেশি ▾ ]     মোট বাকি ৳৩,৬০০│  ← sort; total RED
│                                            │
│  ┌────────────────────────────────────┐    │
│  │ 🧑 রফিক আহমেদ           ▸           │    │
│  │ গাড়ি ঢাকা-৪২ · লক্ষ্য ৳১,২০০        │    │
│  │ বাকি:  ৳ ২,১০০  🔴                  │    │  ← RED pill, largest
│  └────────────────────────────────────┘    │
│  ┌────────────────────────────────────┐    │
│  │ 🧑 করিম মিয়া            ▸          │    │
│  │ গাড়ি ঢাকা-১১ · লক্ষ্য ৳১,২০০        │    │
│  │ বাকি:  ৳ ৩০০  🔴                    │    │
│  └────────────────────────────────────┘    │
│  ┌────────────────────────────────────┐    │
│  │ 🧑 সেলিম হক             ▸          │    │
│  │ গাড়ি ঢাকা-৭ · লক্ষ্য ৳১,০০০         │    │
│  │ বাকি:  ৳ ০  🟢  পরিশোধিত            │    │  ← GREEN = clear
│  └────────────────────────────────────┘    │
│                                            │
│           [ ➕ নতুন ড্রাইভার ]              │
├────────────────────────────────────────────┤
│ 🏠হোম  🧑‍✈️ড্রা.   (➕)   🚗গাড়ি  📊রিপোর্ট │
└────────────────────────────────────────────┘
```
Notes: Rows sorted by dues desc by default. Dues pill color: red > 0, green = 0. Whole row tappable → detail. Avatar shows KYC photo if present, else initial.

---

#### 3.4 Driver detail / ledger (4.2) [MVP]

```
┌────────────────────────────────────────────┐
│ ←   রফিক আহমেদ           ✏️ এডিট   ⋮        │
├────────────────────────────────────────────┤
│   ( 🧑 )   রফিক আহমেদ                       │  ← KYC photo
│           📞 01712-xxxxxx                   │
│           গাড়ি: ঢাকা মেট্রো-থ-৪২            │
│                                            │
│  ┌──────────┬──────────┬──────────┐        │
│  │ জমা      │ বাকি     │ ছাড়      │        │  ← 3 distinct columns
│  │ ৳৪৫,০০০  │ ৳২,১০০🔴 │ ৳৫০০     │        │
│  └──────────┴──────────┴──────────┘        │
│                                            │
│  [ 💰 জমা নিন ]   [ 📩 SMS মনে করান ]       │  ← primary actions
│  [ ✅ বাকি পরিশোধ ]                          │
│                                            │
│  খতিয়ান (Ledger)                           │
│ ┌──────────────────────────────────────┐  │
│ │ ১১ জুলাই  জমা      +৳১,২০০   বাকি ২১০০│  │
│ │ ১০ জুলাই  জমা      +৳৯০০    বাকি ২১০০│  │  ← shortfall added ▲
│ │           ঘাটতি     +৳৩০০🔴          │  │
│ │ ০৯ জুলাই  ছাড়      −৳৫০০            │  │
│ │ ০৮ জুলাই  পরিশোধ   −৳৪০০   বাকি ১৮০০│  │
│ └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```
Notes: The three-column summary maps exactly to `জমা/বাকি/ছাড়`. Running balance shown per row. Shortfall rows rendered RED with ▲; repayments/waivers green/neutral with −.

---

#### 3.5 Vehicle profile + P&L (5.2) [MVP]

```
┌────────────────────────────────────────────┐
│ ←   ঢাকা-থ-১১-২২৩৪         ✏️  ⋮            │
├────────────────────────────────────────────┤
│  🚗 CNG অটো-রিকশা      স্ট্যাটাস: 🟢 চলছে    │  ← run/op status chip
│  ড্রাইভার: করিম মিয়া                        │
│  ওডোমিটার: ৪২,১৫০ কিমি                      │
│                                            │
│  এই মাসের হিসাব (জুলাই)   [ মাস ▾ ]         │
│  ┌────────────────────────────────────┐    │
│  │ আয়      ৳ ৩৬,০০০            🟢     │    │
│  │ খরচ     ৳ ১১,৪০০            🔵     │    │
│  │ ─────────────────────────          │    │
│  │ লাভ     ৳ ২৪,৬০০  (সবুজ, বড়)      │    │  ← per-vehicle P&L
│  └────────────────────────────────────┘    │
│                                            │
│  খরচের ভাগ (খাত)                           │
│  ⛽ তেল ৳৬,০০০  🔧 মেরামত ৳৩,৪০০  🅿️ টোল … │
│                                            │
│  ┌───────┬───────┬───────┬───────┐         │
│  │ ⛽ফুয়েল│ 🔧সার্ভিস│ 📄ডকু.  │ 📍GPS  │         │  ← quick tiles to modules
│  └───────┴───────┴───────┴───────┘         │
│                                            │
│  ⚠ ফিটনেস মেয়াদ ২০ দিনে শেষ                │  ← doc expiry warn (amber)
└────────────────────────────────────────────┘
```
Notes: P&L is the hero. Expense breakdown by category = the `খাত` model. Module tiles (fuel/service/docs/GPS) route into P2/P3 features; locked ones show a small 🔒 and route to paywall.

---

#### 3.6 Add vehicle — free-tier gate (5.3 / 12.1) [MVP]

**State A — first (free) vehicle:**
```
┌────────────────────────────────────────────┐
│ ←   নতুন গাড়ি যোগ করুন                      │
├────────────────────────────────────────────┤
│  🎁 আপনার ১ম গাড়ি সারাজীবন ফ্রি!            │  ← free-forever banner (green)
│                                            │
│  গাড়ির ধরন                                 │
│  [🛺CNG][🚗কার][🏍️বাইক][🚌বাস][🚚ট্রাক]…    │  ← icon type picker
│                                            │
│  রেজিস্ট্রেশন নম্বর                          │
│  ┌────────────────────────────────────┐    │
│  │ ঢাকা মেট্রো-থ-__-____                │    │
│  └────────────────────────────────────┘    │
│  দৈনিক জমা লক্ষ্য (ঐচ্ছিক) ৳ [ ____ ]       │
│                                            │
│  ┌────────────────────────────────────┐    │
│  │        ✅  ফ্রি গাড়ি যোগ করুন         │    │
│  └────────────────────────────────────┘    │
└────────────────────────────────────────────┘
```

**State B — 2nd+ vehicle → paywall gate:**
```
┌────────────────────────────────────────────┐
│ ←   নতুন গাড়ি যোগ করুন                      │
├────────────────────────────────────────────┤
│           🔓  আরও গাড়ি যোগ করুন            │
│                                            │
│  ১টি গাড়ি সবসময় ফ্রি। ২য় গাড়ি থেকে        │  ← explains freemium
│  পেইড প্ল্যান — এখন টাকা লাগবে না,          │
│  মাস শেষে বিল (পোস্টপেইড, bKash)।           │
│                                            │
│  ┌────────────────────────────────────┐    │
│  │ 🏍️ বাইক/CNG/অটো/ই-বাইক              │    │
│  │    ৳ ৩৫০ / গাড়ি / মাস               │    │
│  ├────────────────────────────────────┤    │
│  │ 🚗 কার/বাস/ট্রাক/মাইক্রো             │    │
│  │    ৳ ৫০০ / গাড়ি / মাস               │    │
│  └────────────────────────────────────┘    │
│  ✓ কোনো অগ্রিম খরচ নেই                      │
│  ✓ মাস শেষে ৭ দিন সময়                       │
│                                            │
│  ┌────────────────────────────────────┐    │
│  │   ✅ রাজি — গাড়ি যোগ করুন            │    │  ← postpaid consent = add
│  └────────────────────────────────────┘    │
│  [ শুধু ১টি গাড়িতেই থাকি ]                   │  ← decline path
└────────────────────────────────────────────┘
```
Notes: No card upfront (postpaid). Consenting sets the new vehicle `isBillable=true` and creates/updates subscription; the org flips FREE→PAID at month-end billing. Decline returns to fleet with only the free vehicle writable.

---

#### 3.7 Digital receipt + share (6.1) [MVP]

```
┌────────────────────────────────────────────┐
│ ←   রসিদ                    ⬇️ সেভ  ⋮        │
├────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐   │
│ │        আমার অটো — জমা রসিদ            │   │
│ │  রসিদ নং: R-২০২৬-০০১৪২                │   │
│ │  তারিখ: ১১ জুলাই ২০২৬, ৯:১৫           │   │
│ │  ────────────────────────            │   │
│ │  ড্রাইভার:  করিম মিয়া                 │   │
│ │  গাড়ি:     ঢাকা-থ-১১-২২৩৪            │   │
│ │  ────────────────────────            │   │
│ │  জমা:       ৳ ১,২০০                  │   │
│ │  ছাড়:       ৳ ০                      │   │
│ │  আগের বাকি:  ৳ ৩০০                    │   │
│ │  বর্তমান বাকি: ৳ ৩০০  🔴              │   │
│ │  ────────────────────────            │   │
│ │  ✅ যাচাইকৃত · টাইমস্ট্যাম্পড          │   │
│ └──────────────────────────────────────┘   │
│                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 📩 SMS   │ │ 🟢 হোয়াটস│ │ 🔗 লিংক  │    │  ← share targets
│  └──────────┘ └──────────┘ └──────────┘    │
│  ┌────────────────────────────────────┐    │
│  │        📤  শেয়ার করুন                │    │
│  └────────────────────────────────────┘    │
└────────────────────────────────────────────┘
```
Notes: Receipt is a rendered card (exportable as PDF/image, `pdfUrl` + `shareLink`). SMS button sends the `shareLink` to the driver's phone via the SMS gateway (marks `smsReceiptSent`). Works offline: receipt renders locally; share link resolves after sync (shows "লিংক সিঙ্কের পর সচল হবে").

---

#### 3.8 Reports (7.1) [MVP]

```
┌────────────────────────────────────────────┐
│ ←   রিপোর্ট                  ● সিঙ্ক         │
├────────────────────────────────────────────┤
│  সময়:  [ এই মাস ▾ ]   গাড়ি: [ সব ▾ ]       │  ← period + vehicle filter
│                                            │
│  ┌────────────────────────────────────┐    │
│  │   মোট আয়    ৳ ১,৪২,০০০      🟢     │    │
│  │   মোট খরচ   ৳ ৪৮,৬০০        🔵     │    │
│  │   ─────────────────────            │    │
│  │   নিট লাভ   ৳ ৯৩,৪০০  (সবুজ, বড়)   │    │
│  └────────────────────────────────────┘    │
│                                            │
│   [আয়-খরচ] [খাতভিত্তিক] [ক্যালেন্ডার]       │  ← report type tabs
│                                            │
│   গাড়ি অনুযায়ী লাভ (P&L)                    │
│   🚗 ঢাকা-১১   ৳ ২৪,৬০০  ▓▓▓▓▓▓▓░░         │  ← per-vehicle bars
│   🚗 ঢাকা-৪২   ৳ ১৯,২০০  ▓▓▓▓▓░░░░         │
│   🚗 ঢাকা-৭    ৳ ১১,১০০  ▓▓▓░░░░░░         │
│                                            │
│  ┌────────────────────────────────────┐    │
│  │  📄 PDF   │   📊 Excel   │  রপ্তানি  │    │  ← one-tap monthly export
│  └────────────────────────────────────┘    │
├────────────────────────────────────────────┤
│ 🏠হোম  🧑‍✈️ড্রা.   (➕)   🚗গাড়ি  📊রিপোর্ট │
└────────────────────────────────────────────┘
```
Notes: MVP shows summary + per-vehicle P&L bars + export. Charts (analytics/calendar) unlock in P2 as extra tabs. Export queues if offline.

---

#### 3.9 OTP login (1.5) [MVP]

```
┌────────────────────────────────────────────┐
│ ←                                          │
│                                            │
│            📱  ভেরিফিকেশন কোড               │
│                                            │
│   ০১৭১২-৩৪৫৬৭৮ নম্বরে পাঠানো ৬-সংখ্যার      │  ← number echoed
│   কোডটি দিন                                 │
│                                            │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐            │
│   │৳ │ │  │ │  │ │  │ │  │ │  │            │  ← 6 OTP boxes, auto-advance
│   └──┘ └──┘ └──┘ └──┘ └──┘ └──┘            │
│         ⌛ SMS পড়া হচ্ছে…                   │  ← auto-read hint
│                                            │
│   কোড আসেনি?  পুনরায় পাঠান (০:৪৫)          │  ← resend timer
│   নম্বর ভুল?  পরিবর্তন করুন                  │
│                                            │
│   ┌────────────────────────────────────┐   │
│   │            ✅  নিশ্চিত করুন           │   │
│   └────────────────────────────────────┘   │
│                                            │
│   ┌─┐┌─┐┌─┐    বড় সংখ্যা কীপ্যাড          │
│   │১││২││৩│    (system keyboard = numeric) │
│   └─┘└─┘└─┘                                │
└────────────────────────────────────────────┘
```
Notes: SMS auto-read via Android SMS Retriever. Resend disabled until timer 0. Rate-limit/attempt errors surface as Bengali toast (see §4). Same screen reused for forgot-PIN re-verify.

---

#### 3.10 Upgrade / paywall + postpaid bill (12.1 / 12.3) [MVP gate / P2 pay]

```
┌────────────────────────────────────────────┐
│ ←   বিল ও প্ল্যান             ● সিঙ্ক         │
├────────────────────────────────────────────┤
│  বর্তমান প্ল্যান:  পোস্টপেইড (পেইড)          │
│  বিলযোগ্য গাড়ি: ৩টি                          │
│                                            │
│  ┌────────────────────────────────────┐    │
│  │  জুলাই ২০২৬ বিল                     │    │
│  │  🏍️ ২ × ৳৩৫০ = ৳৭০০                 │    │
│  │  🚗 ১ × ৳৫০০ = ৳৫০০                 │    │
│  │  ─────────────────────             │    │
│  │  মোট বিল:  ৳ ১,২০০                  │    │
│  │  পরিশোধের শেষ দিন: ৭ আগস্ট (৭ দিন)   │    │  ← 7-day window
│  │  অবস্থা: 🟠 বকেয়া                    │    │
│  └────────────────────────────────────┘    │
│                                            │
│  ┌────────────────────────────────────┐    │
│  │      🔴 bKash দিয়ে পরিশোধ করুন       │    │  ← bKash pay
│  └────────────────────────────────────┘    │
│                                            │
│  ⚠ বিল বকেয়া থাকলে অতিরিক্ত গাড়ির ফিচার     │  ← soft-lock warning
│    সাময়িক লক হবে (তথ্য মুছবে না)।           │
│                                            │
│  বিল ইতিহাস  ▸                             │
└────────────────────────────────────────────┘
```

**Soft-lock interstitial (HTTP 402 on a paid write):**
```
┌────────────────────────────────────────────┐
│              🔒  ফিচার সাময়িক লক            │
│                                            │
│  বিল বকেয়া থাকায় অতিরিক্ত গাড়ির লেখা         │
│  বন্ধ আছে। আপনার সব তথ্য নিরাপদ — কিছুই      │
│  মুছবে না। ১ম (ফ্রি) গাড়ি চালু আছে।         │
│                                            │
│   [ 🔴 bKash-এ বিল দিন ]                    │
│   [ পরে করব ]                               │
└────────────────────────────────────────────┘
```
Notes: Read access + free-vehicle writes always remain. Only paid-feature writes trigger the 402 interstitial. On bKash webhook clear, lock lifts silently and a success toast fires.

---

### 4. KEY INTERACTIONS

#### 4.1 One-tap keypad collection (the flagship interaction)
1. From Dashboard "জমা দিন" quick-action OR + → জমা → pick driver.
2. Keypad opens with driver, target, prior dues preloaded.
3. Tap **"লক্ষ্য পূরণ"** chip → amount = daily target instantly, or type amount.
4. `ঘাটতি` recomputes live per keystroke; turns RED when a due will be created.
5. Optional **ছাড় (waiver)** via a small "ছাড় দিন" link → mini keypad.
6. **✅ জমা নিশ্চিত করুন** → haptic + green success flash → receipt CTA.
7. If a shortfall exists, a `DriverDue` auto-posts; the driver's list badge updates immediately (optimistic, offline-safe).

Target: an experienced owner logs a collection in **≤ 3 taps** (driver, লক্ষ্য পূরণ, নিশ্চিত).

#### 4.2 Offline indicator + sync state (always visible)
Header sync chip states:
| State | Chip | Color | Behavior |
|---|---|---|---|
| Online, all synced | `● সিঙ্ক` | Green | Passive |
| Queued writes | `⟳ ৩ অপেক্ষায়` | Amber | Tappable → Sync queue (15.8) |
| Offline | `⚠ অফলাইন` | Amber/grey | Banner: "অফলাইন — এন্ট্রি সেভ হচ্ছে, নেট এলে সিঙ্ক হবে" |
| Sync error/conflict | `⚠ সমস্যা ১` | Red | Tappable → conflict resolver |

- Every locally-created record shows a small `⟳` badge until confirmed by server, then it disappears.
- On reconnect: silent background sync; a subtle toast "✅ ৩টি এন্ট্রি সিঙ্ক হয়েছে".
- Conflict policy surfaced in Bengali: server-wins on ledger balances, user is shown "সার্ভারের হিসাব রাখা হয়েছে" with a view-diff link.

#### 4.3 Dues-in-red (consistent visual grammar)
- RED (`#D32F2F`) is reserved **only** for outstanding dues/loss: driver dues pill, `বাকি` column, negative P&L, overdue bill, shortfall ledger rows.
- Zero/cleared dues → GREEN pill "পরিশোধিত". Never show ৳0 in red.
- Total-dues bar on Dashboard is the app's single loudest red element to drive collection behavior.
- Icon pairing (🔴/🟢) accompanies color for colorblind + low-literacy redundancy.

#### 4.4 Empty states (icon + one action, never a blank screen)
| Screen | Illustration + copy | CTA |
|---|---|---|
| Drivers (none) | 🧑‍✈️ "এখনো কোনো ড্রাইভার নেই" | ➕ প্রথম ড্রাইভার যোগ করুন |
| Vehicles (none) | 🚗 "আপনার ১ম গাড়ি ফ্রি!" | ➕ ফ্রি গাড়ি যোগ করুন |
| Collections today | 💰 "আজ এখনো জমা নেওয়া হয়নি" | জমা নিন |
| Reports (no data) | 📊 "হিসাব শুরু করলে রিপোর্ট দেখা যাবে" | জমা নিন |
| Receipts | 🧾 "কোনো রসিদ নেই" | — |
| GPS (no device) | 📍 "GPS ট্র্যাকার নেই" | ট্র্যাকার অর্ডার করুন (P3) |

#### 4.5 Error / toast copy (Bengali, plain, actionable)
| Situation | Toast / message |
|---|---|
| OTP wrong | ❌ কোড মিলেনি, আবার দিন |
| OTP rate-limited | ⏳ অনেকবার চেষ্টা হয়েছে, ২ মিনিট পরে আবার চেষ্টা করুন |
| No network on submit | 📴 নেট নেই — এন্ট্রি সেভ হলো, পরে সিঙ্ক হবে |
| Amount empty | পরিমাণ লিখুন |
| Amount = 0 confirm | ৳০ জমা? নিশ্চিত করুন / বাতিল |
| Collection saved | ✅ জমা সেভ হয়েছে |
| Due created | ⚠ ৳৩০০ বাকি যোগ হলো |
| Paid write blocked (402) | 🔒 বিল বকেয়া — ফিচার সাময়িক লক (তথ্য নিরাপদ) |
| bKash success | ✅ বিল পরিশোধ হয়েছে, ধন্যবাদ |
| Sync done | ✅ সব এন্ট্রি সিঙ্ক হয়েছে |
| Duplicate reg no | এই রেজিস্ট্রেশন নম্বর আগে থেকেই আছে |
| Sync conflict | ⚠ সার্ভারের হিসাব রাখা হয়েছে · দেখুন |
| Generic fail | কিছু সমস্যা হয়েছে, আবার চেষ্টা করুন |

Toast rules: 1 line, verb-first, ≤ 6 words where possible; success = green with ✅, warning = amber ⚠, error = red ❌. Destructive actions use a confirm sheet, never a silent toast.

#### 4.6 Confirmations / undo
- Collection save shows a 4-second "বাতিল করুন (undo)" snackbar before committing to sync queue (guards fat-finger amounts).
- Delete/void requires typed/tap confirm sheet; ledger entries are voided (audit-flagged), never hard-deleted (matches "never delete data").

---

### 5. LOW-LITERACY & ACCESSIBILITY CHOICES

#### 5.1 Icon + color coding system (learnable vocabulary)
A fixed, repeated icon set so meaning is learned once:
| Concept | Icon | Color |
|---|---|---|
| জমা / income | 💰 / ➕ | Green |
| খরচ / expense | 🧾 / 🔧 ⛽ | Blue/neutral |
| বাকি / due / loss | 🔴 | Red |
| পরিশোধিত / clear | 🟢 | Green |
| লাভ / profit | 📈 | Green |
| গাড়ি | 🚗 🛺 🚌 🚚 🏍️ | by type |
| ড্রাইভার | 🧑‍✈️ | — |
| রসিদ | 🧾 | — |
| সিঙ্ক / offline | ● ⟳ ⚠ | green/amber |
| লক / paywall | 🔒 | grey |

Expense categories are chosen from an **icon grid** (⛽তেল 🔧মেরামত 🅿️টোল 🛞টায়ার 🛢️মবিল 🏠গ্যারেজ ⚡বিদ্যুৎ 🧍ড্রাইভার বাটা …) — no typing needed.

#### 5.2 Large tap targets & density
- Keypad keys 88dp; primary buttons 72dp full-width; list rows ≥ 56dp.
- Max 5–6 interactive elements per viewport on core flows.
- Responsive down to small/cheap Android phones (360dp width) — 2-column tile grids collapse to 1 gracefully; text never truncates critical numbers (amounts get priority space).

#### 5.3 Minimal typing
- Amounts: numeric keypad only (Bengali digits default).
- Names: picker/search from existing entities; only KYC creation needs typing (with big fields, phone = numeric).
- Quick chips (`+৫০০`, `লক্ষ্য পূরণ`) remove most number entry.
- Dates via calendar picker, not typed.

#### 5.4 Voice-entry hook (P3, designed-in now)
- 🎙️ button in Quick-Add and in expense/income keypad screens.
- Flow: press-and-hold mic → Bengali speech "পাঁচশো টাকা তেল খরচ" → parsed into amount + category + optional vehicle → shows a **confirmation card** (never auto-commits) → user taps ✅.
- Falls back gracefully: if parse confidence low, prefill what it caught and let user finish on keypad.
- Mic permission is optional and gated only to this feature (per PRD device-permission model).

#### 5.5 Redundant signaling & robustness
- Every color carries an icon partner (colorblind-safe).
- Haptics: confirm on save, error buzz on failed submit.
- Numerals toggle (Bengali ↔ Latin) in settings for mixed-literacy staff.
- Bengali TalkBack labels on all icons; screen-reader pass required for the 10 wireframed screens before MVP ship.
- Font scaling to 200% without layout break on core flows.
- All destructive/financial actions are reversible or confirmable (undo snackbar, void-not-delete).

---

### 6. Build Notes (Expo / RN specifics)

- **Nav:** React Navigation — `NativeStackNavigator` per tab, `BottomTabNavigator` root, `Modal` group for Quick-Add/paywall/receipt.
- **Offline core:** WatermelonDB or SQLite + a mutation queue; optimistic writes with `⟳` pending flag; background sync on `NetInfo` reconnect. Collections/dues/expenses are the MVP offline-critical entities.
- **Auth:** phone+OTP → JWT access (15m) + rotating refresh per `device_id`; PIN/biometric unlock re-mints tokens locally. Store refresh in SecureStore, PIN as local check only.
- **Soft-lock:** intercept `402 SUBSCRIPTION_REQUIRED` in the API layer → route to soft-lock interstitial; never block reads/free-vehicle writes.
- **i18n:** `i18next`, Bengali default bundle is source-of-truth (not a translation of English). Bengali numeral formatter utility, toggle-driven.
- **Receipts:** server renders `pdfUrl`/`shareLink`; client renders a local card for instant/offline display, hydrates share link post-sync.
- **Numbers:** all money as Decimal strings from API; format with a single currency util (৳ prefix, thousands grouping, Bengali digits).
- **Theming:** semantic color tokens (`money.in`=green, `money.due`=red, `warn`=amber) so the dues-in-red grammar is enforced centrally.

---

#### Phase rollup
- **MVP (Phase 1):** Flows 1,2,3(core),4,5,6,7(summary+export),15(settings/sync). Screens marked [MVP] above — this is a fully usable daily-collection + dues + per-vehicle P&L + receipt product with the free-tier gate and postpaid consent.
- **P2:** notifications, ledger/balance-sheet, fuel/maintenance, rental/booking, QR, analytics/budget, staff permissions, bKash pay + soft-lock enforcement, multi-device.
- **P3:** GPS live map + hardware order, charging/loans/party ledger, inventory, marketplace, voice entry, accident records, cloud backup, achievements.

---

### Part III — Web Dashboard + Platform Admin Panel UI

## আমার অটো (Amar Auto) — Web Dashboard + Platform Admin Panel · UI/UX Design Spec

**Stack:** React + TS + Vite · TanStack Query · Tailwind + shadcn/ui · React Hook Form + Zod · ECharts/Recharts · i18n (bn default, native)
**Source of truth:** `docs/01-PRD-full-build-spec.md` (§2 features, §3 roles, §4 data model, §5 API) + `docs/02-feature-inventory.md`
**Phase legend:** `[MVP]` Phase 1 · `[P2]` Phase 2 · `[P3]` Phase 3

---

### 0. Design Foundations (apply to every screen)

**0.1 Bengali-first, low-literacy principles**
- Bengali (বাংলা) is the default and native language — never a translation overlay. English is the *toggle*, not the base. Every label below leads with Bengali; English gloss is for the developer only.
- **Icon + label always paired.** Never icon-only for primary actions (low-literacy users). Use large, universally-legible glyphs (money bag, car, driver head, fuel pump, wrench).
- **Numbers are king.** Big money figures, minimal prose. A driver's due is a large red ৳ number, not a sentence.
- **Color carries meaning consistently:** RED = dues/overdue/loss/danger, GREEN = paid/collected/profit/live, AMBER = pending/due-soon/partial, BLUE/NEUTRAL = informational.
- **Fonts:** bundle Noto Sans Bengali / Hind Siliguri / SolaimanLipi (never trust device fonts; verify conjunct shaping on low-end Android-in-browser). Tabular-nums for all money columns.
- **Density:** comfortable default; a compact toggle for power users on wide screens. Fully responsive down to a 360px phone-web (owner may open dashboard on the same phone the app runs on).

**0.2 shadcn/ui primitive map** (what to build each pattern from)
| UI need | shadcn primitive |
|---|---|
| Nav / layout | `sidebar`, `sheet` (mobile drawer), `breadcrumb`, `tabs` |
| Tables | `table` + TanStack Table headless + `pagination`, `dropdown-menu`, `checkbox` |
| Forms | `form` (RHF+Zod), `input`, `select`, `combobox`, `calendar`+`popover` (date), `radio-group`, `switch`, `textarea` |
| Money entry | custom **NumericKeypad** (big-tap) + `input` with `inputMode="decimal"` |
| Feedback | `toast` (sonner), `alert`, `dialog`, `alert-dialog` (destructive confirm), `skeleton`, `progress` |
| Data display | `card`, `badge`, `avatar`, `hover-card`, `tooltip`, `accordion` |
| Charts | ECharts (Bengali axis labels, large GPS series) primary; Recharts for simple cards |

**0.3 Money formatting rule (non-negotiable)**
- API sends money as **string decimal** (`"1500.00"`, BDT). Never parse to JS float for math — keep as string / use a Decimal lib; format only for display.
- Display helper `formatBDT(value, {lang})` → `৳ ১,৫০০` (Bengali digits + Bengali thousands grouping when lang=bn) / `৳ 1,500` (en). Symbol `৳` always leads. Tabular-nums, right-aligned in tables.
- Negative / due amounts render red with parentheses or a `−` prefix: `−৳ ৫০০` (red).

**0.4 Global route map**
```
/login  /verify-otp  /pin  /signup            (unauth: OTP/PIN/password)
/app                                            (Owner console — Part A)
  /                    ড্যাশবোর্ড  overview
  /vehicles  /vehicles/:id
  /drivers   /drivers/:id
  /collections
  /ledger              income/expense + money history
  /reports/*           pnl, balance-sheet, trial-balance, analytics, calendar, budget
  /fuel  /maintenance  /documents
  /inventory  /suppliers  /purchases  /sales
  /rentals             bookings calendar
  /customers  /customers/:id (party ledger)
  /loans  /charging
  /gps                 live fleet map
  /qr                  QR dashboard + messages
  /staff               users, roles, permission matrix
  /billing             subscription, invoices, usage
  /notifications
  /support
  /marketplace         my listings
  /settings
/admin                                          (Platform super-admin — Part B, role-gated)
  /  tenants  moderation  users  billing-ops  sms-ops  gps-inventory  metrics
```

---

## PART A — OWNER WEB DASHBOARD (Management Console)

### A1. Global Layout

Persistent **three-zone shell**: left Sidebar · top Topbar · main Content. On mobile the sidebar collapses into a `sheet` drawer triggered by a hamburger; a bottom-tab bar surfaces the 4 MVP essentials (ড্যাশবোর্ড / জমা / গাড়ি / ড্রাইভার).

#### Topbar (sticky, h-14)
Left→right:
1. **Hamburger** (mobile) / sidebar collapse toggle.
2. **Org switcher / name** — `প্রতিষ্ঠান: রহিম CNG` with `businessMode` preset badge (e.g. `CNG/অটো`). Dropdown to `/settings` if multi-mode enabled.
3. **Plan + soft-lock badge** — the load-bearing status chip:
   - `ফ্রি` (green outline) — FREE tier, 1 vehicle.
   - `পেইড` (green solid) — active paid subscription.
   - `বকেয়া · ৳X` (amber) — invoice pending, in 7-day window.
   - `🔒 লক · বিল দিন` (red, pulsing) — **soft-locked**; clicking deep-links to `/billing/invoices/:id/pay`. This badge is globally visible because soft-lock (HTTP 402) blocks paid-feature writes anywhere.
4. **Global search** (`⌘K` command palette) — jump to vehicle/driver/customer by name/reg-no.
5. **Quick-add `+`** — dropdown: জমা এন্ট্রি / খরচ / আয় / গাড়ি / ড্রাইভার (fast-path to the money-making actions).
6. **Notifications bell** — unread count badge; opens `/notifications` popover (dues, doc-expiry, service-due, bill).
7. **Language toggle** — `বাং | EN` segmented control; persists to `profile.lang` + `Accept-Language`.
8. **Offline/sync indicator** — cloud icon: green (synced) / amber spinner (syncing N queued) / grey (offline, entries queue locally). Tooltip: `৩টি এন্ট্রি সিঙ্ক হচ্ছে`.
9. **User avatar** — menu: প্রোফাইল, ডিভাইস (logged-in devices / remote logout), ব্যাকআপ, লগআউট.

#### Sidebar (grouped, icon+label, collapsible to icon-rail)
Groups mirror the module taxonomy; items hidden/greyed by scope and by `verticals_enabled[]` (a CNG owner doesn't see Charging; a charging garage doesn't see Rentals). Locked paid items show a small 🔒.

```
হিসাব (Accounts)
  🏠 ড্যাশবোর্ড            /            [MVP]
  💵 জমা / কালেকশন        /collections [MVP]
  📒 খতিয়ান / আয়-খরচ     /ledger      [MVP]
বহর (Fleet)
  🚗 গাড়ি                 /vehicles    [MVP]
  🧑‍✈️ ড্রাইভার            /drivers     [MVP]
  📅 ভাড়া / বুকিং         /rentals     [P2]
  ⛽ ফুয়েল               /fuel        [P2]
  🔧 মেইনটেন্যান্স         /maintenance [P2]
  📄 কাগজপত্র (ডকুমেন্ট)   /documents   [P2]
  🗺️ লাইভ GPS            /gps         [P3] 🔒(hw)
  🔳 গাড়ি QR              /qr          [P2]
পার্টি ও স্টক (Parties/Stock)
  👥 গ্রাহক / পার্টি        /customers   [P2]
  📦 ইনভেন্টরি / পার্টস    /inventory   [P3]
  🏭 সরবরাহকারী           /suppliers   [P3]
  🔋 চার্জিং              /charging    [P3]
  🤝 ঋণ ও কিস্তি          /loans       [P3]
রিপোর্ট (Reports)
  📊 রিপোর্ট ও বিশ্লেষণ    /reports     [MVP core, P2 depth]
প্রশাসন (Admin)
  👤 স্টাফ ও পারমিশন       /staff       [P2]
  💳 বিলিং ও সাবস্ক্রিপশন   /billing     [MVP gate, P2 charge]
  🛒 মার্কেটপ্লেস          /marketplace [P3]
  🔔 নোটিফিকেশন           /notifications [P2]
  🎧 সাপোর্ট              /support     [P2]
  ⚙️ সেটিংস               /settings    [MVP]
```
Sidebar footer: mini plan meter (`১ / ৩ গাড়ি বিলেবল`) + `আপগ্রেড` CTA when approaching the free gate.

---

### A2. Full Page Inventory

Each row: route · Bengali title · purpose · **key components** · primary API · phase.

#### Accounts & Collections
| Route | Title | Purpose / key components | API | Phase |
|---|---|---|---|---|
| `/` | ড্যাশবোর্ড | Today's KPI tiles (collection/expense/profit/active+running vehicles), driver-dues total, unread-QR, overdue-docs, alerts feed, quick-entry launcher, 7-day trend chart | `GET /org/dashboard`, `/reports/analytics` | MVP |
| `/collections` | জমা / কালেকশন | Driver picker → NumericKeypad amount entry; live shortfall + running-due; receipt preview (PDF/image/share); collections ledger table (filter by driver/vehicle/date, backdated flag); resend-SMS | `POST /collections`, `GET /collections`, `/collections/:id/receipt`, `/send-sms` | MVP |
| `/ledger` | খতিয়ান / আয়-খরচ | Money history (double-entry) table; add income/expense drawer with category (khat) picker; voice-entry mic button; backdated toggle (audit-flagged); debit/credit pair on row-expand | `GET /transactions`, `POST /transactions/expense|income|voice`, `/categories` | MVP |

#### Fleet
| Route | Title | Purpose / key components | API | Phase |
|---|---|---|---|---|
| `/vehicles` | গাড়ি | Fleet table (reg-no, type icon, driver, status chips খালি/ভাড়ায়/বুকড + চলছে/থামানো, P&L, docs status) + calendar/board toggle; add-vehicle wizard | `GET /vehicles`, `POST /vehicles` | MVP (list) / P2 (calendar board) |
| `/vehicles/:id` | গাড়ির প্রোফাইল | Tabbed: সারাংশ (P&L card, odometer, driver), হিসাব, ফুয়েল, সার্ভিস, কাগজপত্র, দুর্ঘটনা, GPS, QR | `GET /vehicles/:id`, `/pnl`, `/history`, `/documents` | MVP (core tabs) |
| `/drivers` | ড্রাইভার | Driver table with **dues in RED**, target, collection-rate; add + KYC | `GET /drivers`, `POST /drivers` | MVP |
| `/drivers/:id` | ড্রাইভার প্রোফাইল | KYC panel (NID, photo, profession), দায়/বাকি ledger (জমা/বাকি/ছাড় columns + running balance), assignment history, send-SMS reminder | `GET /drivers/:id/ledger`, `/kyc`, `/assignments` | MVP |
| `/rentals` | ভাড়া / বুকিং | Availability calendar (double-book prevented), booking drawer, one-tap START(রিলিজ)/END(এন্ড) hourly billing, per-vehicle rental profit | `GET/POST /bookings`, `POST /trips/start`, `/trips/:id/end` | P2 |
| `/fuel` | ফুয়েল | Fill-up log per vehicle (volume/price/odometer/method), auto KPL & cost/km, analytics (avg fill, city/highway split, price trend chart) | `GET/POST /vehicles/:id/fuel`, `/fuel/analytics` | P2 |
| `/maintenance` | মেইনটেন্যান্স | Reminder dashboard (due-soon / overdue), service-record log, total/YTD/avg cost cards | `GET /maintenance/dashboard`, `POST /vehicles/:id/services` | P2 |
| `/documents` | কাগজপত্র | Fleet-wide doc-expiry board (Route Permit/Fitness/Insurance/Tax Token/Registration) with days-left + traffic-light status; set/renew; reminder lead-time | `GET /document-alerts`, `PUT /vehicles/:id/documents/:type` | P2 |
| `/gps` | লাইভ GPS | Fleet map (~10s refresh, 100+ vehicles clustered), vehicle list side-panel, route playback, geofences, alerts feed, remote engine lock/unlock (fresh-auth PIN), order-hardware flow | `GET /gps/live`, `/history`, `/geofences`, `/alerts`, `POST /immobilizer` | P3 |
| `/qr` | গাড়ি QR | Smart QR dashboard (total scans, unread by type), passenger-message inbox (verification/complaint/lost-item/accident, anon relay reply), custom QR text, bulk QR print PDF | `GET /qr/dashboard`, `/qr/messages`, `POST /qr/print` | P2 |

#### Parties, Stock, Loans
| Route | Title | Purpose / key components | API | Phase |
|---|---|---|---|---|
| `/customers` | গ্রাহক / পার্টি | CRM table (dues/advance/receivable), profile + party-ledger (পাওনা/দেনা/অগ্রিম/পরিশোধ running balance) | `GET /customers`, `/:id/party-ledger` | P2 |
| `/inventory` | ইনভেন্টরি / পার্টস | Parts stock table (reorder flag), part detail + stock-movement history, count/write-off, reorder & dead-stock reports | `GET/POST /parts`, `/stock-movements`, `/parts/reorder` | P3 |
| `/suppliers` | সরবরাহকারী | Supplier ledger (outstanding), pay-due, purchase invoices | `GET /suppliers`, `/:id/payments`, `POST /purchases` | P3 |
| `/purchases` `/sales` | ক্রয় / বিক্রয় | Multi-item invoice builder (discount, credit), printable/share receipt, returns | `POST /purchases`, `/sales`, `/returns` | P3 |
| `/loans` | ঋণ ও কিস্তি | Loans given/taken/HP, installment schedule, record payment, remaining-balance | `GET/POST /loans`, `/:id/payments` | P3 |
| `/charging` | চার্জিং | Daily charge sessions per customer, dues auto-calc (`prev + rate − paid`), flexible-rate (no-due) customers, monthly bill | `GET/POST /charging/sessions`, `/customers/:id/bill` | P3 |

#### Reports
| Route | Title | Purpose / key components | API | Phase |
|---|---|---|---|---|
| `/reports` | রিপোর্ট ও বিশ্লেষণ | Tabbed hub: আয়-খরচ, লাভ-ক্ষতি (P&L overall/per-vehicle), ব্যালেন্স শীট, ট্রায়াল ব্যালেন্স, ড্রাইভার বাকি (aging), ক্যালেন্ডার, খাতভিত্তিক, বাজেট. Charts (ECharts) + **PDF / Excel export** buttons (async job → poll → download) | `GET /reports/*`, `POST /reports/export`, `GET /exports/:job` | MVP (money-history, per-vehicle P&L, PDF/Excel) / P2 (balance sheet, trial balance, analytics, budget) |

#### Platform / Admin (owner-side)
| Route | Title | Purpose / key components | API | Phase |
|---|---|---|---|---|
| `/staff` | স্টাফ ও পারমিশন | Staff table (Manager/Accountant), invite via phone+OTP, **role→permission matrix** editor | `GET/POST /users`, `/roles`, `/permissions` | P2 |
| `/billing` | বিলিং ও সাবস্ক্রিপশন | Current subscription + soft-lock state, plan catalog (freemium + GPS tiers/terms), usage meter (projected total), postpaid invoice list, **bKash pay** flow, free-gate meter | `GET /billing/subscription`, `/plans`, `/usage`, `/invoices`, `POST /invoices/:id/pay` | MVP (gate/plan view) / P2 (charge + pay) |
| `/marketplace` | মার্কেটপ্লেস | Post ad (photos + map + price), my-listings with approval status (pending/approved/rejected), browse verified feed | `GET /marketplace/listings`, `POST /listings`, `/my-listings` | P3 |
| `/notifications` | নোটিফিকেশন | In-app feed (dues/doc-expiry/service/bill/alert), mark-read/all, push-token reg | `GET /notifications`, `/read-all` | P2 |
| `/support` | সাপোর্ট | Ticket/chat list, open ticket, contact form (Name*, Mobile, Message*), support hours/phone | `GET/POST /support/tickets`, `/contact` | P2 |
| `/settings` | সেটিংস | Org (name, business-mode/preset toggles, bkash number, address, currency, lang), profile, PIN/password, devices, categories (khat) manager, cloud backup/export | `PATCH /org`, `/profile`, `/auth/set-pin`, `/org/backup/export` | MVP |

---

### A3. ASCII Wireframes — 8 Key Owner Pages

> Notation: `[ ]` button · `▸` dropdown · `◔` chart · `▓` filled/active · red text noted as `(!)`, green as `(✓)`.

#### WF-1 · ড্যাশবোর্ড (Dashboard / Overview) `[MVP]`
```
┌────────────────────────────────────────────────────────────────────────────┐
│ ☰  রহিম CNG  [CNG/অটো]        🔍⌘K       [ ফ্রি ✓ ]  [+]  🔔³  বাং|EN  ☁✓  (RA)│
├──────────┬─────────────────────────────────────────────────────────────────┤
│ হিসাব     │  আজ, ১১ জুলাই ২০২৬                        [ আজ ▾ ]  [+ দ্রুত এন্ট্রি]│
│ 🏠ড্যাশ▓  │ ┌──────────┐┌──────────┐┌──────────┐┌──────────┐               │
│ 💵জমা     │ │আজ জমা     ││আজ খরচ     ││আজ লাভ     ││সচল গাড়ি   │               │
│ 📒খতিয়ান  │ │৳ ১২,৪৫০(✓)││৳ ৩,২০০   ││৳ ৯,২৫০(✓)││ ৪ / ৫ চলছে │               │
│ বহর       │ └──────────┘└──────────┘└──────────┘└──────────┘               │
│ 🚗গাড়ি    │ ┌─────────────────────────┐ ┌─────────────────────────────────┐ │
│ 🧑‍✈️ড্রাইভার│ │ মোট বাকি (ড্রাইভার)       │ │ ⚠️ সতর্কতা / রিমাইন্ডার           │ │
│ 📅ভাড়া🔒  │ │  ৳ ৮,৭০০  (!)  ৩ জন       │ │ • করিমের ফিটনেস ৫ দিনে শেষ (!)   │ │
│ ⛽ফুয়েল🔒 │ │  [ বাকি দেখুন ▸ ]         │ │ • অটো-৩ সার্ভিস ডিউ (২০০km পার)  │ │
│ 🔧সার্ভিস🔒│ └─────────────────────────┘ │ • QR: ২টি নতুন অভিযোগ            │ │
│ রিপোর্ট    │ ┌───────────────────────────────────────────────────────────┐ │ │
│ 📊রিপোর্ট  │ │ ◔ গত ৭ দিন: আয় vs খরচ vs লাভ (ECharts, বাংলা লেবেল)        │ │ │
│ প্রশাসন    │ │      ▁▃▅▇▆▅▇   আয়   ▁▂▃▂▃▂▃  খরচ                          │ │ │
│ 👤স্টাফ    │ └───────────────────────────────────────────────────────────┘ │ │
│ 💳বিলিং    │ ┌── সাম্প্রতিক জমা ─────────────────────────────┐  [সব দেখুন ▸] │ │
│ ⚙️সেটিংস   │ │ ৩:১২pm করিম·অটো-১  ৳৮০০ (✓)  বাকি ৳০           │              │ │
│ ─────────│ │ ২:০৫pm রফিক·অটো-৩  ৳৬৫০ (!)  বাকি ৳১৫০          │              │ │
│ ১/৩ বিলেবল│ └──────────────────────────────────────────────┘              │ │
│ [আপগ্রেড] │                                                                 │
└──────────┴─────────────────────────────────────────────────────────────────┘
```

#### WF-2 · গাড়ি তালিকা (Vehicle List) `[MVP]` + Profile `[MVP]`
```
LIST ─────────────────────────────────────────────────────────────────────────
│ গাড়ি (৫)          [তালিকা▓|বোর্ড📅]   🔍খুঁজুন   টাইপ▾ স্ট্যাটাস▾   [+ গাড়ি যোগ] │
├──────────────────────────────────────────────────────────────────────────────┤
│ ☐ রেজি নং    টাইপ   ড্রাইভার    অবস্থা         লাভ/ক্ষতি(মাস)  কাগজ    অ্যাকশন │
│ ☐ DHK-11-2233 🛺CNG করিম       ভাড়ায়·চলছে    ৳+১৮,২০০(✓)    ✓সব      ⋮      │
│ ☐ DHK-11-9080 🛺CNG রফিক       খালি·থামানো    ৳+১২,৪০০(✓)    ⚠️ফিটনেস ⋮      │
│ ☐ DHK-14-5521 🚗Car (নেই)      বুকড          ৳−১,৫০০ (!)    ✓সব      ⋮      │
│ ☐ ...                                                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│ ‹ পূর্ব   পৃষ্ঠা ১ / ২   পরবর্তী ›            প্রতি পৃষ্ঠা ২৫▾    মোট ৫         │
──────────────────────────────────────────────────────────────────────────────

PROFILE · DHK-11-2233 ────────────────────────────────────────────────────────
│ ‹ গাড়ি / DHK-11-2233  🛺CNG      অডোমিটার ৪৫,২১০ km   ড্রাইভার: করিম [বদল]   │
│ [সারাংশ▓][হিসাব][ফুয়েল][সার্ভিস][কাগজপত্র][দুর্ঘটনা][GPS][QR]                  │
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌ এই মাসের লাভ-ক্ষতি ─────────┐  ┌ খরচ ভাঙন (খাত) ──────────────────────────┐ │
│ │ আয়    ৳ ২৮,০০০               │  │ ⛽তেল ৳৫,২০০ ▇▇▇▇  🔧মেরামত ৳২,৮০০ ▇▇      │ │
│ │ খরচ    ৳ ৯,৮০০                │  │ 🛞টায়ার ৳১,২০০ ▇   টোল ৳৬০০ ▏             │ │
│ │ নিট    ৳ +১৮,২০০ (✓)          │  └──────────────────────────────────────────┘ │
│ └────────────────────────────┘                                                │
│ ┌ ইতিহাস (মেরামত+সার্ভিস+দুর্ঘটনা) ───────────────────────────┐ [PDF রপ্তানি]  │
│ │ ০৮ জুলাই সার্ভিস · ইঞ্জিন অয়েল · ৳১,২০০ · অডো ৪৪,৯০০         │               │
│ │ ০১ জুলাই ফুয়েল · ১২L @৳১১২ · ৳১,৩৪৪ · KPL ২৮.৪              │               │
│ └─────────────────────────────────────────────────────────────┘               │
──────────────────────────────────────────────────────────────────────────────
```

#### WF-3 · ড্রাইভার বাকি (Driver Dues) `[MVP]`
```
│ ড্রাইভার (৮)     🔍নাম   ফিল্টার: [শুধু বাকি▓] গাড়ি▾    [+ ড্রাইভার]  [SMS পাঠান]│
├──────────────────────────────────────────────────────────────────────────────┤
│ ছবি  নাম      গাড়ি      দৈনিক টার্গেট  মোট জমা    বাকি          আদায় হার  ⋮   │
│ (RK) রফিক     অটো-৩     ৳ ৮০০          ৳ ১৮,২০০   ৳ ৩,৪৫০ (!)   ৭৮%       ⋮   │
│ (KM) করিম     অটো-১     ৳ ৮০০          ৳ ২২,০০০   ৳ ০    (✓)    ১০০%      ⋮   │
│ (SB) সবুজ     Car       ৳ ১,৫০০        ৳ ৯,০০০    ৳ ৫,২৫০ (!)   ৬২%(!)    ⋮   │
├──────────────────────────────────────────────────────────────────────────────┤
│ নিচে: মোট বকেয়া ৳ ৮,৭০০ (!)   ৩ জনের বাকি আছে      [সবাইকে রিমাইন্ডার SMS 📩] │
──────────────────────────────────────────────────────────────────────────────
DRAWER · রফিক এর দায়/বাকি খতিয়ান ─────────────────────────────────────────────
│ তারিখ      জমা(জমা)   বাকি(due)   ছাড়(discount)   চলতি ব্যালেন্স              │
│ ১১ জুলাই   ৳ ৬৫০       ৳ ১৫০ (!)   ৳ ০            ৳ ৩,৪৫০ (!)                 │
│ ১০ জুলাই   ৳ ৮০০       ৳ ০         ৳ ০            ৳ ৩,৩০০ (!)                 │
│ ০৯ জুলাই   ৳ ৫০০       ৳ ৩০০ (!)   ৳ ৫০          ৳ ৩,৩০০ (!)                 │
│                                    [ রিমাইন্ডার SMS ] [ ছাড় দিন ] [ আদায় নিন ]│
──────────────────────────────────────────────────────────────────────────────
```

#### WF-4 · জমা / কালেকশন লেজার (Collections Entry + Ledger) `[MVP]`
```
┌ নতুন জমা এন্ট্রি ──────────────────────────┐ ┌ রসিদ প্রিভিউ ─────────────────┐
│ ড্রাইভার:  [ করিম · অটো-১        ▾ ]        │ │  আমার অটো — জমা রসিদ           │
│ তারিখ:     [ ১১ জুলাই ২০২৬  📅 ]           │ │  রসিদ# CLN-00412              │
│  (পিছনের তারিখ হলে ⚑অডিট-ফ্ল্যাগ)          │ │  করিম · অটো-১                 │
│                                            │ │  জমা      ৳ ৮০০ (✓)           │
│      টার্গেট ৳ ৮০০    ┌─────────────┐       │ │  বাকি      ৳ ০                │
│                      │  ৭   ৮   ৯   │       │ │  ১১ জুলাই ৩:১২pm             │
│   জমা: ৳ [  ৮০০ ]    │  ৪   ৫   ৬   │       │ │  [PDF] [ছবি] [🔗শেয়ার] [SMS] │
│   ছাড়: ৳ [   ০  ]    │  ১   ২   ৩   │       │ └───────────────────────────────┘
│                      │  ⌫   ০   ✓   │       │  ☑ ড্রাইভারকে SMS রসিদ পাঠান
│   ঘাটতি: ৳ ০ (✓)     └─────────────┘       │  [ জমা সংরক্ষণ করুন  ✓ ]
│   চলতি বাকি: ৳ ০                            │
└────────────────────────────────────────────┘
┌ কালেকশন খতিয়ান ─────────────────────────────────────────────────────────────┐
│ 🔍  ড্রাইভার▾ গাড়ি▾ [তারিখ:জুলাই▾] [ব্যাকডেটেড☐]        [Excel] [PDF] [SMS log]│
│ সময়/তারিখ     ড্রাইভার  গাড়ি   জমা      ঘাটতি      বাকি        SMS   ⋮        │
│ ১১জুল ৩:১২pm   করিম     অটো-১  ৳৮০০     ৳০ (✓)    ৳০          ✅    ⋮        │
│ ১১জুল ২:০৫pm   রফিক     অটো-৩  ৳৬৫০     ৳১৫০(!)   ৳৩,৪৫০(!)   ✅    ⋮        │
│ ১০জুল ⚑        সবুজ     Car    ৳১,০০০   ৳৫০০(!)   ৳৫,২৫০(!)   —     ⋮        │
│  (⚑ = ব্যাকডেটেড, অডিট চিহ্নিত)                                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ পাদ: আজ মোট জমা ৳ ১২,৪৫০ (✓)  ঘাটতি ৳ ৬৫০    ‹ ১/৪ ›  ২৫▾                    │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### WF-5 · রিপোর্ট ও বিশ্লেষণ (Reports & Analytics) `[MVP/P2]`
```
│ রিপোর্ট     পরিসীমা: [ ০১–৩১ জুলাই ২০২৬ 📅 ]  গাড়ি:সব▾  খাত:সব▾  [PDF][Excel] │
│ [আয়-খরচ▓][লাভ-ক্ষতি][ব্যালেন্স শীট][ট্রায়াল ব্যালেন্স][ড্রাইভার বাকি][ক্যালেন্ডার][বাজেট]│
├──────────────────────────────────────────────────────────────────────────────┤
│ ┌ সারাংশ ─────────────┐ ┌ ◔ আয় vs খরচ (মাসিক ট্রেন্ড) ──────────────────────┐ │
│ │ মোট আয়  ৳ ৩,৪২,০০০   │ │  আয় ▇▇▇▇▇▇  খরচ ▃▃▃▄▃▃   নিট ▅▅▅▆▅▅            │ │
│ │ মোট খরচ  ৳ ১,১৮,০০০   │ └────────────────────────────────────────────────────┘ │
│ │ নিট লাভ  ৳ +২,২৪,০০০ │ ┌ ◔ খাতভিত্তিক খরচ (ডোনাট) ──┐ ┌ আদায় হার ─────────┐ │
│ │           (✓)        │ │ ⛽তেল ৪২% 🔧মেরামত ২১%      │ │  ৮৭% (✓)          │ │
│ └─────────────────────┘ │ 🛞টায়ার ১১% টোল ৮% ...      │ │  গড় দৈনিক টার্গেট  │ │
│                         └─────────────────────────────┘ └────────────────────┘ │
│ ┌ ট্রায়াল ব্যালেন্স (ডবল-এন্ট্রি) ───────────────────────────────────────────┐ │
│ │ হিসাব (Account)              ডেবিট (৳)        ক্রেডিট (৳)                   │ │
│ │ নগদ (Cash)                   ৳ ৮৫,০০০         —                            │ │
│ │ ড্রাইভার বাকি (Receivable)    ৳ ৮,৭০০          —                            │ │
│ │ জমা আয় (Collection Income)   —                ৳ ৩,৪২,০০০                   │ │
│ │ জ্বালানি খরচ (Fuel Exp.)      ৳ ৪৯,৫০০         —                            │ │
│ │ ─────────────────────────────────────────────────────────────────────────  │ │
│ │ মোট                          ৳ ৪,৬০,০০০       ৳ ৪,৬০,০০০   [✓ সমতা মিলেছে]  │ │
│ └───────────────────────────────────────────────────────────────────────────┘ │
│  রপ্তানি হচ্ছে… ▓▓▓▓▓░░ ৭০%  (async job → ডাউনলোড লিংক)                        │
```

#### WF-6 · স্টাফ ও পারমিশন ম্যাট্রিক্স (Staff / Roles Permission Matrix) `[P2]`
```
│ স্টাফ ও পারমিশন            [+ স্টাফ আমন্ত্রণ (ফোন+OTP)]                         │
│ ┌ স্টাফ তালিকা ──────────────────────────────────────────────────────────────┐│
│ │ নাম      ফোন           রোল          অবস্থা      শেষ লগইন     ⋮              ││
│ │ (SM)সেলিম 017xxxxxxxx  ম্যানেজার     সক্রিয়(✓)   আজ ২:০০pm    ⋮ [সম্পাদনা]  ││
│ │ (NR)নীলা  018xxxxxxxx  হিসাবরক্ষক    সক্রিয়(✓)   গতকাল        ⋮             ││
│ │ (AB)আবির  019xxxxxxxx  ম্যানেজার     নিষ্ক্রিয়    ৫ দিন আগে    ⋮             ││
│ └────────────────────────────────────────────────────────────────────────────┘│
│ ┌ পারমিশন ম্যাট্রিক্স — সেলিম (ম্যানেজার) ─────────────────────────────────────┐│
│ │ মডিউল / স্কোপ            দেখা(read)   যোগ(write)   সম্পাদনা   মুছুন(owner)    ││
│ │ 💵 জমা / কালেকশন          ☑            ☑            ☑          ☐(owner only) ││
│ │ 📒 আয়-খরচ খতিয়ান          ☑            ☑            ☑          ☐             ││
│ │ 🚗 গাড়ি                   ☑            ☑            ☑          ☐             ││
│ │ 🧑‍✈️ ড্রাইভার / KYC        ☑            ☑            ☑          ☐             ││
│ │ 📊 রিপোর্ট                 ☑            —            —          —             ││
│ │ 🧾 ব্যালেন্স/ট্রায়াল ব্যাল. ☑ (accountant:read)                              ││
│ │ 💳 বিলিং ও পেমেন্ট         ☐            ☐  🔒(শুধু মালিক)                     ││
│ │ 👤 স্টাফ ব্যবস্থাপনা        ☐            ☐  🔒(শুধু মালিক)                     ││
│ │ 🗺️ GPS immobilizer লক     ☐            ☐  🔒(মালিক, fresh-auth)             ││
│ │  প্রিসেট: [হিসাবরক্ষক] [ম্যানেজার▓] [কাস্টম]     [ পরিবর্তন সংরক্ষণ ✓ ]       ││
│ └────────────────────────────────────────────────────────────────────────────┘│
```
> Rows map to scopes (`manager:*`, `accountant:read`, `write:txn`, …). Owner-only rows locked with 🔒. Saving writes `PATCH /users/:id { permissions[] }`.

#### WF-7 · বিলিং ও সাবস্ক্রিপশন (Billing & Subscription) `[MVP gate / P2 charge]`
```
│ বিলিং ও সাবস্ক্রিপশন                                          অবস্থা: [বকেয়া · ৳৭০০]│
│ ┌ বর্তমান প্ল্যান ─────────────────┐ ┌ এই মাসের ব্যবহার (Usage) ─────────────────┐│
│ │ পোস্টপেইড · মাসিক                │ │ সক্রিয় গাড়ি: ৩   (১টি ফ্রি চিরকাল)         ││
│ │ বিলেবল গাড়ি: ২ (১টি ফ্রি)        │ │ • অটো-১   ফ্রি        ৳ ০                  ││
│ │ পেমেন্ট: bKash 017xxxxxxxx       │ │ • অটো-৩   বিলেবল      ৳ ৩৫০                ││
│ │ [ প্ল্যান পরিবর্তন / আপগ্রেড ]    │ │ • Car     বিলেবল      ৳ ৫০০                ││
│ └─────────────────────────────────┘ │ ─────────────────────────────────────────  ││
│                                      │ আনুমানিক মাস-শেষ বিল:  ৳ ৮৫০ (projected)   ││
│                                      └────────────────────────────────────────────┘│
│ ┌ ⚠️ বকেয়া ইনভয়েস ─────────────────────────────────────────────────────────────┐│
│ │ INV-2026-06  জুন ২০২৬   ৳ ৭০০   অবস্থা:বকেয়া(!)  শেষ তারিখ ১৭ জুলাই (৬ দিন)   ││
│ │                                            [ ইনভয়েস PDF ]  [ 🅱️ bKash দিয়ে দিন ]││
│ └────────────────────────────────────────────────────────────────────────────────┘│
│  bKash পেমেন্ট: initiated→ ▓▓▓▓▓░ যাচাই হচ্ছে…  (webhook এলে লক খুলবে)             │
│ ┌ ইনভয়েস ইতিহাস ────────────────────────────────────────────────────────────────┐│
│ │ INV-2026-05  মে   ৳ ৮৫০   পরিশোধিত(✓)  ২ মে      [PDF]                          ││
│ │ INV-2026-04  এপ্রিল ৳ ৭০০  পরিশোধিত(✓)  ৩ এপ্রিল  [PDF]                          ││
│ └────────────────────────────────────────────────────────────────────────────────┘│
│ ┌ প্ল্যান ক্যাটালগ (GPS হার্ডওয়্যার অ্যাড-অন) ────────────────────────────────────┐│
│ │ Bike/CNG/অটো/e-bike: ৳৩৫০/মাস   |   Car/Bus/Truck/Micro: ৳৫০০/মাস               ││
│ │ প্রিপে টার্ম (৳৩৫০): ১মা ৳৩৫০ · ৩মা ৳৩১৫(−১০৫) · ৬মা ৳২৯৮(−৩১২) · ১২মা ৳২৮০(−৮৪০)││
│ └────────────────────────────────────────────────────────────────────────────────┘│
```

#### WF-8 · লাইভ GPS ফ্লিট ম্যাপ (GPS Fleet Map) `[P3]`
```
│ লাইভ GPS       🟢 লাইভ · ~১০সে রিফ্রেশ    [সব গাড়ি▾] [জিওফেন্স] [অ্যালার্ট³] [রুট প্লেব্যাক]│
├────────────────────────────┬─────────────────────────────────────────────────────────┤
│ গাড়ি (৫ · ৪ চলছে)          │                                                         │
│ 🟢 অটো-১  ৪২km/h  বনানী     │            ┌─── MAP (clustered pins, 100+ scale) ───┐     │
│ 🟢 অটো-৩  ২৮km/h  মহাখালী    │            │        🟢অটো-১        ⭕জিওফেন্স         │     │
│ 🔴 Car    থামানো  গুলশান     │            │   🟢অটো-৩       🔴Car(থামানো)          │     │
│ 🟢 Truck  ৫৫km/h  উত্তরা(!)  │            │           🟢Truck  ⚠️ওভারস্পিড          │     │
│ ⚪ Bus    অফলাইন            │            └──────────────────────────────────────────┘     │
│ ────────────────────────── │  ┌ নির্বাচিত: Truck ─────────────────────────────────────┐ │
│ 🔔 অ্যালার্ট ফিড            │  │ গতি ৫৫km/h · ইগনিশন চালু · উত্তরা                       │ │
│ ⚠️ Truck ওভারস্পিড ৩:৪০pm   │  │ [ রুট ইতিহাস/প্লেব্যাক ]  [ 🔒 ইঞ্জিন লক/আনলক (PIN) ]    │ │
│ 🚪 অটো-১ জিওফেন্স ছাড়ল ৩:১০ │  │ আজ: ৮৪km · ৩ট্রিপ · সর্বোচ্চ ৬২km/h                    │ │
│ ⚙️ অটো-৩ সার্ভিস ডিউ        │  └────────────────────────────────────────────────────────┘ │
└────────────────────────────┴─────────────────────────────────────────────────────────┘
  হার্ডওয়্যার নেই? [ GPS ট্র্যাকার অর্ডার করুন (COD, ফ্রি ইনস্টল) ]  ৳৪,০০০ + মাসিক
```

---

## PART B — PLATFORM ADMIN PANEL (Super-Admin)

Separate role-gated route-set (`/admin`) in the *same* React app, but a **distinct shell** (different sidebar, no org/tenant scoping — admin operates cross-org). Access requires platform `Admin` role; the `organizationId` tenant filter is bypassed only here. Distinct visual treatment (darker/neutral chrome, "প্ল্যাটফর্ম অ্যাডমিন" wordmark) so an admin never confuses it with an owner console.

**Cross-org tables** (`SubscriptionPlan` price book, marketplace moderation) carry no `organizationId` — the admin panel is their only editor.

### B1. Admin Pages
| Route | Title | Purpose / key components | API |
|---|---|---|---|
| `/admin` | মেট্রিক্স ড্যাশবোর্ড | Platform KPIs: total orgs, active/soft-locked, MRR, free→paid conversion, new signups, SMS spend, GPS orders pipeline, churn; trend charts | platform metrics (admin-scoped) |
| `/admin/tenants` | টেন্যান্ট / প্রতিষ্ঠান | All orgs table (name, owner phone, business-mode, plan, bill_status, vehicles, created); drill into org (read-only impersonate for support), soft-lock/unlock, plan override | admin org endpoints |
| `/admin/moderation` | মার্কেটপ্লেস মডারেশন | **Approve/reject queue** for marketplace listings (pending first); photo gallery, map location, price, seller org; bulk actions; reject-reason | `GET/PATCH` marketplace moderation |
| `/admin/users` | ইউজার ও সাপোর্ট | Cross-org user lookup, support tickets triage, contact-form submissions, device/session reset | `/support/tickets`, admin user lookup |
| `/admin/billing-ops` | বিলিং অপস | Invoice runs, failed bKash payments, manual mark-paid/refund, soft-lock overrides, plan price-book editor (`SubscriptionPlan`) | billing admin + `SubscriptionPlan` |
| `/admin/sms-ops` | SMS অপস | Gateway health (SSL Wireless + failover providers), delivery rates, per-type volume, OTP failure spikes, spend | `/sms/logs` (cross-org), provider status |
| `/admin/gps-inventory` | GPS ইনভেন্টরি ও অর্ডার | Device stock (IMEI/SIM), order fulfillment pipeline (ordered→called→installed→live), install scheduling, warranty tracking | `/gps/orders`, `/gps/devices` |

### B2. Admin Wireframes

#### WF-9 · মার্কেটপ্লেস মডারেশন কিউ (Moderation Queue)
```
┌ প্ল্যাটফর্ম অ্যাডমিন ──────────────────────────────────────────────────────────────┐
│ 📊মেট্রিক্স 🏢টেন্যান্ট 🛒মডারেশন▓ 👥ইউজার 💳বিলিং 📩SMS 📡GPS        অ্যাডমিন:শুভম ▾│
├────────────────────────────────────────────────────────────────────────────────────┤
│ মার্কেটপ্লেস মডারেশন   ট্যাব: [অপেক্ষমাণ▓ ৭][অনুমোদিত][প্রত্যাখ্যাত]  টাইপ▾  🔍     │
│ ┌ কিউ (বাম) ─────────────────┐ ┌ বিস্তারিত (ডান) ───────────────────────────────┐ │
│ │▸ CNG ২০১৯ · ৳২,৮৫,০০০       │ │  [ছবি ১][ছবি ২][ছবি ৩][ছবি ৪]   🖼️ গ্যালারি   │ │
│ │  বিক্রেতা: রহিম CNG · ২ঘ আগে │ │  শিরোনাম: CNG অটোরিকশা ২০১৯, ভালো কন্ডিশন      │ │
│ │  ─────────────────────────  │ │  দাম: ৳ ২,৮৫,০০০   টাইপ: 🛺 ব্যবহৃত অটো        │ │
│ │  স্পেয়ার পার্টস · ৳১২,০০০    │ │  বিবরণ: ইঞ্জিন সম্প্রতি ওভারহল, কাগজ হালনাগাদ… │ │
│ │  বিক্রেতা: করিম অটো · ৪ঘ আগে │ │  📍 ম্যাপ: বনানী, ঢাকা  [ম্যাপে দেখুন]         │ │
│ │  ─────────────────────────  │ │  বিক্রেতা org: রহিম CNG · প্ল্যান:পেইড · ✔ভেরিফায়েড│ │
│ │  Micro ২০১৭ · ৳৮,৫০,০০০      │ │  ⚠️ স্বয়ংক্রিয় ফ্ল্যাগ: কোনো নিষিদ্ধ শব্দ নেই   │ │
│ │  ...                        │ │ ┌──────────────────────────────────────────┐ │ │
│ │                             │ │ │ প্রত্যাখ্যানের কারণ (reject হলে): [        ]│ │ │
│ │                             │ │ └──────────────────────────────────────────┘ │ │
│ │                             │ │  [ ✓ অনুমোদন ]   [ ✕ প্রত্যাখ্যান ]  [পরবর্তী›]│ │
│ └─────────────────────────────┘ └────────────────────────────────────────────────┘ │
│ নির্বাচিত ৩টি:  [ ✓ সব অনুমোদন ]  [ ✕ সব প্রত্যাখ্যান ]     কিউ: ৭ অপেক্ষমাণ         │
└────────────────────────────────────────────────────────────────────────────────────┘
```
> Listing appears in the public verified feed **only after** approve. Reject requires a reason (relayed to seller). Keyboard-driven: `A`=approve, `R`=reject, `→`=next.

#### WF-10 · টেন্যান্ট তালিকা (Tenant / Org List)
```
│ টেন্যান্ট / প্রতিষ্ঠান (২,৳১৪ সক্রিয়)   🔍নাম/ফোন   মোড▾ প্ল্যান▾ অবস্থা▾  [Excel]│
├────────────────────────────────────────────────────────────────────────────────────┤
│ প্রতিষ্ঠান     মালিক ফোন    মোড        প্ল্যান   বিল অবস্থা      গাড়ি  তৈরি      ⋮  │
│ রহিম CNG       017xxxxxxxx  CNG/অটো    পেইড     🔒সফট-লক(!)     ৩    ১২ জান     ⋮  │
│ করিম অটো       018xxxxxxxx  CNG/অটো    ফ্রি     সক্রিয়(✓)       ১    ০৫ মার্চ   ⋮  │
│ ঢাকা রেন্ট-এ-কার 019xxxxxxxx রেন্ট-কার  পেইড     বকেয়া(!)       ৮    ২২ ফেব     ⋮  │
│ গ্রিন চার্জিং    016xxxxxxxx  চার্জিং    পেইড     পরিশোধিত(✓)     ০    ৩০ এপ্রিল  ⋮  │
│   ⋮ = [বিস্তারিত/ইম্পার্সোনেট(read-only)] [সফট-লক/আনলক] [প্ল্যান ওভাররাইড] [SMS log]│
├────────────────────────────────────────────────────────────────────────────────────┤
│ ‹ ১ / ৮৬ ›   ২৫▾   মোট ২,১৪০   |  সফট-লক ৪৭ · বকেয়া ১১২ · ফ্রি ১,৩২০ · পেইড ৮২০    │
└────────────────────────────────────────────────────────────────────────────────────┘
```

---

## PART C — Component Patterns (Buildable Specs)

#### C1. Data Table (`<DataTable>` — TanStack Table + shadcn)
Single reusable component powering every list.
- **Toolbar:** left = title + count; right = search (`q`, debounced 300ms), faceted filter dropdowns (multi-select chips), density toggle, column-visibility menu, export buttons.
- **Filtering/sorting/pagination:** server-side. Filters map to API query params (`status`, `vehicle_id`, `from`/`to`, `category`); sort → `?sort=field:dir`; pagination → **cursor** (`?limit=25&cursor=…`) with `‹ পূর্ব / পরবর্তী ›` + page-size select; envelope `{ data, meta:{ next_cursor, has_more, total } }`.
- **Row:** selection checkbox (bulk actions bar appears when >0 selected), row-click → detail, `⋮` row-action `dropdown-menu` (edit/void/SMS/PDF gated by scope).
- **States:** `skeleton` rows while loading (TanStack Query `isLoading`), empty-state illustration + primary CTA, error `alert` with retry.
- **Money columns:** right-aligned, tabular-nums, `formatBDT`, red for dues/negatives.
- **Footer:** aggregate row (মোট / totals) where meaningful (collections total, dues total, trial-balance debit=credit).
- **Bengali/English:** column headers from i18n; enum cells render `{value,label}` label (API already returns localized labels).

#### C2. Forms (`react-hook-form` + `zod`)
- One `zodResolver` schema per form; Bengali error messages via i18n resolver. Server `422 {error:{fields}}` maps back onto field errors.
- **Money inputs:** string decimal, `inputMode="decimal"`, mask to 2 dp, never coerce to float; the **NumericKeypad** variant for collection/quick-entry (large tappable, low-literacy).
- **Date:** `calendar`+`popover`; backdated selection auto-sets `isBackdated` and shows an inline ⚑ "অডিট চিহ্নিত" hint.
- **Category (khat) picker:** `combobox` seeded from `GET /categories?type=`, with "নতুন খাত" inline-create.
- **Entity pickers:** driver/vehicle/customer async `combobox` (searches API), showing avatar + reg-no + live dues badge in the option.
- **Offline:** every mutating submit attaches `Idempotency-Key` + `client_id` + `client_created_at`; on offline, optimistic-write to local queue, toast "অফলাইন — সিঙ্ক হবে", sync indicator increments.
- **Destructive actions** (void collection, delete vehicle, reject listing) → `alert-dialog` confirm with typed reason where the API requires `reason`.

#### C3. Permission Matrix (`<PermissionMatrix>`)
- Grid: rows = permission groups (module scopes from `GET /permissions` grouped by `group`), columns = access levels (read / write / edit / owner-only).
- Cells = `checkbox`; owner-only rows rendered locked 🔒 and disabled for non-owner editors.
- **Presets** (`radio-group`): হিসাবরক্ষক (accountant:read + write:txn), ম্যানেজার (manager:*), কাস্টম — selecting a preset bulk-toggles cells; any manual edit flips to কাস্টম.
- Maps directly to `User.permissions` JSON → `PATCH /users/:id`. Scope semantics: `owner:*` implies all; role gives default set; overrides layer on top.

#### C4. Money Formatting (`formatBDT`)
- Input: string decimal from API. Never `Number()` for arithmetic — use decimal.js/dinero for any client math (rare; prefer server totals).
- Output: `৳` prefix, locale digit set (Bengali `০-৯` when lang=bn, else Latin), grouped thousands, 2 dp only when non-zero fraction. Right-aligned, `font-variant-numeric: tabular-nums`.
- Sign/semantics: dues, shortfall, loss, payable → **red**, `−` prefix. Income, profit, paid, advance → **green** where it denotes a positive event. Neutral figures → default text color.

#### C5. Status Badges (`<StatusBadge kind={...}>`) — single source of color truth
| Domain | Value → Bengali label · color |
|---|---|
| Plan/bill (`BillingStatus`) | পরিশোধিত green · বকেয়া amber · 🔒সফট-লক red(pulse) · খসড়া grey |
| Vehicle op (`VehicleOpStatus`) | খালি grey · ভাড়ায় blue · বুকড amber |
| Run (`RunState`) | চলছে green(dot) · থামানো grey |
| Driver dues | পরিশোধিত green · বাকি ৳X red |
| Invoice (`InvoiceStatus`) | পরিশোধিত green · আংশিক amber · বকেয়া red |
| Doc expiry | ঠিক আছে green · শীঘ্রই শেষ(≤lead) amber · মেয়াদোত্তীর্ণ red |
| Service | ঠিক green · ডিউ amber · ওভারডিউ red |
| Charging (`ChargingStatus`) | পূর্ণ green · আংশিক amber · বকেয়া red |
| Installment (`InstallmentStatus`) | পরিশোধিত green · আংশিক amber · বকেয়া grey · ওভারডিউ red |
| Moderation | অপেক্ষমাণ amber · অনুমোদিত green · প্রত্যাখ্যাত red |
| GPS live | চলছে green(dot) · থামানো grey · অফলাইন hollow · ⚠️অ্যালার্ট red |
| KYC | যাচাইকৃত green · অসম্পূর্ণ amber |
- Consistent shape: pill, small dot for live/run states, icon-optional. Colors are theme-aware tokens (works light/dark), never hard-coded hex in components.

#### C6. Cross-cutting UI behaviors
- **Soft-lock (HTTP 402):** a `SUBSCRIPTION_REQUIRED` response anywhere → interceptor shows a non-dismissable-until-acknowledged `dialog` "বিল বকেয়া — পেইড ফিচার সাময়িক লক" with a bKash-pay CTA; paid-feature buttons render disabled with 🔒 + tooltip. Read + free-vehicle writes stay enabled. **Never** implies data loss.
- **Free-gate nudge:** attempting to add a 2nd billable vehicle on FREE → inline explainer (১টি গাড়ি চিরকাল ফ্রি; ২য় থেকে পোস্টপেইড) + upgrade, not a hard block.
- **Vertical presets:** `verticals_enabled[]` from `GET /org` drives sidebar/section visibility — the same shell reshapes for CNG vs rent-a-car vs charging vs bus-association without separate code.
- **Export jobs:** PDF/Excel buttons kick `POST /reports/export` → `{export_job_id}` → poll `GET /exports/:job` with `progress` bar → download link (toast on ready). Async, non-blocking.
- **i18n toggle:** flips digit set, labels, and date formatting app-wide instantly (TanStack Query cache keyed by lang for label-bearing responses).
- **Audit visibility:** backdated/edited/voided entries always carry a ⚑ marker + hover-card showing who/when (anti-theft transparency is the product's core promise).

---

### Build priority summary
- **MVP shell to ship first:** global layout (sidebar+topbar+plan badge+lang toggle+offline indicator), Dashboard (WF-1), Collections entry+ledger (WF-4), Vehicles list+profile (WF-2), Drivers+dues (WF-3), Ledger (income/expense), core Reports with PDF/Excel (WF-5), Settings, Billing plan/gate view. Plus the reusable `DataTable`, `formatBDT`, `StatusBadge`, form kit.
- **P2:** Rentals, Fuel, Maintenance, Documents, QR, Customers/party-ledger, full Reports depth (balance sheet/trial balance/analytics/budget — WF-5 tabs), Staff+PermissionMatrix (WF-6), Billing charge+bKash pay (WF-7), Notifications, Support.
- **P3:** GPS fleet map (WF-8), Inventory/Suppliers/Purchases-Sales, Loans, Charging, Marketplace, and the entire **Platform Admin panel** (WF-9 moderation, WF-10 tenants, metrics, billing/SMS/GPS ops).

Source references consulted: `/Users/mslive/Documents/Antigravity Projects/myauto.dupno.com/docs/01-PRD-full-build-spec.md` and `/Users/mslive/Documents/Antigravity Projects/myauto.dupno.com/docs/02-feature-inventory.md`.


---

## অংশ ৩ — পূর্ণ PRD (ফিচার/রোল/লজিক)


## Amar Auto Clone — Full Build Spec (myauto.dupno.com)

> Master build document for **আমার অটো (Amar Auto)** — a Bengali-first, multi-tenant vehicle & fleet accounting SaaS (web + API first, then mobile). Audience: the developer/owner building it. This is the single source of truth: product, features, roles, data model, API surface, stack, monetization, roadmap, and business logic.

---

### 1. Product Overview & Positioning

#### 1.1 What it is
**আমার অটো (Amar Auto)** is a Bengali-first, multi-tenant vehicle/fleet **accounting SaaS** delivered as an Android/iOS mobile app plus a web dashboard. At its heart is **one vehicle-agnostic double-entry accounting core** exposed through **8 vertical presets**. Every promised feature — GPS, inventory, rental, charging, bus-association funds — is a module writing into the same ledger spine.

#### 1.2 Positioning
- **Bengali is native, not a translation layer.** Icon-driven UI targets low-literacy fleet owners. ~5-minute setup, no training required.
- **Freemium acquisition funnel:** **1 vehicle's accounting is free forever.** Multiple vehicles convert to a paid, **postpaid** plan billed at month-end via **bKash** — zero upfront cost, zero signup friction.
- **Offline-first:** entries queue locally and auto-sync on reconnect (eventual consistency) — essential for an emerging-market field product.
- **Hardware upsell:** an optional GPS tracker (partner: Autonemo GPS) is a separate paid add-on (one-time device + monthly subscription).

#### 1.3 Target users
Owners of mixed fleets — CNG/auto-rickshaw, rent-a-car, e-vehicle charging garages, bus associations, truck/transport, bike rideshare, parts workshops, or generic fleets — who today run their business on cash, memory, and paper.

#### 1.4 Core value proposition
- **Anti-theft transparency:** every collection is timestamped and receipt-backed; zero manual arithmetic.
- **Automatic driver dues:** shortfalls against a daily target auto-post and show in red.
- **Per-vehicle P&L** and an authoritative double-entry ledger (balance sheet, trial balance) side by side.
- **Digital receipts** as PDF/image with shareable links.

#### 1.5 Platform surfaces
| Surface | Purpose |
|---|---|
| Mobile app (RN/Expo, Android + iOS) | Primary field tool: collections, dashboard, receipts, live GPS, offline entry |
| Web dashboard (React) | Full management, reports, admin |
| Admin/moderation panel | Platform-side marketplace moderation (same web app, admin-gated) |
| GPS ingestion service | Decoupled high-write telemetry pipeline |
| Public/anon endpoints | Passenger QR scan/verify; bKash webhook |

---

### 2. Complete Feature Inventory (by module)

Legend: **MVP** = Phase 1 shippable core · **P2** = Phase 2 (monetization + depth) · **P3** = Phase 3 (platform + hardware + verticals).

#### A. Authentication & Onboarding
| Feature | Phase |
|---|---|
| Mobile-number signup verified via OTP (primary credential) | MVP |
| PIN quick-login + password (secondary conveniences) | MVP |
| Multi-device login (one refresh token per device) | MVP |
| Web signup ("ওয়েব থেকে শুরু করুন") + free app download | MVP |
| ~5-minute setup, icon-driven low-literacy UI | MVP |
| Bengali/English i18n (Bengali default, native) | MVP |

#### B. Accounts & Collections (হিসাব ও জমা)
| Feature | Phase |
|---|---|
| Smart Dashboard — today's collections, expenses, profit, active-vehicle count (real time) | MVP |
| Daily Collection Entry — select driver, one-tap keypad; dues auto-calculated; timestamped log | MVP |
| Digital Receipt — PDF/image + shareable link, stored digitally | MVP |
| General Ledger / Books — double-entry, balances, balance sheet, trial balance | MVP |
| Backdated Entry — past-date transactions allowed, flagged for audit | MVP |
| Receivables/Payables & Loans in one ledger | P3 |

#### C. Vehicles & Fleet Management (গাড়ি ও বহর)
| Feature | Phase |
|---|---|
| Vehicle Management — mixed fleet in one account | MVP |
| Vehicle Profile — per-vehicle P&L, repair/service history, documents | MVP |
| Per-vehicle segmentation — income/expense/profit auto-isolated; unlimited vehicles | MVP |
| Fleet Calendar / Dashboard — per-vehicle status (empty/rented/booked; running/stopped) | P2 |
| Accident Record — photo evidence; fines & damage auto-posted as vehicle expenses | P3 |

#### D. Driver Management (ড্রাইভার)
| Feature | Phase |
|---|---|
| Driver list/profiles — dues, vehicle assignment | MVP |
| Driver KYC — NID/identity docs, photo, profession | MVP |
| Driver & Dues Ledger — deposits (জমা), dues (বাকি), discounts/waivers (ছাড়) as distinct columns | MVP |
| Daily deposit target per driver (drives shortfall/dues auto-calc) | MVP |
| SMS receipts/reminders to drivers | MVP |

#### E. Vehicle QR (গাড়ি QR)
| Feature | Phase |
|---|---|
| Verification & Safety — passenger scans QR sticker to verify vehicle/driver | P2 |
| Contact Without Number — anonymous passenger→owner messaging | P2 |
| Complaints & Reports — complaints, lost-item, accident news to owner's app | P2 |
| Smart QR Dashboard — total scans, unread counts, breakdown by type | P2 |
| Bulk QR Print — all vehicles' stickers as one PDF | P2 |
| Custom QR Text — editable text under QR | P2 |

#### F. Fuel & Maintenance (ফুয়েল ও মেইনটেন্যান্স)
| Feature | Phase |
|---|---|
| Fuel Log — volume, cost, odometer, price/liter, payment method | P2 |
| Mileage Calculation — auto KPL and cost/km from odometer deltas | P2 |
| Fuel Analytics — avg fill-up cost, city/highway split, price trends | P2 |
| Maintenance Dashboard — reminders; total/YTD/average cost | P2 |
| Service Record — full history, parts replaced | P2 |
| Service reminder — time- and/or odometer-based; overdue flagging | P2 |
| Document expiry reminders — Route Permit, Fitness, Insurance, Tax Token, Registration | P2 |

#### G. Inventory & Parts (ইনভেন্টরি ও পার্টস)
| Feature | Phase |
|---|---|
| Parts Stock — category, part number, brand, location, reorder level, prices | P3 |
| Suppliers & Credit — supplier ledger, on-credit purchases, dues | P3 |
| Purchase/Sale Invoice — multi-item with discounts & credit; printable | P3 |
| Stock Count & Write-off — physical count, damage/waste, returns | P3 |
| Inventory Reports — purchases, payables, reorder, slow/dead stock | P3 |

#### H. Reports & Analytics (রিপোর্ট ও বিশ্লেষণ)
| Feature | Phase |
|---|---|
| Money History — chronological log with filter/search | MVP |
| Per-vehicle P&L + monthly PDF/Excel export | MVP |
| Analytics — income/expense trends, sources, collection rates (charts) | P2 |
| Calendar Report — day-by-day income/expense | P2 |
| Budget — monthly budgets with alert threshold | P2 |
| Category-wise reports (খাতভিত্তিক) | P2 |
| Balance sheet / trial balance (double-entry) | P2 |

#### I. Live GPS Tracking (লাইভ GPS) + hardware
| Feature | Phase |
|---|---|
| Live GPS Map — real-time, ~10s updates, 100+ mixed vehicles | P3 |
| Tracker-to-Vehicle mapping | P3 |
| Route history / trip report with playback; running vs stopped | P3 |
| Remote engine lock/unlock (immobilizer / cut-off relay) | P3 |
| Smart Alerts — Engine On/Off, Over-Speed, Geofence Enter/Exit | P3 |
| Geofence definition (enter/exit) | P3 |
| Hardware order flow (Order→Call→Install→Live, COD, nationwide, free install) | P3 |
| Device specs: backup battery, 9–90V, IP65, integrated SIM, 1-yr warranty | P3 |

#### J. Charging & Loans (চার্জিং ও ঋণ)
| Feature | Phase |
|---|---|
| Charging Station — daily/monthly bills & dues; per-customer daily rate; flexible-rate customers | P3 |
| Loans & Installments — receivables/payables and hire-purchase (HP) | P3 |
| Installment Purchase — HP & installment schedule | P3 |

#### K. Rental / Bookings (ভাড়া ও বুকিং)
| Feature | Phase |
|---|---|
| Booking & Calendar — availability by date; double-booking prevention | P2 |
| Customer Profile / CRM — photo, phone, ID, profession, rental history | P2 |
| Rental & Invoice — fare, advance/deposit (অগ্রিম), dues (বকেয়া); printable receipt | P2 |
| Trip handover — start/end odometer, distance, fare | P2 |
| Hourly/time-based billing — one-tap START (রিলিজ)/END (এন্ড); auto-elapsed + rate + surcharge; SMS bill link | P2 |
| Per-vehicle rental profit | P2 |
| Roadmap: trip distance & route-based billing | Later |

#### L. Party Ledger (পাওনা-দেনা — truck/transport)
| Feature | Phase |
|---|---|
| Per-client receivable (পাওনা), advance (অগ্রিম), settlement (পরিশোধ) as running ledger | P3 |

#### M. Billing & Subscription
| Feature | Phase |
|---|---|
| Plan model + free-tier gate (billing engine stubbed) | MVP |
| Postpaid billing — auto-invoice at month-end; bKash; 7-day window | P2 |
| Free tier: 1 vehicle free forever; multi-vehicle = paid | MVP (gate) / P2 (charge) |
| GPS tracker hardware = separate paid add-on | P3 |
| Soft-lock paid features on non-payment (no deletion) | P2 |
| Nagad/Rocket gateways | Later |

#### N. Notifications & Communication
| Feature | Phase |
|---|---|
| SMS reminders (driver dues, bill links, document expiry) | MVP (dues) / P2 (docs, bill) |
| In-app / push notifications | P2 |
| Voice entry — hands-free income/expense via microphone | P3 |

#### O. Support
| Feature | Phase |
|---|---|
| In-app support chat / ticket + support phone | P2 |
| Contact/support form (Name*, Mobile, Message*) | P2 |

#### P. Auto Marketplace (অটো বেচা-কেনা)
| Feature | Phase |
|---|---|
| Post Ad — used autos/CNGs/spare parts with photos + map location | P3 |
| Verified Feed — admin-moderated; visible only after approval | P3 |

#### Q. Additional / Platform
| Feature | Phase |
|---|---|
| Offline mode with auto-sync (offline-first) | MVP (collections) / P2 (all entries) |
| Multi-business-mode / 8 vertical presets | MVP (mode select) / P3 (full presets) |
| Expense categorization (fuel, repair, garage rent, gas, oil/mobil, tires, parts, toll, driver bata, other) | MVP |
| Staff Permissions — role-based access (manager/accountant) | P2 |
| Cloud Backup — encrypted, automatic, per-account | P3 (surfaced) |
| Achievements — goals/milestones (gamification) | P3 |
| Responsive small-phone UI density | MVP |

---

### 3. User Roles & Auth Model

#### 3.1 Roles
| Role | Login? | Description |
|---|---|---|
| **Owner (মালিক)** | ✅ | Account holder / tenant. Full access; manages fleet, drivers, finances, billing (postpaid bKash), business-mode selection. |
| **Manager (ম্যানেজার)** | ✅ | Staff with role-based permissions. |
| **Accountant (হিসাবরক্ষক)** | ✅ | Staff with role-based permissions (typically ledger read + txn write). |
| **Admin (platform)** | ✅ | Platform-side. Moderates the Auto Marketplace feed. |
| **Driver (ড্রাইভার)** | ❌ | Managed entity. Receives SMS receipts/reminders; has KYC, dues, vehicle assignment. |
| **Customer / Passenger / Party** | ❌ | External. Passengers scan QR & send anonymous messages; rental/charging/party customers receive receipts and appear in ledgers. |
| **Member (সদস্য — bus assoc.)** | ❌ | Subscription-paying member tracked in fund accounting. |

Roles with app logins: **Owner + Staff (Manager, Accountant)**, secured by phone+OTP, PIN, password, multi-device. Everyone else is a managed entity or external actor.

#### 3.2 Credential model
- **Primary credential = phone + OTP.** PIN and password are device conveniences that mint the same JWT pair.
- OTP: 6-digit, hashed in Redis with TTL + attempt counter + rate limit; roll your own (control Bengali SMS copy, cheaper than paid identity providers).
- Secondary unlocks stored as **Argon2** hashes.

#### 3.3 Token model
- **Access JWT** (RS256, 15 min). Claims: `sub` (user_id), `org` (owner account/tenant), `role`, `device_id`, `scope[]`, `plan`, `soft_locked`, `iat`, `exp`.
- **Refresh token** (opaque, rotating, 60 d): **one row per `device_id`** → enables multi-device and per-device remote logout. Reuse detection revokes the device chain.

#### 3.4 Scope model
- Role → default scope set (`owner:*`, `manager:*`, `accountant:read`, `accountant:write:txn`, …). `owner` implies all scopes for its org. Owner can grant granular staff `permissions[]` that map to scopes. Every endpoint lists a minimum scope.

#### 3.5 Soft-lock (HTTP 402)
An unpaid org keeps **read access + free-vehicle writes**; paid-feature writes are rejected with `error.code = SUBSCRIPTION_REQUIRED` until the bKash webhook clears the invoice. **Never delete data.**

#### 3.6 Multi-tenancy
The **Owner account _is_ the tenant** (`organizationId`). Enforced in order of trust: (1) Postgres **Row-Level Security** as the backstop; (2) Prisma middleware/extension auto-injecting `organizationId`; (3) org-scoped composite uniqueness and org-first composite indexes.

---

### 4. Data Model (Prisma / PostgreSQL)

Production schema. Single database, shared schema, `organizationId` discriminator on every tenant-scoped table with `onDelete: Cascade`. Money is always `Decimal` with fixed scale — never floats. `LocationPing` is the only high-write time-series table (partition monthly / TimescaleDB in production).

```prisma
// ============================================================
// datasource & generator
// ============================================================
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================================
// ENUMS
// ============================================================
enum UserRole {
  OWNER
  MANAGER
  ACCOUNTANT
}

enum PlanTier {
  FREE          // 1 vehicle free forever
  PAID          // multi-vehicle monthly/yearly
}

enum BusinessMode {
  CNG_AUTORICKSHAW
  RENT_A_CAR
  E_VEHICLE_CHARGING
  BUS_ASSOCIATION
  TRUCK_TRANSPORT
  BIKE_RIDESHARE
  GENERIC_FLEET
  PARTS_WORKSHOP
}

enum VehicleType {
  CNG
  AUTO_RICKSHAW
  RENT_A_CAR
  E_BIKE
  BIKE
  CAR
  BUS
  TRUCK
  MICRO
}

enum VehicleOpStatus {
  EMPTY         // খালি
  RENTED        // ভাড়ায়
  BOOKED        // বুকড
}

enum RunState {
  RUNNING
  STOPPED
}

enum DocType {
  ROUTE_PERMIT
  FITNESS
  INSURANCE
  TAX_TOKEN
  REGISTRATION
}

enum LedgerEntryType {
  DEBIT
  CREDIT
}

enum TxnDirection {
  INCOME
  EXPENSE
}

enum PaymentMethod {
  CASH
  BKASH
  NAGAD
  ROCKET
  BANK
  CREDIT
  OTHER
}

enum InvoiceKind {
  PURCHASE
  SALE
}

enum InvoiceStatus {
  PAID
  PENDING
  PARTIAL
}

enum LoanType {
  GIVEN         // receivable
  TAKEN         // payable
  HIRE_PURCHASE // HP installment
}

enum InstallmentStatus {
  DUE
  PAID
  PARTIAL
  OVERDUE
}

enum PartyLedgerType {
  RECEIVABLE    // পাওনা
  PAYABLE       // দেনা
  ADVANCE       // অগ্রিম
  SETTLEMENT    // পরিশোধ
}

enum ChargingStatus {
  FULL
  PARTIAL
  PENDING
}

enum BillingStatus {
  DRAFT
  PENDING
  PAID
  OVERDUE
  SOFT_LOCKED
}

enum SmsType {
  RECEIPT
  EXPIRY_REMINDER
  DUES_REMINDER
  BILL_LINK
  OTP
  OTHER
}

enum SmsStatus {
  QUEUED
  SENT
  FAILED
  DELIVERED
}

enum AlertType {
  ENGINE_ON_OFF
  OVERSPEED
  GEOFENCE_ENTER
  GEOFENCE_EXIT
  SERVICE_DUE
  DOC_EXPIRY
}

enum StockMoveType {
  PURCHASE_IN
  SALE_OUT
  WRITE_OFF
  RETURN_IN
  RETURN_OUT
  ADJUSTMENT
  COUNT_CORRECTION
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  SOFT_LOCK
  PAYMENT
}

// ============================================================
// TENANCY: ORGANIZATION + USERS/ROLES
// ============================================================
model Organization {
  id             String        @id @default(cuid())
  name           String
  ownerPhone     String        // OTP-verified primary owner phone
  businessMode   BusinessMode  @default(GENERIC_FLEET)
  planTier       PlanTier      @default(FREE)
  bkashNumber    String?
  termsAcceptedAt DateTime?
  isActive       Boolean       @default(true)   // soft-lock kills paid features, not this
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // relations (every tenant-scoped table back-references here)
  users             User[]
  vehicles          Vehicle[]
  drivers           Driver[]
  customers         Customer[]
  collections       Collection[]
  driverDues        DriverDue[]
  expenses          Expense[]
  expenseCategories ExpenseCategory[]
  fuelEntries       FuelEntry[]
  serviceRecords    ServiceRecord[]
  documents         VehicleDocument[]
  parts             Part[]
  stockMovements    StockMovement[]
  suppliers         Supplier[]
  invoices          Invoice[]
  bookings          Booking[]
  receipts          Receipt[]
  accidents         Accident[]
  loans             Loan[]
  partyLedgers      PartyLedgerEntry[]
  chargingSessions  ChargingSession[]
  ledgerAccounts    LedgerAccount[]
  journalEntries    JournalEntry[]
  budgets           Budget[]
  gpsDevices        GpsDevice[]
  geofences         Geofence[]
  gpsTrips          GpsTrip[]
  billingInvoices   BillingInvoice[]
  billingPayments   BillingPayment[]
  subscriptions     Subscription[]
  smsLogs           SmsLog[]
  auditLogs         AuditLog[]

  @@index([planTier])
  @@map("organizations")
}

model User {
  id             String    @id @default(cuid())
  organizationId String
  name           String
  phone          String    // OTP-verified; unique per org
  email          String?
  role           UserRole  @default(OWNER)
  pinHash        String?
  passwordHash   String?
  otpVerified    Boolean   @default(false)
  permissions    Json?     // fine-grained staff permission map
  isActive       Boolean   @default(true)
  lastLoginAt    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdCollections Collection[] @relation("CollectionCreatedBy")
  auditLogs    AuditLog[]

  @@unique([organizationId, phone])
  @@index([organizationId, role])
  @@map("users")
}

// ============================================================
// VEHICLES / DRIVERS / ASSIGNMENTS
// ============================================================
model Vehicle {
  id                 String          @id @default(cuid())
  organizationId     String
  registrationNo     String
  vehicleType        VehicleType
  model              String?
  voltageRange       String?
  currentOdometer    Int             @default(0)
  opStatus           VehicleOpStatus @default(EMPTY)
  runState           RunState        @default(STOPPED)
  dailyDepositTarget Decimal         @default(0) @db.Decimal(12, 2)
  routeName          String?         // bus line assignment
  isActive           Boolean         @default(true)
  isBillable         Boolean         @default(false) // false for the 1 free vehicle
  gpsDeviceId        String?         @unique
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  organization   Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  gpsDevice      GpsDevice?         @relation(fields: [gpsDeviceId], references: [id])
  assignments    DriverAssignment[]
  collections    Collection[]
  driverDues     DriverDue[]
  expenses       Expense[]
  fuelEntries    FuelEntry[]
  serviceRecords ServiceRecord[]
  documents      VehicleDocument[]
  accidents      Accident[]
  bookings       Booking[]
  gpsTrips       GpsTrip[]
  geofences      Geofence[]

  @@unique([organizationId, registrationNo])
  @@index([organizationId, vehicleType])
  @@index([organizationId, isActive])
  @@map("vehicles")
}

model Driver {
  id                 String    @id @default(cuid())
  organizationId     String
  name               String
  phone              String?
  nidNumber          String?
  photoUrl           String?
  profession         String?
  kycDocs            Json?     // uploaded doc references
  dailyCollectionTarget Decimal @default(0) @db.Decimal(12, 2)
  isActive           Boolean   @default(true)
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  organization Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  assignments  DriverAssignment[]
  collections  Collection[]
  driverDues   DriverDue[]
  expenses     Expense[]
  bookings     Booking[]

  @@index([organizationId, isActive])
  @@map("drivers")
}

model DriverAssignment {
  id             String    @id @default(cuid())
  organizationId String
  driverId       String
  vehicleId      String
  startDate      DateTime  @default(now())
  endDate        DateTime? // null = currently active
  createdAt      DateTime  @default(now())

  driver  Driver  @relation(fields: [driverId], references: [id], onDelete: Cascade)
  vehicle Vehicle @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  // one active (endDate null) assignment per vehicle enforced at app layer;
  // partial unique index below covers the DB guard
  @@index([organizationId, vehicleId, endDate])
  @@index([organizationId, driverId, endDate])
  @@map("driver_assignments")
}

// ============================================================
// COLLECTIONS / DEPOSITS + DRIVER DUES
// ============================================================
model Collection {
  id               String   @id @default(cuid())
  organizationId   String
  driverId         String
  vehicleId        String
  createdByUserId  String?
  amountCollected  Decimal  @db.Decimal(12, 2)
  dailyTarget      Decimal  @db.Decimal(12, 2) // snapshot of target at time of entry
  discountAmount   Decimal  @default(0) @db.Decimal(12, 2) // ছাড় / waiver
  shortfall        Decimal  @default(0) @db.Decimal(12, 2) // computed & persisted: max(0, target - collected - discount)
  collectionDate   DateTime @db.Date
  enteredAt        DateTime @default(now())        // wall-clock stamp (anti-theft)
  isBackdated      Boolean  @default(false)        // flagged for audit
  smsReceiptSent   Boolean  @default(false)
  createdAt        DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  driver       Driver       @relation(fields: [driverId], references: [id])
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])
  createdBy    User?        @relation("CollectionCreatedBy", fields: [createdByUserId], references: [id])
  driverDue    DriverDue?   // shortfall may spawn a due row
  receipt      Receipt?

  @@index([organizationId, driverId, collectionDate])
  @@index([organizationId, vehicleId, collectionDate])
  @@index([organizationId, collectionDate])
  @@map("collections")
}

model DriverDue {
  id                 String   @id @default(cuid())
  organizationId     String
  driverId           String
  vehicleId          String?
  sourceCollectionId String?  @unique
  dateIncurred       DateTime @db.Date
  amount             Decimal  @db.Decimal(12, 2) // original due
  amountRepaid       Decimal  @default(0) @db.Decimal(12, 2)
  remainingBalance   Decimal  @db.Decimal(12, 2) // amount - amountRepaid (persisted)
  isSettled          Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  organization     Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  driver           Driver       @relation(fields: [driverId], references: [id])
  vehicle          Vehicle?     @relation(fields: [vehicleId], references: [id])
  sourceCollection Collection?  @relation(fields: [sourceCollectionId], references: [id])

  @@index([organizationId, driverId, isSettled])
  @@map("driver_dues")
}

// ============================================================
// EXPENSES / INCOME CATEGORIES
// ============================================================
model ExpenseCategory {
  id             String   @id @default(cuid())
  organizationId String
  name           String   // fuel/তেল, repair, toll, driver_bata, garage_rent...
  direction      TxnDirection @default(EXPENSE)
  isSystem       Boolean  @default(false)
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  expenses     Expense[]

  @@unique([organizationId, name, direction])
  @@map("expense_categories")
}

model Expense {
  id             String   @id @default(cuid())
  organizationId String
  vehicleId      String?
  driverId       String?
  categoryId     String
  amount         Decimal  @db.Decimal(12, 2)
  note           String?
  expenseDate    DateTime @db.Date
  isBackdated    Boolean  @default(false)
  sourceAccidentId String? @unique  // auto-posted accident cost
  createdAt      DateTime @default(now())

  organization Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle?        @relation(fields: [vehicleId], references: [id])
  driver       Driver?         @relation(fields: [driverId], references: [id])
  category     ExpenseCategory @relation(fields: [categoryId], references: [id])
  accident     Accident?       @relation(fields: [sourceAccidentId], references: [id])

  @@index([organizationId, vehicleId, expenseDate])
  @@index([organizationId, categoryId, expenseDate])
  @@map("expenses")
}

// ============================================================
// FUEL LOGS
// ============================================================
model FuelEntry {
  id                String   @id @default(cuid())
  organizationId    String
  vehicleId         String
  fillDate          DateTime @db.Date
  volumeLiters      Decimal  @db.Decimal(10, 3)
  pricePerLiter     Decimal  @db.Decimal(10, 2)
  cost              Decimal  @db.Decimal(12, 2) // volumeLiters * pricePerLiter
  odometerReading   Int
  distanceSinceLast Int?     // odo - prev odo (computed)
  kpl               Decimal? @db.Decimal(8, 2)  // distance / volume
  costPerKm         Decimal? @db.Decimal(8, 2)
  paymentMethod     PaymentMethod @default(CASH)
  isHighway         Boolean? // for city/highway split analytics
  createdAt         DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])

  @@index([organizationId, vehicleId, fillDate])
  @@map("fuel_entries")
}

// ============================================================
// MAINTENANCE / SERVICE
// ============================================================
model ServiceRecord {
  id               String   @id @default(cuid())
  organizationId   String
  vehicleId        String
  serviceType      String
  serviceDate      DateTime @db.Date
  cost             Decimal  @db.Decimal(12, 2)
  odometerAtService Int?
  serviceIntervalKm Int?
  serviceIntervalDays Int?
  partsReplaced    Json?    // free-form list or references to Part
  nextServiceDueDate DateTime? @db.Date
  nextServiceDueKm  Int?
  createdAt        DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])

  @@index([organizationId, vehicleId, serviceDate])
  @@index([organizationId, nextServiceDueDate])
  @@map("service_records")
}

// ============================================================
// DOCUMENT ALERTS
// ============================================================
model VehicleDocument {
  id              String   @id @default(cuid())
  organizationId  String
  vehicleId       String
  docType         DocType
  issueDate       DateTime? @db.Date
  expiryDate      DateTime  @db.Date
  reminderLeadDays Int      @default(30)
  reminderSent    Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  @@unique([organizationId, vehicleId, docType])
  @@index([organizationId, expiryDate])   // powers the expiry-alert scan
  @@map("vehicle_documents")
}

// ============================================================
// PARTS INVENTORY / STOCK / SUPPLIERS / INVOICES
// ============================================================
model Part {
  id             String   @id @default(cuid())
  organizationId String
  name           String
  category       String?
  partNumber     String?
  brand          String?
  location       String?
  stockQuantity  Int      @default(0)
  reorderLevel   Int      @default(0)
  purchasePrice  Decimal  @default(0) @db.Decimal(12, 2)
  salePrice      Decimal  @default(0) @db.Decimal(12, 2)
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization   Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  stockMovements StockMovement[]
  invoiceLines   InvoiceLine[]

  @@unique([organizationId, partNumber])
  @@index([organizationId, category])
  @@map("parts")
}

model StockMovement {
  id             String        @id @default(cuid())
  organizationId String
  partId         String
  type           StockMoveType
  quantity       Int           // signed by convention: +in / -out
  unitCost       Decimal?      @db.Decimal(12, 2)
  reason         String?
  invoiceId      String?
  movedAt        DateTime      @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  part         Part         @relation(fields: [partId], references: [id])
  invoice      Invoice?     @relation(fields: [invoiceId], references: [id])

  @@index([organizationId, partId, movedAt])
  @@map("stock_movements")
}

model Supplier {
  id                String   @id @default(cuid())
  organizationId    String
  name              String
  contact           String?
  outstandingBalance Decimal @default(0) @db.Decimal(12, 2) // credit purchases - payments
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  organization Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  invoices     Invoice[]
  payments     SupplierPayment[]

  @@index([organizationId])
  @@map("suppliers")
}

model SupplierPayment {
  id             String   @id @default(cuid())
  organizationId String
  supplierId     String
  amount         Decimal  @db.Decimal(12, 2)
  method         PaymentMethod @default(CASH)
  paidAt         DateTime @default(now())

  supplier Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  @@index([organizationId, supplierId, paidAt])
  @@map("supplier_payments")
}

model Invoice {
  id             String        @id @default(cuid())
  organizationId String
  kind           InvoiceKind   // PURCHASE (from supplier) or SALE (to customer)
  supplierId     String?
  customerId     String?
  invoiceNo      String
  subtotal       Decimal       @db.Decimal(12, 2)
  discount       Decimal       @default(0) @db.Decimal(12, 2)
  total          Decimal       @db.Decimal(12, 2)
  creditAmount   Decimal       @default(0) @db.Decimal(12, 2) // on-credit portion
  status         InvoiceStatus @default(PENDING)
  invoiceDate    DateTime      @db.Date
  createdAt      DateTime      @default(now())

  organization   Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  supplier       Supplier?       @relation(fields: [supplierId], references: [id])
  customer       Customer?       @relation(fields: [customerId], references: [id])
  lines          InvoiceLine[]
  stockMovements StockMovement[]

  @@unique([organizationId, kind, invoiceNo])
  @@index([organizationId, status])
  @@map("invoices")
}

model InvoiceLine {
  id        String  @id @default(cuid())
  invoiceId String
  partId    String?
  description String?
  quantity  Int
  unitPrice Decimal @db.Decimal(12, 2)
  lineTotal Decimal @db.Decimal(12, 2)

  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  part    Part?   @relation(fields: [partId], references: [id])

  @@index([invoiceId])
  @@map("invoice_lines")
}

// ============================================================
// CUSTOMERS / BOOKINGS / RECEIPTS / ACCIDENTS
// ============================================================
model Customer {
  id                 String   @id @default(cuid())
  organizationId     String
  name               String
  phone              String?
  idDocument         String?
  photoUrl           String?
  profession         String?
  dailyRate          Decimal? @db.Decimal(12, 2) // charging garages
  hasFixedRate       Boolean  @default(false)    // flexible-rate => no due tracking
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  organization     Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  bookings         Booking[]
  invoices         Invoice[]
  partyLedgers     PartyLedgerEntry[]
  chargingSessions ChargingSession[]
  loans            Loan[]

  @@index([organizationId])
  @@map("customers")
}

model Booking {
  id             String        @id @default(cuid())
  organizationId String
  vehicleId      String
  customerId     String?
  driverId       String?
  startDateTime  DateTime
  endDateTime    DateTime?
  startOdometer  Int?
  endOdometer    Int?
  distance       Int?
  fare           Decimal       @default(0) @db.Decimal(12, 2)
  advancePaid    Decimal       @default(0) @db.Decimal(12, 2)
  hourlyRate     Decimal?      @db.Decimal(12, 2)
  baseRate       Decimal?      @db.Decimal(12, 2)
  surcharge      Decimal       @default(0) @db.Decimal(12, 2)
  outstandingDue Decimal       @default(0) @db.Decimal(12, 2) // fare - advance - payments
  status         InvoiceStatus @default(PENDING)
  createdAt      DateTime      @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])
  customer     Customer?    @relation(fields: [customerId], references: [id])
  driver       Driver?      @relation(fields: [driverId], references: [id])
  receipt      Receipt?

  // overlap / double-booking prevention handled via exclusion constraint (see notes)
  @@index([organizationId, vehicleId, startDateTime])
  @@map("bookings")
}

model Receipt {
  id             String   @id @default(cuid())
  organizationId String
  receiptNo      String
  collectionId   String?  @unique
  bookingId      String?  @unique
  amount         Decimal  @db.Decimal(12, 2)
  advance        Decimal  @default(0) @db.Decimal(12, 2)
  duesRemaining  Decimal  @default(0) @db.Decimal(12, 2)
  pdfUrl         String?
  shareLink      String?  @unique
  issuedAt       DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  collection   Collection?  @relation(fields: [collectionId], references: [id])
  booking      Booking?     @relation(fields: [bookingId], references: [id])

  @@unique([organizationId, receiptNo])
  @@map("receipts")
}

model Accident {
  id             String   @id @default(cuid())
  organizationId String
  vehicleId      String
  accidentDate   DateTime @db.Date
  description    String?
  photoEvidence  Json?    // array of URLs
  fineAmount     Decimal  @default(0) @db.Decimal(12, 2)
  damageCost     Decimal  @default(0) @db.Decimal(12, 2)
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])
  expense      Expense?     // auto-posted (fine + damage) as vehicle expense

  @@index([organizationId, vehicleId, accidentDate])
  @@map("accidents")
}

// ============================================================
// LOANS / INSTALLMENTS / PARTY LEDGER
// ============================================================
model Loan {
  id               String   @id @default(cuid())
  organizationId   String
  customerId       String?
  type             LoanType
  principalAmount  Decimal  @db.Decimal(14, 2)
  remainingBalance Decimal  @db.Decimal(14, 2)
  installmentAmount Decimal? @db.Decimal(12, 2)
  installmentCount Int?
  startDate        DateTime @db.Date
  isClosed         Boolean  @default(false)
  createdAt        DateTime @default(now())

  organization Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  customer     Customer?          @relation(fields: [customerId], references: [id])
  installments LoanInstallment[]

  @@index([organizationId, type, isClosed])
  @@map("loans")
}

model LoanInstallment {
  id          String            @id @default(cuid())
  loanId      String
  dueDate     DateTime          @db.Date
  amountDue   Decimal           @db.Decimal(12, 2)
  amountPaid  Decimal           @default(0) @db.Decimal(12, 2)
  paidAt      DateTime?
  status      InstallmentStatus @default(DUE)

  loan Loan @relation(fields: [loanId], references: [id], onDelete: Cascade)

  @@index([loanId, status])
  @@index([dueDate])
  @@map("loan_installments")
}

model PartyLedgerEntry {
  id             String          @id @default(cuid())
  organizationId String
  customerId     String
  entryDate      DateTime        @db.Date
  type           PartyLedgerType // RECEIVABLE / PAYABLE / ADVANCE / SETTLEMENT
  debit          Decimal         @default(0) @db.Decimal(14, 2)
  credit         Decimal         @default(0) @db.Decimal(14, 2)
  runningBalance Decimal         @db.Decimal(14, 2)
  reference      String?
  createdAt      DateTime        @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  customer     Customer     @relation(fields: [customerId], references: [id])

  @@index([organizationId, customerId, entryDate])
  @@map("party_ledger_entries")
}

// ============================================================
// CHARGING SESSIONS
// ============================================================
model ChargingSession {
  id             String         @id @default(cuid())
  organizationId String
  customerId     String
  sessionDate    DateTime       @db.Date
  expectedRate   Decimal        @db.Decimal(12, 2) // snapshot of daily_rate
  amountPaid     Decimal        @db.Decimal(12, 2)
  addedDue       Decimal        @default(0) @db.Decimal(12, 2) // rate - paid (0 if fixed-rate customer)
  status         ChargingStatus @default(PENDING)
  createdAt      DateTime       @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  customer     Customer     @relation(fields: [customerId], references: [id])

  @@index([organizationId, customerId, sessionDate])
  @@map("charging_sessions")
}

// ============================================================
// DOUBLE-ENTRY LEDGER
// ============================================================
model LedgerAccount {
  id             String   @id @default(cuid())
  organizationId String
  code           String   // e.g. 1000 Cash, 4000 Fare Income
  name           String
  direction      TxnDirection?
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  lines        JournalLine[]

  @@unique([organizationId, code])
  @@map("ledger_accounts")
}

model JournalEntry {
  id             String   @id @default(cuid())
  organizationId String
  entryDate      DateTime @db.Date
  reference      String?
  memo           String?
  isBackdated    Boolean  @default(false) // flagged for audit
  vehicleId      String?
  driverId       String?
  createdAt      DateTime @default(now())

  organization Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  lines        JournalLine[]

  @@index([organizationId, entryDate])
  @@map("journal_entries")
}

model JournalLine {
  id             String          @id @default(cuid())
  journalEntryId String
  accountId      String
  type           LedgerEntryType // DEBIT / CREDIT
  amount         Decimal         @db.Decimal(14, 2)

  entry   JournalEntry  @relation(fields: [journalEntryId], references: [id], onDelete: Cascade)
  account LedgerAccount @relation(fields: [accountId], references: [id])

  @@index([journalEntryId])
  @@index([accountId])
  @@map("journal_lines")
}

model Budget {
  id             String   @id @default(cuid())
  organizationId String
  month          DateTime @db.Date // first of month
  category       String
  budgetAmount   Decimal  @db.Decimal(12, 2)
  alertThreshold Decimal  @default(0.8) @db.Decimal(4, 2)
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([organizationId, month, category])
  @@map("budgets")
}

// ============================================================
// GPS DEVICES + POSITIONS + TRIPS + GEOFENCES
// ============================================================
model GpsDevice {
  id             String    @id @default(cuid())
  organizationId String
  imei           String    @unique
  simOperator    String?
  simNumber      String?
  provider       String    @default("Autonemo")
  warrantyStart  DateTime? @db.Date
  ipRating       String?   @default("IP65")
  voltageRange   String?   @default("9-90V")
  lastLat        Decimal?  @db.Decimal(10, 7)
  lastLng        Decimal?  @db.Decimal(10, 7)
  lastUpdateAt   DateTime?
  installStatus  String?
  createdAt      DateTime  @default(now())

  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle?
  positions    LocationPing[]
  trips        GpsTrip[]

  @@index([organizationId])
  @@map("gps_devices")
}

// High-volume time-series table — partition by month in production (see notes)
model LocationPing {
  id             BigInt   @id @default(autoincrement())
  deviceId       String
  recordedAt     DateTime
  latitude       Decimal  @db.Decimal(10, 7)
  longitude      Decimal  @db.Decimal(10, 7)
  speed          Decimal? @db.Decimal(6, 2)
  ignition       Boolean?
  trafficState   String?

  device GpsDevice @relation(fields: [deviceId], references: [id], onDelete: Cascade)

  @@index([deviceId, recordedAt])
  @@map("location_pings")
}

model GpsTrip {
  id             String   @id @default(cuid())
  organizationId String
  vehicleId      String
  deviceId       String?
  startTime      DateTime
  endTime        DateTime?
  durationSec    Int?
  distanceMeters Int?
  maxSpeed       Decimal? @db.Decimal(6, 2)
  avgSpeed       Decimal? @db.Decimal(6, 2)
  pathGeoJson    Json?    // route playback
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])
  device       GpsDevice?   @relation(fields: [deviceId], references: [id])

  @@index([organizationId, vehicleId, startTime])
  @@map("gps_trips")
}

model Geofence {
  id             String   @id @default(cuid())
  organizationId String
  vehicleId      String?
  name           String
  centerLat      Decimal? @db.Decimal(10, 7)
  centerLng      Decimal? @db.Decimal(10, 7)
  radiusMeters   Int?
  polygonGeoJson Json?
  alertOnEnter   Boolean  @default(true)
  alertOnExit    Boolean  @default(true)
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle?     @relation(fields: [vehicleId], references: [id])

  @@index([organizationId])
  @@map("geofences")
}

// ============================================================
// SUBSCRIPTION / BILLING (POSTPAID, bKASH)
// ============================================================
model SubscriptionPlan {
  id                  String   @id @default(cuid())
  code                String   @unique  // e.g. LIGHT_MONTHLY, HEAVY_YEARLY
  vehicleClass        String   // "2-wheeler/light" vs "car/bus/truck/micro"
  baseMonthlyPrice    Decimal  @db.Decimal(10, 2) // 350 or 500
  billingTermMonths   Int      // 1/3/6/12
  perMonthEffective   Decimal  @db.Decimal(10, 2) // 350/315/298/280
  discountAmount      Decimal  @default(0) @db.Decimal(10, 2)
  isActive            Boolean  @default(true)

  subscriptions Subscription[]

  @@map("subscription_plans")
}

model Subscription {
  id             String   @id @default(cuid())
  organizationId String
  planId         String
  billableVehicleCount Int   @default(0)
  startDate      DateTime @db.Date
  currentPeriodStart DateTime @db.Date
  currentPeriodEnd   DateTime @db.Date
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())

  organization Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  plan         SubscriptionPlan @relation(fields: [planId], references: [id])

  @@index([organizationId, isActive])
  @@map("subscriptions")
}

model BillingInvoice {
  id             String        @id @default(cuid())
  organizationId String
  billingPeriod  DateTime      @db.Date // first of the billed month
  lineItems      Json          // usage snapshot: vehicles x plan price
  totalAmount    Decimal       @db.Decimal(12, 2)
  status         BillingStatus @default(PENDING)
  dueDate        DateTime      @db.Date // 7-day window from generation
  generatedAt    DateTime      @default(now())

  organization Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  payments     BillingPayment[]

  @@unique([organizationId, billingPeriod])
  @@index([organizationId, status])
  @@map("billing_invoices")
}

model BillingPayment {
  id               String        @id @default(cuid())
  organizationId   String
  billingInvoiceId String
  amount           Decimal       @db.Decimal(12, 2)
  method           PaymentMethod @default(BKASH)
  gatewayTxnId     String?       @unique
  bkashNumber      String?
  paidAt           DateTime      @default(now())

  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  invoice      BillingInvoice @relation(fields: [billingInvoiceId], references: [id])

  @@index([organizationId, billingInvoiceId])
  @@map("billing_payments")
}

// ============================================================
// SMS LOG + AUDIT LOG
// ============================================================
model SmsLog {
  id             String    @id @default(cuid())
  organizationId String
  recipientPhone String
  type           SmsType
  messageBody    String
  status         SmsStatus @default(QUEUED)
  relatedEntity  String?   // "collection:<id>" / "document:<id>" etc.
  gatewayRef     String?
  sentAt         DateTime?
  createdAt      DateTime  @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId, type, status])
  @@index([organizationId, createdAt])
  @@map("sms_logs")
}

model AuditLog {
  id             String      @id @default(cuid())
  organizationId String
  userId         String?
  action         AuditAction
  entityType     String      // "Collection", "Vehicle", ...
  entityId       String?
  before         Json?
  after          Json?
  ipAddress      String?
  createdAt      DateTime    @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User?        @relation(fields: [userId], references: [id])

  @@index([organizationId, entityType, entityId])
  @@index([organizationId, createdAt])
  @@map("audit_logs")
}
```

#### 4.1 Raw-migration constraints (Prisma can't express these)
- **RLS backstop:** `USING (organization_id = current_setting('app.current_org')::text)` on every tenant table; app sets `SET app.current_org = $orgId` per request/transaction.
- **Double-booking:** `EXCLUDE USING gist` on `bookings(vehicle_id WITH =, tstzrange(start_date_time, end_date_time) WITH &&)`.
- **One active assignment per vehicle:** `CREATE UNIQUE INDEX ON driver_assignments(vehicle_id) WHERE end_date IS NULL`.
- **`LocationPing`:** monthly range partitions on `recordedAt` (or TimescaleDB hypertable). `BigInt` PK is intentional.

#### 4.2 Cross-org global tables
`SubscriptionPlan` (platform price book) and the marketplace moderation surface are platform-owned and deliberately carry **no** `organizationId`.

---

### 5. REST API Surface

**Base URL:** `https://api.amar-auto.com/v1` · **Auth:** `Authorization: Bearer <access_token>`

**Conventions**
- Access token 15 min (claims `sub, org, role, device_id, scope[], plan, soft_locked, iat, exp`); refresh 60 d, rotated, bound to `device_id`.
- Every resource is `org`-scoped server-side; clients never pass `owner_id`.
- **i18n:** `Accept-Language: bn|en` (default `bn`), `?lang=` override; enum values stay ASCII, list responses carry `{value, label}`.
- **Pagination:** cursor `?limit=25&cursor=…` (legacy `?page=&per_page=`), envelope `{ "data": [...], "meta": { "next_cursor", "has_more", "total" } }`.
- **Common filters:** `from, to, vehicle_id, driver_id, category, status, q, sort`.
- **Errors:** `{ "error": { "code", "message", "fields" } }`. Status: `401` refresh, `402` soft-lock, `403` scope, `409` conflict, `422` validation, `429` OTP/rate-limit.
- **Offline:** mutating requests accept `Idempotency-Key` + `client_id` + `client_created_at`; `/sync/batch` returns `server_id` mapping.
- **Money:** string decimal `"amount": "150.00"` BDT (never floats).

#### A. Auth & Onboarding `/auth`
| METHOD | Path | Purpose | Key request fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/auth/send-otp` | Start signup/login; send OTP SMS | `phone`, `purpose`(signup\|login\|reset_pin), `device_id`, `device_name` | `{ otp_token, expires_in:120, resend_after:30, channel:"sms" }` | none (rate-limited IP+phone) |
| POST | `/auth/verify-otp` | Verify OTP → issue tokens (or signup ticket) | `otp_token`, `otp_code`, `device_id` | `{ verified, is_new_user, signup_ticket?, access_token?, refresh_token?, user? }` | none |
| POST | `/auth/signup` | Complete new-account after OTP | `signup_ticket`, `name`, `business_mode`, `terms_accepted:true`, `lang` | `{ user, org, access_token, refresh_token }` | signup_ticket |
| POST | `/auth/set-pin` | Set/change 4–6 digit PIN | `pin`, `pin_confirm`, `current_pin?` | `{ ok:true }` | Bearer (fresh) |
| POST | `/auth/pin-login` | Quick login on known device | `phone`\|`device_id`, `pin` | `{ access_token, refresh_token, user }` | none (device has prior refresh; lockout→OTP) |
| POST | `/auth/password-login` | Alt credential | `phone`, `password` | `{ access_token, refresh_token, user }` | none |
| POST | `/auth/set-password` | Set/change password | `password`, `current_password?` | `{ ok }` | Bearer |
| POST | `/auth/refresh` | Rotate access token | `refresh_token` | `{ access_token, refresh_token, expires_in }` | refresh token |
| POST | `/auth/logout` | Revoke this device's refresh token | `refresh_token` | `204` | Bearer |
| GET | `/auth/devices` | List logged-in devices | — | `[{ device_id, name, last_active_at, current, ip }]` | Bearer |
| DELETE | `/auth/devices/{device_id}` | Remote logout a device | — | `204` | owner/self |
| GET | `/auth/me` | Session/user + scopes + plan/bill_status | — | `{ user, org, role, scopes[], plan, bill_status, soft_locked }` | Bearer |

*Notes: OTP is primary; PIN/password are conveniences. `send-otp` returns `429` w/ `resend_after` on flood. Soft-locked accounts still verify-otp but token carries `soft_locked:true`.*

#### B. Org / Profile `/org`, `/profile`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/org` | Owner account/org settings | — | `{ id,name,business_mode,verticals_enabled[],bkash_number,plan,bill_status,terms_accepted_at,address,currency,lang }` | member |
| PATCH | `/org` | Update org / business_mode / presets | `name`,`business_mode`,`verticals_enabled[]`,`bkash_number`,`lang`,`default_currency` | updated org | owner |
| GET | `/profile` | Current user profile | — | `{ id,name,phone,email,photo_url,role,pin_set,password_set,lang }` | self |
| PATCH | `/profile` | Update own profile | `name`,`email`,`photo_url`,`lang` | updated | self |
| GET | `/org/dashboard` | Smart Dashboard aggregate (today) | `?date=` | `{ today_collections,today_expenses,today_profit,active_vehicles,running_vehicles,unread_qr,overdue_docs,driver_dues_total }` | member |
| POST | `/org/backup/export` | Trigger cloud backup / export | `format`(json\|encrypted) | `{ job_id, status }` | owner |

#### C. Users, Roles & Staff Permissions `/users`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/users` | List staff | `role`,`status` | paginated `[{ id,name,phone,role,permissions[],status }]` | owner\|manager |
| POST | `/users` | Invite/create staff | `name`,`phone`,`role`,`permissions[]` | created user + invite OTP flow | owner |
| GET | `/users/{id}` | Staff detail | — | user | owner\|self |
| PATCH | `/users/{id}` | Update role/permissions | `role`,`permissions[]`,`status` | updated | owner |
| DELETE | `/users/{id}` | Remove staff | — | `204` | owner |
| GET | `/roles` | Role catalog + permission matrix | — | `[{ role, default_permissions[] }]` | member |
| GET | `/permissions` | Available permission keys | — | `[{ key,label_bn,label_en,group }]` | owner |

#### D. Vehicles & Fleet + QR `/vehicles`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/vehicles` | Fleet list / calendar | `vehicle_type`,`status`,`availability`,`running`,`q`,`assigned_driver_id` | paginated summaries incl. `profit_loss`, live `status` | member |
| POST | `/vehicles` | Add vehicle | `registration_no`,`vehicle_type`,`model`,`voltage_range?`,`current_odometer`,`assigned_driver_id?`,`daily_deposit_target?`,`route?` | vehicle | owner\|manager |
| GET | `/vehicles/{id}` | Vehicle profile | — | full vehicle: docs expiry, odometer, gps_device_id, driver, `profit_loss`, counts | member |
| PATCH | `/vehicles/{id}` | Edit | any writable field | updated | owner\|manager |
| DELETE | `/vehicles/{id}` | Deactivate (soft) | — | `204` | owner |
| GET | `/vehicles/{id}/pnl` | Per-vehicle P&L | `from`,`to` | `{ revenue, expenses_by_category{}, net_profit }` | member |
| GET | `/vehicles/{id}/history` | Repair+service+accident timeline | `type` | paginated events | member |
| GET | `/vehicles/{id}/documents` | Document list + expiry | — | `[{ doc_type,expiry_date,status,reminder_offset_days }]` | member |
| PUT | `/vehicles/{id}/documents/{doc_type}` | Set/renew document | `issue_date`,`expiry_date`,`reminder_lead_time` | doc | owner\|manager |
| POST | `/vehicles/{id}/accidents` | Log accident (auto-posts expense) | `date`,`description`,`photos[]`,`fine_amount?`,`damage_cost?` | accident + created expense refs | member |
| GET | `/vehicles/{id}/qr` | Get/generate vehicle QR + custom text | — | `{ qr_payload, qr_image_url, custom_text }` | member |
| PATCH | `/vehicles/{id}/qr` | Edit custom QR text | `custom_text` | updated | owner\|manager |
| POST | `/qr/print` | Bulk QR print sheet | `vehicle_ids[]`\|`all:true` | `{ pdf_url }` | member |
| GET | `/qr/dashboard` | Smart QR dashboard | — | `{ total_scans,unread,by_type{...} }` | member |
| GET | `/qr/messages` | Passenger messages/complaints inbox | `type`,`read`,`vehicle_id` | paginated anonymous messages | member |
| PATCH | `/qr/messages/{id}` | Mark read / reply (anon relay) | `read`,`reply_text?` | updated | member |
| POST | `/public/qr/{qr_payload}/scan` | (public) passenger scan → verify + open contact | `passenger_msg?`,`type` | `{ vehicle:{reg,type,verified}, driver:{name,photo}, contact_token }` | **public/anon** |

#### E. Drivers & KYC `/drivers`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/drivers` | Driver list | `status`,`assigned_vehicle_id`,`has_dues`,`q` | paginated `[{ id,name,phone,assigned_vehicle,outstanding_dues,daily_collection_target,status }]` | member |
| POST | `/drivers` | Add driver | `name`,`phone`,`profession`,`daily_collection_target`,`assigned_vehicle_id?` | driver | owner\|manager |
| GET | `/drivers/{id}` | Profile + dues summary | — | driver incl. `total_deposited,total_discount,outstanding_dues` | member |
| PATCH | `/drivers/{id}` | Edit | writable fields | updated | owner\|manager |
| POST | `/drivers/{id}/kyc` | Upload KYC docs | `nid_no`,`photo`,`documents[]` | `{ kyc_status }` | owner\|manager |
| GET | `/drivers/{id}/ledger` | Driver & dues ledger | `from`,`to` | `[{ date,deposit,due,discount,running_balance }]` | member |
| POST | `/drivers/{id}/assignments` | Assign to vehicle | `vehicle_id`,`effective_date` | assignment | owner\|manager |

#### F. Assignments `/assignments`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/assignments` | List current/historical | `vehicle_id`,`driver_id`,`active` | paginated | member |
| POST | `/assignments` | Create assignment | `vehicle_id`,`driver_id`,`start_date` | assignment | owner\|manager |
| PATCH | `/assignments/{id}` | End/transfer | `end_date` | updated | owner\|manager |

#### G. Daily Collections & Receipts `/collections`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/collections` | One-tap daily collection entry | `driver_id`,`vehicle_id`,`amount_collected`,`collection_date?`,`discount_amount?`,`note?`,`send_sms?`,`client_id`,`Idempotency-Key` | `{ collection, shortfall, running_due_balance, receipt:{id,pdf_url,image_url,share_link}, backdated_flag }` | write:txn |
| GET | `/collections` | List collections | `driver_id`,`vehicle_id`,`from`,`to`,`backdated` | paginated incl. `shortfall`,`sms_receipt_sent` | member |
| GET | `/collections/{id}` | Detail | — | collection + receipt | member |
| PATCH | `/collections/{id}` | Correct (audit-logged) | `amount_collected`,`discount_amount`,`note` | updated | owner\|manager |
| DELETE | `/collections/{id}` | Void (reversing entry) | `reason` | `204` | owner |
| GET | `/collections/{id}/receipt` | Regenerate/fetch receipt | `format`(pdf\|image) | `{ pdf_url,image_url,share_link }` | member |
| POST | `/collections/{id}/send-sms` | Resend SMS receipt | — | `{ sms_id, status }` | write:txn |

*Logic: `amount_collected < daily_target` → `DriverDue` auto-created; over-deposit auto-reduces prior dues; every entry timestamped.*

#### H. Trips / Bookings / Rentals `/trips`, `/bookings`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/bookings` | Booking calendar | `vehicle_id`,`from`,`to`,`status` | paginated bookings + availability | member |
| POST | `/bookings` | Create booking (double-book → 409) | `vehicle_id`,`customer_id`,`driver_id?`,`start_datetime`,`end_datetime`,`fare`,`advance_paid?` | booking | member |
| GET | `/bookings/{id}` | Detail | — | booking + `outstanding_due` | member |
| PATCH | `/bookings/{id}` | Update/cancel | fields, `status` | updated | member |
| POST | `/trips/start` | One-tap START (রিলিজ) | `vehicle_id`,`customer_id?`,`driver_id?`,`start_odometer?`,`hourly_rate?`,`base_rate?` | `{ trip_id, start_time }` | write:txn |
| POST | `/trips/{id}/end` | One-tap END (এন্ড) → compute bill | `end_odometer?`,`surcharge?` | `{ distance, elapsed_hours, fare, invoice:{id,pdf,share_link} }` | write:txn |
| GET | `/trips` | Trip/handover list | `vehicle_id`,`driver_id`,`from`,`to` | paginated | member |
| GET | `/trips/{id}` | Trip detail | — | trip + invoice | member |

*Hourly bill = `base_rate + hourly_rate×hours + surcharge`; `outstanding_due = fare − (advance + payments)`.*

#### I. Ledger — Expenses / Income `/transactions`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/transactions` | Money history (double-entry) | `type`,`category`,`vehicle_id`,`driver_id`,`from`,`to`,`backdated`,`q` | paginated `[{ id,date,type,category{value,label},amount,debit_account,credit_account,vehicle,note,backdated_flag }]` | member |
| POST | `/transactions/expense` | Add expense | `vehicle_id?`,`driver_id?`,`category`,`amount`,`date?`,`note?`,`client_id`,`Idempotency-Key` | txn | write:txn |
| POST | `/transactions/income` | Add income | `vehicle_id?`,`category`,`amount`,`date?`,`source`,`note?` | txn | write:txn |
| POST | `/transactions/voice` | Voice entry (audio → parsed) | `audio`(file),`lang` | `{ draft_txn, confidence }` (confirm via POST) | write:txn |
| GET | `/transactions/{id}` | Detail | — | txn incl. double-entry pair | member |
| PATCH | `/transactions/{id}` | Edit (audit) | fields | updated | owner\|manager |
| DELETE | `/transactions/{id}` | Reverse | `reason` | `204` | owner |
| GET | `/categories` | Expense/income categories (khat) | `type` | `[{ id,value,label,type }]` | member |
| POST | `/categories` | Custom category | `name`,`type` | category | owner\|manager |
| GET | `/budgets` | Monthly budgets + actuals | `month` | `[{ category,budget_amount,actual_amount,alert_threshold,over }]` | member |
| PUT | `/budgets` | Set category budget | `month`,`category`,`budget_amount`,`alert_threshold` | budget | owner\|manager |

#### J. Fuel `/fuel`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/vehicles/{id}/fuel` | Fuel log | `from`,`to` | paginated `[{ fill_date,volume_liters,price_per_liter,cost,odometer,distance_since_last,kpl,cost_per_km,payment_method }]` | member |
| POST | `/vehicles/{id}/fuel` | Add fill-up (auto KPL/cost-per-km) | `volume_liters`,`price_per_liter`,`odometer_reading`,`payment_method`,`fill_date?`,`city_highway_split?` | entry w/ computed mileage; posts fuel expense | write:txn |
| PATCH | `/fuel/{id}` | Edit | fields | updated | owner\|manager |
| GET | `/vehicles/{id}/fuel/analytics` | Fuel analytics | `from`,`to` | `{ avg_fillup_cost,kpl_avg,cost_per_km,city_pct,highway_pct,price_trend[] }` | member |

#### K. Maintenance & Documents `/maintenance`, `/documents`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/vehicles/{id}/services` | Service/repair history | `from`,`to` | paginated `[{ service_type,date,cost,odometer_at_service,parts_replaced[],next_service_due,overdue_flag }]` | member |
| POST | `/vehicles/{id}/services` | Log service (posts expense) | `service_type`,`date`,`cost`,`odometer_at_service`,`service_interval?`,`parts_replaced[]?` | service | write:txn |
| PATCH | `/services/{id}` | Edit | fields | updated | owner\|manager |
| GET | `/maintenance/dashboard` | Reminders + costs | — | `{ due_soon[],overdue[],total_cost,ytd_cost,avg_cost }` | member |
| GET | `/document-alerts` | All doc expiry alerts across fleet | `status`,`doc_type`,`vehicle_id` | paginated `[{ vehicle,doc_type,expiry_date,days_left,status }]` | member |
| GET | `/reminders` | Unified service+document+GPS reminders | `source`,`read` | paginated | member |
| PATCH | `/reminders/{id}` | Ack/mark read | `read` | updated | member |

#### L. Inventory & Parts `/inventory`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/parts` | Parts stock list | `category`,`brand`,`location`,`reorder_needed`,`q` | paginated `[{ id,name,part_number,brand,stock_quantity,reorder_level,reorder_flag,purchase_price,sale_price,location }]` | member |
| POST | `/parts` | Add part | `name`,`category`,`part_number`,`brand`,`reorder_level`,`purchase_price`,`sale_price`,`location`,`opening_stock` | part | write:txn |
| GET | `/parts/{id}` | Detail + movement history | — | part + `[stock_movements]` | member |
| PATCH | `/parts/{id}` | Edit | fields | updated | owner\|manager |
| GET | `/parts/reorder` | Reorder-needed report | — | `[{ part, shortfall }]` | member |
| GET | `/parts/dead-stock` | Slow-moving/dead stock | `days` | `[{ part, last_moved_at }]` | member |

**Stock Movements `/stock-movements`**
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/stock-movements` | Ledger of stock in/out | `part_id`,`type`,`from`,`to` | paginated `[{ part,type,qty,ref,date }]` | member |
| POST | `/stock-movements` | Manual adjust / write-off / count | `part_id`,`type`,`qty`,`reason`,`counted_qty?` | movement + new `stock_quantity` | write:txn |

**Suppliers `/suppliers`**
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/suppliers` | List | `has_dues`,`q` | paginated `[{ id,name,contact,outstanding_balance }]` | member |
| POST | `/suppliers` | Add | `name`,`contact` | supplier | write:txn |
| GET | `/suppliers/{id}` | Profile + ledger | — | supplier + `[ledger_entries]`, `outstanding_balance` | member |
| PATCH | `/suppliers/{id}` | Edit | fields | updated | owner\|manager |
| POST | `/suppliers/{id}/payments` | Pay supplier due | `amount`,`date`,`method` | `{ payment, new_balance }` | write:txn |

**Purchases & Sales `/purchases`, `/sales`**
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/purchases` | Purchase invoice (multi-item, credit) | `supplier_id`,`line_items[{part_id,qty,price}]`,`discount?`,`credit_amount?`,`date?` | `{ invoice,total,status,receipt_pdf,stock_updated }` | write:txn |
| GET | `/purchases` | List | `supplier_id`,`status`,`from`,`to` | paginated | member |
| GET | `/purchases/{id}` | Detail + printable | — | invoice | member |
| POST | `/sales` | Sale invoice (multi-item, credit) | `customer_id`,`line_items[]`,`discount?`,`credit_amount?` | `{ invoice,total,status,receipt_pdf,share_link,stock_updated }` | write:txn |
| GET | `/sales` | List | `customer_id`,`status`,`from`,`to` | paginated | member |
| GET | `/sales/{id}` | Detail | — | invoice | member |
| POST | `/purchases/{id}/returns` · `/sales/{id}/returns` | Return items | `line_items[]`,`reason` | return + stock movement | write:txn |
| GET | `/inventory/reports` | Purchases / payables / reorder / dead-stock | `type`,`from`,`to` | report | member |

#### M. Customers / Parties, Loans & Charging `/customers`, `/loans`, `/charging`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/customers` | CRM list | `type`,`has_dues`,`q` | paginated `[{ id,name,phone,outstanding_dues,advance,receivable }]` | member |
| POST | `/customers` | Add | `name`,`phone`,`id_document?`,`photo?`,`profession?`,`daily_rate?`,`has_fixed_rate?` | customer | write:txn |
| GET | `/customers/{id}` | Profile + history | — | customer + history | member |
| PATCH | `/customers/{id}` | Edit | fields | updated | member |
| GET | `/customers/{id}/party-ledger` | Party ledger (পাওনা/দেনা/অগ্রিম/পরিশোধ) | `from`,`to` | `[{ date,debit,credit,type,running_balance }]` + `{ receivable,advance,settled,net }` | member |
| POST | `/customers/{id}/party-ledger` | Post party entry | `type`(paona\|dena\|advance\|porishodh),`amount`,`date`,`note?` | entry + running_balance | write:txn |
| GET | `/loans` | Loans/installments | `type`,`status` | paginated `[{ id,type,principal,remaining_balance,next_installment }]` | member |
| POST | `/loans` | Create loan/HP | `type`(given\|taken\|hp),`principal_amount`,`party_id?`,`installment_amount`,`schedule[]` | loan | write:txn |
| GET | `/loans/{id}` | Detail + schedule + payments | — | loan | member |
| POST | `/loans/{id}/payments` | Record installment | `amount`,`date` | `{ payment, remaining_balance }` | write:txn |
| GET | `/charging/sessions` | Daily charging collections | `customer_id`,`from`,`to`,`status` | paginated `[{ customer,date,amount_paid,expected_rate,shortfall,status }]` | member |
| POST | `/charging/sessions` | Log charge session | `customer_id`,`amount_paid`,`date?` | `{ session, new_dues }` | write:txn |
| GET | `/charging/customers/{id}/bill` | Charging bill/dues | `period`(daily\|monthly) | `{ charge_amount, due_balance }` | member |

*`new_dues = previous_dues + (daily_rate − amount_paid)`; `has_fixed_rate=false` (flexible) → all income, no dues.*

#### N. Reports `/reports`
All accept `from`, `to`, `vehicle_id?`, `driver_id?`, `category?`, and `?format=json|pdf|excel` (non-json → `{ export_job_id }` or `{ file_url }`).
| METHOD | Path | Purpose | Response (json) | Auth |
|---|---|---|---|---|
| GET | `/reports/income-expense` | Income vs expense summary + trend | `{ total_income,total_expense,net,by_category[],series[] }` | member |
| GET | `/reports/pnl` | P&L (overall or per vehicle) | `{ revenue,cogs,expenses_by_category[],gross_profit,net_profit }` | member |
| GET | `/reports/balance-sheet` | Balance sheet (double-entry) | `{ assets[],liabilities[],equity[],totals }` | accountant:read |
| GET | `/reports/trial-balance` | Trial balance | `{ accounts:[{account,debit,credit}],totals:{debit,credit,balanced} }` | accountant:read |
| GET | `/reports/driver-dues` | Driver dues aging | `[{ driver,total_deposited,outstanding_dues,discount,collection_rate }]` | member |
| GET | `/reports/calendar` | Day-by-day income/expense | `[{ date,income,expense,net }]` | member |
| GET | `/reports/analytics` | Trends / sources / collection rate | `{ series[],sources[],collection_rate }` | member |
| GET | `/reports/money-history` | Filterable chronological log (alias of `/transactions`) | paginated | member |
| POST | `/reports/export` | Kick off PDF/Excel export | body `{ report,params,format }` → `{ export_job_id }` | member |
| GET | `/exports/{job_id}` | Poll export status / download | `{ status,file_url,expires_at }` | member |

#### O. GPS Tracking `/gps`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/gps/devices` | Trackers list + mapping | `mapped`,`vehicle_id` | `[{ device_id,imei,sim_operator,mapped_vehicle_id,last_update_time,install_status }]` | member |
| POST | `/gps/devices/{id}/map` | Map device → vehicle | `vehicle_id` | updated | owner\|manager |
| GET | `/gps/live` | Live positions (mixed fleet, ~10s) | `vehicle_ids[]?`,`bbox?` | `[{ vehicle_id,lat,lng,speed,ignition,traffic_state,ts,status }]` | member |
| GET | `/gps/vehicles/{id}/live` | Single live position | — | position | member |
| GET | `/gps/vehicles/{id}/history` | Route history/playback | `from`,`to` | `{ points:[{lat,lng,speed,ts}],distance,duration,max_speed,avg_speed }` | member |
| GET | `/gps/vehicles/{id}/trips` | Trip report list | `from`,`to` | paginated `[{ trip_id,start,end,distance,duration,max_speed }]` | member |
| GET | `/gps/trips/{trip_id}` | Trip playback detail | — | trip + path | member |
| POST | `/gps/vehicles/{id}/immobilizer` | Remote engine lock/unlock | `action`(lock\|unlock),`pin` | `{ command_id, status }` | owner (fresh auth) |
| GET | `/gps/alerts` | Smart alerts feed | `type`,`vehicle_id`,`read`,`from`,`to` | paginated `[{ type,vehicle,value,location,ts,message,read }]` | member |
| PATCH | `/gps/alerts/{id}` | Mark read | `read` | updated | member |
| GET | `/gps/geofences` | List geofences | `vehicle_id` | `[{ id,name,shape,coordinates,radius,alert_on_enter,alert_on_exit }]` | member |
| POST | `/gps/geofences` | Create geofence | `name`,`vehicle_id?`,`shape`,`coordinates`,`radius`,`alert_on_enter`,`alert_on_exit` | geofence | owner\|manager |
| PATCH/DELETE | `/gps/geofences/{id}` | Edit/remove | fields | updated/`204` | owner\|manager |
| POST | `/gps/orders` | Order tracker hardware (COD) | `customer_name`,`phone`,`address`,`vehicle_type`,`plan_term`,`device_qty` | `{ order_id, status:"ordered" }` | member |
| GET | `/gps/orders/{id}` | Order status (ordered→called→installed→live) | — | order | member |

#### P. Billing & Subscription `/billing`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/billing/plans` | Plan catalog (freemium + GPS tiers/terms) | `?category` | `[{ plan_id,vehicle_category,base_monthly_price,terms:[{months,per_month_price,discount}],features[] }]` | member |
| GET | `/billing/subscription` | Current subscription + soft-lock state | — | `{ plan,vehicles_billable,free_vehicle_used,status,soft_locked }` | member |
| POST | `/billing/subscription` | Choose/upgrade plan (postpaid) | `plan_id`,`billing_term`,`vehicle_ids[]?` | subscription | owner |
| GET | `/billing/usage` | Current-period usage meter | `period?` | `{ period,vehicles_active,line_items[],projected_total }` | owner |
| GET | `/billing/invoices` | Postpaid invoices | `status`,`from`,`to` | paginated `[{ id,billing_period,total_amount,status,due_date }]` | owner |
| GET | `/billing/invoices/{id}` | Invoice detail + line items | — | invoice + `pdf_url` | owner |
| POST | `/billing/invoices/{id}/pay` | Initiate bKash payment | `method`(bkash\|nagad\|rocket),`msisdn?` | `{ payment_id, gateway_redirect_url \| bkash_execute_ref, status:"initiated" }` | owner |
| GET | `/billing/payments/{id}` | Poll payment status | — | `{ status(initiated\|success\|failed), invoice_id }` | owner |
| POST | `/webhooks/bkash` | **bKash payment webhook** (gateway→server) | signed: `paymentID`,`trxID`,`amount`,`invoice_ref`,`status` | `200 {received:true}`; verify signature, mark paid, lift soft-lock | **gateway auth** (HMAC + IP allowlist, not user JWT) |

*Rules: 1 vehicle free forever; extras billable monthly/yearly; 7-day payment window; non-payment → `bill_status=overdue` → paid features return `402` (soft-lock, no deletion).*

#### Q. Notifications, SMS & Support `/notifications`, `/sms`, `/support`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/notifications` | In-app/push feed | `read`,`type` | paginated `[{ id,type,title,body,ref,read,ts }]` | member |
| PATCH | `/notifications/{id}` | Mark read | `read` | updated | member |
| POST | `/notifications/read-all` | Mark all read | — | `{ updated }` | member |
| POST | `/devices/push-token` | Register FCM/APNs token | `token`,`platform`(android\|ios),`device_id` | `{ ok }` | member |
| GET | `/sms/logs` | Sent SMS history | `type`,`recipient`,`from`,`to` | paginated `[{ id,recipient_phone,type,message_body,sent_at,status }]` | member |
| POST | `/sms/send` | Manual SMS (dues reminder / bill link) | `recipient_phone`,`type`,`ref_id?`,`message?` | `{ sms_id, status }` | write:txn |
| GET | `/support/tickets` | Support chat/tickets | `status` | paginated | member |
| POST | `/support/tickets` | Open ticket / chat message | `message`,`channel`(chat\|phone) | ticket | member |
| POST | `/support/contact` | Contact form (Name*, Mobile, Message*) | `name`,`mobile?`,`message` | `{ received:true }` | member/public |

#### R. Cross-cutting: Offline Sync & Marketplace
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/sync/batch` | Offline queue flush (bulk mutations) | `operations[{ op_id,client_id,resource,method,payload,client_created_at }]` | `{ results:[{ op_id,status,server_id?,error? }], server_time }` | member |
| GET | `/sync/changes` | Pull server-side changes since cursor | `since`,`resources[]` | `{ changes[], next_cursor }` | member |
| GET | `/marketplace/listings` | Public verified feed | `type`,`q` | paginated approved listings | member |
| POST | `/marketplace/listings` | Post ad (pending moderation) | `type`,`title`,`description`,`photos[]`,`map_location`,`price` | `{ listing, approval_status:"pending" }` | member |
| GET | `/marketplace/my-listings` | Own listings + approval status | — | paginated | member |

**Public/anon surface (no JWT):** `/public/qr/{payload}/scan` and `/webhooks/bkash` (HMAC-signed gateway callback).

---

### 6. Tech Stack & Architecture

**Guiding principle:** everything the ad promises is one vehicle-agnostic double-entry accounting core with vertical presets on top. Build the ledger + multi-tenancy correctly once; GPS, inventory, rental, charging are modules writing into the same `Transaction`/`Ledger` spine. Reuse the owner's Node/TS/Prisma/PostgreSQL/React muscle memory — no second backend language.

#### 6.1 Component choices
| Concern | Choice | Why |
|---|---|---|
| Backend framework | **NestJS (Node + TS)** | Module boundaries for a multi-tenant multi-module SaaS; DI for testability; `class-validator`; guards for role/tenant; free Swagger/OpenAPI → mobile contract. (Fastify + tsoa is the lighter alt.) |
| API style | **REST** (not GraphQL) | Simpler for a low-literacy-market app; trivially cacheable; device/GPS webhooks & bKash callbacks are REST anyway |
| ORM | **Prisma** | Already in stack; Prisma Migrate for evolution; drop to `$queryRaw` for ledger rollups & reporting |
| Multi-tenancy | Single DB + mandatory `organizationId` + Prisma client extension auto-injecting tenant filter + **Postgres RLS** backstop | Never rely on devs remembering `where` |
| Auth / OTP | Phone+OTP primary; PIN/password (Argon2) secondary; JWT access + rotating per-device refresh; roll-your-own OTP in Redis (6-digit hashed, TTL, attempt counter, rate limit) | Control Bengali SMS copy; cheaper than identity providers |
| SMS gateway (BD) | **SSL Wireless** (bank-grade, branded sender) for OTP + billing; bulk alts (Reve, Alpha SMS, MIMSMS, bulksmsbd, greenweb) behind an `SmsProvider` interface with failover | Avoid Twilio (too expensive for BD OTP); deliverability is a churn driver |
| Web frontend | **React + TS + Vite**, **TanStack Query**, **Tailwind + shadcn/ui**, **React Hook Form + Zod**, **ECharts/Recharts** | ECharts handles Bengali labels + large series; admin panel is a role-gated route-set |
| Mobile | **React Native + Expo** (over Flutter) | Shares TS DTO types, Zod validation, business-rule utils across web/mobile/server; Expo OTA updates, EAS builds, push, camera/mic/location modules |
| Bengali fonts | Bundle **Noto Sans Bengali / SolaimanLipi / Hind Siliguri** everywhere incl. PDFs | Don't trust device fonts; verify complex-script shaping on real low-end Android |
| GPS ingestion | **Decoupled** Node/Fastify (or Go) service. Mode 1: pull/proxy Autonemo API. Mode 2: **Traccar** (open-source, 200+ protocols: GT06/JT808/Concox) for own devices | Different scaling profile — high-write, low-value-per-write time series |
| GPS storage | **TimescaleDB** hypertable for `LocationPing` (Postgres extension) | Never put 10s pings in transactional tables |
| Live delivery | **WebSocket** (or MQTT via EMQX); stream consumer computes geofence/overspeed/ignition → `Alert` rows → push+SMS | App subscribes only to on-screen vehicles |
| PDF/PNG | HTML template → **Puppeteer** or **Gotenberg** (Dockerized HTML→PDF) | Correct Bengali rendering where PDFKit struggles |
| Excel | **ExcelJS** | Styled `.xlsx` |
| Object storage | **Cloudflare R2** or **Backblaze B2** | No egress fees; signed URLs for shareable links |
| Payments | **bKash PGW / Tokenized Checkout** (Grant→Create→Execute→Query/Callback), token caching, idempotency; behind `PaymentProvider` for Nagad/Rocket | Postpaid: confirm server-side, never on redirect alone |
| Background jobs | **BullMQ** (Redis) repeatable/cron; worker as separate container | Reminders, SMS batches, monthly invoicing, reconciliation |
| i18n | **i18next / react-i18next** (shared JSON web+mobile); centralize `Intl` `bn-BD` number/date formatter; ৳ BDT | Bengali-first from commit one; decide Bengali-numeral policy early |
| Offline (mobile) | **WatermelonDB** (SQLite) or PowerSync/RxDB; client-UUID + version + sync queue; append-only ledger events; last-write-wins except money | Hardest correctness problem — design early |
| Hosting | VPS in **Singapore** (DO SGP1 / AWS ap-southeast-1, ~30–60ms to BD); Docker Compose: API, GPS ingest, Postgres+Timescale, Redis, Gotenberg, Nginx/Caddy; **BunnyCDN/Cloudflare** front; nightly `pg_dump` + WAL to R2/B2 | Latency matters; start regional, add BD edge later; no Kubernetes early |

#### 6.2 Architecture (in words)
```
[RN/Expo App] ─┐                          ┌─ BullMQ Workers (SMS, PDF, invoices, reminders)
[React Web]  ──┼─ REST API (NestJS) ──────┼─ Postgres + TimescaleDB (single tenant-scoped DB, RLS)
[Admin panel]─┘        │  │  │             ├─ Redis (OTP, cache, queues)
                       │  │  └─ PaymentProvider → bKash PGW
                       │  └──── SmsProvider → SSL Wireless / fallback
                       └─ WebSocket gateway (live positions/alerts)
[GPS Devices] → Traccar / Autonemo API → GPS Ingestion svc → TimescaleDB → stream consumer (geofence/overspeed) → Alerts
[Gotenberg] ← PDF/PNG receipts → R2/B2 object storage → signed shareable links
```
Everything tenant-scoped by `organizationId`. Ledger is append-only. NestJS modules map 1:1 to feature groups A–Q.

#### 6.3 Risks to design around early (don't defer)
1. **Offline sync correctness on money** — append-only ledger + client UUIDs from day one.
2. **Multi-tenant isolation** — Prisma middleware **and** Postgres RLS.
3. **OTP deliverability** — dual SMS provider failover.
4. **Bengali rendering everywhere incl. PDFs** — bundle fonts, test on real low-end Android.
5. **GPS scaling** — separate service + TimescaleDB from the start.

---

### 7. Monetization — "1 vehicle free forever" + postpaid bKash

#### 7.1 Free-tier gate (technical)
- On the org, track `activeVehicleCount` + `planTier`. Free tier = **exactly 1 vehicle's accounting** fully functional forever. Implemented via `Vehicle.isBillable` (exactly one vehicle per org is `false` — the oldest) + `Subscription.billableVehicleCount`.
- When the owner adds a 2nd vehicle, they cross into **paid**. **Recommended = grace + postpaid (a):** allow adding vehicles freely; the first (oldest) stays free; each additional vehicle accrues charges on the month-end invoice ("use first, pay at month-end, no upfront cost"). Avoid hard-gating the 2nd vehicle (friction).
- **Billing calculation:** paid vehicles × plan rate, prorated for mid-month additions. Optional category tiering mirrors the GPS structure (light vs car/bus/truck/micro); the accounting SaaS itself can be a flat per-extra-vehicle rate.

#### 7.2 Postpaid cycle (BullMQ cron)
1. **Month-end:** generate `BillingInvoice` per org = sum of paid-vehicle charges (usage line items); `dueDate = +7 days`.
2. **Dispatch:** bKash payment link + SMS + in-app notification.
3. **7-day window:** reminders on day 3 and day 6.
4. **On payment:** bKash execute + callback → mark paid → confirm via **Query Payment cron** (never trust redirect alone) → lift soft-lock.
5. **Non-payment after grace:** **soft-lock paid features** (multi-vehicle views/paid modules read-only or hidden) — **never delete data**; the free vehicle keeps working; unlock instantly on payment.
6. **GPS hardware billed separately.**

#### 7.3 GPS hardware & subscription pricing
- Device: one-time **৳4,000** incl. 1-yr warranty; COD, nationwide, free install.
- Monthly subscription by category: **Bike / CNG / auto-rickshaw / e-bike = ৳350/mo**; **Car / Bus / Truck / Micro = ৳500/mo**.
- Prepay-term discounts (৳350 tier), `discount = (base − discounted) × months`:

| Term | Per-month | Save |
|---|---|---|
| 1 mo | ৳350 | ৳0 |
| 3 mo | ৳315 | ৳105 |
| 6 mo | ৳298 | ৳312 |
| 12 mo | ৳280 | ৳840 |

- Device specs: 9–90V one-SKU compatibility, backup battery tracks on power cut, IP65, integrated SIM (Banglalink/GP/Robi).

#### 7.4 Why postpaid works here
Zero signup friction (matches "no upfront cost, app install free"); the free single vehicle is a permanent acquisition funnel; expansion revenue grows as owners add vehicles; the gentle soft-lock (not deletion) preserves trust and lets lapsed users reactivate.

---

### 8. Phased Build Roadmap + Estimates

Assumes a small team (≈2 backend, 1–2 frontend/mobile, part-time devops). Ranges are calendar time.

#### MVP — "what the ad promises" (≈8–12 weeks)
The freemium hook + daily operations for a single owner:
- Auth: phone+OTP signup, PIN/password login, multi-device, JWT (SSL Wireless).
- Multi-tenant core + append-only double-entry ledger + category (khat) system.
- Vehicle management (mixed types, per-vehicle profile & P&L) with **1-vehicle-free** enforcement.
- Driver management + KYC + daily deposit target + daily collection entry (one-tap keypad, timestamped) + **auto driver-dues/shortfall** (dues in red).
- Income/Expense entry with categories; **Smart Dashboard** (today's collection/expense/profit/active count).
- Digital receipt (PDF/image + shareable link) via Gotenberg.
- Basic reports: money history, per-vehicle P&L, monthly PDF/Excel export.
- SMS receipts/reminders to drivers (BullMQ cron).
- Bengali-first i18n baked in.
- Web app + REST API complete; **mobile MVP** (Expo) covering collection entry, dashboard, receipts — **offline queue for collections** from day one.
- Monetization scaffolding: plan model + free-tier gate (billing engine stubbable).

**Deliverable:** an owner runs daily collections, tracks driver dues, manages vehicles, sees profit, shares receipts — free for 1 vehicle. Shippable product on its own.

#### Phase 2 — Monetization + operational depth (≈6–10 weeks)
- **Postpaid billing engine:** month-end auto-invoice, usage line items, **bKash PGW**, payment-link SMS, 7-day window, **soft-lock**, reconciliation cron.
- Subscription plans (free single / paid multi; monthly & prepay-term pricing).
- Fuel & maintenance: fuel log, auto KPL/cost-per-km, service records, service + document-expiry reminders (route permit/fitness/insurance/tax token/registration) via cron+SMS+push.
- Rental/bookings: booking calendar w/ double-booking prevention, customer CRM, rental invoice, hourly START/END billing.
- Reports/analytics: charts, calendar report, budgets w/ thresholds, balance sheet / trial balance.
- Staff permissions (manager/accountant).
- Vehicle QR: generation, passenger scan verification, anonymous messaging, complaints, bulk QR PDF.
- Push notifications (Expo). Harden offline sync across all entry types.

#### Phase 3 — Platform + hardware + verticals (≈10–16 weeks, parallelizable)
- **Live GPS:** Traccar/Autonemo ingestion, TimescaleDB, WebSocket live map (100+ vehicles, clustering), trip history/playback, geofence/overspeed/ignition alerts, tracker-to-vehicle mapping, hardware order flow (order→call→install→live, COD).
- **Inventory & parts:** stock, suppliers/credit, purchase/sale invoices, reorder & dead-stock reports.
- Loans/installments/HP, party ledger (paona/dena/advance), charging-station module, bus-association fund/member/route accounting.
- Auto marketplace with admin moderation.
- Voice entry (mic → txn), accident record w/ photo→auto-expense, achievements/gamification, encrypted cloud backup surfaced, remaining 8 vertical presets.
- **iOS** parity + store submission.

**Total to full feature parity:** roughly **6–9 months** with a small team; a compelling **MVP in ~2–3 months**.

| Phase | Calendar | Headline outcome |
|---|---|---|
| MVP | 8–12 wk | Free single-vehicle daily-ops product, shippable |
| Phase 2 | 6–10 wk | Revenue (bKash postpaid) + rental/fuel/maintenance/QR depth |
| Phase 3 | 10–16 wk | GPS hardware, inventory, verticals, marketplace, iOS |

---

### 9. Key Business-Logic Notes

#### 9.1 Driver dues (event-sourced, materialized)
Per collection:
```
shortfall = max(0, dailyTarget − amountCollected − discountAmount)
```
- Persist `shortfall` on `Collection`, **snapshotting `dailyTarget` at entry time** so later target changes never rewrite history (audit/anti-theft), alongside `enteredAt` wall-clock and `isBackdated`.
- If `shortfall > 0`, write a `DriverDue` with `sourceCollectionId` (unique → one due per collection) and `remainingBalance = amount`.
- On later over-deposit (`amountCollected > target`), apply surplus against oldest open dues **FIFO**: increment `amountRepaid`, recompute `remainingBalance = amount − amountRepaid`, set `isSettled` at zero. Discounts/waivers (ছাড়) reduce shortfall at source — they don't create a due.
- Live outstanding = `SUM(remainingBalance) WHERE driverId = ? AND isSettled = false` (served by `@@index([organizationId, driverId, isSettled])`), shown in **RED**, triggering SMS reminders. Derived, never hand-entered → "zero manual arithmetic."
- **Same shape drives charging** (`ChargingSession.addedDue = expectedRate − amountPaid`, suppressed when `Customer.hasFixedRate`) **and rental** (`Booking.outstandingDue = fare − advance − payments`).
- **Charging garage:** `new_dues = previous_dues + (daily_rate − amount_paid)`; overpayment reduces prior dues; flexible-rate customers → `due_tracking=false`, all payment = income, no dues accrue.
- **Collection rate** = `collections ÷ expected target × 100%`.

#### 9.2 Profit & Loss (two reconciling layers)
**Operational per-vehicle P&L (fast dashboard number):**
```
revenue(vehicle)  = Σ Collection.amountCollected
                  + Σ Booking.fare (rental)
                  + Σ ChargingSession.amountPaid (charging)
expenses(vehicle) = Σ Expense.amount              (fuel, repair, toll, bata, garage rent, …)
                  + Σ FuelEntry.cost              (if fuel tracked as fuel log not generic expense)
                  + Σ ServiceRecord.cost
                  + Σ (Accident.fineAmount + Accident.damageCost)  ← auto-posted as Expense
P&L(vehicle)      = revenue − expenses
```
- Everything that costs money carries a `vehicleId` → per-vehicle isolation is `GROUP BY vehicleId`, fleet roll-up is the ungrouped sum.
- **Accidents:** fines + damage auto-posted into `Expense` (linked via `Expense.sourceAccidentId`, unique) → lands in exactly one place, never double-counts.
- Every income/expense row carries a `categoryId` (khat) → category-wise reports = `GROUP BY categoryId`.
- Garage net = `total_collection − electricity_cost − other_expenses`. Truck per-vehicle P&L = income tagged to vehicle − expenses tagged to vehicle.
- Rent-a-car net = rental revenue − driver cost − fuel cost.

**Authoritative double-entry P&L (source of truth):**
- `JournalEntry` + `JournalLine` against `LedgerAccount` enforce `Σ debits = Σ credits` in the posting transaction. Trial balance = per-account `Σ(debit) − Σ(credit)`; income statement = income accounts − expense accounts. `Decimal(14,2)` throughout — money never drifts.
- The operational number is a denormalized cache for speed; the ledger is authoritative for accountants. A posting service writes **both in one transaction** so they can't diverge. `isBackdated` flags out-of-period postings for the audit view.

#### 9.3 Fuel / mileage
- Distance per fill-up = current odo − previous odo. `kpl = total km ÷ total liters`. `cost_per_km = total fuel cost ÷ total km`. `cost = liters × price_per_liter`.

#### 9.4 Maintenance / documents
- Overdue service when `(current odo − last service odo) ≥ interval` **OR** `days since last service > interval`.
- Document reminders fire (only if an expiry date is entered) `reminderLeadDays` before Route Permit / Fitness / Insurance / Tax Token / Registration expiry. Cron scans `@@index([organizationId, expiryDate])` / `nextServiceDueDate`, emits `SmsLog` + push; `reminderSent` prevents duplicates.

#### 9.5 Inventory
- Reorder flag when `stock_quantity ≤ reorder_level`; slow-moving/dead stock reported. Supplier outstanding = credit purchases − payments made.

#### 9.6 Rental
- Double-booking prevented via a Postgres `EXCLUDE USING gist` range-overlap constraint (Prisma can't express it).
- `outstanding_due = total fare − (advance + payments)`. Hourly bill = `base_rate + hourly_rate×hours + surcharge` from START/END timestamps.

#### 9.7 Party ledger (truck) & bus association
- Party net = receivable (পাওনা) − settlements (পরিশোধ); advances (অগ্রিম) held separately, never conflated.
- Member outstanding = subscription owed − amount paid; fund balance = total income − total expenses (per category); per-bus/per-route separate ledgers.

#### 9.8 GPS ingest
- Live positions refresh every ~10s; dashboard scales to 100+ mixed vehicles.
- Keep ingestion **decoupled** (separate service, TimescaleDB / monthly-partitioned `LocationPing`, `BigInt` PK). A stream consumer computes alerts:
  - **Overspeed** on threshold; **Geofence** on enter/exit; **Ignition** on engine on/off.
- Live delivery over WebSocket; app subscribes only to on-screen vehicles (throttle marker updates + clustering in RN).
- `GpsTrip` summaries stay in the relational hot path; raw pings do not.

#### 9.9 Offline-first (money correctness)
- Each record gets a client-generated UUID (offline creates never collide), `updatedAt`/version, and a sync queue. On reconnect: push queued mutations (idempotent, keyed by client UUID) then pull deltas.
- **Last-write-wins per field is acceptable except money.** Ledger entries are **append-only immutable events** — you never edit a collection, you post a correcting/reversing entry. Backdated entries fall out naturally from an `effectiveDate`/`collectionDate` separate from `createdAt`/`enteredAt`.

#### 9.10 Platform / legal notes
- Acceptance implicit on account creation/login; usage must be lawful/business-only. User owns their data; platform only processes it; service "as-is"; data retained while active, deleted on closure except legal retention.
- Device permissions (location/contacts/microphone) are optional and gate specific features (tracking map / SMS reminders / voice entry). Third-party sharing limited to essential operational data: bKash (payments), GPS providers, SMS/push services.
- Support SLA: 9 AM–9 PM daily, Friday closed; contact form requires Name + Message. Email `amarautobd@gmail.com`.

---

*Master spec compiled from the deduplicated feature inventory, production Prisma data model, mobile REST API surface, and tech-stack/architecture brief. Build the ledger + multi-tenancy core once; every module writes into it.*


---

## অংশ ৪ — ডেটা মডেল (Prisma স্কিমা)


## আমার অটো (Amar Auto) — Production PostgreSQL Data Model (Prisma)

```prisma
// ============================================================
// datasource & generator
// ============================================================
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ============================================================
// ENUMS
// ============================================================
enum UserRole {
  OWNER
  MANAGER
  ACCOUNTANT
}

enum PlanTier {
  FREE          // 1 vehicle free forever
  PAID          // multi-vehicle monthly/yearly
}

enum BusinessMode {
  CNG_AUTORICKSHAW
  RENT_A_CAR
  E_VEHICLE_CHARGING
  BUS_ASSOCIATION
  TRUCK_TRANSPORT
  BIKE_RIDESHARE
  GENERIC_FLEET
  PARTS_WORKSHOP
}

enum VehicleType {
  CNG
  AUTO_RICKSHAW
  RENT_A_CAR
  E_BIKE
  BIKE
  CAR
  BUS
  TRUCK
  MICRO
}

enum VehicleOpStatus {
  EMPTY         // খালি
  RENTED        // ভাড়ায়
  BOOKED        // বুকড
}

enum RunState {
  RUNNING
  STOPPED
}

enum DocType {
  ROUTE_PERMIT
  FITNESS
  INSURANCE
  TAX_TOKEN
  REGISTRATION
}

enum LedgerEntryType {
  DEBIT
  CREDIT
}

enum TxnDirection {
  INCOME
  EXPENSE
}

enum PaymentMethod {
  CASH
  BKASH
  NAGAD
  ROCKET
  BANK
  CREDIT
  OTHER
}

enum InvoiceKind {
  PURCHASE
  SALE
}

enum InvoiceStatus {
  PAID
  PENDING
  PARTIAL
}

enum LoanType {
  GIVEN         // receivable
  TAKEN         // payable
  HIRE_PURCHASE // HP installment
}

enum InstallmentStatus {
  DUE
  PAID
  PARTIAL
  OVERDUE
}

enum PartyLedgerType {
  RECEIVABLE    // পাওনা
  PAYABLE       // দেনা
  ADVANCE       // অগ্রিম
  SETTLEMENT    // পরিশোধ
}

enum ChargingStatus {
  FULL
  PARTIAL
  PENDING
}

enum BillingStatus {
  DRAFT
  PENDING
  PAID
  OVERDUE
  SOFT_LOCKED
}

enum SmsType {
  RECEIPT
  EXPIRY_REMINDER
  DUES_REMINDER
  BILL_LINK
  OTP
  OTHER
}

enum SmsStatus {
  QUEUED
  SENT
  FAILED
  DELIVERED
}

enum AlertType {
  ENGINE_ON_OFF
  OVERSPEED
  GEOFENCE_ENTER
  GEOFENCE_EXIT
  SERVICE_DUE
  DOC_EXPIRY
}

enum StockMoveType {
  PURCHASE_IN
  SALE_OUT
  WRITE_OFF
  RETURN_IN
  RETURN_OUT
  ADJUSTMENT
  COUNT_CORRECTION
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  SOFT_LOCK
  PAYMENT
}

// ============================================================
// TENANCY: ORGANIZATION + USERS/ROLES
// ============================================================
model Organization {
  id             String        @id @default(cuid())
  name           String
  ownerPhone     String        // OTP-verified primary owner phone
  businessMode   BusinessMode  @default(GENERIC_FLEET)
  planTier       PlanTier      @default(FREE)
  bkashNumber    String?
  termsAcceptedAt DateTime?
  isActive       Boolean       @default(true)   // soft-lock kills paid features, not this
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // relations (every tenant-scoped table back-references here)
  users             User[]
  vehicles          Vehicle[]
  drivers           Driver[]
  customers         Customer[]
  collections       Collection[]
  driverDues        DriverDue[]
  expenses          Expense[]
  expenseCategories ExpenseCategory[]
  fuelEntries       FuelEntry[]
  serviceRecords    ServiceRecord[]
  documents         VehicleDocument[]
  parts             Part[]
  stockMovements    StockMovement[]
  suppliers         Supplier[]
  invoices          Invoice[]
  bookings          Booking[]
  receipts          Receipt[]
  accidents         Accident[]
  loans             Loan[]
  partyLedgers      PartyLedgerEntry[]
  chargingSessions  ChargingSession[]
  ledgerAccounts    LedgerAccount[]
  journalEntries    JournalEntry[]
  budgets           Budget[]
  gpsDevices        GpsDevice[]
  geofences         Geofence[]
  gpsTrips          GpsTrip[]
  billingInvoices   BillingInvoice[]
  billingPayments   BillingPayment[]
  subscriptions     Subscription[]
  smsLogs           SmsLog[]
  auditLogs         AuditLog[]

  @@index([planTier])
  @@map("organizations")
}

model User {
  id             String    @id @default(cuid())
  organizationId String
  name           String
  phone          String    // OTP-verified; unique per org
  email          String?
  role           UserRole  @default(OWNER)
  pinHash        String?
  passwordHash   String?
  otpVerified    Boolean   @default(false)
  permissions    Json?     // fine-grained staff permission map
  isActive       Boolean   @default(true)
  lastLoginAt    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdCollections Collection[] @relation("CollectionCreatedBy")
  auditLogs    AuditLog[]

  @@unique([organizationId, phone])
  @@index([organizationId, role])
  @@map("users")
}

// ============================================================
// VEHICLES / DRIVERS / ASSIGNMENTS
// ============================================================
model Vehicle {
  id                 String          @id @default(cuid())
  organizationId     String
  registrationNo     String
  vehicleType        VehicleType
  model              String?
  voltageRange       String?
  currentOdometer    Int             @default(0)
  opStatus           VehicleOpStatus @default(EMPTY)
  runState           RunState        @default(STOPPED)
  dailyDepositTarget Decimal         @default(0) @db.Decimal(12, 2)
  routeName          String?         // bus line assignment
  isActive           Boolean         @default(true)
  isBillable         Boolean         @default(false) // false for the 1 free vehicle
  gpsDeviceId        String?         @unique
  createdAt          DateTime        @default(now())
  updatedAt          DateTime        @updatedAt

  organization   Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  gpsDevice      GpsDevice?         @relation(fields: [gpsDeviceId], references: [id])
  assignments    DriverAssignment[]
  collections    Collection[]
  driverDues     DriverDue[]
  expenses       Expense[]
  fuelEntries    FuelEntry[]
  serviceRecords ServiceRecord[]
  documents      VehicleDocument[]
  accidents      Accident[]
  bookings       Booking[]
  gpsTrips       GpsTrip[]
  geofences      Geofence[]

  @@unique([organizationId, registrationNo])
  @@index([organizationId, vehicleType])
  @@index([organizationId, isActive])
  @@map("vehicles")
}

model Driver {
  id                 String    @id @default(cuid())
  organizationId     String
  name               String
  phone              String?
  nidNumber          String?
  photoUrl           String?
  profession         String?
  kycDocs            Json?     // uploaded doc references
  dailyCollectionTarget Decimal @default(0) @db.Decimal(12, 2)
  isActive           Boolean   @default(true)
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  organization Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  assignments  DriverAssignment[]
  collections  Collection[]
  driverDues   DriverDue[]
  expenses     Expense[]
  bookings     Booking[]

  @@index([organizationId, isActive])
  @@map("drivers")
}

model DriverAssignment {
  id             String    @id @default(cuid())
  organizationId String
  driverId       String
  vehicleId      String
  startDate      DateTime  @default(now())
  endDate        DateTime? // null = currently active
  createdAt      DateTime  @default(now())

  driver  Driver  @relation(fields: [driverId], references: [id], onDelete: Cascade)
  vehicle Vehicle @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  // one active (endDate null) assignment per vehicle enforced at app layer;
  // partial unique index below covers the DB guard
  @@index([organizationId, vehicleId, endDate])
  @@index([organizationId, driverId, endDate])
  @@map("driver_assignments")
}

// ============================================================
// COLLECTIONS / DEPOSITS + DRIVER DUES
// ============================================================
model Collection {
  id               String   @id @default(cuid())
  organizationId   String
  driverId         String
  vehicleId        String
  createdByUserId  String?
  amountCollected  Decimal  @db.Decimal(12, 2)
  dailyTarget      Decimal  @db.Decimal(12, 2) // snapshot of target at time of entry
  discountAmount   Decimal  @default(0) @db.Decimal(12, 2) // ছাড় / waiver
  shortfall        Decimal  @default(0) @db.Decimal(12, 2) // computed & persisted: max(0, target - collected - discount)
  collectionDate   DateTime @db.Date
  enteredAt        DateTime @default(now())        // wall-clock stamp (anti-theft)
  isBackdated      Boolean  @default(false)        // flagged for audit
  smsReceiptSent   Boolean  @default(false)
  createdAt        DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  driver       Driver       @relation(fields: [driverId], references: [id])
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])
  createdBy    User?        @relation("CollectionCreatedBy", fields: [createdByUserId], references: [id])
  driverDue    DriverDue?   // shortfall may spawn a due row
  receipt      Receipt?

  @@index([organizationId, driverId, collectionDate])
  @@index([organizationId, vehicleId, collectionDate])
  @@index([organizationId, collectionDate])
  @@map("collections")
}

model DriverDue {
  id                 String   @id @default(cuid())
  organizationId     String
  driverId           String
  vehicleId          String?
  sourceCollectionId String?  @unique
  dateIncurred       DateTime @db.Date
  amount             Decimal  @db.Decimal(12, 2) // original due
  amountRepaid       Decimal  @default(0) @db.Decimal(12, 2)
  remainingBalance   Decimal  @db.Decimal(12, 2) // amount - amountRepaid (persisted)
  isSettled          Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  organization     Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  driver           Driver       @relation(fields: [driverId], references: [id])
  vehicle          Vehicle?     @relation(fields: [vehicleId], references: [id])
  sourceCollection Collection?  @relation(fields: [sourceCollectionId], references: [id])

  @@index([organizationId, driverId, isSettled])
  @@map("driver_dues")
}

// ============================================================
// EXPENSES / INCOME CATEGORIES
// ============================================================
model ExpenseCategory {
  id             String   @id @default(cuid())
  organizationId String
  name           String   // fuel/তেল, repair, toll, driver_bata, garage_rent...
  direction      TxnDirection @default(EXPENSE)
  isSystem       Boolean  @default(false)
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  expenses     Expense[]

  @@unique([organizationId, name, direction])
  @@map("expense_categories")
}

model Expense {
  id             String   @id @default(cuid())
  organizationId String
  vehicleId      String?
  driverId       String?
  categoryId     String
  amount         Decimal  @db.Decimal(12, 2)
  note           String?
  expenseDate    DateTime @db.Date
  isBackdated    Boolean  @default(false)
  sourceAccidentId String? @unique  // auto-posted accident cost
  createdAt      DateTime @default(now())

  organization Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle?        @relation(fields: [vehicleId], references: [id])
  driver       Driver?         @relation(fields: [driverId], references: [id])
  category     ExpenseCategory @relation(fields: [categoryId], references: [id])
  accident     Accident?       @relation(fields: [sourceAccidentId], references: [id])

  @@index([organizationId, vehicleId, expenseDate])
  @@index([organizationId, categoryId, expenseDate])
  @@map("expenses")
}

// ============================================================
// FUEL LOGS
// ============================================================
model FuelEntry {
  id                String   @id @default(cuid())
  organizationId    String
  vehicleId         String
  fillDate          DateTime @db.Date
  volumeLiters      Decimal  @db.Decimal(10, 3)
  pricePerLiter     Decimal  @db.Decimal(10, 2)
  cost              Decimal  @db.Decimal(12, 2) // volumeLiters * pricePerLiter
  odometerReading   Int
  distanceSinceLast Int?     // odo - prev odo (computed)
  kpl               Decimal? @db.Decimal(8, 2)  // distance / volume
  costPerKm         Decimal? @db.Decimal(8, 2)
  paymentMethod     PaymentMethod @default(CASH)
  isHighway         Boolean? // for city/highway split analytics
  createdAt         DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])

  @@index([organizationId, vehicleId, fillDate])
  @@map("fuel_entries")
}

// ============================================================
// MAINTENANCE / SERVICE
// ============================================================
model ServiceRecord {
  id               String   @id @default(cuid())
  organizationId   String
  vehicleId        String
  serviceType      String
  serviceDate      DateTime @db.Date
  cost             Decimal  @db.Decimal(12, 2)
  odometerAtService Int?
  serviceIntervalKm Int?
  serviceIntervalDays Int?
  partsReplaced    Json?    // free-form list or references to Part
  nextServiceDueDate DateTime? @db.Date
  nextServiceDueKm  Int?
  createdAt        DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])

  @@index([organizationId, vehicleId, serviceDate])
  @@index([organizationId, nextServiceDueDate])
  @@map("service_records")
}

// ============================================================
// DOCUMENT ALERTS
// ============================================================
model VehicleDocument {
  id              String   @id @default(cuid())
  organizationId  String
  vehicleId       String
  docType         DocType
  issueDate       DateTime? @db.Date
  expiryDate      DateTime  @db.Date
  reminderLeadDays Int      @default(30)
  reminderSent    Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id], onDelete: Cascade)

  @@unique([organizationId, vehicleId, docType])
  @@index([organizationId, expiryDate])   // powers the expiry-alert scan
  @@map("vehicle_documents")
}

// ============================================================
// PARTS INVENTORY / STOCK / SUPPLIERS / INVOICES
// ============================================================
model Part {
  id             String   @id @default(cuid())
  organizationId String
  name           String
  category       String?
  partNumber     String?
  brand          String?
  location       String?
  stockQuantity  Int      @default(0)
  reorderLevel   Int      @default(0)
  purchasePrice  Decimal  @default(0) @db.Decimal(12, 2)
  salePrice      Decimal  @default(0) @db.Decimal(12, 2)
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  organization   Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  stockMovements StockMovement[]
  invoiceLines   InvoiceLine[]

  @@unique([organizationId, partNumber])
  @@index([organizationId, category])
  @@map("parts")
}

model StockMovement {
  id             String        @id @default(cuid())
  organizationId String
  partId         String
  type           StockMoveType
  quantity       Int           // signed by convention: +in / -out
  unitCost       Decimal?      @db.Decimal(12, 2)
  reason         String?
  invoiceId      String?
  movedAt        DateTime      @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  part         Part         @relation(fields: [partId], references: [id])
  invoice      Invoice?     @relation(fields: [invoiceId], references: [id])

  @@index([organizationId, partId, movedAt])
  @@map("stock_movements")
}

model Supplier {
  id                String   @id @default(cuid())
  organizationId    String
  name              String
  contact           String?
  outstandingBalance Decimal @default(0) @db.Decimal(12, 2) // credit purchases - payments
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  organization Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  invoices     Invoice[]
  payments     SupplierPayment[]

  @@index([organizationId])
  @@map("suppliers")
}

model SupplierPayment {
  id             String   @id @default(cuid())
  organizationId String
  supplierId     String
  amount         Decimal  @db.Decimal(12, 2)
  method         PaymentMethod @default(CASH)
  paidAt         DateTime @default(now())

  supplier Supplier @relation(fields: [supplierId], references: [id], onDelete: Cascade)

  @@index([organizationId, supplierId, paidAt])
  @@map("supplier_payments")
}

model Invoice {
  id             String        @id @default(cuid())
  organizationId String
  kind           InvoiceKind   // PURCHASE (from supplier) or SALE (to customer)
  supplierId     String?
  customerId     String?
  invoiceNo      String
  subtotal       Decimal       @db.Decimal(12, 2)
  discount       Decimal       @default(0) @db.Decimal(12, 2)
  total          Decimal       @db.Decimal(12, 2)
  creditAmount   Decimal       @default(0) @db.Decimal(12, 2) // on-credit portion
  status         InvoiceStatus @default(PENDING)
  invoiceDate    DateTime      @db.Date
  createdAt      DateTime      @default(now())

  organization   Organization    @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  supplier       Supplier?       @relation(fields: [supplierId], references: [id])
  customer       Customer?       @relation(fields: [customerId], references: [id])
  lines          InvoiceLine[]
  stockMovements StockMovement[]

  @@unique([organizationId, kind, invoiceNo])
  @@index([organizationId, status])
  @@map("invoices")
}

model InvoiceLine {
  id        String  @id @default(cuid())
  invoiceId String
  partId    String?
  description String?
  quantity  Int
  unitPrice Decimal @db.Decimal(12, 2)
  lineTotal Decimal @db.Decimal(12, 2)

  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)
  part    Part?   @relation(fields: [partId], references: [id])

  @@index([invoiceId])
  @@map("invoice_lines")
}

// ============================================================
// CUSTOMERS / BOOKINGS / RECEIPTS / ACCIDENTS
// ============================================================
model Customer {
  id                 String   @id @default(cuid())
  organizationId     String
  name               String
  phone              String?
  idDocument         String?
  photoUrl           String?
  profession         String?
  dailyRate          Decimal? @db.Decimal(12, 2) // charging garages
  hasFixedRate       Boolean  @default(false)    // flexible-rate => no due tracking
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  organization     Organization      @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  bookings         Booking[]
  invoices         Invoice[]
  partyLedgers     PartyLedgerEntry[]
  chargingSessions ChargingSession[]
  loans            Loan[]

  @@index([organizationId])
  @@map("customers")
}

model Booking {
  id             String        @id @default(cuid())
  organizationId String
  vehicleId      String
  customerId     String?
  driverId       String?
  startDateTime  DateTime
  endDateTime    DateTime?
  startOdometer  Int?
  endOdometer    Int?
  distance       Int?
  fare           Decimal       @default(0) @db.Decimal(12, 2)
  advancePaid    Decimal       @default(0) @db.Decimal(12, 2)
  hourlyRate     Decimal?      @db.Decimal(12, 2)
  baseRate       Decimal?      @db.Decimal(12, 2)
  surcharge      Decimal       @default(0) @db.Decimal(12, 2)
  outstandingDue Decimal       @default(0) @db.Decimal(12, 2) // fare - advance - payments
  status         InvoiceStatus @default(PENDING)
  createdAt      DateTime      @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])
  customer     Customer?    @relation(fields: [customerId], references: [id])
  driver       Driver?      @relation(fields: [driverId], references: [id])
  receipt      Receipt?

  // overlap / double-booking prevention handled via exclusion constraint (see notes)
  @@index([organizationId, vehicleId, startDateTime])
  @@map("bookings")
}

model Receipt {
  id             String   @id @default(cuid())
  organizationId String
  receiptNo      String
  collectionId   String?  @unique
  bookingId      String?  @unique
  amount         Decimal  @db.Decimal(12, 2)
  advance        Decimal  @default(0) @db.Decimal(12, 2)
  duesRemaining  Decimal  @default(0) @db.Decimal(12, 2)
  pdfUrl         String?
  shareLink      String?  @unique
  issuedAt       DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  collection   Collection?  @relation(fields: [collectionId], references: [id])
  booking      Booking?     @relation(fields: [bookingId], references: [id])

  @@unique([organizationId, receiptNo])
  @@map("receipts")
}

model Accident {
  id             String   @id @default(cuid())
  organizationId String
  vehicleId      String
  accidentDate   DateTime @db.Date
  description    String?
  photoEvidence  Json?    // array of URLs
  fineAmount     Decimal  @default(0) @db.Decimal(12, 2)
  damageCost     Decimal  @default(0) @db.Decimal(12, 2)
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])
  expense      Expense?     // auto-posted (fine + damage) as vehicle expense

  @@index([organizationId, vehicleId, accidentDate])
  @@map("accidents")
}

// ============================================================
// LOANS / INSTALLMENTS / PARTY LEDGER
// ============================================================
model Loan {
  id               String   @id @default(cuid())
  organizationId   String
  customerId       String?
  type             LoanType
  principalAmount  Decimal  @db.Decimal(14, 2)
  remainingBalance Decimal  @db.Decimal(14, 2)
  installmentAmount Decimal? @db.Decimal(12, 2)
  installmentCount Int?
  startDate        DateTime @db.Date
  isClosed         Boolean  @default(false)
  createdAt        DateTime @default(now())

  organization Organization       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  customer     Customer?          @relation(fields: [customerId], references: [id])
  installments LoanInstallment[]

  @@index([organizationId, type, isClosed])
  @@map("loans")
}

model LoanInstallment {
  id          String            @id @default(cuid())
  loanId      String
  dueDate     DateTime          @db.Date
  amountDue   Decimal           @db.Decimal(12, 2)
  amountPaid  Decimal           @default(0) @db.Decimal(12, 2)
  paidAt      DateTime?
  status      InstallmentStatus @default(DUE)

  loan Loan @relation(fields: [loanId], references: [id], onDelete: Cascade)

  @@index([loanId, status])
  @@index([dueDate])
  @@map("loan_installments")
}

model PartyLedgerEntry {
  id             String          @id @default(cuid())
  organizationId String
  customerId     String
  entryDate      DateTime        @db.Date
  type           PartyLedgerType // RECEIVABLE / PAYABLE / ADVANCE / SETTLEMENT
  debit          Decimal         @default(0) @db.Decimal(14, 2)
  credit         Decimal         @default(0) @db.Decimal(14, 2)
  runningBalance Decimal         @db.Decimal(14, 2)
  reference      String?
  createdAt      DateTime        @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  customer     Customer     @relation(fields: [customerId], references: [id])

  @@index([organizationId, customerId, entryDate])
  @@map("party_ledger_entries")
}

// ============================================================
// CHARGING SESSIONS
// ============================================================
model ChargingSession {
  id             String         @id @default(cuid())
  organizationId String
  customerId     String
  sessionDate    DateTime       @db.Date
  expectedRate   Decimal        @db.Decimal(12, 2) // snapshot of daily_rate
  amountPaid     Decimal        @db.Decimal(12, 2)
  addedDue       Decimal        @default(0) @db.Decimal(12, 2) // rate - paid (0 if fixed-rate customer)
  status         ChargingStatus @default(PENDING)
  createdAt      DateTime       @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  customer     Customer     @relation(fields: [customerId], references: [id])

  @@index([organizationId, customerId, sessionDate])
  @@map("charging_sessions")
}

// ============================================================
// DOUBLE-ENTRY LEDGER
// ============================================================
model LedgerAccount {
  id             String   @id @default(cuid())
  organizationId String
  code           String   // e.g. 1000 Cash, 4000 Fare Income
  name           String
  direction      TxnDirection?
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  lines        JournalLine[]

  @@unique([organizationId, code])
  @@map("ledger_accounts")
}

model JournalEntry {
  id             String   @id @default(cuid())
  organizationId String
  entryDate      DateTime @db.Date
  reference      String?
  memo           String?
  isBackdated    Boolean  @default(false) // flagged for audit
  vehicleId      String?
  driverId       String?
  createdAt      DateTime @default(now())

  organization Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  lines        JournalLine[]

  @@index([organizationId, entryDate])
  @@map("journal_entries")
}

model JournalLine {
  id             String          @id @default(cuid())
  journalEntryId String
  accountId      String
  type           LedgerEntryType // DEBIT / CREDIT
  amount         Decimal         @db.Decimal(14, 2)

  entry   JournalEntry  @relation(fields: [journalEntryId], references: [id], onDelete: Cascade)
  account LedgerAccount @relation(fields: [accountId], references: [id])

  @@index([journalEntryId])
  @@index([accountId])
  @@map("journal_lines")
}

model Budget {
  id             String   @id @default(cuid())
  organizationId String
  month          DateTime @db.Date // first of month
  category       String
  budgetAmount   Decimal  @db.Decimal(12, 2)
  alertThreshold Decimal  @default(0.8) @db.Decimal(4, 2)
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([organizationId, month, category])
  @@map("budgets")
}

// ============================================================
// GPS DEVICES + POSITIONS + TRIPS + GEOFENCES
// ============================================================
model GpsDevice {
  id             String    @id @default(cuid())
  organizationId String
  imei           String    @unique
  simOperator    String?
  simNumber      String?
  provider       String    @default("Autonemo")
  warrantyStart  DateTime? @db.Date
  ipRating       String?   @default("IP65")
  voltageRange   String?   @default("9-90V")
  lastLat        Decimal?  @db.Decimal(10, 7)
  lastLng        Decimal?  @db.Decimal(10, 7)
  lastUpdateAt   DateTime?
  installStatus  String?
  createdAt      DateTime  @default(now())

  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle?
  positions    LocationPing[]
  trips        GpsTrip[]

  @@index([organizationId])
  @@map("gps_devices")
}

// High-volume time-series table — partition by month in production (see notes)
model LocationPing {
  id             BigInt   @id @default(autoincrement())
  deviceId       String
  recordedAt     DateTime
  latitude       Decimal  @db.Decimal(10, 7)
  longitude      Decimal  @db.Decimal(10, 7)
  speed          Decimal? @db.Decimal(6, 2)
  ignition       Boolean?
  trafficState   String?

  device GpsDevice @relation(fields: [deviceId], references: [id], onDelete: Cascade)

  @@index([deviceId, recordedAt])
  @@map("location_pings")
}

model GpsTrip {
  id             String   @id @default(cuid())
  organizationId String
  vehicleId      String
  deviceId       String?
  startTime      DateTime
  endTime        DateTime?
  durationSec    Int?
  distanceMeters Int?
  maxSpeed       Decimal? @db.Decimal(6, 2)
  avgSpeed       Decimal? @db.Decimal(6, 2)
  pathGeoJson    Json?    // route playback
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle      @relation(fields: [vehicleId], references: [id])
  device       GpsDevice?   @relation(fields: [deviceId], references: [id])

  @@index([organizationId, vehicleId, startTime])
  @@map("gps_trips")
}

model Geofence {
  id             String   @id @default(cuid())
  organizationId String
  vehicleId      String?
  name           String
  centerLat      Decimal? @db.Decimal(10, 7)
  centerLng      Decimal? @db.Decimal(10, 7)
  radiusMeters   Int?
  polygonGeoJson Json?
  alertOnEnter   Boolean  @default(true)
  alertOnExit    Boolean  @default(true)
  createdAt      DateTime @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  vehicle      Vehicle?     @relation(fields: [vehicleId], references: [id])

  @@index([organizationId])
  @@map("geofences")
}

// ============================================================
// SUBSCRIPTION / BILLING (POSTPAID, bKASH)
// ============================================================
model SubscriptionPlan {
  id                  String   @id @default(cuid())
  code                String   @unique  // e.g. LIGHT_MONTHLY, HEAVY_YEARLY
  vehicleClass        String   // "2-wheeler/light" vs "car/bus/truck/micro"
  baseMonthlyPrice    Decimal  @db.Decimal(10, 2) // 350 or 500
  billingTermMonths   Int      // 1/3/6/12
  perMonthEffective   Decimal  @db.Decimal(10, 2) // 350/315/298/280
  discountAmount      Decimal  @default(0) @db.Decimal(10, 2)
  isActive            Boolean  @default(true)

  subscriptions Subscription[]

  @@map("subscription_plans")
}

model Subscription {
  id             String   @id @default(cuid())
  organizationId String
  planId         String
  billableVehicleCount Int   @default(0)
  startDate      DateTime @db.Date
  currentPeriodStart DateTime @db.Date
  currentPeriodEnd   DateTime @db.Date
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())

  organization Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  plan         SubscriptionPlan @relation(fields: [planId], references: [id])

  @@index([organizationId, isActive])
  @@map("subscriptions")
}

model BillingInvoice {
  id             String        @id @default(cuid())
  organizationId String
  billingPeriod  DateTime      @db.Date // first of the billed month
  lineItems      Json          // usage snapshot: vehicles x plan price
  totalAmount    Decimal       @db.Decimal(12, 2)
  status         BillingStatus @default(PENDING)
  dueDate        DateTime      @db.Date // 7-day window from generation
  generatedAt    DateTime      @default(now())

  organization Organization     @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  payments     BillingPayment[]

  @@unique([organizationId, billingPeriod])
  @@index([organizationId, status])
  @@map("billing_invoices")
}

model BillingPayment {
  id               String        @id @default(cuid())
  organizationId   String
  billingInvoiceId String
  amount           Decimal       @db.Decimal(12, 2)
  method           PaymentMethod @default(BKASH)
  gatewayTxnId     String?       @unique
  bkashNumber      String?
  paidAt           DateTime      @default(now())

  organization Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  invoice      BillingInvoice @relation(fields: [billingInvoiceId], references: [id])

  @@index([organizationId, billingInvoiceId])
  @@map("billing_payments")
}

// ============================================================
// SMS LOG + AUDIT LOG
// ============================================================
model SmsLog {
  id             String    @id @default(cuid())
  organizationId String
  recipientPhone String
  type           SmsType
  messageBody    String
  status         SmsStatus @default(QUEUED)
  relatedEntity  String?   // "collection:<id>" / "document:<id>" etc.
  gatewayRef     String?
  sentAt         DateTime?
  createdAt      DateTime  @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@index([organizationId, type, status])
  @@index([organizationId, createdAt])
  @@map("sms_logs")
}

model AuditLog {
  id             String      @id @default(cuid())
  organizationId String
  userId         String?
  action         AuditAction
  entityType     String      // "Collection", "Vehicle", ...
  entityId       String?
  before         Json?
  after          Json?
  ipAddress      String?
  createdAt      DateTime    @default(now())

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User?        @relation(fields: [userId], references: [id])

  @@index([organizationId, entityType, entityId])
  @@index([organizationId, createdAt])
  @@map("audit_logs")
}
```

---

### Design logic explained

#### 1. Multi-tenancy (shared-database, shared-schema, discriminator column)

Every tenant-scoped table carries a non-null `organizationId` FK to `Organization` with `onDelete: Cascade`. This is the single tenant boundary — an owner account *is* a tenant, and multiple staff logins (`User` rows with `OWNER`/`MANAGER`/`ACCOUNTANT`) live under one org.

Enforcement layers, in order of trust:
- **Row-Level Security (recommended in production).** Add a Postgres RLS policy `USING (organization_id = current_setting('app.current_org')::text)` on every tenant table; the app sets `SET app.current_org = $orgId` per request/transaction. Prisma does not emit RLS, so ship it as a raw migration. This makes cross-tenant leakage impossible even if an app query forgets a `where`.
- **App layer.** A Prisma middleware/extension injects `organizationId` into every `where` and `data`, so developers can't accidentally omit it.
- **Composite uniqueness is always org-scoped** — `@@unique([organizationId, registrationNo])`, `@@unique([organizationId, phone])`, etc. Two different tenants can reuse the same vehicle plate or phone; uniqueness only holds inside a tenant.
- **Every hot-path index is composite and org-first** (`@@index([organizationId, vehicleId, collectionDate])`). Org-first ordering keeps a tenant's rows physically clustered in the index and lets every dashboard query prune to one tenant immediately.

Cross-org shared/global tables are deliberately the exception: `SubscriptionPlan` (platform price book) and the marketplace-moderation surface have no `organizationId` because they are platform-owned, not tenant data.

`Subscription.billableVehicleCount` + `Vehicle.isBillable` implement the freemium rule: exactly one vehicle per org may have `isBillable = false` (the "1 vehicle free forever"); the rest count toward postpaid billing. Non-payment flips `Organization.isActive`/`BillingStatus.SOFT_LOCKED` to gate paid features without deleting data.

#### 2. Driver-dues derivation

Dues are **event-sourced from collections, then materialized** so the RED "outstanding" number is O(1) to read.

Per collection entry:
```
shortfall = max(0, dailyTarget − amountCollected − discountAmount)
```
This is persisted on `Collection.shortfall` (snapshotting `dailyTarget` at entry time so later target changes don't rewrite history — critical for the audit/anti-theft guarantee, alongside `enteredAt` wall-clock and `isBackdated`).

If `shortfall > 0`, a `DriverDue` row is written with `sourceCollectionId` (unique → one due per collection) and `remainingBalance = amount`. When a driver over-deposits later (`amountCollected > target`), the surplus is applied against the oldest open `DriverDue` rows (FIFO): increment `amountRepaid`, recompute `remainingBalance = amount − amountRepaid`, and set `isSettled` when it hits zero. Discounts/waivers (ছাড়) reduce the shortfall at source rather than creating a due.

A driver's live outstanding is `SUM(remainingBalance) WHERE driverId = ? AND isSettled = false`, served by `@@index([organizationId, driverId, isSettled])`. It is derived, never hand-entered, so "zero manual arithmetic" holds. The identical shape drives charging (`ChargingSession.addedDue = expectedRate − amountPaid`, suppressed when `Customer.hasFixedRate`) and rental (`Booking.outstandingDue = fare − advance − payments`).

#### 3. Profit-loss derivation

There are two P&L layers that reconcile:

**Operational per-vehicle P&L (the fast dashboard number):**
```
revenue(vehicle)  = Σ Collection.amountCollected
                  + Σ Booking.fare (rental)
                  + Σ ChargingSession.amountPaid (charging)
expenses(vehicle) = Σ Expense.amount              (fuel, repair, toll, bata, garage rent, …)
                  + Σ FuelEntry.cost              (if fuel tracked as fuel log not generic expense)
                  + Σ ServiceRecord.cost
                  + Σ (Accident.fineAmount + Accident.damageCost)  ← auto-posted as Expense
P&L(vehicle)      = revenue − expenses
```
Everything that costs money carries a `vehicleId`, so per-vehicle isolation is a `GROUP BY vehicleId`, and the fleet roll-up is the ungrouped sum. Accident fines/damage are auto-posted into `Expense` (linked back via `Expense.sourceAccidentId`) so they land in exactly one place and never double-count. Every income/expense row also carries a `categoryId` (khat) → category-wise reports are a `GROUP BY categoryId`.

**Authoritative double-entry P&L (balance sheet / trial balance):**
`JournalEntry` + `JournalLine` against `LedgerAccount` enforce that every transaction debits one account and credits another. A valid entry satisfies `Σ debits = Σ credits` (enforced in the posting transaction). Trial balance = per-account `Σ(debit) − Σ(credit)`; the income statement = income-type accounts − expense-type accounts. `JournalLine.amount` uses `Decimal(14,2)` throughout — **never floats** — so money never drifts. `isBackdated` on both `Collection`/`Expense`/`JournalEntry` flags out-of-period postings for the audit view.

The operational number is the denormalized cache for speed; the ledger is the source of truth for accountants. In production a posting service writes both in one transaction so they can't diverge.

#### Production notes worth flagging
- **`LocationPing`** is the only high-write, high-volume table (100+ vehicles × ping/10s). Model it as a **declaratively partitioned** table (monthly range partitions on `recordedAt`) or move it to Timescale; keep only `GpsTrip` summaries in the relational hot path. `BigInt` PK is intentional.
- **Double-booking prevention**: add a Postgres `EXCLUDE USING gist` constraint on `bookings(vehicle_id WITH =, tstzrange(start_date_time, end_date_time) WITH &&)` via raw migration — Prisma can't express range-overlap exclusion.
- **One active assignment per vehicle**: enforce with a partial unique index `CREATE UNIQUE INDEX ON driver_assignments(vehicle_id) WHERE end_date IS NULL`.
- All money is `@db.Decimal` with fixed scale; all money defaults are `0`, not null, to keep aggregates branch-free.
- Documents/service reminders are scanned by a cron over `@@index([organizationId, expiryDate])` / `nextServiceDueDate`, emitting `SmsLog` + push rows; `reminderSent` prevents duplicate sends.


---

## অংশ ৫ — REST API স্পেক


## আমার অটো (Amar Auto) — Mobile REST API Surface

### 0. Global Conventions

**Base URL**: `https://api.amar-auto.com/v1`

**Auth**: Bearer JWT in `Authorization: Bearer <access_token>`.
- Access token: short-lived (15 min), claims: `sub` (user_id), `org` (owner_account_id), `role`, `device_id`, `scope[]`, `plan`.
- Refresh token: long-lived (60 d), rotated on each refresh, bound to `device_id` (multi-device: one refresh token row per device).
- Scopes: `owner:*`, `manager:*`, `accountant:read`, `accountant:write:txn`, etc. Endpoints below list the minimum scope. `owner` implies all scopes for its org.

**Multi-tenancy**: every resource is scoped to `org` claim server-side; clients never pass `owner_id`.

**i18n**: `Accept-Language: bn` (default) or `en`. Affects: validation/error messages, category names (khat), enum display labels, SMS/receipt templates, PDF output. Enum *values* stay stable ASCII (`vehicle_type=cng`); each list response includes a `label` (localized) alongside the raw `value`. `?lang=bn` query override supported.

**Pagination** (all list endpoints): cursor-based preferred.
- Request: `?limit=25&cursor=<opaque>` (also legacy `?page=1&per_page=25`).
- Response envelope:
```json
{ "data": [ ... ],
  "meta": { "next_cursor": "eyJpZCI6...", "has_more": true, "total": 240 } }
```

**Filtering/sorting** (common query params): `?from=2026-06-01&to=2026-06-30&vehicle_id=..&driver_id=..&category=fuel&status=pending&q=<search>&sort=-created_at`.

**Standard response**: `{ "data": {...}, "meta": {...} }`. Errors: `{ "error": { "code": "VALIDATION_ERROR", "message": "...(localized)", "fields": {"phone":"..."} } }`. HTTP status semantics standard (401 no/expired token → refresh; 402 payment-required → soft-lock; 403 scope; 409 conflict e.g. double-booking; 422 validation; 429 OTP/rate limit).

**Offline-first**: mutating requests accept `Idempotency-Key` header + optional `client_id` (client-generated UUID) and `client_created_at`. Bulk sync endpoint below. Server returns `server_id` mapping.

**Money**: integers in poisha? — use string decimal `"amount": "150.00"` BDT to avoid float issues.

---

### A. Auth & Onboarding  `/auth`

| METHOD | Path | Purpose | Key request fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/auth/send-otp` | Start signup/login; send OTP SMS | `phone`, `purpose`(signup\|login\|reset_pin), `device_id`, `device_name` | `{ otp_token, expires_in:120, resend_after:30, channel:"sms" }` | none (rate-limited by IP+phone) |
| POST | `/auth/verify-otp` | Verify OTP → issue tokens (or signup ticket if new) | `otp_token`, `otp_code`, `device_id` | `{ verified:true, is_new_user, signup_ticket?, access_token?, refresh_token?, user? }` | none |
| POST | `/auth/signup` | Complete new-account creation after OTP | `signup_ticket`, `name`, `business_mode`, `terms_accepted:true`, `lang` | `{ user, org, access_token, refresh_token }` | signup_ticket |
| POST | `/auth/set-pin` | Set/change 4–6 digit quick-login PIN | `pin`, `pin_confirm`, `current_pin?` | `{ ok:true }` | Bearer (fresh session) |
| POST | `/auth/pin-login` | Quick login on a known device | `phone` or `device_id`, `pin` | `{ access_token, refresh_token, user }` | none (device must have prior refresh token; lockout after N tries → OTP) |
| POST | `/auth/password-login` | Alt credential | `phone`, `password` | `{ access_token, refresh_token, user }` | none |
| POST | `/auth/set-password` | Set/change password | `password`, `current_password?` | `{ ok }` | Bearer |
| POST | `/auth/refresh` | Rotate access token | `refresh_token` (header or body) | `{ access_token, refresh_token, expires_in }` | refresh token |
| POST | `/auth/logout` | Revoke this device's refresh token | `refresh_token` | `204` | Bearer |
| GET | `/auth/devices` | List logged-in devices (multi-device) | — | `[{ device_id, name, last_active_at, current:bool, ip }]` | Bearer |
| DELETE | `/auth/devices/{device_id}` | Remote logout a device | — | `204` | owner/self |
| GET | `/auth/me` | Current session/user + effective scopes + plan/bill_status | — | `{ user, org, role, scopes[], plan, bill_status, soft_locked }` | Bearer |

Notes: OTP is primary credential; PIN & password are conveniences. `send-otp` returns `429` with `resend_after` on flood. `verify-otp` for a soft-locked (unpaid) account still succeeds but `access_token` carries `soft_locked:true`.

---

### B. Org / Profile  `/org`, `/profile`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/org` | Owner account/org settings | — | `{ id, name, business_mode, verticals_enabled[], bkash_number, plan, bill_status, terms_accepted_at, address, currency, lang }` | member |
| PATCH | `/org` | Update org profile / business_mode / vertical presets | `name`, `business_mode`, `verticals_enabled[]`, `bkash_number`, `lang`, `default_currency` | updated org | `owner` |
| GET | `/profile` | Current user profile | — | `{ id, name, phone, email, photo_url, role, pin_set, password_set, lang }` | self |
| PATCH | `/profile` | Update own profile | `name`, `email`, `photo_url`, `lang` | updated | self |
| GET | `/org/dashboard` | Smart Dashboard aggregate (today) | `?date=` | `{ today_collections, today_expenses, today_profit, active_vehicles, running_vehicles, unread_qr, overdue_docs, driver_dues_total }` | member |
| POST | `/org/backup/export` | Trigger cloud backup / data export | `format`(json\|encrypted) | `{ job_id, status }` | owner |

---

### C. Users, Roles & Staff Permissions  `/users`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/users` | List staff | filter `role`, `status` | paginated `[{ id, name, phone, role, permissions[], status }]` | `owner`\|`manager` |
| POST | `/users` | Invite/create staff (manager/accountant) | `name`, `phone`, `role`, `permissions[]` | created user + invite OTP flow | `owner` |
| GET | `/users/{id}` | Staff detail | — | user | `owner`\|self |
| PATCH | `/users/{id}` | Update role/permissions | `role`, `permissions[]`, `status` | updated | `owner` |
| DELETE | `/users/{id}` | Remove staff | — | `204` | `owner` |
| GET | `/roles` | Role catalog + permission matrix | — | `[{ role, default_permissions[] }]` | member |
| GET | `/permissions` | Available permission keys (for UI toggles) | — | `[{ key, label_bn, label_en, group }]` | `owner` |

---

### D. Vehicles & Fleet  `/vehicles`  + QR

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/vehicles` | Fleet list / calendar | filter `vehicle_type`, `status`(active\|inactive), `availability`(empty\|rented\|booked), `running`, `q`, `assigned_driver_id` | paginated vehicle summaries incl. `profit_loss`, live `status` | member |
| POST | `/vehicles` | Add vehicle | `registration_no`, `vehicle_type`, `model`, `voltage_range?`, `current_odometer`, `assigned_driver_id?`, `daily_deposit_target?`, `route?` | vehicle | `owner`\|`manager` |
| GET | `/vehicles/{id}` | Vehicle profile | — | full vehicle: docs expiry, odometer, gps_device_id, driver, `profit_loss`, counts | member |
| PATCH | `/vehicles/{id}` | Edit | any writable field | updated | `owner`\|`manager` |
| DELETE | `/vehicles/{id}` | Deactivate | — | `204` (soft) | `owner` |
| GET | `/vehicles/{id}/pnl` | Per-vehicle P&L | `from`,`to` | `{ revenue, expenses_by_category{}, net_profit }` | member |
| GET | `/vehicles/{id}/history` | Repair+service+accident timeline | `type` | paginated events | member |
| GET | `/vehicles/{id}/documents` | Document list + expiry | — | `[{ doc_type, expiry_date, status(valid\|expiring\|expired), reminder_offset_days }]` | member |
| PUT | `/vehicles/{id}/documents/{doc_type}` | Set/renew a document | `issue_date`, `expiry_date`, `reminder_lead_time` | doc | `owner`\|`manager` |
| POST | `/vehicles/{id}/accidents` | Log accident (auto-posts expense) | `date`, `description`, `photos[]`, `fine_amount?`, `damage_cost?` | accident + created expense refs | member |
| **QR** | | | | | |
| GET | `/vehicles/{id}/qr` | Get/generate vehicle QR + custom text | — | `{ qr_payload, qr_image_url, custom_text }` | member |
| PATCH | `/vehicles/{id}/qr` | Edit custom QR text | `custom_text` | updated | `owner`\|`manager` |
| POST | `/qr/print` | Bulk QR print sheet | `vehicle_ids[]` or `all:true` | `{ pdf_url }` | member |
| GET | `/qr/dashboard` | Smart QR dashboard | — | `{ total_scans, unread, by_type{verification,complaint,lost_item,accident} }` | member |
| GET | `/qr/messages` | Passenger messages/complaints inbox | filter `type`, `read`, `vehicle_id` | paginated anonymous messages | member |
| PATCH | `/qr/messages/{id}` | Mark read / reply (anonymous relay) | `read`, `reply_text?` | updated | member |
| POST | `/public/qr/{qr_payload}/scan` | (public) passenger scans → verify + open contact channel | `passenger_msg?`, `type` | `{ vehicle:{reg,type,verified}, driver:{name,photo}, contact_token }` | **public/anon** |

---

### E. Drivers & KYC  `/drivers`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/drivers` | Driver list | filter `status`, `assigned_vehicle_id`, `has_dues`, `q` | paginated `[{ id,name,phone,assigned_vehicle,outstanding_dues,daily_collection_target,status }]` | member |
| POST | `/drivers` | Add driver | `name`, `phone`, `profession`, `daily_collection_target`, `assigned_vehicle_id?` | driver | `owner`\|`manager` |
| GET | `/drivers/{id}` | Profile + dues summary | — | driver incl. `total_deposited,total_discount,outstanding_dues` | member |
| PATCH | `/drivers/{id}` | Edit | writable fields | updated | `owner`\|`manager` |
| POST | `/drivers/{id}/kyc` | Upload KYC docs | `nid_no`, `photo`, `documents[]`(file refs) | `{ kyc_status }` | `owner`\|`manager` |
| GET | `/drivers/{id}/ledger` | Driver & dues ledger | `from`,`to` | `[{ date, deposit, due, discount, running_balance }]` | member |
| POST | `/drivers/{id}/assignments` | Assign to vehicle | `vehicle_id`, `effective_date` | assignment | `owner`\|`manager` |

---

### F. Assignments  `/assignments`
(driver↔vehicle history; also usable for staff↔vehicle scope)

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/assignments` | List current/historical assignments | `vehicle_id`,`driver_id`,`active` | paginated | member |
| POST | `/assignments` | Create assignment | `vehicle_id`,`driver_id`,`start_date` | assignment | `owner`\|`manager` |
| PATCH | `/assignments/{id}` | End/transfer | `end_date` | updated | `owner`\|`manager` |

---

### G. Daily Collections & Receipts  `/collections`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/collections` | One-tap daily collection entry | `driver_id`, `vehicle_id`, `amount_collected`, `collection_date?`(backdate→flagged), `discount_amount?`, `note?`, `send_sms?`, `client_id`, `Idempotency-Key` | `{ collection, shortfall, running_due_balance, receipt:{id,pdf_url,image_url,share_link}, backdated_flag }` | write:txn |
| GET | `/collections` | List collections | `driver_id`,`vehicle_id`,`from`,`to`,`backdated` | paginated incl. `shortfall`,`sms_receipt_sent` | member |
| GET | `/collections/{id}` | Detail | — | collection + receipt | member |
| PATCH | `/collections/{id}` | Correct (audit-logged) | `amount_collected`,`discount_amount`,`note` | updated | `owner`\|`manager` |
| DELETE | `/collections/{id}` | Void (reversing entry) | `reason` | `204` | `owner` |
| GET | `/collections/{id}/receipt` | Regenerate/fetch receipt | `format`(pdf\|image) | `{ pdf_url, image_url, share_link }` | member |
| POST | `/collections/{id}/send-sms` | Resend SMS receipt to driver | — | `{ sms_id, status }` | write:txn |

Business logic surfaced: if `amount_collected < daily_target` → `DriverDue` auto-created; over-deposit auto-reduces prior dues; every entry timestamped.

---

### H. Trips / Bookings / Rentals  `/trips`, `/bookings`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/bookings` | Booking calendar | `vehicle_id`,`from`,`to`,`status` | paginated bookings + availability | member |
| POST | `/bookings` | Create booking (double-booking guarded → 409) | `vehicle_id`,`customer_id`,`driver_id?`,`start_datetime`,`end_datetime`,`fare`,`advance_paid?` | booking | member |
| GET | `/bookings/{id}` | Detail | — | booking + `outstanding_due` | member |
| PATCH | `/bookings/{id}` | Update/cancel | fields, `status` | updated | member |
| POST | `/trips/start` | One-tap START (রিলিজ) — hourly/odo trip | `vehicle_id`,`customer_id?`,`driver_id?`,`start_odometer?`,`hourly_rate?`,`base_rate?` | `{ trip_id, start_time }` | write:txn |
| POST | `/trips/{id}/end` | One-tap END (এন্ড) → compute bill | `end_odometer?`,`surcharge?` | `{ distance, elapsed_hours, fare, invoice:{id,pdf,share_link} }` | write:txn |
| GET | `/trips` | Trip/handover list | `vehicle_id`,`driver_id`,`from`,`to` | paginated | member |
| GET | `/trips/{id}` | Trip detail | — | trip + invoice | member |

Hourly bill = `base_rate + hourly_rate×hours + surcharge`. `outstanding_due = fare − (advance + payments)`.

---

### I. Ledger — Expenses / Income  `/transactions`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/transactions` | Money history (double-entry ledger) | `type`(income\|expense), `category`, `vehicle_id`, `driver_id`, `from`, `to`, `backdated`, `q` | paginated `[{ id,date,type,category{value,label},amount,debit_account,credit_account,vehicle,note,backdated_flag }]` | member |
| POST | `/transactions/expense` | Add expense | `vehicle_id?`,`driver_id?`,`category`,`amount`,`date?`,`note?`,`client_id`,`Idempotency-Key` | txn | write:txn |
| POST | `/transactions/income` | Add income | `vehicle_id?`,`category`,`amount`,`date?`,`source`,`note?` | txn | write:txn |
| POST | `/transactions/voice` | Voice entry (audio → parsed txn) | `audio` (file), `lang` | `{ draft_txn, confidence }` (confirm via normal POST) | write:txn |
| GET | `/transactions/{id}` | Detail | — | txn incl. double-entry pair | member |
| PATCH | `/transactions/{id}` | Edit (audit) | fields | updated | `owner`\|`manager` |
| DELETE | `/transactions/{id}` | Reverse | `reason` | `204` | `owner` |
| GET | `/categories` | Expense/income categories (khat), localized | `type` | `[{ id, value, label, type }]` | member |
| POST | `/categories` | Custom category | `name`,`type` | category | `owner`\|`manager` |
| GET | `/budgets` | Monthly budgets + actuals | `month` | `[{ category, budget_amount, actual_amount, alert_threshold, over:bool }]` | member |
| PUT | `/budgets` | Set category budget | `month`,`category`,`budget_amount`,`alert_threshold` | budget | `owner`\|`manager` |

---

### J. Fuel  `/fuel`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/vehicles/{id}/fuel` | Fuel log | `from`,`to` | paginated `[{ fill_date,volume_liters,price_per_liter,cost,odometer,distance_since_last,kpl,cost_per_km,payment_method }]` | member |
| POST | `/vehicles/{id}/fuel` | Add fill-up (auto KPL/cost-per-km) | `volume_liters`,`price_per_liter`,`odometer_reading`,`payment_method`,`fill_date?`,`city_highway_split?` | entry w/ computed mileage; also posts fuel expense | write:txn |
| PATCH | `/fuel/{id}` | Edit | fields | updated | `owner`\|`manager` |
| GET | `/vehicles/{id}/fuel/analytics` | Fuel analytics | `from`,`to` | `{ avg_fillup_cost, kpl_avg, cost_per_km, city_pct, highway_pct, price_trend[] }` | member |

---

### K. Maintenance & Documents  `/maintenance`, `/documents`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/vehicles/{id}/services` | Service/repair history | `from`,`to` | paginated `[{ service_type,date,cost,odometer_at_service,parts_replaced[],next_service_due,overdue_flag }]` | member |
| POST | `/vehicles/{id}/services` | Log service (posts expense) | `service_type`,`date`,`cost`,`odometer_at_service`,`service_interval?`,`parts_replaced[]?` | service | write:txn |
| PATCH | `/services/{id}` | Edit | fields | updated | `owner`\|`manager` |
| GET | `/maintenance/dashboard` | Reminders + costs | — | `{ due_soon[], overdue[], total_cost, ytd_cost, avg_cost }` | member |
| GET | `/document-alerts` | All doc expiry alerts across fleet | `status`(expiring\|expired),`doc_type`,`vehicle_id` | paginated `[{ vehicle, doc_type, expiry_date, days_left, status }]` | member |
| GET | `/reminders` | Unified service+document+GPS reminders | `source`,`read` | paginated | member |
| PATCH | `/reminders/{id}` | Ack/mark read | `read` | updated | member |

---

### L. Inventory & Parts  `/inventory`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/parts` | Parts stock list | `category`,`brand`,`location`,`reorder_needed`,`q` | paginated `[{ id,name,part_number,brand,stock_quantity,reorder_level,reorder_flag,purchase_price,sale_price,location }]` | member |
| POST | `/parts` | Add part | `name`,`category`,`part_number`,`brand`,`reorder_level`,`purchase_price`,`sale_price`,`location`,`opening_stock` | part | write:txn |
| GET | `/parts/{id}` | Detail + movement history | — | part + `[stock_movements]` | member |
| PATCH | `/parts/{id}` | Edit | fields | updated | `owner`\|`manager` |
| GET | `/parts/reorder` | Reorder-needed report | — | `[{ part, shortfall }]` | member |
| GET | `/parts/dead-stock` | Slow-moving/dead stock | `days` | `[{ part, last_moved_at }]` | member |

#### Stock Movements  `/stock-movements`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/stock-movements` | Ledger of stock in/out | `part_id`,`type`,`from`,`to` | paginated `[{ part,type(purchase\|sale\|writeoff\|return_in\|return_out\|count_adjust),qty,ref,date }]` | member |
| POST | `/stock-movements` | Manual adjust / write-off / physical count | `part_id`,`type`,`qty`,`reason`,`counted_qty?` | movement + new `stock_quantity` | write:txn |

#### Suppliers  `/suppliers`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/suppliers` | List | `has_dues`,`q` | paginated `[{ id,name,contact,outstanding_balance }]` | member |
| POST | `/suppliers` | Add | `name`,`contact` | supplier | write:txn |
| GET | `/suppliers/{id}` | Profile + ledger | — | supplier + `[ledger_entries]`, `outstanding_balance` | member |
| PATCH | `/suppliers/{id}` | Edit | fields | updated | `owner`\|`manager` |
| POST | `/suppliers/{id}/payments` | Pay supplier due | `amount`,`date`,`method` | `{ payment, new_balance }` | write:txn |

#### Purchases & Sales  `/purchases`, `/sales`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/purchases` | Purchase invoice (multi-item, credit) | `supplier_id`,`line_items[{part_id,qty,price}]`,`discount?`,`credit_amount?`,`date?` | `{ invoice, total, status, receipt_pdf, stock_updated }` | write:txn |
| GET | `/purchases` | List | `supplier_id`,`status`,`from`,`to` | paginated | member |
| GET | `/purchases/{id}` | Detail + printable | — | invoice | member |
| POST | `/sales` | Sale invoice (multi-item, credit) | `customer_id`,`line_items[]`,`discount?`,`credit_amount?` | `{ invoice, total, status, receipt_pdf, share_link, stock_updated }` | write:txn |
| GET | `/sales` | List | `customer_id`,`status`,`from`,`to` | paginated | member |
| GET | `/sales/{id}` | Detail | — | invoice | member |
| POST | `/purchases/{id}/returns` / `/sales/{id}/returns` | Return items | `line_items[]`,`reason` | return + stock movement | write:txn |
| GET | `/inventory/reports` | Purchases / payables / reorder / dead-stock rollup | `type`,`from`,`to` | report | member |

---

### M. Customers / Parties, Loans & Charging  `/customers`, `/loans`, `/charging`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/customers` | CRM list (rental/charging/party) | `type`,`has_dues`,`q` | paginated `[{ id,name,phone,outstanding_dues,advance,receivable }]` | member |
| POST | `/customers` | Add | `name`,`phone`,`id_document?`,`photo?`,`profession?`,`daily_rate?`,`has_fixed_rate?` | customer | write:txn |
| GET | `/customers/{id}` | Profile + rental/txn history | — | customer + history | member |
| PATCH | `/customers/{id}` | Edit | fields | updated | member |
| GET | `/customers/{id}/party-ledger` | Party ledger (পাওনা/দেনা/অগ্রিম/পরিশোধ) | `from`,`to` | `[{ date,debit,credit,type,running_balance }]` + `{ receivable, advance, settled, net }` | member |
| POST | `/customers/{id}/party-ledger` | Post party entry | `type`(paona\|dena\|advance\|porishodh),`amount`,`date`,`note?` | entry + running_balance | write:txn |
| **Loans** | | | | | |
| GET | `/loans` | Loans/installments (given/taken/HP) | `type`,`status` | paginated `[{ id,type,principal,remaining_balance,next_installment }]` | member |
| POST | `/loans` | Create loan/HP | `type`(given\|taken\|hp),`principal_amount`,`party_id?`,`installment_amount`,`schedule[]` | loan | write:txn |
| GET | `/loans/{id}` | Detail + schedule + payments | — | loan | member |
| POST | `/loans/{id}/payments` | Record installment | `amount`,`date` | `{ payment, remaining_balance }` | write:txn |
| **Charging** | | | | | |
| GET | `/charging/sessions` | Daily charging collections | `customer_id`,`from`,`to`,`status` | paginated `[{ customer,date,amount_paid,expected_rate,shortfall,status }]` | member |
| POST | `/charging/sessions` | Log charge session | `customer_id`,`amount_paid`,`date?` | `{ session, new_dues }` (flexible-rate customers accrue none) | write:txn |
| GET | `/charging/customers/{id}/bill` | Charging bill/dues | `period`(daily\|monthly) | `{ charge_amount, due_balance }` | member |

`new_dues = previous_dues + (daily_rate − amount_paid)`; `has_fixed_rate=false` (flexible) → all income, no dues.

---

### N. Reports  `/reports`

All accept `from`, `to`, `vehicle_id?`, `driver_id?`, `category?`, and `?format=json|pdf|excel` (non-json returns `{ export_job_id }` or `{ file_url }`).

| METHOD | Path | Purpose | Response (json) | Auth |
|---|---|---|---|---|
| GET | `/reports/income-expense` | Income vs expense summary + trend | `{ total_income, total_expense, net, by_category[], series[] }` | member |
| GET | `/reports/pnl` | Profit & Loss (overall or per vehicle) | `{ revenue, cogs, expenses_by_category[], gross_profit, net_profit }` | member |
| GET | `/reports/balance-sheet` | Balance sheet (double-entry) | `{ assets[], liabilities[], equity[], totals }` | accountant:read |
| GET | `/reports/trial-balance` | Trial balance | `{ accounts:[{account,debit,credit}], totals:{debit,credit,balanced} }` | accountant:read |
| GET | `/reports/driver-dues` | Driver dues aging | `[{ driver, total_deposited, outstanding_dues, discount, collection_rate }]` | member |
| GET | `/reports/calendar` | Day-by-day income/expense | `[{ date, income, expense, net }]` | member |
| GET | `/reports/analytics` | Trends / sources / collection rate charts | `{ series[], sources[], collection_rate }` | member |
| GET | `/reports/money-history` | Filterable chronological log (alias of `/transactions`) | paginated | member |
| POST | `/reports/export` | Kick off PDF/Excel export of any report | body: `{ report, params, format }` → `{ export_job_id }` | member |
| GET | `/exports/{job_id}` | Poll export status / download | `{ status, file_url, expires_at }` | member |

---

### O. GPS Tracking  `/gps`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/gps/devices` | Trackers list + mapping | `mapped`,`vehicle_id` | `[{ device_id,imei,sim_operator,mapped_vehicle_id,last_update_time,install_status }]` | member |
| POST | `/gps/devices/{id}/map` | Map device → vehicle | `vehicle_id` | updated | `owner`\|`manager` |
| GET | `/gps/live` | Live positions (all/mixed fleet, ~10s) | `vehicle_ids[]?`,`bbox?` | `[{ vehicle_id,lat,lng,speed,ignition,traffic_state,ts,status(running\|stopped) }]` | member |
| GET | `/gps/vehicles/{id}/live` | Single live position | — | position | member |
| GET | `/gps/vehicles/{id}/history` | Route history/playback | `from`,`to` | `{ points:[{lat,lng,speed,ts}], distance, duration, max_speed, avg_speed }` | member |
| GET | `/gps/vehicles/{id}/trips` | Trip report list | `from`,`to` | paginated `[{ trip_id,start,end,distance,duration,max_speed }]` | member |
| GET | `/gps/trips/{trip_id}` | Trip playback detail | — | trip + path | member |
| POST | `/gps/vehicles/{id}/immobilizer` | Remote engine lock/unlock (cut-off relay) | `action`(lock\|unlock),`pin` | `{ command_id, status }` | `owner` (fresh auth) |
| GET | `/gps/alerts` | Smart alerts feed | `type`(engine_on_off\|overspeed\|geofence),`vehicle_id`,`read`,`from`,`to` | paginated `[{ type,vehicle,value,location,ts,message,read }]` | member |
| PATCH | `/gps/alerts/{id}` | Mark read | `read` | updated | member |
| GET | `/gps/geofences` | List geofences | `vehicle_id` | `[{ id,name,shape,coordinates,radius,alert_on_enter,alert_on_exit }]` | member |
| POST | `/gps/geofences` | Create geofence | `name`,`vehicle_id?`,`shape`,`coordinates`,`radius`,`alert_on_enter`,`alert_on_exit` | geofence | `owner`\|`manager` |
| PATCH/DELETE | `/gps/geofences/{id}` | Edit/remove | fields | updated/`204` | `owner`\|`manager` |
| POST | `/gps/orders` | Order tracker hardware (COD) | `customer_name`,`phone`,`address`,`vehicle_type`,`plan_term`,`device_qty` | `{ order_id, status:"ordered" }` | member |
| GET | `/gps/orders/{id}` | Order status (ordered→called→installed→live) | — | order | member |

---

### P. Billing & Subscription  `/billing`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/billing/plans` | Plan catalog (freemium + GPS tiers/terms) | `?category` | `[{ plan_id,vehicle_category,base_monthly_price,terms:[{months,per_month_price,discount}],features[] }]` | member |
| GET | `/billing/subscription` | Current subscription + soft-lock state | — | `{ plan, vehicles_billable, free_vehicle_used, status, soft_locked }` | member |
| POST | `/billing/subscription` | Choose/upgrade plan (postpaid) | `plan_id`,`billing_term`,`vehicle_ids[]?` | subscription | `owner` |
| GET | `/billing/usage` | Current-period usage meter | `period?` | `{ period, vehicles_active, line_items[], projected_total }` | `owner` |
| GET | `/billing/invoices` | Postpaid invoices | `status`,`from`,`to` | paginated `[{ id,billing_period,total_amount,status,due_date }]` | `owner` |
| GET | `/billing/invoices/{id}` | Invoice detail + line items | — | invoice + `pdf_url` | `owner` |
| POST | `/billing/invoices/{id}/pay` | Initiate bKash payment | `method`(bkash\|nagad\|rocket),`msisdn?` | `{ payment_id, gateway_redirect_url \| bkash_execute_ref, status:"initiated" }` | `owner` |
| GET | `/billing/payments/{id}` | Poll payment status | — | `{ status(initiated\|success\|failed), invoice_id }` | `owner` |
| POST | `/webhooks/bkash` | **bKash payment webhook** (gateway→server) | signed payload: `paymentID`,`trxID`,`amount`,`invoice_ref`,`status` | `200 {received:true}`; server verifies signature, marks invoice paid, lifts soft-lock | **gateway auth** (HMAC signature header, IP allowlist — not user JWT) |

Rules surfaced: 1 vehicle free forever; extra vehicles billable monthly/yearly; 7-day payment window; non-payment → `bill_status=overdue` → paid features return `402` (soft-lock, no deletion).

---

### Q. Notifications, SMS & Support  `/notifications`, `/sms`, `/support`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/notifications` | In-app/push feed | `read`,`type` | paginated `[{ id,type(dues\|doc_expiry\|payment\|alert),title,body,ref,read,ts }]` | member |
| PATCH | `/notifications/{id}` | Mark read | `read` | updated | member |
| POST | `/notifications/read-all` | Mark all read | — | `{ updated }` | member |
| POST | `/devices/push-token` | Register FCM/APNs token (per device) | `token`,`platform`(android\|ios),`device_id` | `{ ok }` | member |
| GET | `/sms/logs` | Sent SMS history | `type`(receipt\|dues\|bill_link\|doc_expiry),`recipient`,`from`,`to` | paginated `[{ id,recipient_phone,type,message_body,sent_at,status }]` | member |
| POST | `/sms/send` | Manual SMS (dues reminder / bill link) | `recipient_phone`,`type`,`ref_id?`,`message?` | `{ sms_id, status }` | write:txn |
| GET | `/support/tickets` | Support chat/tickets | `status` | paginated | member |
| POST | `/support/tickets` | Open ticket / chat message | `message`,`channel`(chat\|phone) | ticket | member |
| POST | `/support/contact` | Contact form (Name*, Mobile, Message*) | `name`,`mobile?`,`message` | `{ received:true }` | member/public |

---

### R. Cross-cutting: Offline Sync & Marketplace

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/sync/batch` | Offline queue flush (bulk mutations, eventual consistency) | `operations[{ op_id,client_id,resource,method,payload,client_created_at }]` | `{ results:[{ op_id, status, server_id?, error? }], server_time }` | member |
| GET | `/sync/changes` | Pull server-side changes since cursor | `since`(cursor/ts),`resources[]` | `{ changes[], next_cursor }` | member |
| GET | `/marketplace/listings` | Public verified feed | `type`,`q` | paginated approved listings | member |
| POST | `/marketplace/listings` | Post ad (pending admin moderation) | `type`,`title`,`description`,`photos[]`,`map_location`,`price` | `{ listing, approval_status:"pending" }` | member |
| GET | `/marketplace/my-listings` | Own listings + approval status | — | paginated | member |

---

### Key JWT / Auth Conventions (summary)

- **Primary credential** = phone + OTP. PIN & password are device conveniences that mint the same JWT pair.
- **Access JWT claims**: `sub, org, role, device_id, scope[], plan, soft_locked, iat, exp(15m)`. Signed RS256; clients verify nothing, just carry it.
- **Refresh**: opaque, rotating, one row per `device_id` → enables **multi-device** and per-device remote logout. Reuse detection revokes the device chain.
- **Scope model**: role → default scope set; owner can grant granular staff permissions (`permissions[]`) that map to scopes. Endpoint auth column shows minimum.
- **Soft-lock (402)**: unpaid org keeps read + free-vehicle write; paid-feature writes rejected with `error.code=SUBSCRIPTION_REQUIRED` until webhook clears the invoice.
- **Idempotency + offline**: all POSTs accept `Idempotency-Key` and `client_id`; `/sync/batch` replays queued offline ops safely.
- **i18n**: `Accept-Language: bn|en`; enums return `{value,label}`; receipts/SMS/PDF render in the org/user `lang`.
- **Pagination**: cursor (`limit`+`cursor`) with `page`/`per_page` fallback; every list wrapped in `{data, meta}`.
- **Public/anon surface** (no JWT): `/public/qr/{payload}/scan` (passenger verify + anonymous owner contact) and `/webhooks/bkash` (HMAC-signed gateway callback).


---

## অংশ ৬ — আর্কিটেকচার ও রোডম্যাপ


## Amar Auto Clone — Tech Stack, Architecture & Phased Roadmap

### Guiding principle
Everything the ad promises is **one vehicle-agnostic double-entry accounting core** with vertical presets on top. Build the core ledger + multi-tenancy correctly once; GPS, inventory, rental, charging are all just modules writing into that same `Transaction`/`Ledger` spine. Reuse the owner's existing Node/TS/Prisma/PostgreSQL/React muscle memory — do not introduce a second language on the backend.

---

### 1. Recommended Stack (component by component)

#### Backend framework — **NestJS (Node + TypeScript)**
- The owner already writes Node/TS. NestJS gives the module boundaries a multi-tenant, multi-module SaaS needs (Accounts, Vehicles, Drivers, GPS, Billing as isolated modules), first-class DI for testability, built-in validation (`class-validator`), guards for role/tenant enforcement, and a Swagger/OpenAPI generator you get for free — which becomes your mobile app's contract.
- If the team prefers minimalism over structure, **Fastify + tsoa** is the lighter alternative, but for a product this broad NestJS's structure pays for itself by Phase 2.
- Expose a **REST API** (not GraphQL) — simpler for a low-literacy-market mobile app, trivial to cache, and the device/GPS webhooks and bKash callbacks are REST anyway.

#### ORM — **Prisma** (keep it)
- Already in the owner's stack. Use Prisma Migrate for schema evolution.
- **Multi-tenancy:** use a single database with a mandatory `ownerAccountId` (tenant) column on every tenant-scoped table, enforced by a Prisma **client extension / middleware** that auto-injects the tenant filter on every query. Do NOT rely on developers remembering to add `where: { ownerAccountId }`. Add Postgres **Row-Level Security** as a defense-in-depth backstop.
- Prisma's weak spot is heavy double-entry aggregation and time-series GPS. Drop to **raw SQL / Prisma `$queryRaw`** for ledger balance rollups and reporting; that's fine and expected.

#### Auth / OTP
- **Phone + OTP is the primary credential** (matches the product). Flow: phone → send OTP → verify → issue JWT (access + refresh). Add PIN and password as secondary/quick-login unlocks stored as Argon2 hashes.
- Roll your own OTP service (generate 6-digit, store hashed OTP in Redis with TTL + attempt counter + rate limit) rather than a paid identity provider — cheaper and you control the Bengali SMS copy.
- **JWT** with short-lived access tokens + rotating refresh tokens; support multi-device by storing refresh-token records per device.
- **SMS gateway for Bangladesh** (avoid Twilio — too expensive for BD OTP volume):
  - **SSL Wireless** (most trusted, bank-grade, masking/branded sender ID) — recommend for OTP + billing SMS.
  - Cheaper/bulk alternatives: **Reve Systems, Alpha SMS (sms.net.bd), MIMSMS, bulksmsbd, greenweb**.
  - Wrap the gateway behind an `SmsProvider` interface so you can fail over between two providers (OTP delivery reliability is a churn driver).

#### Web frontend — **React + TypeScript + Vite**, **TanStack Query**, **Tailwind + shadcn/ui**
- Owner already runs React. Vite for fast builds. **TanStack Query** for server-state/caching. **React Hook Form + Zod** for the heavy data-entry forms. **Recharts** or **ECharts** for analytics/fuel charts (ECharts handles Bengali labels and large series better).
- Admin/marketplace moderation panel is just another route-set in the same app gated by the platform-admin role.

#### Mobile framework — **React Native + Expo** ✅ (over Flutter)
Justification specific to this project:
- **Code & talent reuse:** the entire backend, types, and validation (Zod schemas) are TypeScript. With RN you share DTO types, validation logic, and even some business-rule utilities (due calculation, mileage) between web, mobile, and server. Flutter/Dart forces a second language and a duplicate model layer — real cost for a small team.
- **Expo** gives OTA updates (ship fixes without app-store review — huge for iterating in an emerging market), managed builds (EAS), push notifications, and easy access to camera (KYC/accident photos), microphone (voice entry), and location (GPS map) via well-maintained modules.
- Flutter's genuine edge is buttery 60fps custom UI and map rendering — not decisive here; this is a forms-and-ledgers app, not a game.
- **Bengali rendering:** both handle it, but verify complex-script shaping — bundle a known-good Bengali font (**Noto Sans Bengali / SolaimanLipi / Hind Siliguri**) rather than trusting device fonts.
- One caveat: the live-GPS map at 100+ vehicles refreshing every 10s is the one screen where RN needs care — use `react-native-maps` with clustering and throttle marker updates. Manageable.

#### GPS ingestion (Autonemo-style device API)
Keep this **decoupled from the accounting API** — different scaling profile (high-write, low-value-per-write time series).
- **Ingestion service:** a separate lightweight Node/Fastify (or Go if throughput demands) listener. Two integration modes:
  1. **Pull/proxy from Autonemo's API** (fastest path — the product literally partners with Autonemo GPS): poll their device API or receive their webhooks, normalize to your `LocationPing` shape.
  2. **Direct TCP protocol server** (if you own devices): most Chinese trackers speak **GT06 / JT808 / Concox** protocols over raw TCP. Use **Traccar** (open-source GPS server, supports 200+ protocols) as your ingestion layer and read from its DB/API — this saves you writing protocol parsers. Highly recommended.
- **Storage:** time-series data → **TimescaleDB** (a Postgres extension, so same DB engine, same Prisma-adjacent tooling) hypertable for `LocationPing`. Don't put 10-second pings in your transactional tables.
- **Live delivery to app:** **WebSocket** (or MQTT via EMQX if you want device-grade pub/sub) pushing last-known positions; app subscribes only to the vehicles on screen. Compute geofence/overspeed/ignition alerts in a stream consumer, write `Reminder`/`Alert` rows, fan out push+SMS.

#### File / PDF / Excel export
- **PDF (receipts, monthly P&L):** render an HTML template (Handlebars/React-to-HTML) → **Puppeteer** (headless Chromium) for pixel-perfect Bengali PDFs. Puppeteer handles Bengali fonts correctly where PDFKit struggles. For high volume, pre-warm a browser pool or use **Gotenberg** (Dockerized, stateless HTML→PDF microservice) — clean and scalable.
- Receipt "shareable image" → same template rendered to PNG.
- **Excel:** **ExcelJS** for styled `.xlsx` reports.
- Store generated files in **S3-compatible object storage** (see hosting) and hand out signed URLs for the shareable links.

#### bKash payment integration
- Use **bKash PGW / Tokenized Checkout** (merchant account required). Flow: `Grant Token → Create Payment → Execute Payment → Query/Callback`. Handle the token caching (grant token ~1hr) and idempotency.
- Since billing is **postpaid**, at month-end you generate the invoice, send a **bKash payment link/SMS**, and reconcile via the execute/callback + a **Query Payment** cron for stragglers. Don't mark paid on redirect alone — confirm server-side.
- Wrap behind a `PaymentProvider` interface so **Nagad / Rocket** ("coming soon") slot in later.
- Never store bKash credentials client-side; all PGW calls are server-to-server.

#### Hosting / VPS
- **Users are in Bangladesh → latency matters.** Best price/performance/latency: a VPS in **Singapore** (DigitalOcean SGP1, Linode/Akamai SG, or **AWS ap-southeast-1**) — ~30-60ms to BD, far cheaper and more reliable than most local hosts. For lowest possible latency/BDIX peering you could use a local provider (**ExonHost, Dhaka Colo, XeoNBD**) but reliability is uneven — start regional, add a BD edge/CDN later.
- **Low-cost concrete setup:** one **Hetzner (EU) or DigitalOcean SGP** VPS (4 vCPU / 8GB) running **Docker Compose**: app API, GPS ingestion, Postgres (+ Timescale), Redis, Gotenberg, Nginx/Caddy (auto-TLS). Add **BunnyCDN or Cloudflare** in front (both cheap, good BD presence) for static/web + the marketplace/receipt assets.
- **Object storage:** Cloudflare R2 or Backblaze B2 (no egress fees) instead of S3.
- Scale path: split GPS ingestion + Postgres to their own boxes; move to managed Postgres when revenue justifies. Don't over-engineer with Kubernetes early.
- **Backups:** nightly `pg_dump` + WAL archiving to R2/B2; this maps to the product's "encrypted cloud backup" promise.

#### Background jobs (reminders / SMS cron)
- **BullMQ** (Redis-backed) for job queues + repeatable/cron jobs — native to the Node stack, has delayed jobs, retries, dashboards (Bull Board).
- Jobs: daily driver-due SMS reminders, document-expiry reminders (route permit/fitness/insurance/tax token/registration), monthly postpaid invoice generation, bKash payment-link dispatch, payment reconciliation, service-due checks, budget-threshold alerts, offline-sync cleanup.
- Run the worker as a **separate process/container** from the API so heavy SMS/PDF batches don't block request latency.

#### i18n Bengali
- **Bengali is the default locale, English secondary** (the product treats Bengali as native, not a translation). Structure the app **i18n-first from commit one** — retrofitting is painful.
- Web: **i18next / react-i18next**. Mobile: **i18next + react-i18next** (shared translation JSON with web) or **expo-localization**.
- Watch: **Bengali numerals** (০১২৩...) vs Western digits — decide policy and centralize a number/date formatter (use **Intl** with `bn-BD` locale, or `dayjs`/`date-fns` with Bengali locale). Currency = ৳ (BDT). Bundle a proper Bengali font everywhere including PDFs.

#### Offline-first (mobile)
- Non-negotiable per the product ("entries queued locally, auto-sync on reconnect, eventual consistency"). This is the **hardest correctness problem** — design it early, don't bolt on.
- **Local store:** **WatermelonDB** (built for RN offline sync, SQLite-backed, observable, scales to large datasets) or SQLite + a sync layer. Alternatively **PowerSync** or **RxDB** if you want a managed sync engine.
- **Sync model:** each record gets a **client-generated UUID** (so offline creates don't collide), a `updatedAt`/version, and a **sync queue** of mutations. On reconnect, push queued mutations (idempotent, keyed by client UUID) then pull deltas. **Last-write-wins per field** is acceptable for this domain except money — for ledger entries treat them as **append-only immutable events** (you never edit a collection, you post a correcting entry), which sidesteps most merge conflicts. This is another reason the double-entry/event-sourced ledger design is the right core.
- Backdated entries + flagging fall out naturally from an append-only ledger with an `effectiveDate` separate from `createdAt`.

---

### 2. Core Architecture (one diagram in words)

```
[RN/Expo App] ─┐                          ┌─ BullMQ Workers (SMS, PDF, invoices, reminders)
[React Web]  ──┼─ REST API (NestJS) ──────┼─ Postgres + TimescaleDB (single tenant-scoped DB, RLS)
[Admin panel]─┘        │  │  │             ├─ Redis (OTP, cache, queues)
                       │  │  └─ PaymentProvider → bKash PGW
                       │  └──── SmsProvider → SSL Wireless / fallback
                       └─ WebSocket gateway (live positions/alerts)
[GPS Devices] → Traccar / Autonemo API → GPS Ingestion svc → TimescaleDB → stream consumer (geofence/overspeed) → Alerts
[Gotenberg] ← PDF/PNG receipts → R2/B2 object storage → signed shareable links
```

Everything tenant-scoped by `ownerAccountId`. Ledger is append-only. Modules are NestJS modules mapping 1:1 to the inventory's A–Q feature groups.

---

### 3. Phased Build Roadmap + Effort Estimates

Estimates assume a small team (≈2 backend, 1–2 frontend/mobile, part-time devops). Ranges are calendar time.

#### **MVP — "what the ad promises" (≈8–12 weeks)**
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

#### **Phase 2 — Monetization + operational depth (≈6–10 weeks)**
- **Postpaid billing engine**: month-end auto-invoice, usage line items, **bKash PGW** integration, payment-link SMS, 7-day window, **soft-lock** of paid features on non-payment, reconciliation cron.
- **Subscription plans** (single-vehicle free / multi-vehicle paid; monthly & prepay-term pricing).
- **Fuel & maintenance**: fuel log, auto KPL/cost-per-km, service records, **service + document-expiry reminders** (route permit/fitness/insurance/tax token/registration) via cron+SMS+push.
- **Rental/bookings**: booking calendar w/ double-booking prevention, customer CRM, rental invoice, hourly START/END billing.
- **Reports/analytics** expansion: charts, calendar report, budgets w/ thresholds.
- **Staff permissions** (manager/accountant roles).
- **Vehicle QR**: QR generation, passenger scan verification, anonymous messaging, complaints, bulk QR PDF.
- **Push notifications** (Expo).
- Harden **offline sync** across all entry types.

#### **Phase 3 — Platform + hardware + verticals (≈10–16 weeks, parallelizable)**
- **Live GPS**: Traccar/Autonemo ingestion, TimescaleDB, WebSocket live map (100+ vehicles, clustering), trip history/playback, geofence/overspeed/ignition **alerts**, tracker-to-vehicle mapping, **hardware order flow** (order→call→install→live, COD).
- **Inventory & parts**: stock, suppliers/credit, purchase/sale invoices, reorder & dead-stock reports.
- **Loans/installments/HP**, **party ledger** (paona/dena/advance), **charging station** module, **bus-association fund/member/route** accounting.
- **Auto marketplace** with admin moderation.
- **Voice entry** (mic → income/expense), **accident record** w/ photo→auto-expense, **achievements/gamification**, **encrypted cloud backup** surfaced to user, remaining **8 vertical presets**.
- **iOS** parity + store submission.

**Total to full feature parity:** roughly **6–9 months** with a small team; a compelling **MVP in ~2–3 months**.

---

### 4. Monetization Mechanics — "1 vehicle free forever" + postpaid bKash

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

### Key risks to design around early (don't defer)
1. **Offline sync correctness on money** — solve via append-only ledger + client UUIDs from day one.
2. **Multi-tenant isolation** — Prisma middleware + Postgres RLS, both.
3. **OTP deliverability** — dual SMS provider failover; it's a top churn/signup-failure cause in BD.
4. **Bengali rendering everywhere** including PDFs — bundle fonts, test complex-script shaping on real low-end Android devices.
5. **GPS scaling** — keep it a separate service + TimescaleDB from the start; never mix 10-second pings into transactional tables.


---

## অংশ ৭ — ফিচার ইনভেন্টরি (raw)


## AMAR-AUTO.COM — MASTER INVENTORY (deduplicated across all pages + homepage)

Product: আমার অটো (Amar Auto), a Bengali-first, multi-tenant vehicle/fleet accounting SaaS by Autonemo (partner: Autonemo GPS). Mobile app (Android/iOS via autonemo.li/amarauto) + web dashboard. Postpaid billing, freemium (1 vehicle free forever). One shared vehicle-agnostic accounting core exposed as 8 vertical presets.

---

### 1) MODULE → FEATURE LIST

#### A. Authentication & Onboarding
- Mobile-number signup verified via OTP.
- PIN quick-login; also password. Phone+OTP is primary credential.
- Multi-device login.
- Web signup ("ওয়েব থেকে শুরু করুন") + free app download.
- ~5-minute setup, no training required; icon-driven UI for low-literacy users.
- Bengali/English i18n (full app localized; Bengali is native, not a translation layer).

#### B. Accounts & Collections (হিসাব ও জমা)
- Smart Dashboard — today's collections, expenses, profit, active-vehicle count in real time.
- Daily Collection Entry — select driver, one-tap keypad amount; outstanding dues auto-calculated; timestamped log (anti-theft/transparency).
- Digital Receipt — collection receipt shared as PDF/image (+ shareable link); stored digitally.
- Receivables/Payables & Loans — loans given/taken, installments, dues in one ledger.
- General Ledger / Books — double-entry accounting, balances, balance sheet, trial balance.
- Backdated Entry — past-date transactions allowed, flagged/marked in ledger for audit.

#### C. Vehicles & Fleet Management (গাড়ি ও বহর)
- Vehicle Management — mixed fleet (CNG, auto-rickshaw, rent-a-car, e-bike, bike, car, bus, truck, micro) in one account.
- Vehicle Profile — per-vehicle detail: profit/loss, repair & service history, documents.
- Fleet Calendar / Dashboard — unified view; per-vehicle status (empty/rented/booked — খালি/ভাড়ায়/বুকড); running/stopped live state.
- Per-vehicle segmentation — income, expense, profit auto-isolated per vehicle; unlimited vehicles.
- Accident Record — log with photo evidence; fines & damage auto-posted as vehicle expenses.

#### D. Driver Management (ড্রাইভার)
- Driver List/profiles — dues, vehicle assignment.
- Driver KYC — NID/identity docs, photo, profession.
- Driver & Dues Ledger — deposits (জমা), dues (বাকি), discounts/waivers (ছাড়) as distinct ledger columns.
- Daily deposit target per driver (drives shortfall/dues auto-calc).
- SMS receipts/reminders to drivers.

#### E. Vehicle QR (গাড়ি QR)
- Verification & Safety — passenger scans QR sticker to verify vehicle/driver authenticity.
- Contact Without Number — passenger messages owner without seeing owner's phone (privacy-preserving, anonymous).
- Complaints & Reports — complaints, lost-item, accident news delivered to owner's app.
- Smart QR Dashboard — total scans, new/unread counts, breakdown by type.
- Bulk QR Print — all vehicles' QR stickers on one page / PDF export.
- Custom QR Text — editable text under QR (e.g., business name).

#### F. Fuel & Maintenance (ফুয়েল ও মেইনটেন্যান্স)
- Fuel Log — per fill-up: volume, cost, odometer, price/liter, payment method.
- Mileage Calculation — auto KPL and cost/km from odometer deltas.
- Fuel Analytics — avg fill-up cost, city/highway % split, fuel-price trends (charts).
- Maintenance Dashboard — service reminders; total / YTD / average maintenance cost.
- Service Record — full service & repair history per vehicle; parts replaced.
- Service reminder — time-based and/or odometer-based; overdue flagging.
- Document expiry reminders — Route Permit, Fitness, Insurance, Tax Token, Registration renewal alerts.

#### G. Inventory & Parts (ইনভেন্টরি ও পার্টস)
- Parts Stock — category, part number, brand, location, reorder level, prices.
- Suppliers & Credit — supplier ledger, on-credit purchases, dues payment.
- Purchase/Sale Invoice — multi-item buy/sell with discounts & credit; printable receipts.
- Stock Count & Write-off — physical count, damage/waste write-off, supplier/customer returns.
- Inventory Reports — purchases, supplier payables, reorder-needed, slow-moving/dead stock.

#### H. Reports & Analytics (রিপোর্ট ও বিশ্লেষণ)
- Analytics — income/expense trends, sources, collection rates (charts).
- Calendar Report — day-by-day income/expense view.
- Budget — monthly budgets set & tracked with alert threshold.
- Money History — chronological transaction log with filter/search.
- Monthly / category-wise reports — per-vehicle P&L, category breakdown (খাতভিত্তিক).
- Exports — PDF & Excel; on-screen charts; one-click monthly P&L PDF.

#### I. Live GPS Tracking (লাইভ GPS) — app-side + hardware product
App-side (optional, needs tracker):
- Live GPS Map — real-time location, updates every ~10 s; scales to 100+ mixed vehicles on one dashboard.
- Tracker-to-Vehicle Mapping — map each device to its vehicle in-app.
- Route history / trip report with playback; running vs stopped status.
GPS Tracker hardware product (amar-auto.com/gps-tracker):
- Real-time tracking + live traffic.
- Trip Report & History with route playback (route, mileage, duration).
- Remote engine lock/unlock (immobilizer / cut-off relay) — theft prevention.
- Smart Alerts (only 3 named): Engine On/Off, Over-Speed, Geofence Entry/Exit.
- Geofence definition (enter/exit alerts).
- Service & document renewal reminders (Registration, Fitness, Tax Token, Insurance).
- Backup battery (tracks on power cut); 9–90V universal voltage; IP65 waterproof; integrated cellular SIM (Banglalink/Grameenphone/Robi); 1-yr warranty.
- Android & iOS apps + web dashboard.
- Order flow: Order → We call → See live; cash-on-delivery, nationwide, free installation.

#### J. Charging & Loans (চার্জিং ও ঋণ)
- Charging Station — daily/monthly charging bills & dues for e-vehicle charging garages; per-customer daily rate; flexible-rate customers (no due tracking).
- Loans & Installments — receivables/payables and hire-purchase (HP) installment tracking.
- Installment Purchase — HP & installment schedule.

#### K. Rental / Bookings (ভাড়া ও বুকিং)
- Booking & Calendar — availability by date; double-booking prevention.
- Customer Profile / CRM — photo, phone, ID, profession, rental history.
- Rental & Invoice — fare, advance/deposit (অগ্রিম), dues (বকেয়া); shareable/printable receipt.
- Trip handover — start/end odometer, distance, fare.
- Hourly/time-based rental billing — one-tap START (রিলিজ)/END (এন্ড); auto-elapsed time + rate + surcharge; SMS bill link.
- Per-vehicle rental profit.
- Roadmap: trip distance & route-based billing (rent-a-car — not yet live).

#### L. Party Ledger (পাওনা-দেনা / Loan module — truck/transport)
- Per-client receivable (পাওনা), advance (অগ্রিম), settlement/repayment (পরিশোধ) tracked separately as running ledger.

#### M. Billing & Subscription
- Postpaid billing — auto-invoice at month-end; pay via bKash (Nagad/Rocket coming); 7-day payment window; no upfront cost.
- Free tier: 1 vehicle's accounting free forever; multiple vehicles = paid monthly/yearly plan.
- GPS tracker hardware = separate paid add-on.
- In-app payment via bKash + third-party gateways (governed by gateway terms).
- Non-payment temporarily soft-locks paid features (not deletion).

#### N. Notifications & Communication
- SMS reminders (driver dues, bill links, document expiry) via SMS gateway.
- In-app / push notifications (dues, document expiry, urgent updates).
- 24/7 SMS reminders (homepage).
- Voice entry — hands-free income/expense logging via microphone.

#### O. Support
- In-app support chat / ticket + support phone number.
- Contact/support form (Name*, Mobile, Message*); hours 9 AM–9 PM daily, Friday closed; email amarautobd@gmail.com.

#### P. Auto Marketplace (অটো বেচা-কেনা)
- Post Ad — used autos/CNGs/spare parts with photos + map location.
- Verified Feed — admin-moderated; visible in all users' feed only after approval.

#### Q. Additional / Platform
- Cloud Backup — encrypted, automatic, per-account.
- Staff Permissions — role-based access (manager/accountant).
- UI Density (responsive small-phone UI).
- Achievements — goals/milestones (gamification).
- Offline mode with auto-sync (offline-first, eventual consistency).
- Multi-business-mode / 8 vertical presets.
- Expense categorization (fuel, repair, garage rent, gas, oil/mobil, tires, parts, toll, driver bata, other).

---

### 2) ENTITY LIST — fields & relationships

**User / Owner Account** — id, name, phone, email (optional), otp_verified_phone, pin, password, plan (free single-vehicle / paid multi-vehicle), business_mode/vertical, bkash_number, subscription_id, bill_status, terms_accepted, created_at, role/access. → owns many Vehicles, Drivers, Staff, Transactions.

**Staff / User** — id, name, role (owner/manager/accountant), permissions, pin, otp_verified_phone. → belongs to Owner Account.

**Vehicle (গাড়ি)** — id, registration_no, vehicle_type (CNG/auto-rickshaw/rent-a-car/e-bike/bike/car/bus/truck/micro), model, voltage_range, current_odometer, assigned_driver_id, gps_device_id, status (active/inactive; empty/rented/booked; running/stopped), profit_loss (computed), repair_history, service_history, route/line assignment (bus), route_permit_expiry, fitness_expiry, insurance_expiry, tax_token_expiry, registration_doc_expiry, daily_deposit_target, subscription_plan_id, owner_id, created_at. → assigned Driver; has many FuelEntry, Service, Collection, Expense, Trip, Accident, Document; has one GPSDevice.

**Driver (ড্রাইভার)** — id, name, phone, KYC/NID docs, photo, profession, assigned_vehicle_id, daily_collection_target, outstanding_dues (computed), total_deposited, total_discount, sms_receipt_log, status. → assigned to Vehicle; has DriverDue, Collection, Discount records.

**Customer / Client (গ্রাহক/পার্টি)** — id, name, phone/contact, ID document, photo, profession, daily_rate (charging), has_fixed_rate flag, outstanding_dues (computed), advance, receivable (পাওনা), payable (দেনা), settled (পরিশোধ), transaction/rental history. → linked to Booking, ChargingSession, Invoice, PartyLedger.

**Collection / Deposit (জমা)** — id, amount_collected, collection_date, timestamp, driver_id, vehicle_id, daily_target, shortfall (target−collected), discount_amount, receipt_id (PDF/image), running_due_balance (computed), sms_receipt_sent (bool), backdated_flag. → belongs to Driver + Vehicle; generates Receipt & DriverDue.

**DriverDue (বাকি)** — id, driver_id, vehicle_id, date_incurred, amount, amount_repaid, remaining_balance, source_collection_id. → belongs to Driver.

**Expense (খরচ/ব্যয়)** — id, vehicle_id, date, category (fuel/তেল, repair/মেরামত, maintenance, gas/গ্যাস, oil-mobil/মবিল, tires/টায়ার, parts/যন্ত্রাংশ, toll/টোল, driver_bata/ড্রাইভার বাটা, garage_rent, electricity/বিদ্যুৎ, other), amount, note. → belongs to Vehicle (+ optional Driver).

**Expense Category** — category_id, name (khat).

**FuelEntry / FillUp (ফুয়েল লগ)** — id, vehicle_id, fill_date, volume_liters, price_per_liter, cost, odometer_reading, payment_method, distance_since_last (computed), kpl (computed), cost_per_km (computed), city_highway_split. → belongs to Vehicle.

**Maintenance / ServiceRecord (সার্ভিস)** — id, vehicle_id, service_type, date, cost, odometer_at_service, last_service_km, service_interval, parts_replaced, next_service_due (date/odometer), overdue_flag (computed). → belongs to Vehicle.

**Part / Inventory Item (পার্টস)** — id, name, category, part_number, brand, stock_quantity, location, reorder_level, reorder_flag (computed), purchase_price, sale_price. → linked to Supplier, Invoice line items.

**Supplier (সরবরাহকারী)** — id, name, contact, credit_purchases, payments_made, outstanding_balance (computed), ledger_entries. → has Purchase Invoices.

**Purchase/Sale Invoice (ক্রয়/বিক্রয় ইনভয়েস)** — id, type (purchase/sale), supplier_or_customer_id, line_items[] (item, qty, price), discount, credit_amount, total, status (paid/pending), printable_receipt. → belongs to Supplier/Customer; contains Parts.

**Booking / Rental Trip (বুকিং/ট্রিপ)** — id, vehicle_id, customer_id, driver_id, start_datetime/start_odometer, end_datetime/end_odometer, distance, booking_dates, fare/rental_amount, advance_paid, outstanding_due (computed), hourly_rate/base_rate/surcharge, trip_distance & route (roadmap), status, invoice_id. → belongs to Vehicle, Customer, Driver.

**Invoice / Receipt (রসিদ)** — id, invoice_no, booking/collection ref, customer/driver ref, amount, advance, dues_remaining, date_time, shareable/printable output (PDF/link). 

**Accident Record (দুর্ঘটনা)** — id, vehicle_id, date, photo_evidence[], description, linked_fine (auto-expense), linked_damage_cost (auto-expense). → belongs to Vehicle; creates Expense.

**Loan / Installment (ঋণ ও কিস্তি)** — id, type (given/taken/HP), principal_amount, installment_schedule, installment_amount, remaining_balance (computed), payment_history. → linked to Party/Customer.

**Party Ledger / Loan entry (পাওনা-দেনা)** — txn_id, party_id, date, debit, credit, type (paona/dena/advance/porishodh), running_balance. → belongs to Customer/Party.

**Charging Session / Daily Collection (চার্জ সেশন)** — id, customer_id, date, amount_paid, expected_rate (daily_rate snapshot), shortfall/added_due (computed), status (full/partial/pending). → belongs to charging Customer + Garage.

**Garage (গ্যারেজ)** — id, name, daily_revenue, electricity_bill, net_profit (computed), owner_id. → has ChargingSessions, Expenses.

**Charging Bill (চার্জিং স্টেশন)** — vehicle/customer_id, period (daily/monthly), charge_amount, due_balance.

**Ledger Account / Transaction (হিসাব ও খতিয়ান)** — account, debit, credit, date, reference, double_entry_pairing, type (income/expense), category, related_vehicle_id, related_driver_id, status, backdated_marker. → double-entry pairs.

**Budget (বাজেট)** — id, month, category, budget_amount, actual_amount, alert_threshold.

**Billing / Postpaid Invoice** — id, account_id, billing_period (month), usage_line_items, total_amount, status (paid/pending), payment_method (bKash), due_date (7-day window).

**SubscriptionPlan** — plan_id, vehicle_category (2-wheeler/light vs car/bus/truck/micro), base_monthly_price (350 or 500 BDT), billing_term (1/3/6/12 mo), per_month_effective_price (350/315/298/280), discount_amount (0/105/312/840), warranty_included, included_features.

**Member (সদস্য — bus assoc.)** — name, status, monthly_subscription_amount (চাঁদা), vehicle/bus assignment, payment_history, amount_paid_to_date, outstanding_dues. → belongs to Fund/Association; assigned Bus/Route.

**Route (রুট)** — route name/line, associated bus(es), own income-expense ledger.

**Fund / Pool (তহবিল)** — income categories, expense categories, running_balance (computed), monthly_statement.

**Document / DocumentReminder** — id, vehicle_id, doc_type (route_permit/fitness/insurance/tax_token/registration), issue_date, expiry_date, reminder_lead_time/offset_days, reminder_sent/notified_status.

**Reminder / Alert** — id, vehicle_id/device_id, source (service/document/event), type (engine_on_off/overspeed/geofence_enter_exit), trigger_date, timestamp, location, value, message, read/status.

**Geofence** — geofence_id, vehicle_id/user_id, name, shape/coordinates, radius, alert_on_enter, alert_on_exit.

**GPSDevice / Tracker** — device_id/IMEI, sim_operator, sim_number, mapped_vehicle_id, last_lat_lng, last_update_time (~10 s), provider (Autonemo), warranty_start/period (1 yr), ip_rating (IP65), voltage_range (9–90V), backup_battery, install_status, one_time_price (4000 BDT). → mapped to Vehicle.

**Trip (GPS)** — trip_id, vehicle_id, start_time, end_time, duration, route/path (geo points), distance_mileage, playback_data, max_speed, avg_speed.

**LocationPing** — device_id, timestamp, latitude, longitude, speed, ignition_status, traffic_state.

**Order (GPS hardware)** — order_id, customer_name, phone, address, vehicle_type, selected_plan/term, device_qty, payment_method (cash-on-delivery), status (ordered/called/installed/live), delivery_area (nationwide).

**QR Engagement / Message** — vehicle_id, scan_count, message_type (verification/complaint/lost-item/accident), anonymous_passenger_message, read/unread_flag, timestamp. → belongs to Vehicle.

**Marketplace Listing** — id, type (used auto/CNG/parts), title/description, photos[], map_location, price, seller_id, approval_status (admin-moderated). → belongs to Owner (seller).

**ContactMessage** — name (required), mobile_number, message (required), created_at, status.

**SMS / Notification** — id, recipient_phone, type (receipt/expiry_reminder/dues/bill_link), message_body, sent_at, status, related_collection_or_document_id.

**Support Ticket / Chat** — user_id, message, channel (chat/phone), timestamp.

**Company / Office info** — Head Office: Floor 6, Flat 5D, House 7, Road 5, Block I, Banani, Dhaka 1213. Registered Office: Ahmed Tower (Floor 11), 28 & 30 Kamal Ataturk Ave, Banani, Dhaka 1213. Email amarautobd@gmail.com. © 2026.

---

### 3) BUSINESS RULES & CALCULATIONS

**Collections & dues**
- Driver daily shortfall: if collected < daily_target → shortfall (target − collected) auto-posted as DriverDue.
- Dues auto-reduce on later repayment/over-deposit; running cumulative balance per driver; outstanding shown in RED, triggers SMS reminder.
- Every collection is date-time stamped + receipt-backed (anti-theft/transparency); zero manual arithmetic.
- Collection rate = collections ÷ expected target × 100%.

**Charging (garage)**
- new_dues = previous_dues + (daily_rate − amount_paid); overpayment reduces prior dues.
- Flexible-rate customers: due_tracking = false → all payment = income, no dues accrue.

**Profit / accounting**
- Vehicle P&L = revenue (fares/collections) − expenses (fuel + maintenance + repairs + accident fines/damage + category costs), per vehicle & aggregated.
- Net profit (garage) = total_collection − electricity_cost − other_expenses.
- Truck per-vehicle P&L = income tagged to vehicle − expenses tagged to vehicle (fuel/toll/driver-bata/repair).
- Full double-entry accounting: every txn debits one account, credits another → balances, balance sheet, trial balance.
- All income/expense must be assigned a category (khat) for category-wise reports.
- Backdated entries allowed but flagged/marked in ledger for audit.

**Fuel / mileage**
- Distance per fill-up = current odometer − previous odometer.
- Mileage (KPL) = total km ÷ total liters (per vehicle, from odometer deltas).
- Cost per km = total fuel cost ÷ total km. Total fuel amount = liters × price_per_liter.

**Maintenance / documents**
- Overdue service when (current odo − last service odo) ≥ interval, OR days since last service > interval.
- Document reminders fire (only if expiry date entered) before Route Permit/Fitness/Insurance/Tax Token/Registration expiry.

**Inventory**
- Reorder flag when stock_quantity ≤ reorder_level; slow-moving/dead stock reported.
- Supplier outstanding = credit purchases − payments made.

**Rental**
- Double-booking prevented via calendar availability.
- Outstanding due = total rental fee − (advance + payments collected).
- Hourly bill = base rate + (hourly_rate × hours) + overage/surcharge, from START/END timestamps.
- Rent-a-car net profit = rental revenue − driver cost − fuel cost.

**Party ledger (truck)**
- Party net = receivable (পাওনা) − settlements (পরিশোধ); advances (অগ্রিম) held separately (never conflated).

**Bus association**
- Member outstanding = subscription owed − amount paid; fund balance = total income − total expenses (per category); per-bus/per-route separate ledgers.

**Accident** — fines/penalties + damage costs auto-posted as vehicle expenses.

**Multi-vehicle** — each vehicle/driver keeps isolated ledger; unlimited vehicles/drivers; rolls up to fleet view.

**GPS / hardware**
- Live positions refresh every ~10 s; dashboard scales to 100+ mixed vehicles.
- Device one-time ৳4,000 incl. 1-yr warranty.
- Monthly subscription by category: Bike/CNG/auto-rickshaw/e-bike = ৳350/mo; Car/Bus/Truck/Micro = ৳500/mo.
- Prepay-term discounts (৳350 tier): 1mo ৳350 (save 0); 3mo ৳315 (save ৳105); 6mo ৳298 (save ৳312); 12mo ৳280 (save ৳840). Discount = (base − discounted) × months.
- 9–90V one-SKU compatibility; backup battery tracks on power cut; cash-on-delivery, nationwide, free install.
- Alerts: overspeed on threshold; geofence on enter/exit; ignition on engine on/off.

**Marketplace** — listings require admin approval before appearing in public feed (moderation gate).

**Billing / plans**
- Postpaid: use first, pay at month-end via bKash (Nagad/Rocket soon); no upfront cost; 7-day payment window; app install free.
- 1 vehicle free forever; multiple vehicles = paid monthly/yearly plan; GPS hardware separate paid add-on.
- Non-payment temporarily soft-locks paid features (not account deletion).
- Payment info governed by gateway (bKash) terms.

**Platform / legal**
- Offline-first: entries queued locally, auto-sync on reconnect (eventual consistency).
- Acceptance implicit on account creation/login; usage must be lawful/business-only.
- User solely responsible for phone/OTP/PIN/password secrecy; liable for all account activity.
- Data ownership: user owns their data; platform only processes it; service "as-is"; data retained while account active, deleted on closure except legal-retention.
- Device permissions (location/contacts/microphone) optional, gate specific features (tracking map / SMS reminders / voice entry).
- Third-party sharing limited to essential operational data: bKash (payments), GPS providers, SMS/push services.
- Terms can update anytime; continued use = acceptance.

**Support SLA** — 9 AM–9 PM daily, Friday closed; contact form requires Name + Message.

---

### 4) USER ROLES

- **Owner (মালিক)** — account holder; full access; manages fleet, drivers, finances, billing (postpaid via bKash), business-mode selection.
- **Manager (ম্যানেজার)** — staff role with role-based permissions (staff permissions module).
- **Accountant (হিসাবরক্ষক)** — staff role with role-based permissions.
- **Admin (platform)** — moderates the Auto Marketplace feed (approves/rejects listings). Platform-side.
- **Driver (ড্রাইভার)** — not a login user; a managed entity. Receives SMS receipts/reminders; has KYC, dues, vehicle assignment.
- **Customer / Passenger / Party (গ্রাহক/যাত্রী/পার্টি)** — external, not a login user. Passengers scan QR & send anonymous messages; rental/charging/party customers receive receipts, bill-link SMS, and appear in ledgers.
- **Member (সদস্য — bus owner association)** — subscription-paying member tracked in fund accounting (managed entity, not necessarily a login user).

Roles with app logins: Owner + Staff (Manager, Accountant), secured by phone+OTP, PIN, password, multi-device. Drivers/customers/members/passengers are managed entities or external actors, not authenticated app users.