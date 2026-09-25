# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 15:12 +07:00  
Updated by: OpenCode `backend` (merge + close issues)

## Current goal

- Lab 04 + Lab 05 **merge ขึ้น main แล้ว** — ถัดไป Lab 06 QA (Claude/Playwright)

## Done

- Lab 00 init · Lab 01 PROFILE (parser อ่าน section หลายบรรทัดได้แล้ว — `ca5204e`)
- Lab 02: `DEBATE.md` ครบ 3 มุม + D10–D14 · `DECISIONS.md` D1–D9
- Lab 03: issues #1–#6 + #8 · `## Lab 03 — MCP vs gh` ใน DECISIONS
- Lab 04: UI 5 หน้า + D12–D14 — **PR #7 merged** (`ebc9573`)
- Lab 05 BE (OpenCode): M1–M6 จาก `docs/fe-be-contract-check.md` ปิดครบ — **PR #10 merged** (`7bf070e`)
  - M2 length limit ฝั่ง server ใน `db.ts` (guestbook 40/500 · contact 80/120/2000)
  - M3 `listGuestbook` `LIMIT 50` (ORDER BY created_at DESC, id DESC)
  - M1 honeypot `website` → 201 `{ok:true}` ไม่บันทึก (ทั้งสอง endpoint)
  - M4 contact 201 ไม่ echo `email` → `{id, name, created_at}`
  - M5 error body เป็น generic (`bad request` / `server error`) + log ฝั่ง server
  - M6 `scripts/guestbook-delete.mjs <id>` + `scripts/contact-manage.mjs list|delete|purge [--days 90]` (D10)
  - เทสต์ใหม่ `tests/api-safeguards.test.ts` (9 tests · รันใน CI) · smoke จริงผ่าน curl (201/400/200 ตรงสัญญา)
- Issues: #5, #6 ปิดโดย PR #10 (state: completed) · #9 ปิดเป็น superseded (not_planned · rate limit ไปตัดสินที่ L13)

## In progress

- — (รอเริ่ม Lab 06)

## Blocked

- —

## Next actions

1. Lab 06 QA (Claude/Playwright): E2E ใน `playwright/` + ตัดสิน #9→L13 (rate limit ยังไม่มี D-id) ที่ review
2. ตรวจ a11y + มือถือ 360px ทั้ง 5 หน้า (L12)

## Files changed in latest session

- ไม่มีการแก้โค้ด — merge PR #7 + #10 ขึ้น main · ปิด #5, #6, #9 (comment บน #9) · อัปเดตไฟล์นี้ + OPEN_LOOPS

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- **writer STATUS/OPEN_LOOPS รอบถัดไป = Claude** (Lab 06 QA — commit docs นี้แล้ว ไม่ต้องเขียน handoff ใหม่ เพราะ `05-opencode-to-claude.md` ยังตรงสถานะจริง)
