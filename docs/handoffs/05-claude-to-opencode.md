# Handoff: Claude → OpenCode

> ใช้เมื่อสลับ harness / บทบาท — **อย่าเล่าปากเปล่าแทนไฟล์นี้**

Timestamp: 2026-09-25 11:20 +07:00  
Task: Lab 05 BE — ทำเกณฑ์ความปลอดภัย Guestbook / Contact ตาม D5–D6 (`docs/DECISIONS.md`) · OPEN_LOOPS L2, L3  
Status: NEEDS_REVIEW (ส่งต่อให้ implement)

## What changed

- Lab 02 ปิดแล้ว: `docs/DEBATE.md` (Brand / UX / Devil) → `docs/DECISIONS.md` D1–D9 (commit `18138c1`)
- `docs/PROFILE.md`: แก้ `## Headline` + เพิ่มบรรทัดใน `## Tone` · **ไม่เปลี่ยนชื่อ heading** · parser ไม่ต้องแก้
- ฝั่ง Claude ยังไม่ได้แตะ `src/lib/db.ts` หรือ `src/pages/api/*` เลย

## Files

- อ่าน: `docs/DECISIONS.md` (D5, D6 + "สิ่งที่เลื่อนออก") · `docs/DEBATE.md` หัวข้อ `## Devil's Advocate` R1–R3 · `docs/OPEN_LOOPS.md` L2–L3
- ไฟล์ที่คาดว่าจะแก้ (ของ OpenCode): `src/lib/db.ts` · `src/pages/api/guestbook.ts` · `src/pages/api/contact.ts` · เทสต์ใน `tests/` (ไม่ใช่ `tests/labs/`)

## Verification

- Unit / smoke: PASS — `npm test` 2 files / 4 tests (ก่อน handoff)
- Labs (`npm run test:labs`): PASS — `lab05-api.test.ts` 2 tests (ก่อน handoff)
- Manual / localhost: NOT_RUN

## Assumptions to challenge

1. **ไม่ echo email ควรทำที่ชั้น API ไม่ใช่ `db.ts`** — `tests/labs/lab05-api.test.ts:25` คาดหวัง `insertContact()` คืน `row.email` · แนะนำให้ `contact.ts` ตัด `email` ออกจาก JSON 201 แทน (แตะสัญญา FE ↔ BE: ตอนนี้ `contact.astro` ไม่ได้ใช้ field email จาก response — ยืนยันอีกที)
2. **ค่าจำกัดที่เสนอ** (ปรับได้ แต่บันทึกค่าจริงไว้ในรายงาน): guestbook `name` ≤ 40 ตัวอักษร · `message` ≤ 500 · contact `name` ≤ 80 · `message` ≤ 2000 · `listGuestbook` คืนล่าสุด ≤ 50 แถว — ถ้าเห็นว่าควรต่างจากนี้ ให้เขียนเหตุผล
3. **Honeypot**: เสนอ field ชื่อ `website` — ถ้ามีค่า ให้ตอบ 201 แบบไม่บันทึก (บอตไม่รู้ว่าโดนกรอง) · FE จะเพิ่ม input ที่ซ่อนไว้ตามชื่อที่ BE ยืนยัน
4. **วิธีลบข้อความ**: v1 ไม่มี login/admin UI (Out of scope) → เสนอเป็น script เช่น `node scripts/guestbook-delete.mjs <id>` ที่ใช้ `DATA_DIR` เดียวกัน · ห้ามเปิด DELETE endpoint สาธารณะโดยไม่มี auth
5. Error message ที่ throw จาก validation ต้องไม่มี SQL / stack trace — FE จะแปลงเป็นข้อความเป็นมิตรเองอยู่แล้ว แต่อย่าพึ่งพาข้อนั้น

## Request to next agent

**Implement BE เท่านั้น** (agent `backend` ใน `.opencode/agents/`):

1. L2 Guestbook: length limit ฝั่ง server (`db.ts`) · `LIMIT` ใน `listGuestbook` · honeypot · script ลบข้อความ
2. L3 Contact: length limit + ไม่ส่ง `email` กลับใน response 201
3. คงสัญญา error API เดิม (`NOT_IMPLEMENTED` → 501 · POST error → 400 · GET error → 500 · สำเร็จ → 201 + row · guestbook GET → `{ entries: [...] }`)
4. เพิ่มเทสต์ครอบ limit / honeypot / email ไม่หลุด · `npm test` + `npm run test:labs` ต้องผ่าน

**ห้ามแตะ**: `src/pages/*.astro`, `src/layouts/`, styles (ของ Claude `frontend` — งาน `innerHTML` → `textContent` ฝั่ง FE จะทำใน Lab 04) · `docs/DECISIONS.md` (ถ้าต้องเปลี่ยนการตัดสินใจ ให้เขียนเป็นข้อเสนอใน handoff กลับ)

จบงาน: อัปเดต STATUS / OPEN_LOOPS · เขียน `docs/handoffs/05-opencode-to-claude.md` ระบุชื่อ honeypot field, ค่า limit จริง และการเปลี่ยนแปลง response · commit ก่อนสลับกลับ

## Canonical state updated

- [x] `docs/STATUS.md`
- [x] `docs/OPEN_LOOPS.md`
- [x] `docs/DECISIONS.md` (D1–D9 — commit `18138c1`)
- [ ] อื่น ๆ: —

## Single-writer note

Writer รอบถัดไปของ STATUS/OPEN_LOOPS = OpenCode (จนกว่าจะมี handoff กลับ `05-opencode-to-claude.md`)
