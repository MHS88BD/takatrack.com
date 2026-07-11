# আমার অটো ক্লোন — মাস্টার প্ল্যান (myauto.dupno.com)

> এই ফাইল = পুরো প্রজেক্টের **একক সোর্স অব ট্রুথ**। প্রতিযোগী (amar-auto.com) তে কি আছে, আমরা কি বানাবো, কিভাবে বানাবো, কে ম্যানেজ করবে, UI কেমন হবে — সব এখানে + বিস্তারিত ডকে।
>
> **লক্ষ্য:** amar-auto.com এর সম্পূর্ণ ফিচার নিজে বানানো — প্রথমে **ওয়েব + REST API**, তারপর সেই API দিয়ে **মোবাইল অ্যাপ**।

তারিখ: ২০২৬-০৭-১১ · ভাষা: বাংলা-first (English technical terms রাখা হয়েছে)

---

## ০. বিস্তারিত ডকের ইনডেক্স

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

## ১. প্রোডাক্ট কি (এক লাইনে)

**একটি vehicle-agnostic double-entry হিসাব ইঞ্জিন**, যার উপরে **৮টি ভার্টিক্যাল প্রিসেট**। GPS, ইনভেন্টরি, রেন্টাল, চার্জিং — সব একই ledger-এ লেখে। বাংলা native, icon-driven, offline-first, postpaid bKash বিলিং, **১টি গাড়ি lifetime FREE**।

**টার্গেট ইউজার:** CNG/অটোরিকশা, রেন্ট-এ-কার, চার্জিং গ্যারেজ, বাস সমিতি, ট্রাক/ট্রান্সপোর্ট, বাইক রেন্টাল মালিক — যারা আজও কাগজ-কলম-মুখস্থে ব্যবসা চালায়।

---

## ২. amar-auto.com এ এখন কি কি আছে (প্রতিযোগী এনালাইসিস)

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

## ৩. আমরা কি বানাবো (স্কোপ)

**সব কিছু** — কিন্তু phase-এ ভাগ করে। বিজ্ঞাপনের ৬ বুলেট = MVP; বাকি = Phase 2/3.

মূল নীতি: **ledger + multi-tenancy core একবার ঠিকভাবে বানাও**; GPS/inventory/rental/charging সব একই `Transaction`/`Ledger` spine-এ module হিসেবে বসে।

ফিচার→phase ম্যাপ, ডেটা মডেল, API — [docs/01](docs/01-PRD-full-build-spec.md) সেকশন ২–৫ এ পূর্ণ।

### ৩.১ ইউজার রোল
| রোল | লগইন? | কি করে |
|---|---|---|
| **মালিক (Owner)** | ✅ | tenant/account holder — full access, বিলিং, business-mode |
| **ম্যানেজার / হিসাবরক্ষক** | ✅ | staff, role-based permission |
| **Admin (platform)** | ✅ | মার্কেটপ্লেস moderation, tenant ম্যানেজ |
| **ড্রাইভার** | ❌ | managed entity — KYC, dues, SMS পায় |
| **কাস্টমার/যাত্রী/party** | ❌ | external — QR scan, রসিদ পায়, ledger-এ থাকে |

Auth: **phone+OTP primary**; PIN/password device convenience; JWT (access 15min + rotating refresh per device → multi-device)।

---

## ৪. টেক স্ট্যাক (সিদ্ধান্ত)

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

## ৫. রোডম্যাপ + ম্যানেজমেন্ট (কে কি করবে)

ধরে নেওয়া টিম: ~২ backend, ১–২ frontend/mobile, part-time devops।

### MVP — "বিজ্ঞাপন যা বলে" (≈৮–১২ সপ্তাহ) 🎯
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

### Phase 2 — মনিটাইজেশন + গভীরতা (≈৬–১০ সপ্তাহ) 💰
- **Postpaid বিলিং ইঞ্জিন:** month-end auto-invoice, bKash PGW, payment-link SMS, ৭-দিন window, **soft-lock**, reconciliation cron
- সাবস্ক্রিপশন plan (free single / paid multi)
- ফুয়েল ও মেইনটেন্যান্স (KPL, সার্ভিস+কাগজ expiry reminder)
- রেন্টাল/বুকিং (calendar, CRM, invoice, ঘন্টা বিলিং)
- রিপোর্ট/analytics (chart, budget, balance sheet, trial balance)
- staff permission
- গাড়ি QR (verify, anonymous message, bulk print)
- push notification, offline sync সব entry-তে

### Phase 3 — প্ল্যাটফর্ম + হার্ডওয়্যার + ভার্টিক্যাল (≈১০–১৬ সপ্তাহ, parallel) 🚀
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

## ৬. মনিটাইজেশন মেকানিক্স

- **১ গাড়ি free forever** = permanent acquisition funnel। `Vehicle.isBillable=false` (সবচেয়ে পুরনো ১টি গাড়ি)।
- ২য় গাড়ি যোগ = paid। **Grace + postpaid:** গাড়ি free-তে যোগ করা যায়, প্রথমটা free থাকে, বাকিগুলো month-end invoice-এ চার্জ হয় ("আগে ব্যবহার, মাস শেষে পেমেন্ট, no upfront cost")।
- **Postpaid cycle:** month-end invoice → bKash link + SMS → ৩/৬ দিনে reminder → payment callback + Query cron → soft-lock lift। না দিলে **soft-lock** (paid feature read-only, ডেটা মুছে না; free গাড়ি চলতে থাকে)।
- **GPS হার্ডওয়্যার আলাদা:** device one-time + monthly subscription by category।

ডিটেইল → [docs/01](docs/01-PRD-full-build-spec.md) সেকশন ৭।

---

## ৭. মূল বিজনেস লজিক (না বুঝলে ভুল হবে)

- **ড্রাইভার বকেয়া:** `shortfall = max(0, dailyTarget − collected − discount)`; `dailyTarget` entry-এর সময় snapshot (পরে টার্গেট বদলালে history বদলায় না); over-deposit হলে পুরনো dues-এ FIFO apply; live outstanding লাল রঙে → SMS। **zero manual arithmetic।**
- **P&L দুই স্তর:** (a) fast per-vehicle operational number (`GROUP BY vehicleId`), (b) authoritative double-entry ledger (`Σdebit=Σcredit`, trial balance)। এক transaction-এ দুটোই লেখা হয় যাতে diverge না করে।
- **Offline money correctness:** প্রতি record client-UUID + sync queue; ledger **append-only immutable** (collection edit করো না, correcting entry পোস্ট করো)।
- **GPS ingest decoupled:** আলাদা service, TimescaleDB, raw ping relational DB-তে না।

সব লজিক → [docs/01](docs/01-PRD-full-build-spec.md) সেকশন ৯।

---

## ৮. পরবর্তী স্টেপ (এখন কি করবো)

1. ✅ প্রতিযোগী এনালাইসিস + PRD + ডেটা মডেল + API স্পেক + আর্কিটেকচার — **done** (docs/01–05)
2. ✅ UI/UX + ডিজাইন সিস্টেম স্পেক — **docs/06** (তৈরি হচ্ছে)
3. ⬜ রেপো scaffold: NestJS API + Prisma migrate + React web + Expo app monorepo
4. ⬜ MVP স্প্রিন্ট ১: Auth (OTP) + multi-tenant + vehicle + driver + collection keypad + dues
5. ⬜ MVP স্প্রিন্ট ২: dashboard + receipt PDF + reports + SMS + free-tier gate + mobile offline
6. ⬜ MVP ডেপ্লয় → beta মালিক টেস্ট

> স্ক্যাফোল্ড শুরু করতে বললে আমি monorepo + Prisma schema + প্রথম API endpoint বসিয়ে দিতে পারি।
