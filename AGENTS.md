# AGENTS.md — Build AI Multi-Agent Lab (V4)

สินค้า = เว็บ personal branding (Astro SSR) ใน root นี้ · ส่วนที่เหลือคือ scaffolding คอร์ส (Labs 00–08)
ไฟล์นี้เป็นกติการ่วม Claude Code ↔ OpenCode — `CLAUDE.md` import ไฟล์นี้ (`@AGENTS.md`) อย่าคัดลอกเนื้อหาไปซ้ำ

## คำสั่ง

Node **≥ 22.12** (ต้องมี `node:sqlite` built-in — ไม่มี native DB dependency)

```powershell
npm run dev                                   # astro dev → http://localhost:4321
npm test                                      # vitest; exclude tests/labs/**
npm run test:labs                             # tests/labs/** — RED จนกว่า Lab นั้นจะเสร็จ (โดยดีไซน์)
npx vitest run tests/smoke.test.ts            # ไฟล์เดียว
npx vitest run -t "guestbook list/insert"     # เทสต์เดียวด้วยชื่อ
npm run test:e2e                              # Playwright (testDir ./playwright) — ต้องมี server รันอยู่ที่ PLAYWRIGHT_BASE_URL (default http://127.0.0.1:4321)
npm run build; npm start                      # SSR build → node ./dist/server/entry.mjs
node scripts/create-course-issues.mjs         # สร้าง issues จาก .github/course-issues/*.md
```

CI (`.github/workflows/ci.yml`) รันเฉพาะ `npm ci` → `npm test` → `npm run build` — **Lab tests และ E2E ไม่รันใน CI** ต้องรันเองก่อนส่งงาน

## จุดพลาดเชิงสถาปัตยกรรม

- **Astro SSR** `output: 'server'` + `@astrojs/node` standalone · `SITE_URL` ตั้งค่า `site` · API routes ตั้ง `prerender = false`
- **เนื้อหาโปรไฟล์มาจาก docs**: `src/lib/profile.ts` parse `docs/PROFILE.md` ตอน request ด้วย heading `## Name` / `## Headline` / `## Bio` / `## Audience` / `## Interests` — เปลี่ยนชื่อ heading = เว็บเสียเงียบ ๆ แล้ว fallback · นี่คือเหตุที่ Dockerfile copy `docs/` ลง runtime image · `FALLBACK` render สู่สาธารณะ ห้ามใส่ข้อความคอร์ส
- **SQLite singleton**: `src/lib/db.ts` cache `DatabaseSync` ระดับ module ที่ `$DATA_DIR/site.sqlite` (default `./data` · Docker = `/data` volume) — ตั้ง `DATA_DIR` **ก่อน**เรียก `getDb()` ครั้งแรก (lab tests พึ่งพา) · validation อยู่ใน `db.ts` แล้ว throw `Error`
- **สัญญา error API** (`src/pages/api/contact.ts`, `guestbook.ts`): throw message ขึ้นต้น `NOT_IMPLEMENTED` → 501 · error อื่น: POST → 400, GET → 500 · สำเร็จ → 201 + row เป็น JSON · guestbook GET คืน `{ entries: [...] }` · หน้า `contact.astro` / `guestbook.astro` ยิงด้วย client-side `fetch` — นี่คือขอบเขต FE ↔ BE ระหว่างสอง agent
- **Public-leak guard**: `tests/public-site.test.ts` fail ถ้า markup ที่ render มี `lab N` / `แล็บ` — frontmatter และ HTML comment ถูก strip ก่อนเช็ค ข้อความคอร์สใส่ได้เฉพาะ comment หรือไฟล์ `.ts`
- **MCP config ยังไม่มีจริง**: copy `opencode.json.example` → `opencode.json` และ `.mcp.json.example` → `.mcp.json` (ทำใน Lab 00 · ต้องมี `GITHUB_PERSONAL_ACCESS_TOKEN`)

## สี่เสาหลัก

1. **Multi-Agent** — หน้าที่และความจำแยก (`frontend`/`reviewer` ใน `.claude/agents/` · `backend` ใน `.opencode/agents/` + คนละ CLI)
2. **Sub-Agent** — spawn ใช้แล้วทิ้ง; สิ่งที่ต้องจำต่อ = เขียนลง `docs/` เท่านั้น
3. **ประสานงาน** — handoff ผ่าน docs / issues / PR / review สำคัญกว่าแชทเดียว
4. **Swarm** — หลายตัวได้ เพดาน **20 turns** แล้วสรุปหยุด

### Ownership

| Artifact | Owner |
|---|---|
| UI (`src/pages/*.astro`, `src/layouts/`, styles) | Claude · agent `frontend` |
| API + SQLite (`src/lib/db.ts`, `src/pages/api/*`) | OpenCode · agent `backend` |
| E2E / a11y (`playwright/`, `docs/QA.md`) | Playwright MCP + either CLI |
| Profile / debate docs | Claude (Lab 01–02 · subagents) |
| Hot state (`STATUS.md` · `OPEN_LOOPS.md`) | ผู้ถืองานรอบนั้น (single-writer) |
| Review / Ship artifacts | Lab 07 · Lab 08 |

### Start-of-session (≤ 8 บรรทัด)

1. อ่าน `docs/STATUS.md` + `docs/OPEN_LOOPS.md` (ยังไม่มี = สร้างจาก `.example` ตาม Lab 00)
2. มี handoff ส่งถึงคุณใน `docs/handoffs/` — อ่านด้วย
3. สรุปให้คนดู: Current goal · Latest D-id · Open loops · Blockers
4. ข้อมูลขัดแย้งระหว่างไฟล์ — หยุดวิเคราะห์ก่อนแก้โค้ด
5. ห้ามสมมุติว่ารู้สิ่งที่เกิดในแชท CLI อีกฝั่ง ถ้าไม่มีเขียนใน `docs/`

จบงานที่เปลี่ยนสถานะ → อัปเดต STATUS / OPEN_LOOPS · สลับ harness → เขียน handoff ตาม `docs/handoffs/TEMPLATE.md`

### Single-writer & ความจำ

- `STATUS.md` / `OPEN_LOOPS.md` มี writer คนเดียวต่อรอบ สลับ Claude ↔ OpenCode หลัง commit หรือหลังเขียน handoff — **commit ก่อนสลับ harness เสมอ**
- ความจำร่วม = `docs/` + git + PR · ความจำ agent-local = เซสชันของแต่ละ CLI
- Harness persistent: Claude = `memory: project` (`.claude/agent-memory/`) · OpenCode = AGENTS.md + agent file + **resume session** — ห้ามสร้าง memory bus เอง
- `DEBATE.md` = ยังไม่ปิด · `DECISIONS.md` = อนุมัติแล้วเท่านั้น

### Cross-harness & skills

- Call ข้าม harness ได้แบบ headless one-shot: ฝั่ง OpenCode เรียก `claude -p` · ฝั่ง Claude เรียก `opencode run` — ท่อ = ไฟล์ใน `docs/`
- ฝั่งที่ถูกเรียกเขียนได้**เฉพาะไฟล์รายงาน**ที่ prompt ระบุ (เช่น `docs/review-*.md`) — ห้ามแตะไฟล์ ownership ของผู้เรียก
- ห้าม daemon/loop ถาวร · ห้าม JSON orchestration bus · MCP ไม่ใช่ท่อส่งงานระหว่าง CLI
- Skills โปรเจกต์อยู่ที่ `.claude/skills/` และ `.opencode/skills/` — ใช้ **`public-site-safe`** ทุกงาน implement / swarm / ship

## ห้าม

- Commit `.env`, `.mcp.json` (ถ้า gitignore), PAT, Coolify webhook, `node_modules`
- เคลม deploy สำเร็จโดยไม่มี URL ตอบ HTTP 200 จริง
- Leak stack trace / SQL error ให้ผู้ใช้เว็บ
- PR เข้า `Onto-IQ/*` — เข้า learner repo เท่านั้น
- บังคับ tmux บน Windows · ปล่อย swarm เกิน 20 turns โดยไม่สรุปหยุด

## Labs

[`SETUP.md`](./SETUP.md) → [`labs/lab-00-project-init`](./labs/lab-00-project-init/README.md) → [`labs/README.md`](./labs/README.md)

ลำดับ: 00 Init → 01 Interview → 02 Debate → 03 Issues → 04 FE → 05 BE → 05b Swarm(≤20) → 06 QA → 07 Review → 08 Ship