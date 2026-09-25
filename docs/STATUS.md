# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 15:05 +07:00  
Updated by: OpenCode `backend` (Lab 05)

## Current goal

- Lab 05 BE เสร็จบน branch `lab-05-backend` (L2, L3, L10 · #5, #6) — รอ PR + review → ถัดไป Lab 06 QA

## Done

- Lab 00 init · Lab 01 PROFILE (parser อ่าน section หลายบรรทัดได้แล้ว — `ca5204e`)
- Lab 02: `DEBATE.md` ครบ 3 มุม + D10–D14 · `DECISIONS.md` D1–D9
- Lab 03: issues #1–#6 + #8 · `## Lab 03 — MCP vs gh` ใน DECISIONS
- Lab 04: UI 5 หน้า + D12–D14 (PR #7 — **ยังไม่ merge** · branch `lab-05-backend` merge `lab-04-frontend` ไว้แล้วเพื่อทดสอบร่วม)
- Lab 05 BE (OpenCode): M1–M6 จาก `docs/fe-be-contract-check.md` ปิดครบ —
  - M2 length limit ฝั่ง server ใน `db.ts` (guestbook 40/500 · contact 80/120/2000)
  - M3 `listGuestbook` `LIMIT 50` (ORDER BY created_at DESC, id DESC)
  - M1 honeypot `website` → 201 `{ok:true}` ไม่บันทึก (ทั้งสอง endpoint)
  - M4 contact 201 ไม่ echo `email` → `{id, name, created_at}`
  - M5 error body เป็น generic (`bad request` / `server error`) + log ฝั่ง server
  - M6 `scripts/guestbook-delete.mjs <id>` + `scripts/contact-manage.mjs list|delete|purge [--days 90]` (D10)
  - เทสต์ใหม่ `tests/api-safeguards.test.ts` (9 tests · รันใน CI) · smoke จริงผ่าน curl (201/400/200 ตรงสัญญา)

## In progress

- — (รอ review/merge)

## Blocked

- —


## Next actions

1. รีวิว + merge PR #7 (Lab 04 FE) ขึ้น main แล้ว rebase/merge PR Lab 05 (`lab-05-backend`)
2. ปิด issues #5, #6 เมื่อ merge
3. Lab 06 QA (Claude/Playwright): E2E ใน `playwright/` + ตัดสิน #9 (rate limit ยังไม่มี D-id)

## Files changed in latest session

- `src/lib/db.ts` · `src/pages/api/{contact,guestbook}.ts` · `scripts/{guestbook-delete,contact-manage}.mjs` (ใหม่) · `tests/api-safeguards.test.ts` (ใหม่) · `docs/handoffs/05-opencode-to-claude.md` (ใหม่)

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
- **writer STATUS/OPEN_LOOPS รอบถัดไป = Claude** (หลัง commit + handoff 05 นี้)
