# আমার অটো ক্লোন — UI/UX ও ডিজাইন সিস্টেম স্পেক

> Master UI document. Bengali-first · offline-first · low-literacy · icon-driven.
> তিন অংশ: (১) Design System — token/color/type/component, (২) Mobile App UI — স্ক্রিন+wireframe+nav, (৩) Web Dashboard + Platform Admin Panel UI।
> Grounding: [01-PRD-full-build-spec.md](01-PRD-full-build-spec.md), [02-feature-inventory.md](02-feature-inventory.md). Phase tags: **MVP** / **P2** / **P3** PRD §2 এর সাথে মেলে।

---

## Part I — Design System (shared: web shadcn/ui + mobile NativeWind)

# আমার অটো (Amar Auto) — Complete Design System
**Shared design tokens for Web (React + shadcn/ui) and Mobile (React Native + NativeWind)**
Version 1.0 · Bengali-first · Field-optimized · Offline-aware

> **North star:** A CNG driver's non-literate father can read the dashboard. Every meaning is carried by **icon + color + shape**, not text alone. Money that comes in is **green (জমা)**, money owed is **red (বাকি)**, and nothing important is ever conveyed by color alone.

---

## 0. Foundational Principles

| Principle | Implication for tokens/components |
|---|---|
| **Bengali is native** | Fonts, numerals, line-height, and letter-spacing are tuned for Bengali script first; Latin is the guest. |
| **Low-literacy redundancy** | Semantic color **always** pairs with an icon and/or a shape/label. Never color-only status. |
| **Field use (sunlight, one thumb, cheap phones)** | ≥ 4.5:1 text contrast, ≥ 48dp tap targets, big number-pad, high-contrast "outdoor" tuned palette. |
| **Offline-first** | A persistent sync/offline state layer (banner + per-row badges) is a first-class component. |
| **Money is sacred** | Currency uses tabular figures, fixed decimal, never floats; income/expense/due colors are locked and never reused for branding. |
| **One system, two runtimes** | A single JSON token source generates the shadcn CSS variables (HSL) and the NativeWind Tailwind theme. Component *specs* are shared; implementations differ. |

---

## 1. Bengali Typography

### 1.1 Font recommendations (role → font)

| Role | Primary font | Why | Fallback stack |
|---|---|---|---|
| **UI / body / labels** | **Hind Siliguri** (400/500/600/700) | Purpose-built for Bengali UI at small sizes; excellent hinting on low-DPI Android; even color/rhythm; wide weight range. | `"Hind Siliguri", "Noto Sans Bengali", system-ui, sans-serif` |
| **Headings / display / stat numbers** | **Anek Bangla** (variable, 500–800) | Modern, slightly condensed, confident at large sizes for KPIs and screen titles; variable = 1 file, many weights. | `"Anek Bangla", "Hind Siliguri", sans-serif` |
| **Currency / tabular numerals (dashboards, ledger, tables)** | **Hind Siliguri** with `font-feature-settings: "tnum" 1, "lnum" 1` (Latin) OR native Bengali numerals rendered in Hind Siliguri | Hind Siliguri has even numeral widths → columns line up in ledgers. | `"Hind Siliguri", "Noto Sans Bengali"` |
| **Receipts / PDF / print / SMS-image** | **Noto Sans Bengali** (embed 400/700) | The most complete, license-clean (OFL) Bengali coverage; renders identically across PDF engines and OS; safe conjunct rendering. | Embed subset in PDF; never rely on system font. |
| **Monospace (IDs, IMEI, receipt no., part no.)** | **JetBrains Mono** / `ui-monospace` | Latin-only technical strings; unambiguous 0/O, 1/l. | `ui-monospace, "JetBrains Mono", monospace` |

> **Do NOT use** Baloo Da 2 as the body/UI font — its rounded display personality hurts legibility of dense conjuncts (যুক্তাক্ষর) at 13–15px and in ledgers. Reserve **Baloo Da 2** (or Anek) only for **marketing/onboarding illustration captions and the app wordmark**, not product chrome.

### 1.2 Font loading

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

### 1.3 Bengali vs Latin numeral policy

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

### 1.4 Type scale (shared)

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

## 2. Color System

### 2.1 Semantic model

Colors are split into **Brand** (identity), **Financial** (locked meanings — never reused for decoration), **Status** (operational states), and **Neutrals**. Every semantic color has a `-fg` (text/icon on that surface) and, where used as a subtle background, a `-subtle` + `-subtle-fg` pair for AA-safe filled chips/rows.

**Locked financial semantics (memorize these — they are the product):**

| Meaning | Bengali | Token | Light | Dark |
|---|---|---|---|---|
| **Income / deposit / collection** | জমা / আয় | `income` (= success) | `#15803D` (green-700) | `#4ADE80` (green-400) |
| **Expense / due / owed / shortfall** | বাকি / খরচ / বকেয়া | `due` (= danger) | `#DC2626` (red-600) | `#F87171` (red-400) |
| **Expiry / overdue-soon / warning** | মেয়াদ / সতর্কতা | `warning` | `#B45309` (amber-700) | `#FBBF24` (amber-400) |
| **Discount / waiver / advance** | ছাড় / অগ্রিম | `info` (blue, neutral-positive) | `#1D4ED8` (blue-700) | `#60A5FA` (blue-400) |

> Rule: green = money in, red = money out/owed. **Brand color is deliberately NOT green or red** so branding never collides with financial meaning.

### 2.2 Brand

Primary = **Trust Teal-Blue** (`#0E7490`-family, cyan-800/teal). Reads as trustworthy + techy, distinct from income-green and due-red, high-contrast on white and in sunlight.

| Token | Light | Dark |
|---|---|---|
| `primary` | `#0E7490` (cyan-800) | `#22D3EE` (cyan-400) |
| `primary-fg` | `#FFFFFF` | `#062A33` |
| `primary-hover` | `#0C6379` | `#67E8F9` |
| `primary-subtle` (bg) | `#ECFEFF` (cyan-50) | `#0B3B47` |
| `primary-subtle-fg` | `#0E7490` | `#A5F3FC` |
| `accent` (secondary CTA, highlights) | `#7C3AED` (violet-600) | `#A78BFA` |

### 2.3 Full token table (light + dark)

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

### 2.4 Operational status colors (with mandatory icon/shape)

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

### 2.5 Chart palette (categorical + sequential)

Categorical (expense categories, income sources) — colorblind-safe, distinct in light+dark:
```
c1 #0E7490 (teal)  c2 #7C3AED (violet)  c3 #EA580C (orange)
c4 #0891B2 (cyan)  c5 #CA8A04 (gold)    c6 #DB2777 (pink)
c7 #4D7C0F (olive) c8 #475569 (slate)
```
Financial dual-series charts must keep **income=green, expense/due=red** (do not recolor from categorical). Sequential (heatmap/intensity): single-hue teal ramp `#ECFEFF → #0E7490 → #164E63`. Follow the app's numeral system for axis ticks; ≥3:1 contrast for bars vs background. (See dataviz guidance for legend/tooltip/tick rules if building charts.)

---

## 3. Spacing, Radius, Elevation, Breakpoints, Tap Targets

### 3.1 Spacing scale (4px base)
`0, 1=4, 2=8, 3=12, 4=16, 5=20, 6=24, 8=32, 10=40, 12=48, 16=64` (px). Screen gutters: **16px mobile**, 24px tablet, 32px web. Card padding: 16 (mobile) / 20 (web). Stack gap between cards: 12–16.

### 3.2 Radius
| Token | px | Use |
|---|---|---|
| `radius-sm` | 8 | chips, badges, inputs |
| `radius-md` | 12 | buttons, cards (default) |
| `radius-lg` | 16 | stat cards, sheets top corners |
| `radius-xl` | 24 | bottom-sheet grabber area, modals |
| `radius-pill` | 999 | keypad keys are `radius-lg`, FAB & filter chips pill |
| `radius-full` | 9999 | avatars, status dots |

Base `--radius: 12px` (shadcn derives sm/md/lg from it).

### 3.3 Elevation
Field-friendly: rely on **border + subtle shadow**, not heavy blur (cheap screens smear). Dark mode uses lighter *surface* instead of shadow.

| Token | Light shadow | Dark |
|---|---|---|
| `e0` flat | none, 1px border | 1px border |
| `e1` card | `0 1px 2px rgba(15,23,42,.06), 0 1px 3px rgba(15,23,42,.10)` | border + `surface` lift |
| `e2` raised/menu | `0 4px 12px rgba(15,23,42,.10)` | `0 4px 16px rgba(0,0,0,.5)` |
| `e3` sheet/modal | `0 12px 32px rgba(15,23,42,.18)` | `0 16px 40px rgba(0,0,0,.6)` |
| `e-fab` | `0 6px 16px rgba(14,116,144,.35)` | `0 6px 16px rgba(34,211,238,.25)` |

### 3.4 Breakpoints
| Name | min-width | Layout |
|---|---|---|
| `xs` | 0 | 1-col, bottom-nav (mobile app + small web) |
| `sm` | 480 | large phone, 2-col stat grid |
| `md` | 768 | tablet, 2–3 col, sidebar collapsible |
| `lg` | 1024 | web dashboard, persistent left sidebar + content |
| `xl` | 1280 | 3–4 col dashboards, side detail panel |
| `2xl` | 1536 | max-width 1440 content, wide tables |

Mobile app is effectively `xs`. Web dashboard designs at `lg`+ with a mobile-web fallback at `xs`.

### 3.5 Tap targets (field-critical)
- **Minimum 48×48 dp** for any tap target (Android a11y). Primary field actions (keypad keys, জমা entry, START/END) = **56dp**.
- Keypad keys: **64dp tall** on phones ≥ sm, min 56dp on xs; 8px gap.
- Min 8px spacing between adjacent targets. FAB 56dp, bottom-nav items 56–64dp tall with icon+label.
- Form inputs: 52dp height on mobile. Do not place two destructive actions adjacent.

---

## 4. Component Library Spec + Token Blocks

### 4.1 Design tokens — JSON (single source → generates both runtimes)

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

### 4.2 shadcn/ui CSS variables (web — `globals.css`, HSL for shadcn compatibility)

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

### 4.3 NativeWind (mobile) — `tailwind.config.js`

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

### 4.4 Component specs

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

## 5. Iconography, Imagery, RTL, Accessibility

### 5.1 Icon set
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

### 5.2 Imagery
- Onboarding/empty-states: **flat vector illustrations** of Bangladeshi CNG/auto/bus/garage scenes; warm, optimistic, brand-teal + accent-violet + income-green accents. Diverse, respectful depiction of drivers/owners.
- Photos: driver KYC & vehicle docs are user content — show in rounded cards with graceful fallbacks (initials avatar for drivers, type-icon tile for vehicles).
- Never use text baked into raster images for UI copy (localization + accessibility).

### 5.3 RTL
Bengali is **LTR** — the app is LTR. But build with **logical properties** (`margin-inline-start`, `ps-`/`pe-` in Tailwind, `flex-row` with `start/end`) so a future Urdu/Arabic market isn't a rewrite. Icons that imply direction (back chevron) stay LTR now; gate any mirroring behind `I18nManager.isRTL`. Numerals within Bengali text remain LTR runs.

### 5.4 Accessibility (field + low-literacy)
- **Contrast:** all text ≥ AA 4.5:1 (verified in token table); status never color-only — **icon + shape + label** redundancy is mandatory (see §2.4).
- **Tap:** ≥48dp targets, 8dp spacing (§3.5).
- **Text scaling:** support OS font scaling up to 200%; layouts reflow (no fixed-height text rows for Bengali). Test at 130% (common on cheap large-DPI phones).
- **Screen readers:** every icon-only control has a Bengali `accessibilityLabel`/`aria-label`. Money announced with unit ("এক হাজার টাকা জমা"). Status chips announce state, not just color.
- **Focus:** visible 2px `ring` focus ring on web; logical tab order; keypad operable.
- **Motion:** respect `prefers-reduced-motion` — disable pulsing run-state dot, keep static icon.
- **Colorblind:** income/due distinguishable by icon (down-arrow vs up-arrow / check vs triangle) and position, verified against deuteranopia. Never the sole ▲/▼ color.
- **Haptics:** confirm on save, error buzz on failed sync — reinforces state non-visually.

---

## 6. Illustration & Tone Guidelines

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

### Build order for a developer
1. Drop the **JSON tokens** (§4.1) into Style Dictionary → emit shadcn CSS vars (§4.2), NativeWind config (§4.3), and a PDF theme.
2. Self-host + preload **Hind Siliguri / Anek Bangla**, bundle in Expo, embed **Noto Sans Bengali** in the PDF pipeline.
3. Implement the shared **`formatCurrency` / `toBnDigits`** with the `numeralSystem` locale switch (§1.3).
4. Build the signature **Keypad + Collection bottom sheet**, **stat/vehicle/driver cards**, **status chip system (icon+shape+color)**, and the **offline banner** first — they carry the product's core loop.
5. Wire the **receipt template** with embedded Bengali font and test conjuncts + ৳ at thermal + screen resolution before any receipt ships.

All hex values in the token table meet WCAG AA for their intended text/background pairing in both light and dark modes; status is always conveyed by icon + shape + color together, never color alone.

---

## Part II — Mobile App UI (React Native / Expo)

# আমার অটো (Amar Auto) — Complete Mobile App UI/UX Spec

React Native / Expo · Android-first · Bengali-first (native, not translated) · Offline-first · Low-literacy · Icon-driven

Grounding: `docs/01-PRD-full-build-spec.md` (§2 feature inventory, §3 roles/auth, soft-lock 402) and `docs/02-feature-inventory.md` (§3 business rules). Phase tags below mirror the PRD: **MVP** = Phase 1, **P2** = Phase 2 (monetization/depth), **P3** = Phase 3 (platform/hardware/verticals).

---

## 0. Design Principles (drives every decision below)

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

## 1. SCREEN INVENTORY (grouped by flow)

Legend: **[MVP]** ship Phase 1 · **[P2]** · **[P3]** · roles that can reach it in parens.

### Flow 1 — Onboarding / Auth (OTP + PIN)
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

### Flow 2 — Home Dashboard
| # | Screen | Phase | |
|---|---|---|---|
| 2.1 | Smart Dashboard (today) | MVP | Collections/expenses/profit/active-vehicle count, live |
| 2.2 | Quick-add sheet (central +) | MVP | জমা / খরচ / গাড়ি / ড্রাইভার / আয় |
| 2.3 | Notifications center | P2 | Dues, doc expiry, sync errors, bill link |
| 2.4 | Global search | P2 | Driver/vehicle/receipt search |

### Flow 3 — Collections & Accounts (হিসাব ও জমা)
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

### Flow 4 — Drivers & Dues (ড্রাইভার)
| # | Screen | Phase | |
|---|---|---|---|
| 4.1 | Driver list + dues | MVP | Dues in RED, sortable by dues |
| 4.2 | Driver detail (ledger) | MVP | জমা/বাকি/ছাড় columns, running balance |
| 4.3 | Add/edit driver + KYC | MVP | NID, photo, profession, phone |
| 4.4 | Set daily target | MVP | Drives shortfall auto-calc |
| 4.5 | Dues repayment / settle | MVP | Reduce remaining balance |
| 4.6 | Send SMS reminder | MVP | Prefilled Bengali dues SMS |
| 4.7 | Driver-vehicle assignment | MVP | One active assignment/vehicle |

### Flow 5 — Vehicles & Fleet (গাড়ি ও বহর)
| # | Screen | Phase | |
|---|---|---|---|
| 5.1 | Vehicle list / fleet grid | MVP | Status chips (খালি/ভাড়ায়/বুকড) |
| 5.2 | Vehicle profile + P&L | MVP | Per-vehicle income/expense/profit |
| 5.3 | Add vehicle (+ free-tier gate) | MVP | 2nd+ vehicle triggers paywall |
| 5.4 | Edit vehicle / docs | MVP | Reg, type, odometer, route |
| 5.5 | Fleet calendar (status board) | P2 | Empty/rented/booked/running |
| 5.6 | Accident record + photo | P3 | Auto-posts expense |

### Flow 6 — Receipts
| # | Screen | Phase | |
|---|---|---|---|
| 6.1 | Digital receipt preview | MVP | PDF/image, share link |
| 6.2 | Share sheet (SMS/WhatsApp/link) | MVP | |
| 6.3 | Receipt history | P2 | Reissue/resend |

### Flow 7 — Reports & Analytics (রিপোর্ট)
| # | Screen | Phase | |
|---|---|---|---|
| 7.1 | Reports home (P&L summary) | MVP | Period switch, per-vehicle P&L, export |
| 7.2 | Category-wise (খাতভিত্তিক) | P2 | Pie/bar |
| 7.3 | Calendar report | P2 | Day-by-day |
| 7.4 | Analytics trends (charts) | P2 | Income/expense/collection rate |
| 7.5 | Budget set + alert | P2 | Monthly threshold |
| 7.6 | Export (PDF/Excel) sheet | MVP | Monthly P&L PDF one-tap |

### Flow 8 — Fuel & Maintenance (ফুয়েল ও মেইনটেন্যান্স)
| # | Screen | Phase | |
|---|---|---|---|
| 8.1 | Fuel log list + KPL | P2 | |
| 8.2 | Add fuel fill-up | P2 | Volume/price/odo → auto cost/KPL |
| 8.3 | Fuel analytics | P2 | City/highway, price trend |
| 8.4 | Maintenance dashboard | P2 | Reminders, cost totals |
| 8.5 | Add service record | P2 | Parts, next-due |
| 8.6 | Document expiry list | P2 | Route permit/fitness/insurance/tax/reg |

### Flow 9 — Live GPS (লাইভ GPS)
| # | Screen | Phase | |
|---|---|---|---|
| 9.1 | Live map (all vehicles) | P3 | ~10s refresh, 100+ pins |
| 9.2 | Vehicle live detail | P3 | Speed, ignition, lock/unlock |
| 9.3 | Trip history + playback | P3 | |
| 9.4 | Geofence + alerts config | P3 | |
| 9.5 | Order GPS hardware flow | P3 | Order→Call→Install→Live, COD |

### Flow 10 — Rental / Bookings (ভাড়া ও বুকিং)
| # | Screen | Phase | |
|---|---|---|---|
| 10.1 | Booking calendar | P2 | Availability, no double-book |
| 10.2 | New booking / rental invoice | P2 | Fare, অগ্রিম, বকেয়া |
| 10.3 | Hourly START(রিলিজ)/END(এন্ড) | P2 | Auto elapsed + surcharge |
| 10.4 | Customer CRM profile | P2 | Photo/ID/rental history |
| 10.5 | Trip handover (odometer) | P2 | |

### Flow 11 — Charging / Loans / Party (verticals)
| # | Screen | Phase | |
|---|---|---|---|
| 11.1 | Charging daily collection | P3 | Per-customer daily rate, dues |
| 11.2 | Loans & installments | P3 | Given/taken/HP schedule |
| 11.3 | Party ledger (পাওনা-দেনা) | P3 | Truck/transport running ledger |
| 11.4 | Inventory & parts | P3 | Stock, suppliers, invoices |

### Flow 12 — Billing & Subscription
| # | Screen | Phase | |
|---|---|---|---|
| 12.1 | Upgrade / paywall (free-tier gate) | MVP (gate) | Triggered by 2nd vehicle |
| 12.2 | Plan compare | P2 | 2-wheeler ৳350 / car-bus-truck ৳500 |
| 12.3 | Postpaid bill + bKash pay | P2 | Month-end invoice, 7-day window |
| 12.4 | Soft-lock banner / interstitial | P2 | HTTP 402, read stays open |
| 12.5 | Billing history | P2 | |

### Flow 13 — QR (গাড়ি QR)
| # | Screen | Phase | |
|---|---|---|---|
| 13.1 | QR dashboard (scans/messages) | P2 | |
| 13.2 | Passenger messages inbox | P2 | Anonymous, complaints/lost-item |
| 13.3 | Bulk QR print / sticker | P2 | |

### Flow 14 — Marketplace (অটো বেচা-কেনা)
| 14.1 | Feed | P3 | Admin-moderated |
| 14.2 | Post ad | P3 | Photos + map |

### Flow 15 — Settings / Profile / Support
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

## 2. NAVIGATION MODEL

### 2.1 Root

```
RootNavigator (auth gate on cached session + PIN)
├── AuthStack        (splash, lang, carousel, phone, OTP, mode, PIN, onboarding wizard)
├── AppTabs          (bottom tab bar — signed-in Owner/Manager/Accountant)
└── ModalStack       (quick-add sheets, paywall, receipt share, voice entry, soft-lock)
```

### 2.2 Bottom tab bar (5 slots, center is the action)

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

### 2.3 The central "+" Quick-Add (the money shot)

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

### 2.4 Stack flows (per tab)

- **Home stack:** Dashboard → Notifications → Search → any entity detail.
- **Drivers stack:** List → Detail(ledger) → Repayment / SMS / Edit-KYC / Assign.
- **Vehicles stack:** List/Grid → Profile(P&L) → Add(gate) → Edit/Docs → Accident.
- **Reports stack:** Home → Category → Calendar → Analytics → Export.
- **"আরও" (More) menu** (overflow, reachable from Home header ☰): Fuel/Maintenance, GPS, Rental, Charging/Loans, Inventory, QR, Marketplace, Billing, Staff, Settings, Support. Keeps the tab bar to 5 while exposing all P2/P3 modules.

### 2.5 Deep links / entry points

- SMS receipt link → public receipt view (no auth).
- Push "দ্বায় পরিশোধ করুন" → driver detail.
- bKash return → billing screen.
- QR scan (passenger, separate anon surface) → verify page.

---

## 3. ASCII WIREFRAMES — 10 key screens

Persistent element on every signed-in screen: the **sync chip** top-right of the header.
`● সিঙ্ক` (green dot = synced) · `⟳ ৩ অপেক্ষায়` (amber = 3 queued) · `⚠ অফলাইন` (grey/amber = no network).

---

### 3.1 Dashboard (2.1) [MVP]

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

### 3.2 Daily Collection — keypad entry (3.2) [MVP] ★ core screen

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

### 3.3 Driver dues list (4.1) [MVP]

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

### 3.4 Driver detail / ledger (4.2) [MVP]

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

### 3.5 Vehicle profile + P&L (5.2) [MVP]

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

### 3.6 Add vehicle — free-tier gate (5.3 / 12.1) [MVP]

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

### 3.7 Digital receipt + share (6.1) [MVP]

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

### 3.8 Reports (7.1) [MVP]

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

### 3.9 OTP login (1.5) [MVP]

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

### 3.10 Upgrade / paywall + postpaid bill (12.1 / 12.3) [MVP gate / P2 pay]

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

## 4. KEY INTERACTIONS

### 4.1 One-tap keypad collection (the flagship interaction)
1. From Dashboard "জমা দিন" quick-action OR + → জমা → pick driver.
2. Keypad opens with driver, target, prior dues preloaded.
3. Tap **"লক্ষ্য পূরণ"** chip → amount = daily target instantly, or type amount.
4. `ঘাটতি` recomputes live per keystroke; turns RED when a due will be created.
5. Optional **ছাড় (waiver)** via a small "ছাড় দিন" link → mini keypad.
6. **✅ জমা নিশ্চিত করুন** → haptic + green success flash → receipt CTA.
7. If a shortfall exists, a `DriverDue` auto-posts; the driver's list badge updates immediately (optimistic, offline-safe).

Target: an experienced owner logs a collection in **≤ 3 taps** (driver, লক্ষ্য পূরণ, নিশ্চিত).

### 4.2 Offline indicator + sync state (always visible)
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

### 4.3 Dues-in-red (consistent visual grammar)
- RED (`#D32F2F`) is reserved **only** for outstanding dues/loss: driver dues pill, `বাকি` column, negative P&L, overdue bill, shortfall ledger rows.
- Zero/cleared dues → GREEN pill "পরিশোধিত". Never show ৳0 in red.
- Total-dues bar on Dashboard is the app's single loudest red element to drive collection behavior.
- Icon pairing (🔴/🟢) accompanies color for colorblind + low-literacy redundancy.

### 4.4 Empty states (icon + one action, never a blank screen)
| Screen | Illustration + copy | CTA |
|---|---|---|
| Drivers (none) | 🧑‍✈️ "এখনো কোনো ড্রাইভার নেই" | ➕ প্রথম ড্রাইভার যোগ করুন |
| Vehicles (none) | 🚗 "আপনার ১ম গাড়ি ফ্রি!" | ➕ ফ্রি গাড়ি যোগ করুন |
| Collections today | 💰 "আজ এখনো জমা নেওয়া হয়নি" | জমা নিন |
| Reports (no data) | 📊 "হিসাব শুরু করলে রিপোর্ট দেখা যাবে" | জমা নিন |
| Receipts | 🧾 "কোনো রসিদ নেই" | — |
| GPS (no device) | 📍 "GPS ট্র্যাকার নেই" | ট্র্যাকার অর্ডার করুন (P3) |

### 4.5 Error / toast copy (Bengali, plain, actionable)
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

### 4.6 Confirmations / undo
- Collection save shows a 4-second "বাতিল করুন (undo)" snackbar before committing to sync queue (guards fat-finger amounts).
- Delete/void requires typed/tap confirm sheet; ledger entries are voided (audit-flagged), never hard-deleted (matches "never delete data").

---

## 5. LOW-LITERACY & ACCESSIBILITY CHOICES

### 5.1 Icon + color coding system (learnable vocabulary)
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

### 5.2 Large tap targets & density
- Keypad keys 88dp; primary buttons 72dp full-width; list rows ≥ 56dp.
- Max 5–6 interactive elements per viewport on core flows.
- Responsive down to small/cheap Android phones (360dp width) — 2-column tile grids collapse to 1 gracefully; text never truncates critical numbers (amounts get priority space).

### 5.3 Minimal typing
- Amounts: numeric keypad only (Bengali digits default).
- Names: picker/search from existing entities; only KYC creation needs typing (with big fields, phone = numeric).
- Quick chips (`+৫০০`, `লক্ষ্য পূরণ`) remove most number entry.
- Dates via calendar picker, not typed.

### 5.4 Voice-entry hook (P3, designed-in now)
- 🎙️ button in Quick-Add and in expense/income keypad screens.
- Flow: press-and-hold mic → Bengali speech "পাঁচশো টাকা তেল খরচ" → parsed into amount + category + optional vehicle → shows a **confirmation card** (never auto-commits) → user taps ✅.
- Falls back gracefully: if parse confidence low, prefill what it caught and let user finish on keypad.
- Mic permission is optional and gated only to this feature (per PRD device-permission model).

### 5.5 Redundant signaling & robustness
- Every color carries an icon partner (colorblind-safe).
- Haptics: confirm on save, error buzz on failed submit.
- Numerals toggle (Bengali ↔ Latin) in settings for mixed-literacy staff.
- Bengali TalkBack labels on all icons; screen-reader pass required for the 10 wireframed screens before MVP ship.
- Font scaling to 200% without layout break on core flows.
- All destructive/financial actions are reversible or confirmable (undo snackbar, void-not-delete).

---

## 6. Build Notes (Expo / RN specifics)

- **Nav:** React Navigation — `NativeStackNavigator` per tab, `BottomTabNavigator` root, `Modal` group for Quick-Add/paywall/receipt.
- **Offline core:** WatermelonDB or SQLite + a mutation queue; optimistic writes with `⟳` pending flag; background sync on `NetInfo` reconnect. Collections/dues/expenses are the MVP offline-critical entities.
- **Auth:** phone+OTP → JWT access (15m) + rotating refresh per `device_id`; PIN/biometric unlock re-mints tokens locally. Store refresh in SecureStore, PIN as local check only.
- **Soft-lock:** intercept `402 SUBSCRIPTION_REQUIRED` in the API layer → route to soft-lock interstitial; never block reads/free-vehicle writes.
- **i18n:** `i18next`, Bengali default bundle is source-of-truth (not a translation of English). Bengali numeral formatter utility, toggle-driven.
- **Receipts:** server renders `pdfUrl`/`shareLink`; client renders a local card for instant/offline display, hydrates share link post-sync.
- **Numbers:** all money as Decimal strings from API; format with a single currency util (৳ prefix, thousands grouping, Bengali digits).
- **Theming:** semantic color tokens (`money.in`=green, `money.due`=red, `warn`=amber) so the dues-in-red grammar is enforced centrally.

---

### Phase rollup
- **MVP (Phase 1):** Flows 1,2,3(core),4,5,6,7(summary+export),15(settings/sync). Screens marked [MVP] above — this is a fully usable daily-collection + dues + per-vehicle P&L + receipt product with the free-tier gate and postpaid consent.
- **P2:** notifications, ledger/balance-sheet, fuel/maintenance, rental/booking, QR, analytics/budget, staff permissions, bKash pay + soft-lock enforcement, multi-device.
- **P3:** GPS live map + hardware order, charging/loans/party ledger, inventory, marketplace, voice entry, accident records, cloud backup, achievements.

---

## Part III — Web Dashboard + Platform Admin Panel UI

# আমার অটো (Amar Auto) — Web Dashboard + Platform Admin Panel · UI/UX Design Spec

**Stack:** React + TS + Vite · TanStack Query · Tailwind + shadcn/ui · React Hook Form + Zod · ECharts/Recharts · i18n (bn default, native)
**Source of truth:** `docs/01-PRD-full-build-spec.md` (§2 features, §3 roles, §4 data model, §5 API) + `docs/02-feature-inventory.md`
**Phase legend:** `[MVP]` Phase 1 · `[P2]` Phase 2 · `[P3]` Phase 3

---

## 0. Design Foundations (apply to every screen)

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

# PART A — OWNER WEB DASHBOARD (Management Console)

## A1. Global Layout

Persistent **three-zone shell**: left Sidebar · top Topbar · main Content. On mobile the sidebar collapses into a `sheet` drawer triggered by a hamburger; a bottom-tab bar surfaces the 4 MVP essentials (ড্যাশবোর্ড / জমা / গাড়ি / ড্রাইভার).

### Topbar (sticky, h-14)
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

### Sidebar (grouped, icon+label, collapsible to icon-rail)
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

## A2. Full Page Inventory

Each row: route · Bengali title · purpose · **key components** · primary API · phase.

### Accounts & Collections
| Route | Title | Purpose / key components | API | Phase |
|---|---|---|---|---|
| `/` | ড্যাশবোর্ড | Today's KPI tiles (collection/expense/profit/active+running vehicles), driver-dues total, unread-QR, overdue-docs, alerts feed, quick-entry launcher, 7-day trend chart | `GET /org/dashboard`, `/reports/analytics` | MVP |
| `/collections` | জমা / কালেকশন | Driver picker → NumericKeypad amount entry; live shortfall + running-due; receipt preview (PDF/image/share); collections ledger table (filter by driver/vehicle/date, backdated flag); resend-SMS | `POST /collections`, `GET /collections`, `/collections/:id/receipt`, `/send-sms` | MVP |
| `/ledger` | খতিয়ান / আয়-খরচ | Money history (double-entry) table; add income/expense drawer with category (khat) picker; voice-entry mic button; backdated toggle (audit-flagged); debit/credit pair on row-expand | `GET /transactions`, `POST /transactions/expense|income|voice`, `/categories` | MVP |

### Fleet
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

### Parties, Stock, Loans
| Route | Title | Purpose / key components | API | Phase |
|---|---|---|---|---|
| `/customers` | গ্রাহক / পার্টি | CRM table (dues/advance/receivable), profile + party-ledger (পাওনা/দেনা/অগ্রিম/পরিশোধ running balance) | `GET /customers`, `/:id/party-ledger` | P2 |
| `/inventory` | ইনভেন্টরি / পার্টস | Parts stock table (reorder flag), part detail + stock-movement history, count/write-off, reorder & dead-stock reports | `GET/POST /parts`, `/stock-movements`, `/parts/reorder` | P3 |
| `/suppliers` | সরবরাহকারী | Supplier ledger (outstanding), pay-due, purchase invoices | `GET /suppliers`, `/:id/payments`, `POST /purchases` | P3 |
| `/purchases` `/sales` | ক্রয় / বিক্রয় | Multi-item invoice builder (discount, credit), printable/share receipt, returns | `POST /purchases`, `/sales`, `/returns` | P3 |
| `/loans` | ঋণ ও কিস্তি | Loans given/taken/HP, installment schedule, record payment, remaining-balance | `GET/POST /loans`, `/:id/payments` | P3 |
| `/charging` | চার্জিং | Daily charge sessions per customer, dues auto-calc (`prev + rate − paid`), flexible-rate (no-due) customers, monthly bill | `GET/POST /charging/sessions`, `/customers/:id/bill` | P3 |

### Reports
| Route | Title | Purpose / key components | API | Phase |
|---|---|---|---|---|
| `/reports` | রিপোর্ট ও বিশ্লেষণ | Tabbed hub: আয়-খরচ, লাভ-ক্ষতি (P&L overall/per-vehicle), ব্যালেন্স শীট, ট্রায়াল ব্যালেন্স, ড্রাইভার বাকি (aging), ক্যালেন্ডার, খাতভিত্তিক, বাজেট. Charts (ECharts) + **PDF / Excel export** buttons (async job → poll → download) | `GET /reports/*`, `POST /reports/export`, `GET /exports/:job` | MVP (money-history, per-vehicle P&L, PDF/Excel) / P2 (balance sheet, trial balance, analytics, budget) |

### Platform / Admin (owner-side)
| Route | Title | Purpose / key components | API | Phase |
|---|---|---|---|---|
| `/staff` | স্টাফ ও পারমিশন | Staff table (Manager/Accountant), invite via phone+OTP, **role→permission matrix** editor | `GET/POST /users`, `/roles`, `/permissions` | P2 |
| `/billing` | বিলিং ও সাবস্ক্রিপশন | Current subscription + soft-lock state, plan catalog (freemium + GPS tiers/terms), usage meter (projected total), postpaid invoice list, **bKash pay** flow, free-gate meter | `GET /billing/subscription`, `/plans`, `/usage`, `/invoices`, `POST /invoices/:id/pay` | MVP (gate/plan view) / P2 (charge + pay) |
| `/marketplace` | মার্কেটপ্লেস | Post ad (photos + map + price), my-listings with approval status (pending/approved/rejected), browse verified feed | `GET /marketplace/listings`, `POST /listings`, `/my-listings` | P3 |
| `/notifications` | নোটিফিকেশন | In-app feed (dues/doc-expiry/service/bill/alert), mark-read/all, push-token reg | `GET /notifications`, `/read-all` | P2 |
| `/support` | সাপোর্ট | Ticket/chat list, open ticket, contact form (Name*, Mobile, Message*), support hours/phone | `GET/POST /support/tickets`, `/contact` | P2 |
| `/settings` | সেটিংস | Org (name, business-mode/preset toggles, bkash number, address, currency, lang), profile, PIN/password, devices, categories (khat) manager, cloud backup/export | `PATCH /org`, `/profile`, `/auth/set-pin`, `/org/backup/export` | MVP |

---

## A3. ASCII Wireframes — 8 Key Owner Pages

> Notation: `[ ]` button · `▸` dropdown · `◔` chart · `▓` filled/active · red text noted as `(!)`, green as `(✓)`.

### WF-1 · ড্যাশবোর্ড (Dashboard / Overview) `[MVP]`
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

### WF-2 · গাড়ি তালিকা (Vehicle List) `[MVP]` + Profile `[MVP]`
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

### WF-3 · ড্রাইভার বাকি (Driver Dues) `[MVP]`
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

### WF-4 · জমা / কালেকশন লেজার (Collections Entry + Ledger) `[MVP]`
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

### WF-5 · রিপোর্ট ও বিশ্লেষণ (Reports & Analytics) `[MVP/P2]`
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

### WF-6 · স্টাফ ও পারমিশন ম্যাট্রিক্স (Staff / Roles Permission Matrix) `[P2]`
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

### WF-7 · বিলিং ও সাবস্ক্রিপশন (Billing & Subscription) `[MVP gate / P2 charge]`
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

### WF-8 · লাইভ GPS ফ্লিট ম্যাপ (GPS Fleet Map) `[P3]`
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

# PART B — PLATFORM ADMIN PANEL (Super-Admin)

Separate role-gated route-set (`/admin`) in the *same* React app, but a **distinct shell** (different sidebar, no org/tenant scoping — admin operates cross-org). Access requires platform `Admin` role; the `organizationId` tenant filter is bypassed only here. Distinct visual treatment (darker/neutral chrome, "প্ল্যাটফর্ম অ্যাডমিন" wordmark) so an admin never confuses it with an owner console.

**Cross-org tables** (`SubscriptionPlan` price book, marketplace moderation) carry no `organizationId` — the admin panel is their only editor.

## B1. Admin Pages
| Route | Title | Purpose / key components | API |
|---|---|---|---|
| `/admin` | মেট্রিক্স ড্যাশবোর্ড | Platform KPIs: total orgs, active/soft-locked, MRR, free→paid conversion, new signups, SMS spend, GPS orders pipeline, churn; trend charts | platform metrics (admin-scoped) |
| `/admin/tenants` | টেন্যান্ট / প্রতিষ্ঠান | All orgs table (name, owner phone, business-mode, plan, bill_status, vehicles, created); drill into org (read-only impersonate for support), soft-lock/unlock, plan override | admin org endpoints |
| `/admin/moderation` | মার্কেটপ্লেস মডারেশন | **Approve/reject queue** for marketplace listings (pending first); photo gallery, map location, price, seller org; bulk actions; reject-reason | `GET/PATCH` marketplace moderation |
| `/admin/users` | ইউজার ও সাপোর্ট | Cross-org user lookup, support tickets triage, contact-form submissions, device/session reset | `/support/tickets`, admin user lookup |
| `/admin/billing-ops` | বিলিং অপস | Invoice runs, failed bKash payments, manual mark-paid/refund, soft-lock overrides, plan price-book editor (`SubscriptionPlan`) | billing admin + `SubscriptionPlan` |
| `/admin/sms-ops` | SMS অপস | Gateway health (SSL Wireless + failover providers), delivery rates, per-type volume, OTP failure spikes, spend | `/sms/logs` (cross-org), provider status |
| `/admin/gps-inventory` | GPS ইনভেন্টরি ও অর্ডার | Device stock (IMEI/SIM), order fulfillment pipeline (ordered→called→installed→live), install scheduling, warranty tracking | `/gps/orders`, `/gps/devices` |

## B2. Admin Wireframes

### WF-9 · মার্কেটপ্লেস মডারেশন কিউ (Moderation Queue)
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

### WF-10 · টেন্যান্ট তালিকা (Tenant / Org List)
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

# PART C — Component Patterns (Buildable Specs)

### C1. Data Table (`<DataTable>` — TanStack Table + shadcn)
Single reusable component powering every list.
- **Toolbar:** left = title + count; right = search (`q`, debounced 300ms), faceted filter dropdowns (multi-select chips), density toggle, column-visibility menu, export buttons.
- **Filtering/sorting/pagination:** server-side. Filters map to API query params (`status`, `vehicle_id`, `from`/`to`, `category`); sort → `?sort=field:dir`; pagination → **cursor** (`?limit=25&cursor=…`) with `‹ পূর্ব / পরবর্তী ›` + page-size select; envelope `{ data, meta:{ next_cursor, has_more, total } }`.
- **Row:** selection checkbox (bulk actions bar appears when >0 selected), row-click → detail, `⋮` row-action `dropdown-menu` (edit/void/SMS/PDF gated by scope).
- **States:** `skeleton` rows while loading (TanStack Query `isLoading`), empty-state illustration + primary CTA, error `alert` with retry.
- **Money columns:** right-aligned, tabular-nums, `formatBDT`, red for dues/negatives.
- **Footer:** aggregate row (মোট / totals) where meaningful (collections total, dues total, trial-balance debit=credit).
- **Bengali/English:** column headers from i18n; enum cells render `{value,label}` label (API already returns localized labels).

### C2. Forms (`react-hook-form` + `zod`)
- One `zodResolver` schema per form; Bengali error messages via i18n resolver. Server `422 {error:{fields}}` maps back onto field errors.
- **Money inputs:** string decimal, `inputMode="decimal"`, mask to 2 dp, never coerce to float; the **NumericKeypad** variant for collection/quick-entry (large tappable, low-literacy).
- **Date:** `calendar`+`popover`; backdated selection auto-sets `isBackdated` and shows an inline ⚑ "অডিট চিহ্নিত" hint.
- **Category (khat) picker:** `combobox` seeded from `GET /categories?type=`, with "নতুন খাত" inline-create.
- **Entity pickers:** driver/vehicle/customer async `combobox` (searches API), showing avatar + reg-no + live dues badge in the option.
- **Offline:** every mutating submit attaches `Idempotency-Key` + `client_id` + `client_created_at`; on offline, optimistic-write to local queue, toast "অফলাইন — সিঙ্ক হবে", sync indicator increments.
- **Destructive actions** (void collection, delete vehicle, reject listing) → `alert-dialog` confirm with typed reason where the API requires `reason`.

### C3. Permission Matrix (`<PermissionMatrix>`)
- Grid: rows = permission groups (module scopes from `GET /permissions` grouped by `group`), columns = access levels (read / write / edit / owner-only).
- Cells = `checkbox`; owner-only rows rendered locked 🔒 and disabled for non-owner editors.
- **Presets** (`radio-group`): হিসাবরক্ষক (accountant:read + write:txn), ম্যানেজার (manager:*), কাস্টম — selecting a preset bulk-toggles cells; any manual edit flips to কাস্টম.
- Maps directly to `User.permissions` JSON → `PATCH /users/:id`. Scope semantics: `owner:*` implies all; role gives default set; overrides layer on top.

### C4. Money Formatting (`formatBDT`)
- Input: string decimal from API. Never `Number()` for arithmetic — use decimal.js/dinero for any client math (rare; prefer server totals).
- Output: `৳` prefix, locale digit set (Bengali `০-৯` when lang=bn, else Latin), grouped thousands, 2 dp only when non-zero fraction. Right-aligned, `font-variant-numeric: tabular-nums`.
- Sign/semantics: dues, shortfall, loss, payable → **red**, `−` prefix. Income, profit, paid, advance → **green** where it denotes a positive event. Neutral figures → default text color.

### C5. Status Badges (`<StatusBadge kind={...}>`) — single source of color truth
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

### C6. Cross-cutting UI behaviors
- **Soft-lock (HTTP 402):** a `SUBSCRIPTION_REQUIRED` response anywhere → interceptor shows a non-dismissable-until-acknowledged `dialog` "বিল বকেয়া — পেইড ফিচার সাময়িক লক" with a bKash-pay CTA; paid-feature buttons render disabled with 🔒 + tooltip. Read + free-vehicle writes stay enabled. **Never** implies data loss.
- **Free-gate nudge:** attempting to add a 2nd billable vehicle on FREE → inline explainer (১টি গাড়ি চিরকাল ফ্রি; ২য় থেকে পোস্টপেইড) + upgrade, not a hard block.
- **Vertical presets:** `verticals_enabled[]` from `GET /org` drives sidebar/section visibility — the same shell reshapes for CNG vs rent-a-car vs charging vs bus-association without separate code.
- **Export jobs:** PDF/Excel buttons kick `POST /reports/export` → `{export_job_id}` → poll `GET /exports/:job` with `progress` bar → download link (toast on ready). Async, non-blocking.
- **i18n toggle:** flips digit set, labels, and date formatting app-wide instantly (TanStack Query cache keyed by lang for label-bearing responses).
- **Audit visibility:** backdated/edited/voided entries always carry a ⚑ marker + hover-card showing who/when (anti-theft transparency is the product's core promise).

---

## Build priority summary
- **MVP shell to ship first:** global layout (sidebar+topbar+plan badge+lang toggle+offline indicator), Dashboard (WF-1), Collections entry+ledger (WF-4), Vehicles list+profile (WF-2), Drivers+dues (WF-3), Ledger (income/expense), core Reports with PDF/Excel (WF-5), Settings, Billing plan/gate view. Plus the reusable `DataTable`, `formatBDT`, `StatusBadge`, form kit.
- **P2:** Rentals, Fuel, Maintenance, Documents, QR, Customers/party-ledger, full Reports depth (balance sheet/trial balance/analytics/budget — WF-5 tabs), Staff+PermissionMatrix (WF-6), Billing charge+bKash pay (WF-7), Notifications, Support.
- **P3:** GPS fleet map (WF-8), Inventory/Suppliers/Purchases-Sales, Loans, Charging, Marketplace, and the entire **Platform Admin panel** (WF-9 moderation, WF-10 tenants, metrics, billing/SMS/GPS ops).

Source references consulted: `/Users/mslive/Documents/Antigravity Projects/myauto.dupno.com/docs/01-PRD-full-build-spec.md` and `/Users/mslive/Documents/Antigravity Projects/myauto.dupno.com/docs/02-feature-inventory.md`.