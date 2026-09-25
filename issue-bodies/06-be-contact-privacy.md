## Context
จาก [`docs/DECISIONS.md`](https://github.com/Mamee2323/ai-multi-agent/blob/main/docs/DECISIONS.md) **D5** (Contact) — ส่วน BE · OPEN_LOOPS L3 · Owner: OpenCode `backend` · ปิดใน Lab 05

## Acceptance
- [ ] จำกัดความยาว `name` / `message` ฝั่ง server (เสนอ 80 / 2000)
- [ ] response 201 ของ `POST /api/contact` **ไม่มี `email`** — ตัดที่ชั้น API (`contact.ts`) เพราะ `tests/labs/lab05-api.test.ts` คาดว่า `insertContact()` คืน email
- [ ] เพิ่มเทสต์ยืนยันว่า email ไม่หลุดใน response
- [ ] คงสัญญา error API · `npm test` + `npm run test:labs` ผ่าน
