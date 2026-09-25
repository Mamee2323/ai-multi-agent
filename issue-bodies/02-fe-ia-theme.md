## Context
จาก [`docs/DECISIONS.md`](https://github.com/Mamee2323/ai-multi-agent/blob/main/docs/DECISIONS.md) **D3** (IA + สิ่งที่ห้าม render) + **D9** (ธีม) · Owner: Claude `frontend` · ปิดใน Lab 04

## Acceptance
- [ ] Nav ไทย: หน้าแรก · เกี่ยวกับฉัน · สิ่งที่สนใจ · ติดต่อ · สมุดเยี่ยม
- [ ] markup ที่ render **ไม่มี**: Audience, eyebrow "Personal branding site", path `/api/...`, error ดิบ, ข้อความ "เร็ว ๆ นี้", ข้อความคอร์ส (รวม default description ใน `BaseLayout.astro`)
- [ ] label / ปุ่ม / สถานะฟอร์มเป็นไทย
- [ ] ธีมสว่างสดใส · contrast ตัวอักษรผ่าน WCAG AA
- [ ] `npm test` (public-leak guard) ผ่าน
