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

## Lab 03 — Issues จาก Decisions

| Issue # | Title | มาจาก Decision | Owner · Lab | สร้างผ่าน |
|---|---|---|---|---|
| [#1](https://github.com/Mamee2323/ai-multi-agent/issues/1) | [D1][D2] Home hero + โทนข้อความ ฉัน/ค่ะ (ไม่ overclaim) | D1, D2 | Claude `frontend` · 04 | gh |
| [#2](https://github.com/Mamee2323/ai-multi-agent/issues/2) | [D3][D9] IA ไทย + ห้าม render ข้อความภายใน + ธีมสว่าง | D3, D9 | Claude `frontend` · 04 | gh |
| [#3](https://github.com/Mamee2323/ai-multi-agent/issues/3) | [D4] การ์ด Interests 5 หมวด + anchor + disclaimer การเงิน | D4 | Claude `frontend` · 04 | gh |
| [#4](https://github.com/Mamee2323/ai-multi-agent/issues/4) | [D5][D6] FE: Guestbook textContent + noindex · Contact ซ่อน placeholder | D5, D6 | Claude `frontend` · 04 | gh |
| [#5](https://github.com/Mamee2323/ai-multi-agent/issues/5) | [D6] BE: Guestbook limits + LIMIT + honeypot + วิธีลบ | D6 | OpenCode `backend` · 05 | gh |
| [#6](https://github.com/Mamee2323/ai-multi-agent/issues/6) | [D5] BE: Contact length limit + ไม่ echo email | D5 | OpenCode `backend` · 05 | gh |
| [#8](https://github.com/Mamee2323/ai-multi-agent/issues/8) | [D8] JSON-LD Person + meta description | D8 | Claude `frontend` · 04 | **GitHub MCP** (headless `claude -p`) |
| [#9](https://github.com/Mamee2323/ai-multi-agent/issues/9) | [D5][D6] Guestbook v1 + rate limit · Contact บันทึก SQLite (ซ้อน #5/#6 · rate limit ยังไม่มี decision) | D5, D6 | OpenCode `backend` · 05 | **GitHub MCP** (interactive) |

D7 (Now) เลื่อนเป็น Should → ไม่เปิด issue ใน v1

## Lab 03 — MCP vs gh

- **ความเร็ว:** `gh issue create --body-file` สร้าง 6 ใบในคำสั่งเดียว ไม่ต้องรอ tool call ทีละรอบ · MCP ช้ากว่าเล็กน้อยแต่ agent ร่าง + สร้างจบในบทสนทนาเดียว
- **สิทธิ์:** `gh` ใช้ keyring login ของเครื่อง (สิทธิ์เต็มบัญชี) · MCP ใช้ PAT ใน `.env` ผ่าน `.mcp.json` — ควรเป็น fine-grained PAT เฉพาะ repo นี้ + scope Issues
- **Audit trail:** ทั้งคู่สร้าง issue ในชื่อบัญชีเดียวกัน · `gh` มีประวัติคำสั่งใน shell · MCP มีบันทึกใน transcript ของ Claude — แต่ไม่มีทางไหนบอกบน GitHub ว่า agent เป็นคนสร้าง (เขียนใน body เองถ้าต้องการ)
- **ข้อผิดพลาดที่เจอ:** MCP ต่อไม่ติด (`Authorization header is badly formatted`) เพราะเปิด `claude` ก่อนโหลด `GITHUB_PERSONAL_ACCESS_TOKEN` → `${...}` ใน `.mcp.json` ว่าง ได้ `Bearer ` เปล่า · แก้: โหลด `.env` เข้า env ก่อนเปิด `claude` — ครั้งนี้ใช้ headless `claude -p --allowedTools mcp__github…` ใน shell ที่ export token แล้ว สร้าง #8 ได้โดยไม่ต้องปิดเซสชันหลัก · `gh` ใช้ได้ทันทีเพราะ login ไว้แล้ว
- **เมื่อไหร่ใช้อะไร:** งาน batch / script / CI → `gh` · งานที่ agent ต้องอ่านเอกสารแล้วตัดสินใจเนื้อหา issue เอง หรือต้องอ่าน issue/PR ต่อในบทสนทนา → MCP · ร่าง body เป็นไฟล์ก่อน (`issue-bodies/`) ใช้ได้กับทั้งสองทาง

## รอบ 2 (Teams) — 2026-09-25

> ต่อท้าย ไม่แก้ D1–D9 (issues #1–#8 และ PR #7 อ้างอยู่) · ที่มา: `docs/DEBATE.md` หัวข้อ `## รอบ 2 — จำลองทีม (Teams)`

### สรุปการโต้วาที

ทีมไม่เปลี่ยนการตัดสินใจเดิม แต่ชี้ช่องว่างหลัง UI เสร็จ Brand อยากให้เว็บมีเหตุผลให้กลับมา (ส่วน Now) แต่ Devil's Advocate กับ UX เห็นตรงกันว่า Now ที่ต้องแก้ parser และไม่มีวันที่กำกับ เสี่ยงกลายเป็นหลักฐานว่าเว็บร้าง จึงเลื่อนไว้หลัง ship พร้อมเงื่อนไข ประเด็นที่ทั้งสามเห็นพ้องว่าเป็น blocker คือฟอร์ม Contact ที่เจ้าของยังไม่มีทางอ่าน ส่วน UX เพิ่มเกณฑ์มือถือ และ Devil เพิ่มเรื่อง FALLBACK กับ robots

### การตัดสินใจ (ตาราง)

| ID | หัวข้อ | ตัดสินใจ | เหตุผลสั้น | ใครเสนอ (Brand/UX/Devil) |
|----|--------|----------|------------|---------------------------|
| D10 | อ่าน/ลบข้อความ Contact | BE ทำ script อ่านและลบข้อความ Contact (แบบเดียวกับ guestbook ใน D6 — ไม่มี endpoint สาธารณะ) · retention เริ่มต้น 90 วันด้วย script ลบของเก่า · **ห้าม ship ถ้ายังไม่มีวิธีอ่าน** · จังหวะอ่าน (เริ่มต้นสัปดาห์ละครั้ง) และ retention ให้เจ้าของยืนยันใน L4 | ฟอร์มที่ไม่มีใครอ่านทำร้าย brand มากกว่าไม่มีฟอร์ม | Devil + Brand |
| D11 | ส่วน Now | คงเลื่อน (D7) จนหลัง ship · เมื่อทำ: heading `## Now` + วันที่อัปเดตใน PROFILE · แสดงวันที่คู่เสมอ · ซ่อนอัตโนมัติเมื่อเก่ากว่า 60 วัน · ต้องมี D-id ใหม่ + แก้ parser + เทสต์ | ความสดใหม่ต้องซื่อสัตย์ และไม่พึ่งวินัยคนอัปเดต | Brand + UX + Devil |
| D12 | FALLBACK ของ `profile.ts` | เปลี่ยนเป็นข้อความไทยกลาง ๆ (เช่น ชื่อ "13หมาหมี", headline/bio ว่างให้หน้าซ่อน section) · ห้าม "Personal branding site", ข้อความอังกฤษ "coming soon", ข้อความคอร์ส · ทำก่อน Lab 08 (L8) | FALLBACK render สู่สาธารณะเมื่อ PROFILE หาย | Devil + UX |
| D13 | Robots / การ index | ให้ index หน้าเนื้อหา · `/guestbook` คง `noindex` (D6) · เพิ่ม `robots.txt` กัน `/api/` และ `/guestbook` · `llms.txt` ยังเลื่อน (Nice) | อ่านง่ายสำหรับ agent โดยไม่ส่งเนื้อหาของคนอื่นให้ crawler | Devil + Brand |
| D14 | มือถือ | ที่ความกว้าง 360px: ไม่มี scroll แนวนอน · nav 5 รายการตัดบรรทัดหรือย่อได้ · headline ตัดบรรทัดอ่านง่าย · ตรวจใน Lab 06 (Playwright) | กลุ่มเพื่อนส่วนใหญ่เปิดจากมือถือ | UX |

ไม่มีการแก้ `docs/PROFILE.md` ในรอบนี้

### สิ่งที่เลื่อนออก (เพิ่มเติม)

- ส่วน Now + parser ใหม่ (D11) → หลัง ship
- หน้า inbox / แจ้งเตือนทางอีเมลเมื่อมีข้อความ Contact → หลัง v1 (v1 ใช้ script ตาม D10)
- `llms.txt`

### เกณฑ์เพิ่มเติม (ตรวจใน Lab 05–06 และก่อน Lab 08)

- Lab 05 (BE): script อ่าน/ลบข้อความ Contact + ลบของเก่ากว่า 90 วัน (D10) — เพิ่มเข้า scope ของ #6 หรือเปิด issue ใหม่
- Lab 06 (QA): ทุกหน้าที่ 360px ไม่มี scroll แนวนอน · nav ใช้งานได้ (D14)
- ก่อน Lab 08: FALLBACK ตาม D12 · มี `robots.txt` ตาม D13 · เจ้าของตอบ L4 แล้ว (D10)
