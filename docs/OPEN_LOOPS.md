# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 14:20 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L2 | Guestbook เกณฑ์ BE: length limit ฝั่ง server · `LIMIT` แถว · honeypot · วิธีลบข้อความ | OpenCode | P0 | Lab 05 | #5 · D6 — ไม่ครบก่อน ship = ซ่อนลิงก์ Guestbook |
| L3 | Contact: length limit + ไม่ echo email ใน response 201 | OpenCode | P1 | Lab 05 | #6 · D5 · ทำที่ `contact.ts` (lab test คาด `insertContact` คืน email) · ดู handoff `04-claude-to-opencode.md` |
| L4 | ยืนยันจังหวะอ่านข้อความ Contact (เริ่มต้นสัปดาห์ละครั้ง) + retention (เริ่มต้น 90 วัน) | human | P0 | ก่อน Lab 08 Ship | D10 — ห้าม ship ถ้ายังไม่มีวิธีอ่าน |
| L5 | ย้าย `## Brainstorm` ออกจาก PROFILE.md (ไฟล์ถูก copy ลง runtime image) | Claude | P2 | ก่อนทำ `llms.txt` | reviewer Should · ไม่ render อยู่แล้ว |
| L9 | ตั้ง `SITE_URL` จริง (JSON-LD `url` ตอนนี้ = localhost) | human | P1 | Lab 08 | D8 |
| L10 | BE: script อ่าน/ลบข้อความ Contact + ลบของเก่า 90 วัน | OpenCode | P0 | Lab 05 | D10 · ต่อ scope #6 หรือ issue ใหม่ |
| L12 | QA มือถือ 360px ไม่มี scroll แนวนอน | Claude/Playwright | P1 | Lab 06 | D14 · ตรวจเบื้องต้นแล้วใน Lab 04 (5 หน้าผ่าน) — Lab 06 เขียน E2E ใน `playwright/` |
| L6 | smoke test ผูกกับเนื้อหาจริงของ PROFILE → ใช้ fixture | Claude | P2 | ว่างเมื่อไหร่ | reviewer Should |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-25 |
| L7 | issue D8 ผ่าน GitHub MCP → #8 | 2026-09-25 |
| L8 | FALLBACK ไทยกลาง ๆ + ซ่อน section ว่าง (D12) | 2026-09-25 · PR #7 |
| L11 | `public/robots.txt` กัน `/api/` + `/guestbook` (D13) | 2026-09-25 · PR #7 |
| — | UI Lab 04 (#1–#4 + D8 ฝั่ง FE) | 2026-09-25 · รอ merge PR |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
