# Handoff: Claude → OpenCode

> ใช้เมื่อสลับ harness / บทบาท — **อย่าเล่าปากเปล่าแทนไฟล์นี้**
> รวม handoff เดิม `05-claude-to-opencode.md` (เขียนก่อน Lab 04) เข้าไฟล์นี้แล้ว

Timestamp: 2026-09-25 12:10 +07:00  
Task: Lab 05 BE — ปิด issue #5 (Guestbook, D6) และ #6 (Contact, D5) · OPEN_LOOPS L2, L3  
Status: NEEDS_REVIEW (FE เสร็จ — ส่งต่อให้ BE implement)

## What changed

- Lab 02: `docs/DEBATE.md` → `docs/DECISIONS.md` D1–D9 · `docs/PROFILE.md` แก้ `## Headline` + `## Tone` (ไม่เปลี่ยนชื่อ heading)
- Lab 03: issues #1–#6 · ร่าง body ใน `issue-bodies/`
- Lab 04 (branch `lab-04-frontend`, PR #7): UI 5 หน้า ธีมสว่าง nav ไทย · Guestbook render ด้วย `textContent` · ฟอร์มทั้งสองส่ง honeypot `website` + เช็ค `res.ok` + ไม่แสดง error ของ server · JSON-LD `Person` เฉพาะ field ใน D8
- **ฝั่ง Claude ไม่ได้แตะ** `src/lib/*`, `src/pages/api/*`, `tests/`

## Files

- อ่านก่อน: **`docs/fe-be-contract-check.md`** (OpenCode เขียนเองตอน Lab 04 — ไม่มี mismatch ฝั่ง FE) · `docs/DECISIONS.md` D5, D6 · issue #5, #6 · `docs/DEBATE.md` `## Devil's Advocate` R1–R3
- ฟอร์ม FE (อ่านอย่างเดียว): `src/pages/contact.astro`, `src/pages/guestbook.astro`
- ไฟล์ที่คาดว่าจะแก้ (ของ OpenCode): `src/lib/db.ts` · `src/pages/api/guestbook.ts` · `src/pages/api/contact.ts` · `scripts/guestbook-delete.mjs` (ใหม่) · เทสต์ใน `tests/` (ไม่ใช่ `tests/labs/`)

## Verification

- Unit / smoke: PASS — `npm test` 2 files / 4 tests (บน `lab-04-frontend`)
- Build: PASS — `npm run build`
- Labs (`npm run test:labs`): PASS — 2 tests (ยังไม่มีเทสต์ครอบ limit/honeypot)
- Manual / localhost: 5 หน้าตอบ 200 · ตรวจหน้าแรกด้วย Playwright screenshot · grep HTML ไม่พบ `demo@example.com` / Audience / "เร็ว ๆ นี้" / `innerHTML`
- หมายเหตุ: ตอนตรวจ FE ยิง POST guestbook 1 แถว (`a`/`b`) ลง `data/site.sqlite` local (gitignored) — ลบไฟล์ได้

## Assumptions to challenge

ค่าด้านล่าง **ยืนยันแล้วใน `docs/fe-be-contract-check.md`** — FE ใช้ค่าเหล่านี้เป็น `maxlength` แล้ว ถ้า BE เปลี่ยนต้องแจ้งกลับ

1. Honeypot `website` — เช็คที่ชั้น route · มีค่า → 201 + `{ ok: true }` ไม่บันทึก
2. Limit (นับหลัง trim): guestbook name 40 / message 500 · contact name 80 / email 120 / message 2000 · `listGuestbook` `LIMIT 50` คง `ORDER BY created_at DESC`
3. ตัด `email` ที่ `contact.ts` ไม่ใช่ `db.ts` — `tests/labs/lab05-api.test.ts:25` คาด `insertContact()` คืน `row.email` · FE ไม่อ่าน body ของ 201
4. ลบข้อความ = script ใช้ `DATA_DIR` เดียวกัน · ห้าม DELETE endpoint สาธารณะ
5. Error ที่ throw ต้องสั้นและไม่มี SQL / stack trace (FE ไม่แสดงอยู่แล้ว แต่อย่าพึ่งพา)
6. `src/lib/profile.ts` `FALLBACK` มี "Personal branding site" + ข้อความอังกฤษ "coming soon" — render สู่สาธารณะถ้า PROFILE.md หาย (ขัด D3) · ไม่ใช่ขอบเขต #5/#6 แต่ถ้าแก้ได้ให้เสนอในรายงานกลับ

## Request to next agent

**Implement BE เท่านั้น** (agent `backend`):

1. #5 Guestbook: length limit ใน `db.ts` · `LIMIT 50` · honeypot ที่ route · `scripts/guestbook-delete.mjs <id>`
2. #6 Contact: length limit · response 201 ไม่มี `email`
   - **เพิ่มจาก D10 (รอบ 2, หลังเขียน handoff นี้):** script อ่าน/ลบข้อความ Contact + ลบของเก่ากว่า 90 วัน · ไม่มี endpoint สาธารณะ · OPEN_LOOPS L10
3. คงสัญญา error API (`NOT_IMPLEMENTED` → 501 · POST error → 400 · GET error → 500 · สำเร็จ → 201 · guestbook GET → `{ entries: [...] }`)
4. เทสต์ใน `tests/`: เกิน limit → 400 · honeypot → ไม่บันทึก · contact 201 ไม่มี key `email` · `npm test` + `npm run test:labs` ต้องผ่าน
5. Lab 05: call FE ตรวจฟอร์มตาม README ของ Lab 05 · เปิด PR อ้าง `Closes #5` `Closes #6`

**ห้ามแตะ**: `src/pages/*.astro`, `src/layouts/`, `src/components/`, `src/styles/` (Claude `frontend`) · `docs/DECISIONS.md` (เสนอเปลี่ยนผ่าน handoff กลับ)

จบงาน: อัปเดต STATUS / OPEN_LOOPS · เขียน `docs/handoffs/05-opencode-to-claude.md` (ค่า limit จริง · response ที่เปลี่ยน) · **commit ก่อนสลับกลับ**

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md`
- [x] `docs/DECISIONS.md` (D1–D9 · ตาราง Lab 03)
- [x] อื่น ๆ: `docs/fe-be-contract-check.md`

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = **OpenCode** (Lab 05) จนกว่าจะมี `05-opencode-to-claude.md`
