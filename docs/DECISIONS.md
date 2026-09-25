# Decisions — Personal Site

> อนุมัติแล้วเท่านั้น · ที่มา: `docs/DEBATE.md` (Brand Strategist · UX Critic · Devil's Advocate) · ปิดรอบ 2026-09-25
> ข้อที่ขัดกับ `## Brainstorm` ใน `PROFILE.md` → ยึดไฟล์นี้

## สรุปการโต้วาที

ทั้งสามมุมเห็นตรงกันว่าจุดแข็งของเว็บคือ "คนธรรมดาที่เลือกเรียนสิ่งที่ใช้ได้จริง" แต่ headline เดิมกว้างเกินจนคนอ่านและ agent สรุปไม่ได้ว่าเว็บนี้มีอะไร Brand เสนอให้ใช้ "ลองแล้วเล่า" เป็นแกน ส่วน Devil's Advocate เตือนว่าถ้าเขียนเป็นผลงานทั้งที่ยังไม่มีเรื่องเล่าจะกลายเป็น overclaim จึงตกลงเขียนเป็น "ความตั้งใจ" UX ชี้ว่า PROFILE ยังไม่พร้อมสำหรับหน้า Interests / Contact และมีข้อความภายใน (Audience, path API, error ดิบ) หลุดขึ้นเว็บ Devil's Advocate ยกความเสี่ยงของ Guestbook (XSS, สแปม, เพื่อนเผยข้อมูลเจ้าของ) และ Contact ที่ไม่มีใครอ่าน ข้อสรุปคือ v1 เล็กลง ไม่เพิ่ม heading ใหม่ใน PROFILE (parser ไม่ต้องแก้) และ Guestbook ขึ้นเว็บได้เฉพาะเมื่อผ่านเกณฑ์ความปลอดภัย

## การตัดสินใจ (ตาราง)

| ID | หัวข้อ | ตัดสินใจ | เหตุผลสั้น | ใครเสนอ (Brand/UX/Devil) |
|----|--------|----------|------------|---------------------------|
| D1 | Headline | เปลี่ยน `## Headline` ใน PROFILE เป็น "คนธรรมดาที่ชอบเรียนรู้ — กำลังลองทั้งเรื่องเทคและเรื่องชีวิต แล้วค่อย ๆ มาเล่าค่ะ" · **ไม่**เพิ่ม heading `## Tagline` ใน v1 | เก็บตัวตนเดิม + บอกว่าเว็บมีอะไร ในบรรทัดเดียว · เขียนเป็นความตั้งใจ ไม่ overclaim · ไม่กระทบ parser | Brand (แยกคุณค่า) + Devil (R5 overclaim) |
| D2 | มุมเล่าเรื่อง About + โทนข้อความ | มุมหลัก "ลองแล้วเล่า" บนฉากหลัง "นักเรียนตลอดชีพ" · copy ทุกจุดใช้เสียง ฉัน/ค่ะ สดใส เป็นกันเอง แต่ใช้ถ้อยคำเชิงตั้งใจ ("กำลังหัด…", "จะค่อย ๆ มาเล่า") จนกว่าจะมีเนื้อหาจริง · เพิ่มกฎนี้ใน `## Tone` ของ PROFILE | ร้อย 5 หมวดเป็นคนเดียวกัน · กันคำสัญญาที่ไม่มีหลักฐาน | Brand (ข้อ 2–3) + Devil (R5) |
| D3 | IA และสิ่งที่ห้าม render | Nav ไทย: หน้าแรก · เกี่ยวกับฉัน · สิ่งที่สนใจ · ติดต่อ · สมุดเยี่ยม · Home = ชื่อ + headline + ย่อหน้าแรกของ Bio + การ์ด Interests + CTA · Bio เต็มอยู่ About ที่เดียว · **ไม่ render** Audience, eyebrow "Personal branding site", path API, error ดิบ, ข้อความ "เร็ว ๆ นี้" · label/ปุ่ม/สถานะเป็นไทย | ผู้เยี่ยมไม่อ่านซ้ำ ไม่เจอโน้ตภายใน | UX (ข้อ 2–3, U4) |
| D4 | Interests v1 | การ์ดข้อความ 5 ใบจาก `## Interests` เดิม (`string[]`) + anchor ต่อหมวดบนหน้า Interests · คำอธิบายรายหมวด → Should · ไอคอน → Nice · หมวดการเงินมี disclaimer "ไม่ใช่คำแนะนำการลงทุน" (ข้อความ FE คงที่) | ไม่เปลี่ยนรูปแบบ PROFILE และสัญญา `/api/interests` ระหว่าง FE ↔ BE | UX (U1) + Devil (ตัด Must, R6) |
| D5 | Contact | parser **ไม่**อ่าน `## Contact` ใน v1 · ห้ามแสดง `demo@example.com` หรือช่องว่างทั้งใน HTML และ JSON-LD · ฟอร์มเป็นช่องทางหลัก · ใต้ฟอร์มบอกว่า "อีเมลใช้ตอบกลับเท่านั้น ไม่แสดงบนเว็บค่ะ" · ข้อความสำเร็จไม่สัญญาเกินจริง ("ได้รับแล้วค่ะ ฉันจะแวะอ่านเป็นระยะ ๆ นะคะ") · BE พิจารณาไม่ echo email กลับใน response | placeholder ปลอมทำลาย credibility · ยังไม่มีช่องทางแจ้งเตือนเจ้าของ | UX (U3) + Devil (R1, R2, R7) |
| D6 | Guestbook | คงใน Must **แบบมีเงื่อนไข**: (FE) render เป็น text เท่านั้น ห้าม `innerHTML` · บทนำเตือนว่าทุกคนเห็นและอย่าพูดถึงชื่อจริง/ที่ทำงาน/ที่อยู่ของเจ้าของ · `noindex` · (BE) จำกัดความยาวฝั่ง server · `LIMIT` จำนวนแถว · honeypot · มีวิธีลบข้อความที่เจ้าของทำได้จริง — ถ้าฝั่ง BE ไม่ครบก่อน ship ให้ซ่อนลิงก์ Guestbook (ย้ายไป Should) | stored XSS + สแปม + privacy ของเจ้าของเสียหายเร็วที่สุด | Devil (R3, R4) + UX (ข้อ 6) |
| D7 | ส่วน Now | ย้ายจาก Must → Should · ไม่เพิ่ม `## Now` ใน v1 | ต้องแก้ parser + เนื้อหาเก่าเร็วถ้าไม่มีคนอัปเดต | Devil (ตัด Must, คำถามข้อ 7) · UX (U2) |
| D8 | JSON-LD `Person` + ความอ่านง่ายของ agent | คงใน Must · field ที่อนุญาต: `name` ("13หมาหมี"), `alternateName` ("13Mamee"), `description` (headline), `url`, `knowsAbout` (interests) เท่านั้น · ห้าม `email`, `jobTitle`, `worksFor`, `address`, `image` · semantic HTML + heading เรียงชั้น + meta description รายหน้า (ห้ามข้อความคอร์ส) · ไม่เอาเนื้อหา Guestbook เข้า JSON-LD | agent อ่านง่ายโดยไม่มีข้อมูลส่วนตัวหลุดเงียบ ๆ | Brand (audience agent) + Devil (คำถามข้อ 5–6) |
| D9 | ธีม | ธีมสว่าง สดใส ตาม `## Tone` แทนธีมมืดปัจจุบัน · ต้องผ่าน contrast ตัวอักษรขั้นต่ำ WCAG AA | โทนที่เจ้าของตั้งไว้คือ "สดใส สนุก" | Brand (ข้อ 3) |

### บันทึกการแก้ `docs/PROFILE.md` (รอบนี้)

- `## Headline`: "คนธรรมดา ที่ชอบเรียนรู้" → "คนธรรมดาที่ชอบเรียนรู้ — กำลังลองทั้งเรื่องเทคและเรื่องชีวิต แล้วค่อย ๆ มาเล่าค่ะ" (D1)
- `## Tone`: เพิ่มบรรทัด "ข้อความ: สนุกได้ แต่เล่าเป็นความตั้งใจจนกว่าจะมีเรื่องจริงให้ดู ไม่ overclaim" (D2)
- ไม่เปลี่ยนชื่อ heading ใด · ไม่แตะ `## Audience` / `## Contact` / `## Brainstorm` (จัดการฝั่ง render ตาม D3, D5)

## สิ่งที่เลื่อนออก (Out of scope v1)

- `## Tagline` แยก และ `## Now` (heading ใหม่ = ต้องแก้ parser + เทสต์) → Should
- คำอธิบายรายหมวด Interests (เปลี่ยนสัญญา `/api/interests`) → Should · ไอคอนรายหมวด → Nice
- parser อ่าน `## Contact` + ลิงก์ GitHub / LinkedIn → รอเจ้าของให้ข้อมูลจริง
- TIL, มุมครัว, ทริป, หน้า Uses, `llms.txt`, บทความการเงิน, Showcase, RSS, สลับธีม
- แจ้งเตือนเจ้าของเมื่อมีข้อความ Contact / หน้า inbox (ต้องตอบคำถาม "อ่านข้อความยังไง" ก่อน — ดู OPEN_LOOPS)
- CMS, login, คอมเมนต์ต่อบทความ, หลายภาษา, newsletter, analytics

## เกณฑ์พร้อม Frontend (Lab 04)

- หน้าเว็บที่ render **ไม่มี** Audience, eyebrow "Personal branding site", path `/api/...`, error ดิบ, `demo@example.com`, ข้อความคอร์ส และข้อความ "เร็ว ๆ นี้" · `npm test` (รวม public-leak guard) ผ่าน (D3, D5)
- Guestbook render ข้อความผู้ใช้ด้วย `textContent` / สร้าง DOM เอง ไม่มี `innerHTML` กับข้อมูลผู้ใช้ · หน้า Guestbook มีบทนำเตือนเรื่อง privacy + `noindex` (D6)
- Home ตาม D3–D4: ชื่อ + headline ใหม่ + ย่อหน้าแรกของ Bio + การ์ด Interests 5 ใบลิงก์ลง `/interests#<slug>` · About แสดง Bio แยกเป็นหลาย `<p>` ตามย่อหน้า
- label / ปุ่ม / สถานะฟอร์มเป็นไทยเสียง ฉัน/ค่ะ ข้อความสำเร็จ/ผิดพลาดตาม D5 · ธีมสว่างผ่าน contrast AA (D9)
- ทุกหน้ามี meta description ของตัวเอง + JSON-LD `Person` เฉพาะ field ใน D8 · ไม่แตะ `src/lib/db.ts` / `src/pages/api/*` (งาน BE ของ D5–D6 ส่งต่อ OpenCode)
