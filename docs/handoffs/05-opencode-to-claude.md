# Handoff: OpenCode → Claude

> ใช้เมื่อสลับ harness / บทบาท — **อย่าเล่าปากเปล่าแทนไฟล์นี้**

Timestamp: 2026-09-25 15:05 +07:00  
Task: Lab 05 BE — ปิด L2, L3, L10 (issues #5, #6 · D5/D6/D10) ตาม handoff `04-claude-to-opencode.md`  
Status: IMPLEMENTED (รอ review + merge PR #7 แล้ว merge branch นี้)

## What changed

- **M2** `src/lib/db.ts`: length limit ฝั่ง server ใน `normalizeText` — guestbook name ≤ 40 / message ≤ 500 · contact name ≤ 80 / email ≤ 120 / message ≤ 2000 (ค่าเดียวกับ `maxlength` ของ FE พอดี) · แก้ header comment เก่า ("Stubs return null…")
- **M3** `listGuestbook()`: `ORDER BY created_at DESC, id DESC LIMIT 50` (เพิ่ม id tiebreak กันเรียงซ้ำในหนึ่งวินาที)
- **M1** `api/contact.ts` + `api/guestbook.ts`: honeypot `website` มีค่า → ตอบ 201 `{ok:true}` ไม่บันทึก (ตามข้อเสนอใน contract check — FE ส่ง field นี้มาอยู่แล้ว ไม่แตะ FE)
- **M4** `api/contact.ts`: 201 คืน `{id, name, created_at}` — ไม่ echo `email` (แก้ที่ชั้น API ตาม assumption #1 ของ handoff เก่า · `insertContact` ยังคืน row เต็ม ไม่พัง lab test)
- **M5** error body ทุก endpoint เป็น generic (`bad request` / `server error`) + `console.error` รายละเอียดฝั่ง server · status mapping เดิม (NOT_IMPLEMENTED→501 · POST→400 · GET→500)
- **M6** scripts ใหม่: `scripts/guestbook-delete.mjs <id>` (D6) · `scripts/contact-manage.mjs list|delete <id>|purge [--days 90]` (D10/L10) — ใช้ `DATA_DIR` เดียวกับเว็บ ไม่มี DELETE endpoint สาธารณะ
- เทสต์ใหม่ `tests/api-safeguards.test.ts` (9 tests — อยู่ใน `npm test` ที่ CI รัน): limit, LIMIT 50, honeypot ทั้งสอง endpoint, email ไม่หลุดใน response, generic error body
- แก้ typos ในเทสต์ตัวเอง 1 จุด: email ยาวเกินต้อง 116 ตัวอักษร (115 = 120 พอดี ไม่ throw)

## Files

- แก้: `src/lib/db.ts` · `src/pages/api/guestbook.ts` · `src/pages/api/contact.ts`
- ใหม่: `scripts/guestbook-delete.mjs` · `scripts/contact-manage.mjs` · `tests/api-safeguards.test.ts`
- อัปเดต: `docs/STATUS.md` · `docs/OPEN_LOOPS.md` (ปิด L2/L3/L10 · เพิ่ม L13 rate limit)
- อ่านประกอบ: `docs/fe-be-contract-check.md` (M1–M6 คือ scope ที่ทำครบแล้ว)
- ห้ามแตะ: `src/pages/*.astro`, `src/layouts/`, styles — ไม่ได้แตะเลย

## Verification

- Unit / smoke: PASS — `npm test` 3 files / 13 tests (รวม `tests/api-safeguards.test.ts` ใหม่)
- Labs (`npm run test:labs`): PASS — 2 tests (ไม่แดงอยู่แล้วตั้งแต่ก่อนเริ่ม — template Lab 00 มี persistence ครบ · ตามที่ handoff `05-…` รุ่นก่อนบันทึกไว้)
- Build: PASS — `npm run build`
- Manual / localhost (`node dist/server/entry.mjs` + curl, DATA_DIR แยก): honeypot ทั้งสอง → 201 `{ok:true}` และไม่ลง DB · contact 201 ไม่มี `email` · เกิน limit → 400 `{"error":"bad request"}` · GET guestbook → 200 `{entries:[…]}` · scripts list/purge/delete ผ่านกับ DB จริง (purge ลบแถวอายุ 100 วัน, เก็บแถวใหม่)

## Assumptions to challenge

1. **LIMIT 50 + tiebreak `id DESC`** — handoff เดิมเสนอแค่ `ORDER BY created_at DESC LIMIT 50`; ผมเพิ่ม `id DESC` เพราะ `datetime('now')` แม่นระดับวินาที สองโพสต์ในวินาทีเดียวจะเรียงไม่นิ่ง — ถ้าไม่เห็นด้วยแก้ได้ที่ `db.ts:94`
2. **Response 201 ของ contact = `{id, name, created_at}`** ไม่ใช่ `{ok:true}` — เผื่อ FE อนาคตอยากโชว์ "ได้รับเรียบร้อย #id"; FE ปัจจุบันไม่อ่าน body จึงเปลี่ยนได้เสมอ
3. **M5 generic error ครบทั้ง GET/POST** — contract check เสนอไว้ ผมทำทั้งสอง handler (รวม GET guestbook ที่เดิมคืน `err.message` ดิบ)
4. **`tests/labs/lab05-api.test.ts` comment "expected RED" ล้าสมัย** — template มี persistence ตั้งแต่ Lab 00 จึงเขียวมาตลอด ไม่แก้ไฟล์ labs (นอก scope) แต่ควรแก้ตอน maintenance ครั้งหน้า
5. Honeypot ตรวจแค่ `typeof === 'string' && trim() !== ''` — บอทที่ส่ง array/number จะหลุดไปโดน validation ปกติ (400) ยังไม่มีช่องบันทึก; rate limit (#9) ยังเปิดเป็น L13

## Request to next agent

**Lab 06 QA (Claude/Playwright)**:

1. E2E ใน `playwright/`: ส่งฟอร์มจริงทั้งสอง (ผ่าน + honeypot + เกิน limit) · GET guestbook render ด้วย `textContent`
2. ตรวจ L12 (360px) เป็น E2E ถาวร
3. รีวิว PR นี้ (BE) — จุดที่อยากได้มุมรีวิว: LIMIT tiebreak (ข้อ 1) และ generic error ว่า FE แสดงข้อความไทยครบทุกสาขาหรือไม่
4. ห้ามแตะ: `src/lib/db.ts`, `src/pages/api/*`, `scripts/` (ของ backend) · ถ้าต้องเปลี่ยนสัญญา ให้ข้อเสนอใน handoff กลับ

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md`
- [ ] `docs/DECISIONS.md` — ไม่มี decision ใหม่ (ทำตาม D5/D6/D10 ที่อนุมัติแล้วทั้งหมด · ค่า limit = ค่าที่ handoff เสนอ)
- [x] อื่น ๆ: `scripts/guestbook-delete.mjs` · `scripts/contact-manage.mjs` · `tests/api-safeguards.test.ts`

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = Claude (เริ่มรอบ Lab 06) · issues รอปิดหลัง merge: #5, #6
