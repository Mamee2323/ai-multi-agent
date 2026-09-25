# รีวิว PR #11 (Lab 06 QA) — OpenCode (reviewer ฝั่ง backend)

> อิสระจากผู้เขียน (Claude `frontend`) · อ่านเฉพาะ input ที่ `docs/_call-opencode-prompt.md` กำหนด · 2026-09-25

## สรุป

**ผ่าน (approve) — ไม่มี Must fix** · ขอบเขตตรง Lab 06: `docs/QA.md` + smoke spec ไทย + `aria-invalid` ทั้งสองฟอร์ม + อัปเดต STATUS/OPEN_LOOPS ตาม single-writer · ไม่แตะ `src/lib/db.ts` / `src/pages/api/*` (เคารพ ownership) · ไม่มี secret หรือข้อความคอร์สหลุด · มี Should 3 ข้อที่ควรเก็บก่อน/หลัง merge ไม่บล็อก

## จุดแข็ง

- **Smoke spec ผูกกับพฤติกรรม ไม่ผูกกับ implementation** — ใช้ `getByLabel`/`getByRole` + `{ exact: true }` (`playwright/smoke.spec.ts:11-13`) ซึ่งเป็น locator แบบเดียวกับที่ AT ใช้ → regression ด้าน label ไทยถูกจับได้จริง ตรงปัญหาที่ a11y Advocate ยก (`docs/QA.md:49`)
- **เคสอีเมลผิดพิสูจน์ทั้งสองชั้นในคำสั่งเดียว** — ไม่ยิง POST (`smoke.spec.ts:19,26`) + `aria-invalid` ติด/ถูกล้างถูกช่อง (`:24-25`) — เป็น regression guard ของ P1-1 ที่เพิ่งเพิ่ม ไม่ใช่แค่เทสต์หน้าบาน
- **โค้ดจริงดีกว่า diff ที่เสนอใน QA.md** — ยกบล็อก mark/clear `aria-invalid` ขึ้นเหนือ `checkValidity()` (`src/pages/contact.astro:59-63`, `src/pages/guestbook.astro:125-129`) ทำ pass เดียวครบทั้ง set และ clear แทนแยกสองจุดตาม `docs/QA.md:119-133`
- **QA.md ซื่อสัตย์กับข้อจำกัดของวิธี** — บอกชัดว่า MCP รีเซ็ตหน้า, dev toolbar แทรก h1, ยังไม่ได้รัน axe/NVDA (`docs/QA.md:9-10,50`) — แยก "วัดแล้ว" ออกจาก "ความเห็น debate" ชัดเจน
- **State สอดคล้องกัน** — L12 ปิดพร้อมหลักฐานชี้ไป step 12 · L15 เปิดรับของที่เหลือ · STATUS/OPEN_LOOPS ตรงกันและ writer เป็น Claude ตามรอบ (`docs/OPEN_LOOPS.md:14,28`)

## ความเสี่ยง

1. **E2E demo submit เขียน row จริงเข้า DB ของ server ที่รันอยู่** (`smoke.spec.ts:29-40`) — spec ไม่คุม `DATA_DIR`; ถ้ารันด้วย dev server ปกติจะปนเข้า `./data/site.sqlite` ทุกครั้ง และถ้าใครตั้ง `PLAYWRIGHT_BASE_URL` ชี้ไป production (`playwright.config.ts:7`) จะยิงข้อมูล "Demo QA" เข้าตาราง contact จริง — ผลกระทบต่ำ (contact ไม่ render สาธารณะ · ลบได้ด้วย `contact-manage.mjs`) แต่สะสมเงียบ ๆ
2. **ข้อความ "ผ่าน AA ทุกจุดที่วัด" เป็นการวัดมือ ไม่ใช่ axe** (`docs/QA.md:42`) — ความเสี่ยง false confidence ต่ำ เพราะ P2-2 วางแผน axe+NVDA หลัง deploy อยู่แล้ว
3. **`main h1` ผูกกับโครง layout** (`smoke.spec.ts:6`) — ถ้า BaseLayout เอา `<main>` ออก เทสต์จะแดงแบบบอกเหตุไม่ชัด (ต่ำ · ยอมรับได้เพื่อเลี่ยง dev toolbar)

## Must fix

- ไม่มี

## Should

1. **P1-1 เคลม "ล้างเมื่อแก้" แต่โค้ดล้างเฉพาะตอน submit ซ้ำ** — `docs/QA.md:100` เทียบ `src/pages/contact.astro:59-63` / `src/pages/guestbook.astro:125-129`: ผู้ใช้ที่กำลังแก้ช่องจะยังถูกอ่านว่า invalid จนกว่าจะกดส่งอีกครั้ง · เลือกอย่างใดอย่างหนึ่ง: (ก) เพิ่ม `input` listener ล้าง `aria-invalid` รายช่อง (~3 บรรทัด) หรือ (ข) แก้ถ้อย action item เป็น "ล้างเมื่อ submit ซ้ำ" ให้เอกสารตรงโค้ด
2. **กัน/บอกเรื่อง e2e เขียน DB จริง** (`smoke.spec.ts:29-40`) — อย่างน้อยเขียนใน QA.md หรือ README ว่า `npm run test:e2e` insert row จริงและล้างด้วย `scripts/contact-manage.mjs` · ดีกว่านั้น: เพิ่ม `webServer` ใน `playwright.config.ts` ที่ตั้ง `DATA_DIR` ชี้ scratch ให้เอง (จะปิดความเสี่ยงข้อ 1 ทั้งก้อน รวมเคส `PLAYWRIGHT_BASE_URL` ชี้ prod)
3. **`npm run test:e2e` ยังรันจาก repo ไม่ได้ทันที** — QA.md step 15 ผ่านเพราะ config ชั่วคราว `channel: 'msedge'` **นอก repo** (`docs/QA.md:30`) ส่วน `playwright.config.ts:6-9` ยังเดิม · STATUS รับไว้แล้วใน Next actions (`docs/STATUS.md:43`) แต่ควรตัดสินใน PR นี้หรือเปิด loop ให้ชัด ว่าจะ commit `channel`/เขียน doc/เพิ่ม `webServer` — ไม่งั้นเทสต์ที่เพิ่งซ่อมจะกลับเป็น "แดงตลอด ไม่มีใครเชื่อ" เหมือนที่ Pragmatist เตือน (`docs/QA.md:55`)

## Nit

1. **เลข step ไม่ตรงกัน** — STATUS บอก "E2E ผ่าน Playwright MCP 14/14 step" (`docs/STATUS.md:28`) แต่ตาราง QA.md มี 16 แถว (`docs/QA.md:16-31`) · เก็บให้ตรงกันตอนอัปเดต canonical state
2. **"Diff ที่เสนอ" ใน QA.md ไม่ตรงโค้ดที่ merge** (`docs/QA.md:106-133` เทียบ `contact.astro:57-68`) — โค้ดจริงดีกว่า (ดูจุดแข็ง) แต่เอกสารควรถูกย้อนให้ตรง ไม่งั้นคนอ่านย้อนหลังเข้าใจผิด
3. **`waitForResponse` ไม่เช็ค method** (`smoke.spec.ts:35`) — วันนี้หน้า /contact ไม่มี request อื่นไป `/api/contact` แต่เพิ่ม `&& r.request().method() === 'POST'` จะกัน false pass อนาคต
4. **selector กัน honeypot ผูกกับ `name=website`** (`contact.astro:60`, `guestbook.astro:126`) — ถ้าเปลี่ยนชื่อ honeypot ต้องแก้สองจุด · ผูกกับ container `.hp` แทนจะทนกว่า (เล็กมาก ไม่ต้องแก้ก็ได้)

## ความเห็นเรื่อง L13 (#9 rate limit)

**เสนอ: ข้ามใน v1 — ไม่ทำ endpoint-level rate limit ตอนนี้ แล้วเปิด issue P2 ติดตามหลัง ship** เหตุผล:

1. **ผลกระทบถูกจำกัดอยู่แล้วด้วยสิ่งที่มี** — length limit ฝั่ง server (D5/D6) · `LIMIT 50` ตอน list · honeypot ตอบ 201 เงียบ · error body generic · เจ้าของมี `contact-manage.mjs purge` / `guestbook-delete.mjs` (D10) — สแปมที่หลุดมาจึง "รก" ไม่ใช่ "พัง"
2. **Threat model v1 เล็ก** — กลุ่มเป้าหมายคือเพื่อน (D14) และ guestbook ถูก `noindex` + กัน robots (D13) ลดโอกาสโดนบอทเจอ
3. **ทำให้ถูกไม่ใช่งาน BE อย่างเดียว** — 429 จะตกไปที่ branch `else` ของ FE ซึ่งแสดง "ลองเช็คความยาวข้อความ" (`contact.astro:88-91`, `guestbook.astro:154-157`) — ข้อความผิดความหมาย → ต้องเพิ่ม FE copy ใหม่ + ขยายสัญญา error · แถม rate limit หลัง reverse proxy ต้องตัดสินเรื่อง trust `X-Forwarded-For` (spoof ได้ถ้าตั้งผิด) — เกินขอบเขต "Lab 06 review ตัดสิน" และยังไม่มี D-id
4. **ทางกลับมาทำชัดเจน** — standalone = process เดียว จึงพอแค่ in-memory sliding window ต่อ IP (เช่น 5 POST/10 นาที/endpoint) ใน `src/pages/api/*` ไม่ต้องแตะ `db.ts` · trigger ที่เสนอ: **ก่อนโปรโมตเว็บสาธารณะ หรือเจอสแปมจริง** · สอดคล้องกับการปิด #9 เป็น not_planned และไม่ขัด DECISIONS ใด

ถ้าตกลงตามนี้: ปิด L13 พร้อม D-id ใหม่ (เช่น D15 "เลื่อน rate limit ออกจาก v1 พร้อม trigger") ใน DECISIONS.md + เปิด issue P2 — เป็นหน้าที่ของ writer รอบถัดไป ไม่ใช่ของรีวิวนี้

## คำถามต่อ Claude

1. P1-1: ตั้งใจให้ "ล้างเมื่อแก้" = ล้างตอน submit ซ้ำเท่านั้น หรือจะเพิ่ม `input` listener? (Should ข้อ 1)
2. จะ sync "Diff ที่เสนอ" ใน `docs/QA.md:106-133` ให้ตรงโค้ดจริงใน PR นี้เลยไหม หรือทำรวมกับ L15 ภายหลัง?
3. `test:e2e` reproducibility (Should ข้อ 3): เลือกทางไหน — commit `channel: 'msedge'` · เพิ่ม `webServer` + scratch `DATA_DIR` · หรือเขียน doc — และใครเป็น owner?
4. รับความเสี่ยง demo submit เขียน DB จริงไว้ก่อน (ล้างด้วย `contact-manage.mjs` เป็นระยะ) หรืออยากปิดใน PR นี้? (Should ข้อ 2)
5. L13: เห็นตรงกับข้อเสนอ "ข้าม v1 + เปิด issue P2 พร้อม trigger" ไหม ถ้าตรง ฝากร่าง D-id ใหม่ตอนอัปเดต DECISIONS.md

## Canonical state updated

- [ ] docs/STATUS.md
- [ ] docs/OPEN_LOOPS.md
- [ ] docs/DECISIONS.md (ถ้ามี decision ใหม่)
