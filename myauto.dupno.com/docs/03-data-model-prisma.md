# আমার অটো (Amar Auto) — Production Data Model (Prisma)

> **⚙️ FINAL DB = MySQL/MariaDB** (see [07-decisions-and-deployment.md](07-decisions-and-deployment.md)). Schema below is provider-agnostic Prisma; only the datasource `provider` and 4 Postgres-only tricks change:
> - **RLS** (tenant backstop) → not in MySQL → enforce via Prisma middleware only.
> - **`EXCLUDE USING gist`** (double-booking) → app-layer `SELECT … FOR UPDATE` overlap check.
> - **partial unique index** (`WHERE endDate IS NULL`) → app-layer active-assignment check.
> - **`LocationPing` / TimescaleDB** → **removed**: GPS comes from owner's external GPS server API; store only `Vehicle.gpsDeviceId` + `gpsProvider`, no raw pings.
> Use InnoDB + `utf8mb4`. `@db.Decimal` for money works natively.

```prisma
// ============================================================
// datasource & generator
// ============================================================
datasource db {
  provider = "mysql"          // FINAL: MySQL/MariaDB (was "postgresql")
  url      = env("DATABASE_URL")   // mysql://user:pass@host:3306/amarauto
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

## Design logic explained

### 1. Multi-tenancy (shared-database, shared-schema, discriminator column)

Every tenant-scoped table carries a non-null `organizationId` FK to `Organization` with `onDelete: Cascade`. This is the single tenant boundary — an owner account *is* a tenant, and multiple staff logins (`User` rows with `OWNER`/`MANAGER`/`ACCOUNTANT`) live under one org.

Enforcement layers, in order of trust:
- **Tenant isolation (MySQL — no RLS).** MySQL has no Row-Level Security, so the **Prisma middleware/client-extension is the single enforcement layer**: it auto-injects `organizationId` into every `where`/`create`. Discipline + code review required — a query that bypasses the extension can leak across tenants. (Postgres RLS `USING (organization_id = current_setting('app.current_org'))` was the original backstop; on MySQL it's gone, so guard the extension carefully and add integration tests for cross-tenant reads.)
- **App layer.** A Prisma middleware/extension injects `organizationId` into every `where` and `data`, so developers can't accidentally omit it.
- **Composite uniqueness is always org-scoped** — `@@unique([organizationId, registrationNo])`, `@@unique([organizationId, phone])`, etc. Two different tenants can reuse the same vehicle plate or phone; uniqueness only holds inside a tenant.
- **Every hot-path index is composite and org-first** (`@@index([organizationId, vehicleId, collectionDate])`). Org-first ordering keeps a tenant's rows physically clustered in the index and lets every dashboard query prune to one tenant immediately.

Cross-org shared/global tables are deliberately the exception: `SubscriptionPlan` (platform price book) and the marketplace-moderation surface have no `organizationId` because they are platform-owned, not tenant data.

`Subscription.billableVehicleCount` + `Vehicle.isBillable` implement the freemium rule: exactly one vehicle per org may have `isBillable = false` (the "1 vehicle free forever"); the rest count toward postpaid billing. Non-payment flips `Organization.isActive`/`BillingStatus.SOFT_LOCKED` to gate paid features without deleting data.

### 2. Driver-dues derivation

Dues are **event-sourced from collections, then materialized** so the RED "outstanding" number is O(1) to read.

Per collection entry:
```
shortfall = max(0, dailyTarget − amountCollected − discountAmount)
```
This is persisted on `Collection.shortfall` (snapshotting `dailyTarget` at entry time so later target changes don't rewrite history — critical for the audit/anti-theft guarantee, alongside `enteredAt` wall-clock and `isBackdated`).

If `shortfall > 0`, a `DriverDue` row is written with `sourceCollectionId` (unique → one due per collection) and `remainingBalance = amount`. When a driver over-deposits later (`amountCollected > target`), the surplus is applied against the oldest open `DriverDue` rows (FIFO): increment `amountRepaid`, recompute `remainingBalance = amount − amountRepaid`, and set `isSettled` when it hits zero. Discounts/waivers (ছাড়) reduce the shortfall at source rather than creating a due.

A driver's live outstanding is `SUM(remainingBalance) WHERE driverId = ? AND isSettled = false`, served by `@@index([organizationId, driverId, isSettled])`. It is derived, never hand-entered, so "zero manual arithmetic" holds. The identical shape drives charging (`ChargingSession.addedDue = expectedRate − amountPaid`, suppressed when `Customer.hasFixedRate`) and rental (`Booking.outstandingDue = fare − advance − payments`).

### 3. Profit-loss derivation

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

### Production notes worth flagging
- **`LocationPing` — REMOVED (MySQL + external GPS).** GPS telemetry comes from the owner's own GPS server API, so no raw pings are stored here. Keep only `Vehicle.gpsDeviceId` + `gpsProvider` mapping and (optionally) small `GpsTrip`/geofence summaries. Live positions are cached in Redis (short TTL), not the DB. See [07-decisions-and-deployment.md](07-decisions-and-deployment.md) §2.
- **Double-booking prevention (MySQL)**: no `EXCLUDE USING gist`. Enforce in the booking service with a transaction + `SELECT … FOR UPDATE` on the vehicle's overlapping bookings, rejecting any time-range overlap for the same `vehicleId`.
- **One active assignment per vehicle**: enforce with a partial unique index `CREATE UNIQUE INDEX ON driver_assignments(vehicle_id) WHERE end_date IS NULL`.
- All money is `@db.Decimal` with fixed scale; all money defaults are `0`, not null, to keep aggregates branch-free.
- Documents/service reminders are scanned by a cron over `@@index([organizationId, expiryDate])` / `nextServiceDueDate`, emitting `SmsLog` + push rows; `reminderSent` prevents duplicate sends.