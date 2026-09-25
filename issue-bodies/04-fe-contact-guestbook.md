## Context
จาก [`docs/DECISIONS.md`](https://github.com/Mamee2323/ai-multi-agent/blob/main/docs/DECISIONS.md) **D5** (Contact) + **D6** (Guestbook) — ส่วน FE · Owner: Claude `frontend` · ปิดใน Lab 04 · คู่กับ issue BE ของ D5/D6

## Acceptance
- [ ] Guestbook render ข้อความผู้ใช้ด้วย `textContent` / สร้าง DOM เอง — **ไม่มี `innerHTML` กับข้อมูลผู้ใช้**
- [ ] Guestbook มีบทนำ: ทุกคนเห็นข้อความ + ขออย่าพูดถึงชื่อจริง/ที่ทำงาน/ที่อยู่ของเจ้าของ · หน้ามี `<meta name="robots" content="noindex">`
- [ ] Contact ไม่แสดง `demo@example.com` หรือช่องทางที่ว่าง · ใต้ฟอร์มบอก "อีเมลใช้ตอบกลับเท่านั้น ไม่แสดงบนเว็บค่ะ"
- [ ] ข้อความสำเร็จไม่สัญญาเกินจริง ("ได้รับแล้วค่ะ ฉันจะแวะอ่านเป็นระยะ ๆ นะคะ") · error แสดงเป็นข้อความเป็นมิตร ไม่ใช่ `data.error` ดิบ · เช็ค `res.ok` ทั้งสองฟอร์ม
- [ ] เพิ่ม honeypot input ที่ซ่อนไว้ตามชื่อ field ที่ BE ยืนยันใน handoff
