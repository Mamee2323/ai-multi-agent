# FE ↔ BE Contract Check

> รายงานตรวจสัญญาระหว่างฟอร์ม (FE) กับ API stubs (BE) · ฐานอ้างอิง: `docs/DECISIONS.md` (มีอยู่แล้ว ใช้ D4–D6, D10) + โค้ดจริง
> ขอบเขต: `src/pages/contact.astro`, `src/pages/guestbook.astro`, `src/pages/api/{contact,guestbook,interests}.ts`, `src/lib/db.ts` (อ่านอย่างเดียว — ไม่ได้แก้ไฟล์ใดใน `src/`)

## 1. Match — ตรงกันแล้ว

### Contact (`contact.astro` ↔ `api/contact.ts` ↔ `insertContact`)

- **Method/URL**: FE POST `/api/contact` (contact.astro:75–79) = BE `POST` handler (contact.ts:10)
- **Content-Type**: FE ส่ง `application/json` + `JSON.stringify` = BE อ่านด้วย `request.json()` (contact.ts:12)
- **Request body**: FE ส่ง `{name, email, message, website}` — BE ใช้ `name/email/message` ตรงกับ signature ของ `insertContact` (db.ts:60–64) · ทั้งสองฝั่ง trim ก่อน (FE contact.astro:66–68, BE `normalizeText` db.ts:26–35)
- **Email validation**: FE ใช้ `type="email"` + `checkValidity()` · BE มี regex เช็คซ้ำ (db.ts:69–71) — สองชั้นสอดคล้องกัน
- **Status codes**: สำเร็จ 201 → FE เช็ค `res.ok` แสดงข้อความสำเร็จ (contact.astro:80) · 400 → แสดง `rejected` · 501/5xx → แสดง `unavailable` (contact.astro:83–87) — ตรงกับสัญญา error ใน AGENTS.md (NOT_IMPLEMENTED→501, อื่น→400 สำหรับ POST)
- **Error handling**: FE ไม่เคยอ่าน/แสดง error text จาก server — ใช้ข้อความไทยคงที่เท่านั้น (contact.astro:41–49) ตรงตาม D3/D5 (ห้าม render error ดิบ)

### Guestbook (`guestbook.astro` ↔ `api/guestbook.ts` ↔ `listGuestbook/insertGuestbook`)

- **GET**: FE fetch `/api/guestbook` (guestbook.astro:112) คาด `{entries: [...]}` = BE คืน `{ entries: rows }` 200 (guestbook.ts:9) ตรงสัญญา AGENTS.md
- **Entry shape**: FE ใช้ `name`, `message`, `created_at` (guestbook.astro:45, 90–103) = คอลัมน์จริงจาก `SELECT *` (db.ts:91–97)
- **รูปแบบเวลา**: FE `formatTime` รองรับรูปแบบ UTC `"YYYY-MM-DD HH:MM:SS"` ของ SQLite `datetime('now')` พอดี (guestbook.astro:74–75 เทียบ db.ts:54) — เขียน comment อ้างถึงกันไว้ชัดเจน
- **POST body**: FE ส่ง `{name, message, website}` = BE ใช้ `name/message` ตรง signature `insertGuestbook` (db.ts:99–102)
- **Status codes**: 201 → `res.ok` + reload list · 400 → `rejected` · 500/501 → `unavailable` (guestbook.astro:145–153) — ตรงสัญญา
- **XSS-safe render**: FE render ข้อความผู้ใช้ด้วย `createElement` + `textContent` เท่านั้น ไม่มี `innerHTML` (guestbook.astro:84–107) ตรง D6
- **GET error**: 500/501 → FE แสดง `loadFail` (guestbook.astro:118–120) — ครอบคลุม

### อื่น ๆ

- `/api/interests` (interests.ts) คืน `{interests, source: 'profile'}` — **ไม่มี FE หน้าใด fetch endpoint นี้** (grep ทั้ง `src/` แล้ว) เพราะหน้าเว็บใช้ `loadProfile()` ฝั่ง server ตาม D4 จึงไม่มีจุดขัดกัน ถือเป็น endpoint ว่างสำหรับอนาคต

## 2. Mismatch — จุดที่ไม่ตรงกัน

| # | จุด | รายละเอียด | อ้างอิง |
|---|-----|-----------|---------|
| M1 | **Honeypot ไม่ถูกตรวจฝั่ง server** | FE ทั้งสองฟอร์มส่ง field `website` (contact.astro:69, guestbook.astro:134) แต่ BE ไม่เคยอ่าน `website` เลย — บอทที่กรอก honeypot จะถูกบันทึกปกติ | D6 กำหนด honeypot เป็นเงื่อนไข BE ของ Guestbook · `api/contact.ts:12–13`, `api/guestbook.ts:25–26`, `db.ts:60–67, 99–104` |
| M2 | **ไม่มี length limit ฝั่ง server** | FE จำกัดด้วย `maxlength` (contact: 80/120/2000 · guestbook: 40/500) แต่ `normalizeText` เช็คแค่ string + ไม่ว่าง (db.ts:26–35) — ยิง API ตรง ๆ ยาวเท่าไรก็ลง DB ได้ | D6: "จำกัดความยาวฝั่ง server" · issue #6 (Contact length limit) · `db.ts:26–35` |
| M3 | **`listGuestbook` ไม่มี `LIMIT`** | Query คือ `SELECT * FROM guestbook ORDER BY created_at DESC` ไม่จำกัดจำนวนแถว — ข้อมูลโตแล้วหน้า Guestbook จะหนัก | D6: "`LIMIT` จำนวนแถว" · `db.ts:93–95` |
| M4 | **Response ของ Contact echo email กลับ** | `insertContact` คืน row เต็มรวม `email` และ `api/contact.ts:14` ส่งกลับทั้งก้อน — FE ไม่อ่าน body จึงไม่พัง แต่ email หลุดไปใน network response (เห็นใน devtools) | D5: "BE พิจารณาไม่ echo email กลับใน response" · `db.ts:80–88`, `api/contact.ts:14` |
| M5 | **Error body อาจ leak ข้อความดิบ** | ทุก endpoint คืน `{error: err.message}` ดิบ (contact.ts:21, guestbook.ts:16/34) — FE ไม่แสดงจึงความเสี่ยงต่ำ แต่ถ้า error จาก SQLite (เช่น constraint) ข้อความจะติดรายละเอียดภายในออกไป | ห้าม "leak stack trace / SQL error" (AGENTS.md) · `api/guestbook.ts:13–19`, `api/contact.ts:18–24` |
| M6 | **ไม่มีวิธีลบ/อ่านข้อความฝั่งเจ้าของ** | ไม่มี script/endpoint สำหรับลบข้อความ Guestbook และอ่าน/ลบ Contact (D10 กำหนด retention 90 วันด้วย script) — อยู่นอกสัญญา FE↔BE โดยตรง แต่เป็นเงื่อนไข ship | D6 ("มีวิธีลบข้อความ"), D10 ("ห้าม ship ถ้ายังไม่มีวิธีอ่าน") · scope issue #5/#6 |

### ข้อสังเกต (ไม่ใช่ mismatch แต่ควรรู้)

- **501 เป็น dead code ชั่วคราว**: `db.ts` implement จริงแล้ว ไม่มี `NOT_IMPLEMENTED` ถูก throw — สาขา 501 ใน `api/*.ts` ยังไม่เคยทำงาน (เก็บไว้ไม่เสียหาย เป็นสัญญาสำรอง)
- **Header comment ของ `db.ts` เก่าแล้ว**: บรรทัด 3 เขียนว่า "Stubs return null until finishe" ทั้งที่ฟังก์ชัน insert จริงแล้ว (พิมพ์ผิด "finishe" ด้วย) — เป็นเอกสารค้างสภาพ ไม่กระทบการทำงาน
- **`accept: application/json` บน GET guestbook**: BE ไม่สน header นี้ ตอบ JSON เสมอ — ไม่ขัดกัน แค่ไม่จำเป็น

## 3. Suggestion — ข้อเสนอ (ยังไม่แก้โค้ด)

งานทั้งหมดตกเข้าข่าย Lab 05 (BE · issue #5, #6) — เสนอให้ฝั่ง BE รับไปทำ:

1. **Honeypot (M1)**: ใน `api/contact.ts` / `api/guestbook.ts` ถ้า `body.website` ไม่ว่าง → ตอบ `201` เงียบ ๆ โดย **ไม่** insert (บอทคิดว่าสำเร็จ คนจริงไม่กระทบ) — FE ส่ง field นี้มาอยู่แล้ว ไม่ต้องแก้ FE
2. **Length limit ฝั่ง server (M2)**: เพิ่มเช็คความยาวใน `db.ts` ให้สอดคล้อง `maxlength` ของ FE (contact: name ≤ 80, email ≤ 120, message ≤ 2000 · guestbook: name ≤ 40, message ≤ 500) — เกิน → throw → 400 → FE แสดง `rejected` ได้พอดี สัญญาเดิมไม่เปลี่ยน
3. **`LIMIT` ใน `listGuestbook` (M3)**: เช่น `ORDER BY created_at DESC LIMIT 50` — response shape `{entries: [...]}` เหมือนเดิม FE ไม่ต้องแก้
4. **ไม่ echo email (M4)**: ใน `api/contact.ts` ตอบกลับเฉพาะ field ที่จำเป็น (เช่น `{id, name, created_at}` หรือแค่ `{ok: true}`) — FE ไม่อ่าน body อยู่แล้ว เปลี่ยนได้อิสระ
5. **Error body (M5)**: คืนข้อความ generic (เช่น `{error: 'bad request'}` / `{error: 'server error'}`) แทน `err.message` ดิบ แล้ว log รายละเอียดไว้ฝั่ง server — สัญญา status code เดิมไม่เปลี่ยน FE ไม่กระทบ
6. **Script อ่าน/ลบ (M6)**: ทำ script อ่าน/ลบข้อความ Contact (+ ลบของเก่ากว่า 90 วัน) และลบข้อความ Guestbook ตาม D6/D10 — เป็นไฟล์ `scripts/` แยก ไม่แตะ API สาธารณะ
7. **(เล็ก) อัปเดต comment `db.ts:3`** ให้ตรงสถานะจริง เมื่อฝั่ง BE เข้าไปแก้ไฟล์อยู่แล้ว

**สรุป**: สัญญาหลัก (method, URL, body fields, response shape, status-code mapping) ตรงกันครบ — FE ปลอดภัยต่อการเปลี่ยนแปลงทั้งหมดที่เสนอ เพราะไม่เคยอ่าน response body และแสดงเฉพาะข้อความไทยคงที่ · ช่องว่างทั้งหมดอยู่ฝั่ง BE ตามที่ D5/D6/D10 กำหนดไว้แล้ว ไม่มี mismatch ที่ต้องแก้ FE
