# Handoff: Claude → OpenCode

> ใช้เมื่อสลับ harness / บทบาท — **อย่าเล่าปากเปล่าแทนไฟล์นี้**
> รวม handoff เดิม `05-claude-to-opencode.md` (เขียนก่อน Lab 04) เข้าไฟล์นี้แล้ว · แก้รอบ 2 หลัง D10–D14

Timestamp: 2026-09-25 14:20 +07:00  
Task: Lab 05 BE — ปิด issue #5 (Guestbook, D6) และ #6 (Contact, D5) + script อ่าน/ลบ Contact (D10) · OPEN_LOOPS L2, L3, L10  
Status: NEEDS_REVIEW (FE เสร็จ — ส่งต่อให้ BE implement)

## What changed

- Lab 02: `docs/DEBATE.md` → `docs/DECISIONS.md` D1–D9 + รอบ 2 D10–D14 · `docs/PROFILE.md` แก้ `## Headline` + `## Tone` (ไม่เปลี่ยนชื่อ heading)
- Lab 03: issues #1–#6 (gh) · #8, #9 (GitHub MCP) · ร่าง body ใน `issue-bodies/`
- Lab 04 (branch `lab-04-frontend`, PR #7): UI 5 หน้า ธีมสว่าง nav ไทย · Guestbook render ด้วย `textContent` · ฟอร์มทั้งสองส่ง honeypot `website` + เช็ค `res.ok` + ไม่แสดง error ของ server · JSON-LD `Person` เฉพาะ field ใน D8
- Lab 04 รอบ 2 (FE ตาม D12–D14):
  - D12: `FALLBACK` ใน `src/lib/profile.ts` = ชื่อ "13หมาหมี" + headline/bio/interests ว่าง · หน้า Home/Interests + JSON-LD ซ่อนส่วนที่ว่าง (ไม่มี "Personal branding site" / "coming soon" แล้ว)
  - D13: `public/robots.txt` กัน `/api/` และ `/guestbook` (`/guestbook` ยังมี `noindex`)
  - D14: CSS `@media (max-width: 480px)` ลด padding · ตรวจ 360px ทั้ง 5 หน้าไม่มี scroll แนวนอน
- **ฝั่ง Claude ไม่ได้แตะ** `src/lib/db.ts`, `src/pages/api/*`, `tests/` (แตะใน `src/lib/` เฉพาะ `FALLBACK` ของ `profile.ts` — parser เหมือนเดิม)

## Files

- อ่านก่อน: **`docs/fe-be-contract-check.md`** (OpenCode เขียนเองตอน Lab 04 — ไม่มี mismatch ฝั่ง FE) · `docs/DECISIONS.md` D5, D6, D10 · issue #5, #6, #9 · `docs/DEBATE.md` `## Devil's Advocate` R1–R3
- ฟอร์ม FE (อ่านอย่างเดียว): `src/pages/contact.astro`, `src/pages/guestbook.astro`
- ไฟล์ที่คาดว่าจะแก้ (ของ OpenCode): `src/lib/db.ts` · `src/pages/api/guestbook.ts` · `src/pages/api/contact.ts` · `scripts/guestbook-delete.mjs` · script อ่าน/ลบ contact (ใหม่ · D10) · เทสต์ใน `tests/` (ไม่ใช่ `tests/labs/`)

## Verification

- Unit / smoke: PASS — `npm test` 2 files / 4 tests
- Build: PASS — `npm run build`
- Labs (`npm run test:labs`): PASS — 2 tests (ยังไม่มีเทสต์ครอบ limit/honeypot)
- Manual / localhost (build + `node dist/server/entry.mjs`): 5 หน้า + `/robots.txt` ตอบ 200 · รันจาก cwd ที่ไม่มี `docs/PROFILE.md` → หน้าแรกแสดงแค่ชื่อ + CTA, JSON-LD มีแค่ `name`/`url` · Playwright 360px: `scrollWidth <= clientWidth` ทุกหน้า · nav ตัดเป็น 2 บรรทัด

## Assumptions to challenge

ค่าด้านล่าง **ยืนยันแล้วใน `docs/fe-be-contract-check.md`** — FE ใช้ค่าเหล่านี้เป็น `maxlength` แล้ว ถ้า BE เปลี่ยนต้องแจ้งกลับ

1. Honeypot `website` — เช็คที่ชั้น route · มีค่า → 201 + `{ ok: true }` ไม่บันทึก
2. Limit (นับหลัง trim): guestbook name 40 / message 500 · contact name 80 / email 120 / message 2000 · `listGuestbook` `LIMIT 50` คง `ORDER BY created_at DESC`
3. ตัด `email` ที่ `contact.ts` ไม่ใช่ `db.ts` — `tests/labs/lab05-api.test.ts:25` คาด `insertContact()` คืน `row.email` · FE ไม่อ่าน body ของ 201
4. ลบข้อความ (guestbook + contact) = script ใช้ `DATA_DIR` เดียวกัน · ห้าม DELETE / list endpoint สาธารณะ
5. Error ที่ throw ต้องสั้นและไม่มี SQL / stack trace (FE ไม่แสดงอยู่แล้ว แต่อย่าพึ่งพา)
6. Issue #9 ซ้อน #5/#6 และขอ **rate limit** ซึ่งยังไม่มี D-id — อย่า implement rate limit จนกว่าจะมี decision · ปิด #9 เป็น duplicate หรือเสนอ decision กลับผ่าน handoff
7. FE ไม่มีข้อความสถานะเฉพาะสำหรับ 429 — ถ้า BE เพิ่ม status ใหม่ ฟอร์มจะแสดงข้อความ error ทั่วไป

## Request to next agent

**Implement BE เท่านั้น** (agent `backend`):

1. #5 Guestbook: length limit ใน `db.ts` · `LIMIT 50` · honeypot ที่ route · `scripts/guestbook-delete.mjs <id>`
2. #6 Contact: length limit · response 201 ไม่มี `email`
3. D10 (L10): script อ่าน/ลบข้อความ Contact + ลบของเก่ากว่า 90 วัน · ไม่มี endpoint สาธารณะ
4. คงสัญญา error API (`NOT_IMPLEMENTED` → 501 · POST error → 400 · GET error → 500 · สำเร็จ → 201 · guestbook GET → `{ entries: [...] }`)
5. เทสต์ใน `tests/`: เกิน limit → 400 · honeypot → ไม่บันทึก · contact 201 ไม่มี key `email` · `npm test` + `npm run test:labs` ต้องผ่าน
6. Lab 05: call FE ตรวจฟอร์มตาม README ของ Lab 05 · เปิด PR อ้าง `Closes #5` `Closes #6`

**ห้ามแตะ**: `src/pages/*.astro`, `src/layouts/`, `src/components/`, `src/styles/`, `public/`, `src/lib/profile.ts` (Claude `frontend`) · `docs/DECISIONS.md` (เสนอเปลี่ยนผ่าน handoff กลับ)

จบงาน: อัปเดต STATUS / OPEN_LOOPS · เขียน `docs/handoffs/05-opencode-to-claude.md` (ค่า limit จริง · response ที่เปลี่ยน · วิธีรัน script) · **commit ก่อนสลับกลับ**

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md` (ปิด L8, L11 · L12 ตรวจเบื้องต้นแล้ว)
- [ ] `docs/DECISIONS.md` — ไม่มี decision ใหม่รอบนี้
- [x] อื่น ๆ: `docs/fe-be-contract-check.md` (Lab 04 รอบแรก)

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = **OpenCode** (Lab 05) จนกว่าจะมี `05-opencode-to-claude.md`
