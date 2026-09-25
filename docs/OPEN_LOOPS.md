# Open Loops

> คัดลอกเป็น `docs/OPEN_LOOPS.md` ใน Lab 00 · งานค้างที่ยังไม่ปิด · ลบแถวเมื่อเสร็จ  
> Owner = `Claude` | `OpenCode` | `human`

Last updated: 2026-09-25 +07:00

| ID | Task | Owner | Priority | Trigger / due | Notes |
|---|---|---|---|---|---|
| L2 | Guestbook เกณฑ์ BE: length limit ฝั่ง server · `LIMIT` แถว · honeypot · วิธีลบข้อความ | OpenCode | P0 | Lab 05 | D6 — ไม่ครบก่อน ship = ซ่อนลิงก์ Guestbook |
| L3 | Contact: ไม่ echo email ใน response 201 | OpenCode | P1 | Lab 05 | D5 · กระทบสัญญา API → แจ้ง FE |
| L4 | เจ้าของจะอ่านข้อความ Contact ยังไง / ทุกกี่วัน · เก็บข้อมูลผู้เยี่ยมนานแค่ไหน | human | P1 | ก่อน Lab 08 Ship | Devil คำถามข้อ 1, 3 · ตอบแล้วบันทึกเป็น D-id |
| L5 | ย้าย `## Brainstorm` ออกจาก PROFILE.md (ไฟล์ถูก copy ลง runtime image) | Claude | P2 | ก่อนทำ `llms.txt` | reviewer Should · ไม่ render อยู่แล้ว |
| L6 | smoke test ผูกกับเนื้อหาจริงของ PROFILE → ใช้ fixture | Claude | P2 | ว่างเมื่อไหร่ | reviewer Should |

## ปิดแล้ว (ย่อ — ย้ายหรือลบได้เมื่อรก)

| ID | Task | Closed |
|---|---|---|
| L1 | สร้าง STATUS + OPEN_LOOPS จาก example | 2026-09-25 |

## กฎสั้น

- อย่าเก็บงานที่ปิดแล้วจำนวนมากในตารางบน
- เปลี่ยน owner เมื่อ handoff ข้าม harness (ดู `docs/handoffs/`)
- สอง agent ห้ามเป็น writer พร้อมกันบนไฟล์นี้ — single-writer ตาม `AGENTS.md`
