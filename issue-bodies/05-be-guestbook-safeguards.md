## Context
จาก [`docs/DECISIONS.md`](https://github.com/Mamee2323/ai-multi-agent/blob/main/docs/DECISIONS.md) **D6** (Guestbook) — ส่วน BE · OPEN_LOOPS L2 · Owner: OpenCode `backend` · ปิดใน Lab 05 · รายละเอียด: `docs/handoffs/04-claude-to-opencode.md`

## Acceptance
- [ ] จำกัดความยาว `name` / `message` ฝั่ง server ใน `db.ts` (เสนอ 40 / 500)
- [ ] `listGuestbook` คืนล่าสุดไม่เกิน N แถว (เสนอ 50)
- [ ] honeypot field (เสนอ `website`) มีค่า → ตอบ 201 แต่ไม่บันทึก
- [ ] มีวิธีลบข้อความที่เจ้าของทำได้จริง (script ใช้ `DATA_DIR`) · ไม่มี DELETE endpoint สาธารณะ
- [ ] คงสัญญา error API · ไม่ leak SQL / stack trace · `npm test` + `npm run test:labs` ผ่าน

> ถ้าไม่ครบก่อน ship → ซ่อนลิงก์ Guestbook (D6)
