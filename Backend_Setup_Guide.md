# คู่มือติดตั้ง Backend ครบ 17 ตัวแปร
**AIC Telecom Questionnaire — Backend Update Guide**

---

## ภาพรวมระบบ / System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    การทำงานร่วมกันของ 2 ไฟล์                      │
└─────────────────────────────────────────────────────────────────┘

  ┌──────────────────────┐         ┌──────────────────────────────┐
  │     index.html        │         │   AIC_Backend_Script_v2.gs   │
  │   (GitHub Pages)      │         │     (Google Apps Script)     │
  │                       │         │                              │
  │  • หน้าเว็บที่เห็น    │         │  • รับข้อมูลจากฟอร์ม        │
  │  • คำถาม 85 ข้อ      │  POST   │  • บันทึกลง Google Sheets   │
  │  • ผู้ตอบกรอกข้อมูล  │ ──────► │  • สร้าง Summary อัตโนมัติ  │
  │  • ✅ ครบ 17 ตัวแปร  │         │  • ❌ เก่า มีแค่ 10 ตัวแปร  │
  │                       │         │     → ต้องอัปเดต!            │
  └──────────────────────┘         └──────────────────────────────┘
         ผู้ตอบเห็น                        นักวิจัยจัดการ

  ┌─────────────────────────────────────────────────────────────┐
  │  Flow: ผู้ตอบ → Submit → index.html → POST → .gs → Sheets  │
  └─────────────────────────────────────────────────────────────┘
```

| ประเด็น | index.html | AIC_Backend_Script_v2.gs |
|---|---|---|
| อยู่ที่ไหน | GitHub Pages | Google Apps Script |
| ทำอะไร | แสดงฟอร์มให้ผู้ตอบ | เก็บข้อมูลลง Sheets |
| ใครใช้ | ผู้ตอบแบบสอบถาม | นักวิจัย (ตั้งค่าครั้งเดียว) |
| ปัญหาตอนนี้ | ✅ ครบ 17 ตัวแปร | ❌ เวอร์ชั่นเก่า 10 ตัวแปร |

---

## ขั้นตอนการติดตั้ง / Installation Steps

### 🔵 Step 1 — อัปเดต Google Apps Script

**เปิด:** [script.google.com](https://script.google.com) → เลือก Project เดิม

```
1. คลิก Code Editor ใน Apps Script
2. กด Ctrl+A (เลือกทั้งหมด)
3. กด Delete (ลบ)
4. เปิดไฟล์ AIC_Backend_Script_v2.gs ด้วย Notepad
5. กด Ctrl+A → Ctrl+C (Copy ทั้งหมด)
6. กลับไป Apps Script → Ctrl+V (วาง)
7. กด Ctrl+S (Save)
```

จากนั้น **Deploy ใหม่:**

```
Deploy → New deployment
  ├── Type:             Web app
  ├── Execute as:       Me
  └── Who has access:   Anyone  ← สำคัญมาก!

→ กด Deploy → Copy URL ที่ได้
```

> ⚠️ **URL จะเปลี่ยน** ทุกครั้งที่ทำ New deployment — ต้อง Copy URL ใหม่เสมอ

ตัวอย่าง URL ที่จะได้:
```
https://script.google.com/macros/s/AKfycb[xxxxxxxx]/exec
```

---

### 🟢 Step 2 — อัปเดต URL ใน index.html

**เปิด:** ไฟล์ `index.html` ด้วย Notepad

กด `Ctrl+H` (Find & Replace):

```
Find:    PASTE_NEW_WEB_APP_URL_HERE
Replace: https://script.google.com/macros/s/AKfycb[URL ใหม่]/exec
```

ตรวจสอบว่าบรรทัด SCRIPT_URL ดูแบบนี้:
```javascript
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

กด **Ctrl+S** (Save) — **อย่าเปลี่ยนชื่อไฟล์** ให้คงเป็น `index.html`

---

### 🟡 Step 3 — Upload ขึ้น GitHub

เปิด: [github.com/engvatcharb/aic-questionnaire](https://github.com/engvatcharb/aic-questionnaire)

```
1. คลิกที่ไฟล์ index.html ใน repository
2. กดปุ่ม ✏️ (Edit) มุมขวาบน
3. คลิก ··· → Upload file
4. ลากไฟล์ index.html ใหม่วางลง
5. กด Commit changes
6. รอ 1–2 นาที
```

---

## ✅ ตรวจสอบว่าสำเร็จ

```
1. เปิด https://engvatcharb.github.io/aic-questionnaire/
2. กด 🔑 Owner (มุมขวาล่าง) หรือ Ctrl+Shift+O
3. ใส่รหัสผ่าน: AIC2024@Telecom
4. ดู Dashboard → ต้องเห็น banner สีเขียว:
   "✅ เชื่อมต่อ Google Sheets แล้ว"
5. ลองตอบแบบสอบถาม 1 ชุด → กด Submit
6. เปิด Google Sheets → ตรวจสอบว่ามีข้อมูลครบ 85 คอลัมน์
```

---

## โครงสร้าง Google Sheets ที่จะได้

```
AIC Telecom Responses
├── Sheet: Raw Data      ← ทุก response เพิ่มแถวอัตโนมัติ (85 คอลัมน์)
├── Sheet: Summary       ← Mean + Std Dev แยก 17 ตัวแปร (อัปเดตอัตโนมัติ)
└── Sheet: Item Summary  ← Mean + Std Dev รายข้อ 85 ข้อ (ใหม่!)
```

| Sheet | เนื้อหา |
|---|---|
| **Raw Data** | ทุกแถว = 1 ผู้ตอบ, ทุกคอลัมน์ = 1 ข้อ (ครบ 85 ข้อ) |
| **Summary** | Mean, Std Dev แยก 17 ตัวแปร + การตีความ |
| **Item Summary** | Mean, Std Dev รายข้อทุกข้อ (85 แถว) |

---

## 17 ตัวแปรที่บันทึกใน Version ใหม่

| # | Code | ชื่อตัวแปร | ข้อ |
|---|---|---|---|
| 1 | AICW | AI-in-Cloud Awareness | AICW1–5 |
| 2 | AICK | AI-in-Cloud Knowledge Capability | AICK1–5 |
| 3 | TMS | Top Management Support | TMS1–5 |
| 4 | SA | Strategic Alignment | SA1–5 |
| 5 | GOV | Governance | GOV1–5 |
| 6 | CP | Competition Pressure | CP1–5 |
| 7 | PB | Perceived AI-in-Cloud Benefit | PB1–5 |
| 8 | PR | Perceived AI-in-Cloud Risk | PR1–5 |
| 9 | TR | Trust Policy Adoption | TR1–5 |
| 10 | AI | AI-in-Cloud Adoption | AI1–5 |
| 11 | **CDR** | **Cloud & Data Readiness** | CDR1–5 |
| 12 | **RS** | **Resource Structuring** | RS1–5 |
| 13 | **RB** | **Resource Bundling** | RB1–5 |
| 14 | **RL** | **Resource Leveraging** | RL1–5 |
| 15 | **EXPLOR** | **Exploratory Innovation** | EXPLOR1–5 |
| 16 | **EXPLOI** | **Exploitative Innovation** | EXPLOI1–5 |
| 17 | **SVC** | **Sustainable Value Creation** | SVC1–5 |

> ตัวแปร **굵게** (11–17) คือตัวแปรที่ Version เก่าไม่ได้บันทึก

---

## แก้ปัญหา (Troubleshooting)

| ปัญหา | วิธีแก้ |
|---|---|
| Dashboard ยังเป็น banner สีเหลือง | ตรวจสอบ SCRIPT_URL ใน index.html ว่าเปลี่ยนแล้วหรือยัง |
| ข้อมูลยังไม่ครบ 85 คอลัมน์ | Apps Script ยังเป็นเวอร์ชั่นเก่า — ทำ Step 1 ใหม่ |
| Submit แล้วไม่มีข้อมูลใน Sheets | Who has access ต้องเป็น **Anyone** ไม่ใช่ Only me |
| URL ใน SCRIPT_URL ผิด | ต้องเป็น URL ที่ขึ้นต้นด้วย `https://script.google.com/macros/s/` |

---

*AIC Telecom Questionnaire — Backend v2 | Mrs. Thitaree Porameesanaporn | Mahidol University*
