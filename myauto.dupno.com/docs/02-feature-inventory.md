# AMAR-AUTO.COM — MASTER INVENTORY (deduplicated across all pages + homepage)

Product: আমার অটো (Amar Auto), a Bengali-first, multi-tenant vehicle/fleet accounting SaaS by Autonemo (partner: Autonemo GPS). Mobile app (Android/iOS via autonemo.li/amarauto) + web dashboard. Postpaid billing, freemium (1 vehicle free forever). One shared vehicle-agnostic accounting core exposed as 8 vertical presets.

---

## 1) MODULE → FEATURE LIST

### A. Authentication & Onboarding
- Mobile-number signup verified via OTP.
- PIN quick-login; also password. Phone+OTP is primary credential.
- Multi-device login.
- Web signup ("ওয়েব থেকে শুরু করুন") + free app download.
- ~5-minute setup, no training required; icon-driven UI for low-literacy users.
- Bengali/English i18n (full app localized; Bengali is native, not a translation layer).

### B. Accounts & Collections (হিসাব ও জমা)
- Smart Dashboard — today's collections, expenses, profit, active-vehicle count in real time.
- Daily Collection Entry — select driver, one-tap keypad amount; outstanding dues auto-calculated; timestamped log (anti-theft/transparency).
- Digital Receipt — collection receipt shared as PDF/image (+ shareable link); stored digitally.
- Receivables/Payables & Loans — loans given/taken, installments, dues in one ledger.
- General Ledger / Books — double-entry accounting, balances, balance sheet, trial balance.
- Backdated Entry — past-date transactions allowed, flagged/marked in ledger for audit.

### C. Vehicles & Fleet Management (গাড়ি ও বহর)
- Vehicle Management — mixed fleet (CNG, auto-rickshaw, rent-a-car, e-bike, bike, car, bus, truck, micro) in one account.
- Vehicle Profile — per-vehicle detail: profit/loss, repair & service history, documents.
- Fleet Calendar / Dashboard — unified view; per-vehicle status (empty/rented/booked — খালি/ভাড়ায়/বুকড); running/stopped live state.
- Per-vehicle segmentation — income, expense, profit auto-isolated per vehicle; unlimited vehicles.
- Accident Record — log with photo evidence; fines & damage auto-posted as vehicle expenses.

### D. Driver Management (ড্রাইভার)
- Driver List/profiles — dues, vehicle assignment.
- Driver KYC — NID/identity docs, photo, profession.
- Driver & Dues Ledger — deposits (জমা), dues (বাকি), discounts/waivers (ছাড়) as distinct ledger columns.
- Daily deposit target per driver (drives shortfall/dues auto-calc).
- SMS receipts/reminders to drivers.

### E. Vehicle QR (গাড়ি QR)
- Verification & Safety — passenger scans QR sticker to verify vehicle/driver authenticity.
- Contact Without Number — passenger messages owner without seeing owner's phone (privacy-preserving, anonymous).
- Complaints & Reports — complaints, lost-item, accident news delivered to owner's app.
- Smart QR Dashboard — total scans, new/unread counts, breakdown by type.
- Bulk QR Print — all vehicles' QR stickers on one page / PDF export.
- Custom QR Text — editable text under QR (e.g., business name).

### F. Fuel & Maintenance (ফুয়েল ও মেইনটেন্যান্স)
- Fuel Log — per fill-up: volume, cost, odometer, price/liter, payment method.
- Mileage Calculation — auto KPL and cost/km from odometer deltas.
- Fuel Analytics — avg fill-up cost, city/highway % split, fuel-price trends (charts).
- Maintenance Dashboard — service reminders; total / YTD / average maintenance cost.
- Service Record — full service & repair history per vehicle; parts replaced.
- Service reminder — time-based and/or odometer-based; overdue flagging.
- Document expiry reminders — Route Permit, Fitness, Insurance, Tax Token, Registration renewal alerts.

### G. Inventory & Parts (ইনভেন্টরি ও পার্টস)
- Parts Stock — category, part number, brand, location, reorder level, prices.
- Suppliers & Credit — supplier ledger, on-credit purchases, dues payment.
- Purchase/Sale Invoice — multi-item buy/sell with discounts & credit; printable receipts.
- Stock Count & Write-off — physical count, damage/waste write-off, supplier/customer returns.
- Inventory Reports — purchases, supplier payables, reorder-needed, slow-moving/dead stock.

### H. Reports & Analytics (রিপোর্ট ও বিশ্লেষণ)
- Analytics — income/expense trends, sources, collection rates (charts).
- Calendar Report — day-by-day income/expense view.
- Budget — monthly budgets set & tracked with alert threshold.
- Money History — chronological transaction log with filter/search.
- Monthly / category-wise reports — per-vehicle P&L, category breakdown (খাতভিত্তিক).
- Exports — PDF & Excel; on-screen charts; one-click monthly P&L PDF.

### I. Live GPS Tracking (লাইভ GPS) — app-side + hardware product
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

### J. Charging & Loans (চার্জিং ও ঋণ)
- Charging Station — daily/monthly charging bills & dues for e-vehicle charging garages; per-customer daily rate; flexible-rate customers (no due tracking).
- Loans & Installments — receivables/payables and hire-purchase (HP) installment tracking.
- Installment Purchase — HP & installment schedule.

### K. Rental / Bookings (ভাড়া ও বুকিং)
- Booking & Calendar — availability by date; double-booking prevention.
- Customer Profile / CRM — photo, phone, ID, profession, rental history.
- Rental & Invoice — fare, advance/deposit (অগ্রিম), dues (বকেয়া); shareable/printable receipt.
- Trip handover — start/end odometer, distance, fare.
- Hourly/time-based rental billing — one-tap START (রিলিজ)/END (এন্ড); auto-elapsed time + rate + surcharge; SMS bill link.
- Per-vehicle rental profit.
- Roadmap: trip distance & route-based billing (rent-a-car — not yet live).

### L. Party Ledger (পাওনা-দেনা / Loan module — truck/transport)
- Per-client receivable (পাওনা), advance (অগ্রিম), settlement/repayment (পরিশোধ) tracked separately as running ledger.

### M. Billing & Subscription
- Postpaid billing — auto-invoice at month-end; pay via bKash (Nagad/Rocket coming); 7-day payment window; no upfront cost.
- Free tier: 1 vehicle's accounting free forever; multiple vehicles = paid monthly/yearly plan.
- GPS tracker hardware = separate paid add-on.
- In-app payment via bKash + third-party gateways (governed by gateway terms).
- Non-payment temporarily soft-locks paid features (not deletion).

### N. Notifications & Communication
- SMS reminders (driver dues, bill links, document expiry) via SMS gateway.
- In-app / push notifications (dues, document expiry, urgent updates).
- 24/7 SMS reminders (homepage).
- Voice entry — hands-free income/expense logging via microphone.

### O. Support
- In-app support chat / ticket + support phone number.
- Contact/support form (Name*, Mobile, Message*); hours 9 AM–9 PM daily, Friday closed; email amarautobd@gmail.com.

### P. Auto Marketplace (অটো বেচা-কেনা)
- Post Ad — used autos/CNGs/spare parts with photos + map location.
- Verified Feed — admin-moderated; visible in all users' feed only after approval.

### Q. Additional / Platform
- Cloud Backup — encrypted, automatic, per-account.
- Staff Permissions — role-based access (manager/accountant).
- UI Density (responsive small-phone UI).
- Achievements — goals/milestones (gamification).
- Offline mode with auto-sync (offline-first, eventual consistency).
- Multi-business-mode / 8 vertical presets.
- Expense categorization (fuel, repair, garage rent, gas, oil/mobil, tires, parts, toll, driver bata, other).

---

## 2) ENTITY LIST — fields & relationships

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

## 3) BUSINESS RULES & CALCULATIONS

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

## 4) USER ROLES

- **Owner (মালিক)** — account holder; full access; manages fleet, drivers, finances, billing (postpaid via bKash), business-mode selection.
- **Manager (ম্যানেজার)** — staff role with role-based permissions (staff permissions module).
- **Accountant (হিসাবরক্ষক)** — staff role with role-based permissions.
- **Admin (platform)** — moderates the Auto Marketplace feed (approves/rejects listings). Platform-side.
- **Driver (ড্রাইভার)** — not a login user; a managed entity. Receives SMS receipts/reminders; has KYC, dues, vehicle assignment.
- **Customer / Passenger / Party (গ্রাহক/যাত্রী/পার্টি)** — external, not a login user. Passengers scan QR & send anonymous messages; rental/charging/party customers receive receipts, bill-link SMS, and appear in ledgers.
- **Member (সদস্য — bus owner association)** — subscription-paying member tracked in fund accounting (managed entity, not necessarily a login user).

Roles with app logins: Owner + Staff (Manager, Accountant), secured by phone+OTP, PIN, password, multi-device. Drivers/customers/members/passengers are managed entities or external actors, not authenticated app users.