## Context
จาก [`docs/DECISIONS.md`](https://github.com/Mamee2323/ai-multi-agent/blob/main/docs/DECISIONS.md) **D1** (Headline) + **D2** (โทนข้อความ) · Owner: Claude `frontend` · ปิดใน Lab 04

## Acceptance
- [ ] Home แสดงชื่อ + headline ใหม่จาก `## Headline` ใน PROFILE (ไม่ hardcode)
- [ ] Home แสดงเฉพาะย่อหน้าแรกของ Bio · About แสดง Bio เต็มแยกเป็นหลาย `<p>` ตามย่อหน้า
- [ ] copy ทุกจุดเสียง ฉัน/ค่ะ · ใช้ถ้อยคำเชิงตั้งใจ ("กำลังหัด…", "จะค่อย ๆ มาเล่า") ไม่ overclaim ว่ามีผลงาน
- [ ] ไม่แก้ `src/lib/profile.ts` / ไม่เพิ่ม heading ใหม่ใน PROFILE
- [ ] `npm test` ผ่าน
