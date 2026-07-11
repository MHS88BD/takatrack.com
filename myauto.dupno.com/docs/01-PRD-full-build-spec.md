# Amar Auto Clone — Full Build Spec (myauto.dupno.com)

> Master build document for **আমার অটো (Amar Auto)** — a Bengali-first, multi-tenant vehicle & fleet accounting SaaS (web + API first, then mobile). Audience: the developer/owner building it. This is the single source of truth: product, features, roles, data model, API surface, stack, monetization, roadmap, and business logic.

---

## 1. Product Overview & Positioning

### 1.1 What it is
**আমার অটো (Amar Auto)** is a Bengali-first, multi-tenant vehicle/fleet **accounting SaaS** delivered as an Android/iOS mobile app plus a web dashboard. At its heart is **one vehicle-agnostic double-entry accounting core** exposed through **8 vertical presets**. Every promised feature — GPS, inventory, rental, charging, bus-association funds — is a module writing into the same ledger spine.

### 1.2 Positioning
- **Bengali is native, not a translation layer.** Icon-driven UI targets low-literacy fleet owners. ~5-minute setup, no training required.
- **Freemium acquisition funnel:** **1 vehicle's accounting is free forever.** Multiple vehicles convert to a paid, **postpaid** plan billed at month-end via **bKash** — zero upfront cost, zero signup friction.
- **Offline-first:** entries queue locally and auto-sync on reconnect (eventual consistency) — essential for an emerging-market field product.
- **Hardware upsell:** an optional GPS tracker (partner: Autonemo GPS) is a separate paid add-on (one-time device + monthly subscription).

### 1.3 Target users
Owners of mixed fleets — CNG/auto-rickshaw, rent-a-car, e-vehicle charging garages, bus associations, truck/transport, bike rideshare, parts workshops, or generic fleets — who today run their business on cash, memory, and paper.

### 1.4 Core value proposition
- **Anti-theft transparency:** every collection is timestamped and receipt-backed; zero manual arithmetic.
- **Automatic driver dues:** shortfalls against a daily target auto-post and show in red.
- **Per-vehicle P&L** and an authoritative double-entry ledger (balance sheet, trial balance) side by side.
- **Digital receipts** as PDF/image with shareable links.

### 1.5 Platform surfaces
| Surface | Purpose |
|---|---|
| Mobile app (RN/Expo, Android + iOS) | Primary field tool: collections, dashboard, receipts, live GPS, offline entry |
| Web dashboard (React) | Full management, reports, admin |
| Admin/moderation panel | Platform-side marketplace moderation (same web app, admin-gated) |
| GPS ingestion service | Decoupled high-write telemetry pipeline |
| Public/anon endpoints | Passenger QR scan/verify; bKash webhook |

---

## 2. Complete Feature Inventory (by module)

Legend: **MVP** = Phase 1 shippable core · **P2** = Phase 2 (monetization + depth) · **P3** = Phase 3 (platform + hardware + verticals).

### A. Authentication & Onboarding
| Feature | Phase |
|---|---|
| Mobile-number signup verified via OTP (primary credential) | MVP |
| PIN quick-login + password (secondary conveniences) | MVP |
| Multi-device login (one refresh token per device) | MVP |
| Web signup ("ওয়েব থেকে শুরু করুন") + free app download | MVP |
| ~5-minute setup, icon-driven low-literacy UI | MVP |
| Bengali/English i18n (Bengali default, native) | MVP |

### B. Accounts & Collections (হিসাব ও জমা)
| Feature | Phase |
|---|---|
| Smart Dashboard — today's collections, expenses, profit, active-vehicle count (real time) | MVP |
| Daily Collection Entry — select driver, one-tap keypad; dues auto-calculated; timestamped log | MVP |
| Digital Receipt — PDF/image + shareable link, stored digitally | MVP |
| General Ledger / Books — double-entry, balances, balance sheet, trial balance | MVP |
| Backdated Entry — past-date transactions allowed, flagged for audit | MVP |
| Receivables/Payables & Loans in one ledger | P3 |

### C. Vehicles & Fleet Management (গাড়ি ও বহর)
| Feature | Phase |
|---|---|
| Vehicle Management — mixed fleet in one account | MVP |
| Vehicle Profile — per-vehicle P&L, repair/service history, documents | MVP |
| Per-vehicle segmentation — income/expense/profit auto-isolated; unlimited vehicles | MVP |
| Fleet Calendar / Dashboard — per-vehicle status (empty/rented/booked; running/stopped) | P2 |
| Accident Record — photo evidence; fines & damage auto-posted as vehicle expenses | P3 |

### D. Driver Management (ড্রাইভার)
| Feature | Phase |
|---|---|
| Driver list/profiles — dues, vehicle assignment | MVP |
| Driver KYC — NID/identity docs, photo, profession | MVP |
| Driver & Dues Ledger — deposits (জমা), dues (বাকি), discounts/waivers (ছাড়) as distinct columns | MVP |
| Daily deposit target per driver (drives shortfall/dues auto-calc) | MVP |
| SMS receipts/reminders to drivers | MVP |

### E. Vehicle QR (গাড়ি QR)
| Feature | Phase |
|---|---|
| Verification & Safety — passenger scans QR sticker to verify vehicle/driver | P2 |
| Contact Without Number — anonymous passenger→owner messaging | P2 |
| Complaints & Reports — complaints, lost-item, accident news to owner's app | P2 |
| Smart QR Dashboard — total scans, unread counts, breakdown by type | P2 |
| Bulk QR Print — all vehicles' stickers as one PDF | P2 |
| Custom QR Text — editable text under QR | P2 |

### F. Fuel & Maintenance (ফুয়েল ও মেইনটেন্যান্স)
| Feature | Phase |
|---|---|
| Fuel Log — volume, cost, odometer, price/liter, payment method | P2 |
| Mileage Calculation — auto KPL and cost/km from odometer deltas | P2 |
| Fuel Analytics — avg fill-up cost, city/highway split, price trends | P2 |
| Maintenance Dashboard — reminders; total/YTD/average cost | P2 |
| Service Record — full history, parts replaced | P2 |
| Service reminder — time- and/or odometer-based; overdue flagging | P2 |
| Document expiry reminders — Route Permit, Fitness, Insurance, Tax Token, Registration | P2 |

### G. Inventory & Parts (ইনভেন্টরি ও পার্টস)
| Feature | Phase |
|---|---|
| Parts Stock — category, part number, brand, location, reorder level, prices | P3 |
| Suppliers & Credit — supplier ledger, on-credit purchases, dues | P3 |
| Purchase/Sale Invoice — multi-item with discounts & credit; printable | P3 |
| Stock Count & Write-off — physical count, damage/waste, returns | P3 |
| Inventory Reports — purchases, payables, reorder, slow/dead stock | P3 |

### H. Reports & Analytics (রিপোর্ট ও বিশ্লেষণ)
| Feature | Phase |
|---|---|
| Money History — chronological log with filter/search | MVP |
| Per-vehicle P&L + monthly PDF/Excel export | MVP |
| Analytics — income/expense trends, sources, collection rates (charts) | P2 |
| Calendar Report — day-by-day income/expense | P2 |
| Budget — monthly budgets with alert threshold | P2 |
| Category-wise reports (খাতভিত্তিক) | P2 |
| Balance sheet / trial balance (double-entry) | P2 |

### I. Live GPS Tracking (লাইভ GPS) + hardware
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

### J. Charging & Loans (চার্জিং ও ঋণ)
| Feature | Phase |
|---|---|
| Charging Station — daily/monthly bills & dues; per-customer daily rate; flexible-rate customers | P3 |
| Loans & Installments — receivables/payables and hire-purchase (HP) | P3 |
| Installment Purchase — HP & installment schedule | P3 |

### K. Rental / Bookings (ভাড়া ও বুকিং)
| Feature | Phase |
|---|---|
| Booking & Calendar — availability by date; double-booking prevention | P2 |
| Customer Profile / CRM — photo, phone, ID, profession, rental history | P2 |
| Rental & Invoice — fare, advance/deposit (অগ্রিম), dues (বকেয়া); printable receipt | P2 |
| Trip handover — start/end odometer, distance, fare | P2 |
| Hourly/time-based billing — one-tap START (রিলিজ)/END (এন্ড); auto-elapsed + rate + surcharge; SMS bill link | P2 |
| Per-vehicle rental profit | P2 |
| Roadmap: trip distance & route-based billing | Later |

### L. Party Ledger (পাওনা-দেনা — truck/transport)
| Feature | Phase |
|---|---|
| Per-client receivable (পাওনা), advance (অগ্রিম), settlement (পরিশোধ) as running ledger | P3 |

### M. Billing & Subscription
| Feature | Phase |
|---|---|
| Plan model + free-tier gate (billing engine stubbed) | MVP |
| Postpaid billing — auto-invoice at month-end; bKash; 7-day window | P2 |
| Free tier: 1 vehicle free forever; multi-vehicle = paid | MVP (gate) / P2 (charge) |
| GPS tracker hardware = separate paid add-on | P3 |
| Soft-lock paid features on non-payment (no deletion) | P2 |
| Nagad/Rocket gateways | Later |

### N. Notifications & Communication
| Feature | Phase |
|---|---|
| SMS reminders (driver dues, bill links, document expiry) | MVP (dues) / P2 (docs, bill) |
| In-app / push notifications | P2 |
| Voice entry — hands-free income/expense via microphone | P3 |

### O. Support
| Feature | Phase |
|---|---|
| In-app support chat / ticket + support phone | P2 |
| Contact/support form (Name*, Mobile, Message*) | P2 |

### P. Auto Marketplace (অটো বেচা-কেনা)
| Feature | Phase |
|---|---|
| Post Ad — used autos/CNGs/spare parts with photos + map location | P3 |
| Verified Feed — admin-moderated; visible only after approval | P3 |

### Q. Additional / Platform
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

## 3. User Roles & Auth Model

### 3.1 Roles
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

### 3.2 Credential model
- **Primary credential = phone + OTP.** PIN and password are device conveniences that mint the same JWT pair.
- OTP: 6-digit, hashed in Redis with TTL + attempt counter + rate limit; roll your own (control Bengali SMS copy, cheaper than paid identity providers).
- Secondary unlocks stored as **Argon2** hashes.

### 3.3 Token model
- **Access JWT** (RS256, 15 min). Claims: `sub` (user_id), `org` (owner account/tenant), `role`, `device_id`, `scope[]`, `plan`, `soft_locked`, `iat`, `exp`.
- **Refresh token** (opaque, rotating, 60 d): **one row per `device_id`** → enables multi-device and per-device remote logout. Reuse detection revokes the device chain.

### 3.4 Scope model
- Role → default scope set (`owner:*`, `manager:*`, `accountant:read`, `accountant:write:txn`, …). `owner` implies all scopes for its org. Owner can grant granular staff `permissions[]` that map to scopes. Every endpoint lists a minimum scope.

### 3.5 Soft-lock (HTTP 402)
An unpaid org keeps **read access + free-vehicle writes**; paid-feature writes are rejected with `error.code = SUBSCRIPTION_REQUIRED` until the bKash webhook clears the invoice. **Never delete data.**

### 3.6 Multi-tenancy
The **Owner account _is_ the tenant** (`organizationId`). Enforced in order of trust: (1) Postgres **Row-Level Security** as the backstop; (2) Prisma middleware/extension auto-injecting `organizationId`; (3) org-scoped composite uniqueness and org-first composite indexes.

---

## 4. Data Model (Prisma / PostgreSQL)

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

### 4.1 Raw-migration constraints (Prisma can't express these)
- **RLS backstop:** `USING (organization_id = current_setting('app.current_org')::text)` on every tenant table; app sets `SET app.current_org = $orgId` per request/transaction.
- **Double-booking:** `EXCLUDE USING gist` on `bookings(vehicle_id WITH =, tstzrange(start_date_time, end_date_time) WITH &&)`.
- **One active assignment per vehicle:** `CREATE UNIQUE INDEX ON driver_assignments(vehicle_id) WHERE end_date IS NULL`.
- **`LocationPing`:** monthly range partitions on `recordedAt` (or TimescaleDB hypertable). `BigInt` PK is intentional.

### 4.2 Cross-org global tables
`SubscriptionPlan` (platform price book) and the marketplace moderation surface are platform-owned and deliberately carry **no** `organizationId`.

---

## 5. REST API Surface

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

### A. Auth & Onboarding `/auth`
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

### B. Org / Profile `/org`, `/profile`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/org` | Owner account/org settings | — | `{ id,name,business_mode,verticals_enabled[],bkash_number,plan,bill_status,terms_accepted_at,address,currency,lang }` | member |
| PATCH | `/org` | Update org / business_mode / presets | `name`,`business_mode`,`verticals_enabled[]`,`bkash_number`,`lang`,`default_currency` | updated org | owner |
| GET | `/profile` | Current user profile | — | `{ id,name,phone,email,photo_url,role,pin_set,password_set,lang }` | self |
| PATCH | `/profile` | Update own profile | `name`,`email`,`photo_url`,`lang` | updated | self |
| GET | `/org/dashboard` | Smart Dashboard aggregate (today) | `?date=` | `{ today_collections,today_expenses,today_profit,active_vehicles,running_vehicles,unread_qr,overdue_docs,driver_dues_total }` | member |
| POST | `/org/backup/export` | Trigger cloud backup / export | `format`(json\|encrypted) | `{ job_id, status }` | owner |

### C. Users, Roles & Staff Permissions `/users`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/users` | List staff | `role`,`status` | paginated `[{ id,name,phone,role,permissions[],status }]` | owner\|manager |
| POST | `/users` | Invite/create staff | `name`,`phone`,`role`,`permissions[]` | created user + invite OTP flow | owner |
| GET | `/users/{id}` | Staff detail | — | user | owner\|self |
| PATCH | `/users/{id}` | Update role/permissions | `role`,`permissions[]`,`status` | updated | owner |
| DELETE | `/users/{id}` | Remove staff | — | `204` | owner |
| GET | `/roles` | Role catalog + permission matrix | — | `[{ role, default_permissions[] }]` | member |
| GET | `/permissions` | Available permission keys | — | `[{ key,label_bn,label_en,group }]` | owner |

### D. Vehicles & Fleet + QR `/vehicles`
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

### E. Drivers & KYC `/drivers`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/drivers` | Driver list | `status`,`assigned_vehicle_id`,`has_dues`,`q` | paginated `[{ id,name,phone,assigned_vehicle,outstanding_dues,daily_collection_target,status }]` | member |
| POST | `/drivers` | Add driver | `name`,`phone`,`profession`,`daily_collection_target`,`assigned_vehicle_id?` | driver | owner\|manager |
| GET | `/drivers/{id}` | Profile + dues summary | — | driver incl. `total_deposited,total_discount,outstanding_dues` | member |
| PATCH | `/drivers/{id}` | Edit | writable fields | updated | owner\|manager |
| POST | `/drivers/{id}/kyc` | Upload KYC docs | `nid_no`,`photo`,`documents[]` | `{ kyc_status }` | owner\|manager |
| GET | `/drivers/{id}/ledger` | Driver & dues ledger | `from`,`to` | `[{ date,deposit,due,discount,running_balance }]` | member |
| POST | `/drivers/{id}/assignments` | Assign to vehicle | `vehicle_id`,`effective_date` | assignment | owner\|manager |

### F. Assignments `/assignments`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/assignments` | List current/historical | `vehicle_id`,`driver_id`,`active` | paginated | member |
| POST | `/assignments` | Create assignment | `vehicle_id`,`driver_id`,`start_date` | assignment | owner\|manager |
| PATCH | `/assignments/{id}` | End/transfer | `end_date` | updated | owner\|manager |

### G. Daily Collections & Receipts `/collections`
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

### H. Trips / Bookings / Rentals `/trips`, `/bookings`
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

### I. Ledger — Expenses / Income `/transactions`
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

### J. Fuel `/fuel`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/vehicles/{id}/fuel` | Fuel log | `from`,`to` | paginated `[{ fill_date,volume_liters,price_per_liter,cost,odometer,distance_since_last,kpl,cost_per_km,payment_method }]` | member |
| POST | `/vehicles/{id}/fuel` | Add fill-up (auto KPL/cost-per-km) | `volume_liters`,`price_per_liter`,`odometer_reading`,`payment_method`,`fill_date?`,`city_highway_split?` | entry w/ computed mileage; posts fuel expense | write:txn |
| PATCH | `/fuel/{id}` | Edit | fields | updated | owner\|manager |
| GET | `/vehicles/{id}/fuel/analytics` | Fuel analytics | `from`,`to` | `{ avg_fillup_cost,kpl_avg,cost_per_km,city_pct,highway_pct,price_trend[] }` | member |

### K. Maintenance & Documents `/maintenance`, `/documents`
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/vehicles/{id}/services` | Service/repair history | `from`,`to` | paginated `[{ service_type,date,cost,odometer_at_service,parts_replaced[],next_service_due,overdue_flag }]` | member |
| POST | `/vehicles/{id}/services` | Log service (posts expense) | `service_type`,`date`,`cost`,`odometer_at_service`,`service_interval?`,`parts_replaced[]?` | service | write:txn |
| PATCH | `/services/{id}` | Edit | fields | updated | owner\|manager |
| GET | `/maintenance/dashboard` | Reminders + costs | — | `{ due_soon[],overdue[],total_cost,ytd_cost,avg_cost }` | member |
| GET | `/document-alerts` | All doc expiry alerts across fleet | `status`,`doc_type`,`vehicle_id` | paginated `[{ vehicle,doc_type,expiry_date,days_left,status }]` | member |
| GET | `/reminders` | Unified service+document+GPS reminders | `source`,`read` | paginated | member |
| PATCH | `/reminders/{id}` | Ack/mark read | `read` | updated | member |

### L. Inventory & Parts `/inventory`
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

### M. Customers / Parties, Loans & Charging `/customers`, `/loans`, `/charging`
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

### N. Reports `/reports`
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

### O. GPS Tracking `/gps`
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

### P. Billing & Subscription `/billing`
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

### Q. Notifications, SMS & Support `/notifications`, `/sms`, `/support`
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

### R. Cross-cutting: Offline Sync & Marketplace
| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/sync/batch` | Offline queue flush (bulk mutations) | `operations[{ op_id,client_id,resource,method,payload,client_created_at }]` | `{ results:[{ op_id,status,server_id?,error? }], server_time }` | member |
| GET | `/sync/changes` | Pull server-side changes since cursor | `since`,`resources[]` | `{ changes[], next_cursor }` | member |
| GET | `/marketplace/listings` | Public verified feed | `type`,`q` | paginated approved listings | member |
| POST | `/marketplace/listings` | Post ad (pending moderation) | `type`,`title`,`description`,`photos[]`,`map_location`,`price` | `{ listing, approval_status:"pending" }` | member |
| GET | `/marketplace/my-listings` | Own listings + approval status | — | paginated | member |

**Public/anon surface (no JWT):** `/public/qr/{payload}/scan` and `/webhooks/bkash` (HMAC-signed gateway callback).

---

## 6. Tech Stack & Architecture

**Guiding principle:** everything the ad promises is one vehicle-agnostic double-entry accounting core with vertical presets on top. Build the ledger + multi-tenancy correctly once; GPS, inventory, rental, charging are modules writing into the same `Transaction`/`Ledger` spine. Reuse the owner's Node/TS/Prisma/PostgreSQL/React muscle memory — no second backend language.

### 6.1 Component choices
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

### 6.2 Architecture (in words)
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

### 6.3 Risks to design around early (don't defer)
1. **Offline sync correctness on money** — append-only ledger + client UUIDs from day one.
2. **Multi-tenant isolation** — Prisma middleware **and** Postgres RLS.
3. **OTP deliverability** — dual SMS provider failover.
4. **Bengali rendering everywhere incl. PDFs** — bundle fonts, test on real low-end Android.
5. **GPS scaling** — separate service + TimescaleDB from the start.

---

## 7. Monetization — "1 vehicle free forever" + postpaid bKash

### 7.1 Free-tier gate (technical)
- On the org, track `activeVehicleCount` + `planTier`. Free tier = **exactly 1 vehicle's accounting** fully functional forever. Implemented via `Vehicle.isBillable` (exactly one vehicle per org is `false` — the oldest) + `Subscription.billableVehicleCount`.
- When the owner adds a 2nd vehicle, they cross into **paid**. **Recommended = grace + postpaid (a):** allow adding vehicles freely; the first (oldest) stays free; each additional vehicle accrues charges on the month-end invoice ("use first, pay at month-end, no upfront cost"). Avoid hard-gating the 2nd vehicle (friction).
- **Billing calculation:** paid vehicles × plan rate, prorated for mid-month additions. Optional category tiering mirrors the GPS structure (light vs car/bus/truck/micro); the accounting SaaS itself can be a flat per-extra-vehicle rate.

### 7.2 Postpaid cycle (BullMQ cron)
1. **Month-end:** generate `BillingInvoice` per org = sum of paid-vehicle charges (usage line items); `dueDate = +7 days`.
2. **Dispatch:** bKash payment link + SMS + in-app notification.
3. **7-day window:** reminders on day 3 and day 6.
4. **On payment:** bKash execute + callback → mark paid → confirm via **Query Payment cron** (never trust redirect alone) → lift soft-lock.
5. **Non-payment after grace:** **soft-lock paid features** (multi-vehicle views/paid modules read-only or hidden) — **never delete data**; the free vehicle keeps working; unlock instantly on payment.
6. **GPS hardware billed separately.**

### 7.3 GPS hardware & subscription pricing
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

### 7.4 Why postpaid works here
Zero signup friction (matches "no upfront cost, app install free"); the free single vehicle is a permanent acquisition funnel; expansion revenue grows as owners add vehicles; the gentle soft-lock (not deletion) preserves trust and lets lapsed users reactivate.

---

## 8. Phased Build Roadmap + Estimates

Assumes a small team (≈2 backend, 1–2 frontend/mobile, part-time devops). Ranges are calendar time.

### MVP — "what the ad promises" (≈8–12 weeks)
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

### Phase 2 — Monetization + operational depth (≈6–10 weeks)
- **Postpaid billing engine:** month-end auto-invoice, usage line items, **bKash PGW**, payment-link SMS, 7-day window, **soft-lock**, reconciliation cron.
- Subscription plans (free single / paid multi; monthly & prepay-term pricing).
- Fuel & maintenance: fuel log, auto KPL/cost-per-km, service records, service + document-expiry reminders (route permit/fitness/insurance/tax token/registration) via cron+SMS+push.
- Rental/bookings: booking calendar w/ double-booking prevention, customer CRM, rental invoice, hourly START/END billing.
- Reports/analytics: charts, calendar report, budgets w/ thresholds, balance sheet / trial balance.
- Staff permissions (manager/accountant).
- Vehicle QR: generation, passenger scan verification, anonymous messaging, complaints, bulk QR PDF.
- Push notifications (Expo). Harden offline sync across all entry types.

### Phase 3 — Platform + hardware + verticals (≈10–16 weeks, parallelizable)
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

## 9. Key Business-Logic Notes

### 9.1 Driver dues (event-sourced, materialized)
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

### 9.2 Profit & Loss (two reconciling layers)
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

### 9.3 Fuel / mileage
- Distance per fill-up = current odo − previous odo. `kpl = total km ÷ total liters`. `cost_per_km = total fuel cost ÷ total km`. `cost = liters × price_per_liter`.

### 9.4 Maintenance / documents
- Overdue service when `(current odo − last service odo) ≥ interval` **OR** `days since last service > interval`.
- Document reminders fire (only if an expiry date is entered) `reminderLeadDays` before Route Permit / Fitness / Insurance / Tax Token / Registration expiry. Cron scans `@@index([organizationId, expiryDate])` / `nextServiceDueDate`, emits `SmsLog` + push; `reminderSent` prevents duplicates.

### 9.5 Inventory
- Reorder flag when `stock_quantity ≤ reorder_level`; slow-moving/dead stock reported. Supplier outstanding = credit purchases − payments made.

### 9.6 Rental
- Double-booking prevented via a Postgres `EXCLUDE USING gist` range-overlap constraint (Prisma can't express it).
- `outstanding_due = total fare − (advance + payments)`. Hourly bill = `base_rate + hourly_rate×hours + surcharge` from START/END timestamps.

### 9.7 Party ledger (truck) & bus association
- Party net = receivable (পাওনা) − settlements (পরিশোধ); advances (অগ্রিম) held separately, never conflated.
- Member outstanding = subscription owed − amount paid; fund balance = total income − total expenses (per category); per-bus/per-route separate ledgers.

### 9.8 GPS ingest
- Live positions refresh every ~10s; dashboard scales to 100+ mixed vehicles.
- Keep ingestion **decoupled** (separate service, TimescaleDB / monthly-partitioned `LocationPing`, `BigInt` PK). A stream consumer computes alerts:
  - **Overspeed** on threshold; **Geofence** on enter/exit; **Ignition** on engine on/off.
- Live delivery over WebSocket; app subscribes only to on-screen vehicles (throttle marker updates + clustering in RN).
- `GpsTrip` summaries stay in the relational hot path; raw pings do not.

### 9.9 Offline-first (money correctness)
- Each record gets a client-generated UUID (offline creates never collide), `updatedAt`/version, and a sync queue. On reconnect: push queued mutations (idempotent, keyed by client UUID) then pull deltas.
- **Last-write-wins per field is acceptable except money.** Ledger entries are **append-only immutable events** — you never edit a collection, you post a correcting/reversing entry. Backdated entries fall out naturally from an `effectiveDate`/`collectionDate` separate from `createdAt`/`enteredAt`.

### 9.10 Platform / legal notes
- Acceptance implicit on account creation/login; usage must be lawful/business-only. User owns their data; platform only processes it; service "as-is"; data retained while active, deleted on closure except legal retention.
- Device permissions (location/contacts/microphone) are optional and gate specific features (tracking map / SMS reminders / voice entry). Third-party sharing limited to essential operational data: bKash (payments), GPS providers, SMS/push services.
- Support SLA: 9 AM–9 PM daily, Friday closed; contact form requires Name + Message. Email `amarautobd@gmail.com`.

---

*Master spec compiled from the deduplicated feature inventory, production Prisma data model, mobile REST API surface, and tech-stack/architecture brief. Build the ledger + multi-tenancy core once; every module writes into it.*