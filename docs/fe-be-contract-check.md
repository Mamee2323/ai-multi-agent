# FE ↔ BE Contract Check — Guestbook / Contact

> ตรวจตาม `docs/_call-opencode-prompt.md` · วันที่ 2026-09-25 · อ้างอิง D5/D6 ใน `docs/DECISIONS.md` + handoff `docs/handoffs/05-claude-to-opencode.md`
> รายงานนี้ไม่ได้แก้โค้ดใด ๆ — เป็นการเทียบสัญญาระหว่างฟอร์ม FE (เสร็จแล้วใน Lab 04) กับ API ปัจจุบัน (รอ Lab 05 ข้อ #5/#6)

## 1. ตาราง endpoint

| Endpoint | Method | Request fields ที่ FE ส่ง | Response ที่ FE คาด | สิ่งที่ API ทำจริงตอนนี้ | match/mismatch |
|---|---|---|---|---|---|
| `/api/contact` | POST (JSON) | `{ name, email, message, website }` (trim แล้วยกเว้น website) · maxlength ฝั่ง client: 80 / 120 / 2000 | `res.ok` (201) พอ — **ไม่อ่าน body ของ response เลย** · ใช้ข้อความคงที่ของตัวเองทุกสถานะ (ok / rejected 4xx / unavailable 5xx / network) · 400→"เช็คข้อมูล", ≥500→"ฟอร์มใช้ไม่ได้" | รับ JSON → `insertContact()` (validate: string/ไม่ว่าง + regex email · **ยังไม่มี length limit, ไม่มี honeypot**) → 201 + row เต็ม **รวม `email`** · error → 400 หรือ 501 (`NOT_IMPLEMENTED`) พร้อม `{ error: message }` ดิบ | **match** ด้าน method/shape/status handling · **mismatch**: (a) 201 echo `email` กลับ (ขัด D5 — แต่ FE ไม่อ่าน body จึงไม่พัง เป็นเรื่อง leak ล้วน ๆ) (b) ไม่มี server-side length limit (c) honeypot `website` ที่ FE ส่งมา **ถูกเมิน** — บอตที่กรอก website ยังถูกบันทึกจริง |
| `/api/guestbook` | POST (JSON) | `{ name, message, website }` (trim แล้วยกเว้น website) · maxlength ฝั่ง client: 40 / 500 | เหมือน contact: `res.ok` (201) พอ ไม่อ่าน body · สำเร็จแล้ว `load()` ใหม่เพื่อดึง list ล่าสุด | รับ JSON → `insertGuestbook()` (validate: string/ไม่ว่าง · **ไม่มี length limit, ไม่มี honeypot**) → 201 + row · error → 400/501 | **match** ด้าน method/shape/status · **mismatch**: (a) ไม่มี server-side length limit (b) honeypot `website` ถูกเมิน |
| `/api/guestbook` | GET | — (header `accept: application/json`) | 200 + JSON `{ entries: [...] }` · ใช้เฉพาะ `id?`, `name`, `message`, `created_at` ต่อ entry · render ด้วย `textContent` เท่านั้น (ไม่มี `innerHTML`) · ถ้า `!res.ok` → ข้อความโหลดไม่สำเร็จ | 200 + `{ entries: listGuestbook() }` · `SELECT * ... ORDER BY created_at DESC` **ไม่มี `LIMIT`** · error → 500/501 พร้อม `{ error }` ดิบ (FE ไม่แสดง) | **match** ด้าน shape · **mismatch**: ไม่มี `LIMIT` จำนวนแถว (D6) |

สังเกต: FE ทั้งสองฟอร์มไม่เคยแสดง `error` text จาก server (ใช้ข้อความไทยคงที่ตาม D5) — แต่ตามกติกา public-site-safe ฝั่ง BE ก็ยังต้องไม่ leak SQL/stack ใน `{ error }` เอง

## 2. Mismatch ที่ต้องแก้ vs ที่จะหายเอง

**จะหายไปเองเมื่อทำ Lab 05 issue #5/#6 (ฝั่ง BE ทั้งหมด — ไม่มีอะไรที่ FE ต้องแก้):**

1. **Server-side length limit ไม่มี** (`db.ts` validate แค่ string/ไม่ว่าง) → แก้ใน `db.ts` ตาม #5/#6 โดยใช้ค่าเดียวกับ maxlength ของ FE (guestbook 40/500 · contact 80/120/2000) แล้วสัญญาจะตรงกันพอดี
2. **Honeypot `website` ถูกเมิน** → แก้ใน `contact.ts`/`guestbook.ts`: ถ้ามีค่าให้ตอบ 201 โดยไม่บันทึก (ตาม handoff ข้อ 3) — FE ส่ง field นี้มาอยู่แล้ว ไม่ต้องแก้ FE
3. **`listGuestbook` ไม่มี `LIMIT`** → แก้ใน `db.ts` (เสนอ ≤ 50 แถวล่าสุด) — FE รองรับ array ยาวเท่าไรก็ได้
4. **201 ของ contact echo `email` กลับ** → แก้ใน `contact.ts` ตัด `email` ออกจาก JSON response (เก็บใน DB ตามปกติ) — FE ไม่อ่าน body ของ 201 เลย จึงไม่กระทบฟอร์ม

**Mismatch ที่ต้องแก้นอก #5/#6:** ไม่มี — สัญญา method, path, field names, status-code handling (`res.ok` / 4xx / ≥500) และ shape ของ GET ตรงกันหมดแล้ว งานที่เหลือคือเติมเกณฑ์ความปลอดภัยฝั่ง BE ล้วน ๆ

**ข้อควรระวัง (ไม่ใช่ mismatch แต่ต้องคงไว้):** สัญญา error เดิม (`NOT_IMPLEMENTED` → 501 · POST error → 400 · GET error → 500 · สำเร็จ → 201) และ `{ entries: [...] }` ของ guestbook GET — อย่าเปลี่ยนตอนเพิ่ม limit/honeypot

## 3. ยืนยัน / เสนอเปลี่ยน ค่าที่ตกลงกัน

| รายการ | ข้อเสนอใน handoff | สิ่งที่ FE ทำจริง | สรุป |
|---|---|---|---|
| ชื่อ honeypot | `website` | ทั้งสองฟอร์มใช้ `name="website"` (ซ่อนด้วย `.hp`, `tabindex="-1"`, `autocomplete="off"`) | **ยืนยัน `website`** — ตรงกันแล้ว BE แค่อ่าน field นี้ |
| guestbook maxlength | name ≤ 40 · message ≤ 500 | `maxlength="40"` / `maxlength="500"` | **ยืนยัน 40/500** — ใช้ค่าเดียวกันใน `db.ts` (นับหลัง trim) |
| contact maxlength | name ≤ 80 · message ≤ 2000 (+ email ≤ 120 ตาม FE) | `maxlength="80"` / email `maxlength="120"` / `maxlength="2000"` | **ยืนยัน 80/120/2000** — รวม email ≤ 120 ด้วยเพราะ FE จำกัดไว้ (handoff เดิมไม่ได้ระบุ) |
| ตัด email จาก response 201 | ตัดที่ชั้น API ไม่ใช่ `db.ts` (เพราะ `lab05-api.test.ts:25` คาด `insertContact()` คืน `row.email`) | FE ไม่อ่าน body ของ 201 เลย | **ยืนยัน: ตัดที่ `contact.ts`** — `insertContact()` คงคืน row เต็มให้ test ผ่าน ส่วน API response ส่งเฉพาะ `{ id, name, message, created_at }` หรือ `{ ok: true }` ก็ได้ (FE ไม่สน) |

## 4. ข้อเสนอสั้น ๆ

1. **ทำ honeypot ที่ชั้น route** (`contact.ts` / `guestbook.ts`) ไม่ใช่ `db.ts` — เช็ค `body.website` ก่อนเรียก insert ถ้ามีค่าตอบ `201` + `{ ok: true }` โดยไม่แตะ DB (บอตไม่รู้ว่าโดนกรอง) · `db.ts` ไม่ต้องรู้จัก field นี้
2. **ใส่ length check ใน `normalizeText`** (หรือ helper ข้าง ๆ) ของ `db.ts` ให้ throw message สั้นที่ปลอดภัย เช่น `name too long` — จะได้ 400 ผ่านสัญญา error เดิมโดยไม่ leak อะไร
3. **`listGuestbook` ใส่ `LIMIT 50`** และคง `ORDER BY created_at DESC` — FE จัดการ array ว่าง/ยาวอยู่แล้ว
4. **ตอนตัด email จาก response** อย่า destructure ผิดทิ้ง `created_at` ไปด้วย — ส่ง `{ id, name, message, created_at }` ตรง ๆ ชัดเจนกว่า
5. **วิธีลบข้อความ (D6)**: ทำเป็น `scripts/guestbook-delete.mjs <id>` ที่ใช้ `DATA_DIR` เดียวกัน ตาม handoff ข้อ 4 — ห้ามเปิด DELETE endpoint สาธารณะ
6. **เพิ่มเทสต์ใน `tests/` (ไม่ใช่ `tests/labs/`)** ครอบ: เกิน limit → throw · honeypot มีค่า → ไม่บันทึก · contact 201 ไม่มี key `email` · แล้วรัน `npm test` + `npm run test:labs` ให้ผ่านก่อนสลับ handoff กลับ
