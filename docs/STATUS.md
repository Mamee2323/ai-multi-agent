# Project Status

> คัดลอกเป็น `docs/STATUS.md` ใน Lab 00 · อ่านทุก session · **สั้น** · single-writer ต่อรอบ  
> ดู [`COURSE.md`](../COURSE.md) ชั้น State (Hot)

Last updated: 2026-09-25 14:20 +07:00  
Updated by: Claude `frontend` (Lab 04 รอบ 2)

## Current goal

- Lab 04 FE เสร็จ รวม D12–D14 ฝั่ง FE (PR #7 รอรีวิว) → ส่งต่อ Lab 05 BE ให้ OpenCode

## Done

- Lab 00 init · Lab 01 PROFILE (parser อ่าน section หลายบรรทัดได้แล้ว — `ca5204e`)
- Lab 02: `DEBATE.md` ครบ 3 มุม (Brand Strategist · UX Critic · Devil's Advocate) + รอบ 2 จำลองทีม → D10–D14
- `DECISIONS.md` D1–D9 · PROFILE แก้ Headline + Tone ตาม D1/D2
- Lab 03: issues #1–#6 (gh) + #8 (GitHub MCP) · `## Lab 03 — MCP vs gh` ใน DECISIONS
- Lab 04: UI 5 หน้า (branch `lab-04-frontend`) ครอบ #1–#4 + D8 · `docs/fe-be-contract-check.md` (OpenCode) ไม่มี mismatch ฝั่ง FE
- Lab 04 รอบ 2: D12 FALLBACK ไทยกลาง ๆ + ซ่อน section ว่าง · D13 `public/robots.txt` · D14 CSS จอแคบ + ตรวจ 360px ไม่มี scroll แนวนอน (Playwright)

## In progress

- Handoff → OpenCode `backend`: `docs/handoffs/04-claude-to-opencode.md` (#5, #6, D10) · **writer STATUS/OPEN_LOOPS = OpenCode**

## Blocked

- —

## Next actions

1. Lab 05 (OpenCode `backend`): ปิด #5, #6 + script Contact (D10) ตาม handoff 04 · ตัดสิน #9 (rate limit ยังไม่มี D-id)
2. Review + merge PR #7 (Lab 04)

## Files changed in latest session

- `src/lib/profile.ts` (FALLBACK เท่านั้น) · `src/layouts/BaseLayout.astro` · `src/pages/{index,interests}.astro` · `src/styles/global.css` · `public/robots.txt` (ใหม่) · `docs/handoffs/04-claude-to-opencode.md`

## Notes

- Proposed vs Approved: brainstorm อยู่ใน `DEBATE.md` — สิ่งที่ปิดแล้วอยู่ใน `DECISIONS.md`
