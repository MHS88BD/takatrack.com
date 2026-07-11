# আমার অটো (Amar Auto) — Mobile REST API Surface

## 0. Global Conventions

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

## A. Auth & Onboarding  `/auth`

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

## B. Org / Profile  `/org`, `/profile`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/org` | Owner account/org settings | — | `{ id, name, business_mode, verticals_enabled[], bkash_number, plan, bill_status, terms_accepted_at, address, currency, lang }` | member |
| PATCH | `/org` | Update org profile / business_mode / vertical presets | `name`, `business_mode`, `verticals_enabled[]`, `bkash_number`, `lang`, `default_currency` | updated org | `owner` |
| GET | `/profile` | Current user profile | — | `{ id, name, phone, email, photo_url, role, pin_set, password_set, lang }` | self |
| PATCH | `/profile` | Update own profile | `name`, `email`, `photo_url`, `lang` | updated | self |
| GET | `/org/dashboard` | Smart Dashboard aggregate (today) | `?date=` | `{ today_collections, today_expenses, today_profit, active_vehicles, running_vehicles, unread_qr, overdue_docs, driver_dues_total }` | member |
| POST | `/org/backup/export` | Trigger cloud backup / data export | `format`(json\|encrypted) | `{ job_id, status }` | owner |

---

## C. Users, Roles & Staff Permissions  `/users`

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

## D. Vehicles & Fleet  `/vehicles`  + QR

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

## E. Drivers & KYC  `/drivers`

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

## F. Assignments  `/assignments`
(driver↔vehicle history; also usable for staff↔vehicle scope)

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/assignments` | List current/historical assignments | `vehicle_id`,`driver_id`,`active` | paginated | member |
| POST | `/assignments` | Create assignment | `vehicle_id`,`driver_id`,`start_date` | assignment | `owner`\|`manager` |
| PATCH | `/assignments/{id}` | End/transfer | `end_date` | updated | `owner`\|`manager` |

---

## G. Daily Collections & Receipts  `/collections`

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

## H. Trips / Bookings / Rentals  `/trips`, `/bookings`

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

## I. Ledger — Expenses / Income  `/transactions`

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

## J. Fuel  `/fuel`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/vehicles/{id}/fuel` | Fuel log | `from`,`to` | paginated `[{ fill_date,volume_liters,price_per_liter,cost,odometer,distance_since_last,kpl,cost_per_km,payment_method }]` | member |
| POST | `/vehicles/{id}/fuel` | Add fill-up (auto KPL/cost-per-km) | `volume_liters`,`price_per_liter`,`odometer_reading`,`payment_method`,`fill_date?`,`city_highway_split?` | entry w/ computed mileage; also posts fuel expense | write:txn |
| PATCH | `/fuel/{id}` | Edit | fields | updated | `owner`\|`manager` |
| GET | `/vehicles/{id}/fuel/analytics` | Fuel analytics | `from`,`to` | `{ avg_fillup_cost, kpl_avg, cost_per_km, city_pct, highway_pct, price_trend[] }` | member |

---

## K. Maintenance & Documents  `/maintenance`, `/documents`

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

## L. Inventory & Parts  `/inventory`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/parts` | Parts stock list | `category`,`brand`,`location`,`reorder_needed`,`q` | paginated `[{ id,name,part_number,brand,stock_quantity,reorder_level,reorder_flag,purchase_price,sale_price,location }]` | member |
| POST | `/parts` | Add part | `name`,`category`,`part_number`,`brand`,`reorder_level`,`purchase_price`,`sale_price`,`location`,`opening_stock` | part | write:txn |
| GET | `/parts/{id}` | Detail + movement history | — | part + `[stock_movements]` | member |
| PATCH | `/parts/{id}` | Edit | fields | updated | `owner`\|`manager` |
| GET | `/parts/reorder` | Reorder-needed report | — | `[{ part, shortfall }]` | member |
| GET | `/parts/dead-stock` | Slow-moving/dead stock | `days` | `[{ part, last_moved_at }]` | member |

### Stock Movements  `/stock-movements`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/stock-movements` | Ledger of stock in/out | `part_id`,`type`,`from`,`to` | paginated `[{ part,type(purchase\|sale\|writeoff\|return_in\|return_out\|count_adjust),qty,ref,date }]` | member |
| POST | `/stock-movements` | Manual adjust / write-off / physical count | `part_id`,`type`,`qty`,`reason`,`counted_qty?` | movement + new `stock_quantity` | write:txn |

### Suppliers  `/suppliers`

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| GET | `/suppliers` | List | `has_dues`,`q` | paginated `[{ id,name,contact,outstanding_balance }]` | member |
| POST | `/suppliers` | Add | `name`,`contact` | supplier | write:txn |
| GET | `/suppliers/{id}` | Profile + ledger | — | supplier + `[ledger_entries]`, `outstanding_balance` | member |
| PATCH | `/suppliers/{id}` | Edit | fields | updated | `owner`\|`manager` |
| POST | `/suppliers/{id}/payments` | Pay supplier due | `amount`,`date`,`method` | `{ payment, new_balance }` | write:txn |

### Purchases & Sales  `/purchases`, `/sales`

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

## M. Customers / Parties, Loans & Charging  `/customers`, `/loans`, `/charging`

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

## N. Reports  `/reports`

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

## O. GPS Tracking  `/gps`

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

## P. Billing & Subscription  `/billing`

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

## Q. Notifications, SMS & Support  `/notifications`, `/sms`, `/support`

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

## R. Cross-cutting: Offline Sync & Marketplace

| METHOD | Path | Purpose | Key fields | Response | Auth |
|---|---|---|---|---|---|
| POST | `/sync/batch` | Offline queue flush (bulk mutations, eventual consistency) | `operations[{ op_id,client_id,resource,method,payload,client_created_at }]` | `{ results:[{ op_id, status, server_id?, error? }], server_time }` | member |
| GET | `/sync/changes` | Pull server-side changes since cursor | `since`(cursor/ts),`resources[]` | `{ changes[], next_cursor }` | member |
| GET | `/marketplace/listings` | Public verified feed | `type`,`q` | paginated approved listings | member |
| POST | `/marketplace/listings` | Post ad (pending admin moderation) | `type`,`title`,`description`,`photos[]`,`map_location`,`price` | `{ listing, approval_status:"pending" }` | member |
| GET | `/marketplace/my-listings` | Own listings + approval status | — | paginated | member |

---

## Key JWT / Auth Conventions (summary)

- **Primary credential** = phone + OTP. PIN & password are device conveniences that mint the same JWT pair.
- **Access JWT claims**: `sub, org, role, device_id, scope[], plan, soft_locked, iat, exp(15m)`. Signed RS256; clients verify nothing, just carry it.
- **Refresh**: opaque, rotating, one row per `device_id` → enables **multi-device** and per-device remote logout. Reuse detection revokes the device chain.
- **Scope model**: role → default scope set; owner can grant granular staff permissions (`permissions[]`) that map to scopes. Endpoint auth column shows minimum.
- **Soft-lock (402)**: unpaid org keeps read + free-vehicle write; paid-feature writes rejected with `error.code=SUBSCRIPTION_REQUIRED` until webhook clears the invoice.
- **Idempotency + offline**: all POSTs accept `Idempotency-Key` and `client_id`; `/sync/batch` replays queued offline ops safely.
- **i18n**: `Accept-Language: bn|en`; enums return `{value,label}`; receipts/SMS/PDF render in the org/user `lang`.
- **Pagination**: cursor (`limit`+`cursor`) with `page`/`per_page` fallback; every list wrapped in `{data, meta}`.
- **Public/anon surface** (no JWT): `/public/qr/{payload}/scan` (passenger verify + anonymous owner contact) and `/webhooks/bkash` (HMAC-signed gateway callback).