## Context
จาก [`docs/DECISIONS.md`](https://github.com/Mamee2323/ai-multi-agent/blob/main/docs/DECISIONS.md) **D8** (JSON-LD `Person` + อ่านง่ายสำหรับ agent) · Owner: Claude `frontend` · ปิดใน Lab 04 (ตรวจซ้ำ Lab 06)

## Acceptance
- [ ] JSON-LD `Person` มีเฉพาะ `name` ("13หมาหมี"), `alternateName` ("13Mamee"), `description` (headline), `url`, `knowsAbout` (interests)
- [ ] **ห้าม** `email`, `jobTitle`, `worksFor`, `address`, `image` · ไม่ดึงเนื้อหา Guestbook
- [ ] ทุกหน้ามี meta description ของตัวเอง (ไม่มีข้อความคอร์ส)
- [ ] semantic HTML · heading เรียงชั้น (1 `<h1>` / หน้า)
