# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 16:05 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L4 | ยืนยันจังหวะอ่านข้อความ Contact (เริ่มต้นสัปดาห์ละครั้ง) + retention (เริ่มต้น 90 วัน) | human | P0 | ก่อน Lab 08 Ship | D10 — script พร้อมแล้ว (`scripts/contact-manage.mjs`) เหลือให้ human ตัดสินจังหวะ |
| L5 | ย้าย `## Brainstorm` ออกจาก PROFILE.md (ไฟล์ถูก copy ลง runtime image) | Claude | P2 | ก่อนทำ `llms.txt` | reviewer Should · ไม่ render อยู่แล้ว |
| L9 | ตั้ง `SITE_URL` จริง (JSON-LD `url` ตอนนี้ = localhost) | human | P1 | Lab 08 | D8 |
| L14 | POST ที่พังฝั่ง server ตอบ 400 → ผู้ใช้เห็น "เช็คความยาว" แทน "ระบบขัดข้อง" · แยก validation (400) กับ server fault (500) | OpenCode | P2 | ก่อน Lab 08 | reviewer Should ใน SWARM รอบ 2 · `api/guestbook.ts:44`, `api/contact.ts:33` · FE มีข้อความ 500 รองรับแล้ว |
| L15 | a11y P1-2 บอกช่องบังคับ + P2 ที่เหลือ (P0-1/P1-1 แก้แล้ว) | Claude | P1 | ก่อน Lab 08 | `docs/QA.md` a11y Action items |
| L6 | smoke test ผูกกับเนื้อหาจริงของ PROFILE → ใช้ fixture | Claude | P2 | ว่างเมื่อไหร่ | reviewer Should |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-25 |
| L7 | issue D8 ผ่าน GitHub MCP → #8 | 2026-09-25 |
| L8 | FALLBACK ไทยกลาง ๆ + ซ่อน section ว่าง (D12) | 2026-09-25 · PR #7 |
| L11 | `public/robots.txt` กัน `/api/` + `/guestbook` (D13) | 2026-09-25 · PR #7 |
| L2 | Guestbook BE: limit/LIMIT/honeypot/script ลบ (D6) | 2026-09-25 · `lab-05-backend` |
| L3 | Contact: length limit + ไม่ echo email (D5) | 2026-09-25 · `lab-05-backend` |
| L13 | ตัดสิน rate limit → D15 ข้าม v1 · ติดตามที่ issue #12 (P2 · trigger: ก่อนโปรโมต/เจอสแปม) | 2026-09-25 · Lab 07 |
| L12 | QA มือถือ 360px ไม่มี scroll แนวนอน | 2026-09-25 · Lab 06 `docs/QA.md` step 12 |
| L10 | script อ่าน/ลบ Contact + retention 90 วัน (D10) | 2026-09-25 · `lab-05-backend` |
| — | UI Lab 04 (#1–#4 + D8 ฝั่ง FE) | 2026-09-25 · รอ merge PR |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
