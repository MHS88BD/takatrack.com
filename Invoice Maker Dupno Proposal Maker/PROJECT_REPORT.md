# Dupno Proposal Maker — প্রজেক্ট রিপোর্ট
**তারিখ:** ২৭ জুন ২০২৬  
**প্রস্তুতকারী:** Claude Code (Anthropic)  
**প্রজেক্ট মালিক:** Dupno International Limited

---

## প্রজেক্ট পরিচিতি

Dupno GPS কর্পোরেট B2B সেলসের জন্য সিঙ্গেল-ফাইল ডাইনামিক HTML প্রপোজাল জেনারেটর।  
**লাইভ URL:** https://pi.dupno.com  
**লোকাল ফাইল:** `proposal-maker.html`  
**লোকাল পাথ:** `/Users/mslive/Documents/Antigravity Projects/Invoice Maker Dupno Proposal Maker/`

---

## সার্ভার ক্রেডেনশিয়াল

| আইটেম | মান |
|-------|-----|
| **সার্ভার IP** | `147.93.168.136` |
| **প্রোভাইডার** | Contabo VPS |
| **OS ইউজার** | `root` |
| **SSH পাসওয়ার্ড** | `XwnPJeW160yW` |
| **SSH কী** | `~/.ssh/dupno_key` (পাসওয়ার্ড ছাড়া deploy) |
| **SSH পোর্ট** | `22` |
| **CloudPanel URL** | `https://147.93.168.136:8443` |
| **CloudPanel ইউজার** | `admin` |
| **CloudPanel পাসওয়ার্ড** | `O8:vrt7zfBZftxKYnxyh` |
| **VNC IP:Port** | `62.72.41.106:63055` |
| **VNC পাসওয়ার্ড** | `XwnPJeW160yW` |
| **WP Admin URL** | `dupno.com/adminlogin` |
| **WP ইউজার** | `WVL` |
| **WP পাসওয়ার্ড** | `455764Gp#@!` |

---

## সার্ভারে অ্যাপ ইউজার

| আইটেম | মান |
|-------|-----|
| **অ্যাপ ইউজার** | `invoice-app` |
| **সাইট রুট** | `/home/invoice-app/htdocs/pi.dupno.com/` |
| **লাইভ ফাইল** | `/home/invoice-app/htdocs/pi.dupno.com/index.html` |

---

## ডিপ্লয় কমান্ড

```bash
# ফাইল আপলোড
scp -i ~/.ssh/dupno_key "proposal-maker.html" root@147.93.168.136:/home/invoice-app/htdocs/pi.dupno.com/index.html

# ওনারশিপ ঠিক করা
ssh -i ~/.ssh/dupno_key root@147.93.168.136 "chown invoice-app:invoice-app /home/invoice-app/htdocs/pi.dupno.com/index.html"
```

---

## SSH সমস্যা হলে

SSH ব্লক হলে (fail2ban / UFW কারণে):
1. VNC ব্যবহার করো: `62.72.41.106:63055` পাসওয়ার্ড `XwnPJeW160yW`
2. রান করো: `ufw delete limit 22/tcp && ufw allow 22/tcp`
3. রান করো: `fail2ban-client set sshd unbanip <তোমার_IP>`

---

## নোটিফিকেশন সিস্টেম

| আইটেম | মান |
|-------|-----|
| **Telegram Bot Token** | `8708432521:AAHuFnsyyli9whZr8heD7n70bjLEMrgV7EI` |
| **Telegram Chat ID** | `1681829800` |
| **Webhook URL** | `https://dupnocrm.xyz/dopi/webhook` |

**কখন নোটিফিকেশন যায়:** Print, Download PDF, Share WhatsApp — এই তিনটা অ্যাকশনে।

---

## প্রজেক্ট ফাইল স্ট্রাকচার

```
proposal-maker.html              ← সিঙ্গেল-ফাইল অ্যাপ (সব CSS/JS ইনলাইন)
logo/
  3.png                          ← Dupno ওয়ার্ডমার্ক (৫০০×৫০০)
Dupno office Pad 2022.docx.pdf  ← অফিসিয়াল লেটারহেড রেফারেন্স
Compititor Propsoal .pdf        ← Autonemo Ltd. ডিজাইন রেফারেন্স
PROJECT_REPORT.md               ← এই ফাইল
```

---

## প্রপোজাল পেজ স্ট্রাকচার

| # | পেজ ID | শিরোনাম | ডিফল্ট |
|---|--------|---------|--------|
| ১ | `page-cover` | কভার / প্রপোজাল ইনভয়েস | সবসময় চালু |
| ২ | `page-letter` | কভার লেটার | সবসময় চালু |
| ৩ | `page-about` | About Dupno | টগল চালু |
| ৪ | `page-benefits` | Benefits Page | টগল চালু |
| ৫ | `page-clients` | Corporate Clients | টগল বন্ধ |
| ৬ | `page-pricing` | Pricing Comparison Table | টগল বন্ধ |
| ৭ | `page-charges` | Schedule of Charges | টগল চালু |
| ৮ | `page-sign` | Signature / Acceptance | টগল বন্ধ |
| — | `solutions-container` | Advanced Solutions (ডাইনামিক) | চেকবক্স অনুযায়ী |
| — | `accessories-container` | Accessories (ডাইনামিক) | চেকবক্স অনুযায়ী |
| — | `tc-pages-container` | Terms & Conditions (মাল্টি-পেজ) | T&C আইটেম অনুযায়ী |

---

## ডিফল্ট প্যাকেজসমূহ

| প্যাকেজ | OTC (৳) | MRC (৳) | ডিফল্ট |
|---------|---------|---------|--------|
| Dupno Lite All (OTC) | ৪,৯৯১ | ৪০০ | চালু |
| Dupno Standard (OTC) | ৬,৯০০ | ৫০০ | চালু |
| Dupno Standard Plus 4G AI | ৯,৫০০ | ৫০০ | বন্ধ |
| OBD22 Smart GPS | ৫,৫০০ | ৫০০ | বন্ধ |
| LG300 Asset GPS | ১২,০০০ | ৫০০ | বন্ধ |
| JC400 AI Dashcam | ৩২,০০০ | ১,০০০ | বন্ধ |

---

## ব্যাংক ডিটেইলস (ডিফল্ট)

| ফিল্ড | মান |
|------|-----|
| অ্যাকাউন্ট নাম | Dupno International Limited |
| ব্যাংক | UCB (United Commercial Bank Plc) |
| অ্যাকাউন্ট নম্বর | 0992101000003211 |
| শাখা | Basundhara |
| রাউটিং | 245260555 |

---

## Terms & Conditions (১৬টি আইটেম)

| # | শিরোনাম | ডিফল্ট |
|---|---------|--------|
| ১ | Pricing, Tax & VAT | চালু |
| ২ | Payment Terms | চালু |
| ৩ | Installation and Service | চালু |
| ৪ | Device Warranty & Services | চালু |
| ৫ | Monthly Subscription | চালু |
| ৬ | Installation Charges | চালু |
| ৭ | Support | চালু |
| ৮ | Billing and Payment | চালু |
| ৯ | Additional Charges | চালু |
| ১০ | Servicing | চালু |
| ১১ | Warranty | চালু |
| ১২ | Delivery | চালু |
| ১৩ | Validity and Offer | চালু |
| ১৪ | Privacy and Policy | চালু |
| ১৫ | Required Documentation | চালু |
| ১৬ | Migration | চালু |

T&C আইটেমগুলো **drag-and-drop** দিয়ে reorder করা যায় (⠿ হ্যান্ডেল ব্যবহার করে)। নতুন অর্ডার প্রপোজাল আউটপুটে সরাসরি রিফ্লেক্ট হয়।

---

## ২৭ জুন ২০২৬ — করা পরিবর্তনসমূহ

### ১. ব্যাংক ডিটেইলস — ডিফল্ট পরিবর্তন
**আগে:** Dutch Bangla Bank, A/C 1061100046891, শাখা Baridhara  
**পরে:** UCB (United Commercial Bank Plc), A/C 0992101000003211, শাখা Basundhara, Routing 245260555  
ফিল্ডগুলো `contenteditable` থাকায় প্রতিটা প্রপোজালে আলাদাভাবে পরিবর্তন করা যাবে।

### ২. T&C আইটেম #১৬ — Migration ক্লজ যোগ
নতুন ক্লজ (ইংরেজি + বাংলা উভয়ে) যোগ করা হয়েছে:
> "আমরা অন্য সার্ভিস প্রোভাইডার থেকে GPS ডিভাইস মাইগ্রেশন গ্রহণ করি, তবে ডিভাইসটি Dupno Tracker প্ল্যাটফর্মের সাথে প্রযুক্তিগতভাবে সামঞ্জস্যপূর্ণ হতে হবে। Dupno Tracker ডিভাইসগুলি মালিকানাধীন এনক্রিপ্টেড ফার্মওয়্যার দিয়ে কনফিগার করা — অন্য প্রোভাইডারে মাইগ্রেট করা সম্ভব নয়।"

### ৩. T&C Drag-and-Drop রিঅর্ডারিং
T&C সাইডবার লিস্টে HTML5 drag-and-drop যোগ করা হয়েছে।
- প্রতিটা আইটেমে ⠿ হ্যান্ডেল আছে
- ড্র্যাগ করলে serial নম্বর অটো-আপডেট হয়
- নতুন অর্ডার localStorage-এ সেভ হয় এবং প্রপোজালে দেখা যায়

### ৪. সাইডবার — Show/Hide Sections অর্ডার ঠিক
Corporate Clients পেজ Pricing Comparison Table-এর **আগে** নিয়ে আসা হয়েছে (প্রকৃত প্রপোজাল পেজ অর্ডার অনুযায়ী)।

### ৫. সাইডবার — Show/Hide Sections পজিশন ঠিক
"Show / Hide Sections" প্যানেল "Packages & Pricing" সেকশনের **আগে** নিয়ে আসা হয়েছে।  
আগে এটি সাইডবারের একদম নিচে ছিল।

### ৬. History Snapshot কম্প্রেশন
**সমস্যা:** প্রতিটা history রেকর্ডে পুরো `previewPanel.innerHTML` (~১০MB) সেভ হতো। কয়েকটা রেকর্ডের পরে `localStorage.setItem` silently fail করতো — Telegram-এ নোটিফিকেশন যেত কিন্তু History modal-এ দেখা যেত না।

**সমাধান:**
- **LZString** লাইব্রেরি যোগ (CDN) — HTML ৫-১০গুণ কম্প্রেস করে
- শুধু **visible পেজ** capture হয় (hidden `p-page` বাদ)
- কম্প্রেসড snapshot `\x00lz\x00` prefix দিয়ে চেনা যায়
- `_histSave()` এখন try/catch-এ আছে, quota exceed হলে graceful fallback:
  - প্রথম retry: ১১তম রেকর্ড থেকে snapshot মুছে retry
  - দ্বিতীয় retry: সব snapshot মুছে শুধু metadata সেভ
- ফলাফল: ~১০MB → ~১-২MB প্রতি রেকর্ড

---

## গুরুত্বপূর্ণ ফাংশন রেফারেন্স

| ফাংশন | কাজ |
|--------|-----|
| `update()` | সব preview পেজ রি-রেন্ডার করে |
| `renderTcForm()` | T&C সাইডবার লিস্ট render করে (drag handle সহ) |
| `_autoSave(action)` | History রেকর্ড তৈরি + Telegram + Webhook পাঠায় |
| `_histSave(list)` | localStorage-এ history সেভ করে (quota fallback সহ) |
| `histDownloadPDF(id)` | সেভ করা snapshot থেকে PDF রি-জেনারেট করে |
| `doPrint()` | Print trigger (history-তেও লগ হয়) |
| `histOpen()` | History modal খোলে |
| `saveToLS()` | Form state localStorage-এ সেভ করে |
| `loadFromLS()` | localStorage থেকে form state restore করে |

---

## ব্র্যান্ডিং

| আইটেম | মান |
|-------|-----|
| প্রাইমারি ব্লু | `#045cb4` |
| ব্লু লাইট | `#1c75bc` |
| অরেঞ্জ | `#f0592a` |
| ইংরেজি ফন্ট | Bai Jamjuree (Google Fonts) |
| বাংলা ফন্ট | Anek Bangla (Google Fonts) |
| হটলাইন | 09642500400 |
| ইমেইল | sales@dupno.com |
| ওয়েবসাইট | dupno.com |

---

## কোম্পানির ঠিকানা

**কর্পোরেট অফিস:** House-1, Road-11, Block-J (Baridhara), Dhaka-1212, Bangladesh  
**লিয়াজোঁ অফিস:** Suite-1119, International Bank Tower, 191 Dongfeng XI Road, Guangzhou-510180, China

---

## ব্যবহৃত লাইব্রেরি

| লাইব্রেরি | ভার্সন | কাজ |
|-----------|--------|-----|
| jsPDF | 2.5.1 | PDF জেনারেশন |
| html2canvas | 1.4.1 | পেজ-টু-ইমেজ রেন্ডারিং |
| LZString | 1.5.0 | History snapshot কম্প্রেশন |
| Google Fonts | — | Bai Jamjuree, Anek Bangla |

সব CDN থেকে লোড হয়। কোনো npm/build step নেই। সিঙ্গেল HTML ফাইল, কোনো ইনস্টলেশন লাগে না।
