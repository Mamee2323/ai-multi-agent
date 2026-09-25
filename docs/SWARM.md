# Swarm Log — Lab 05 guestbook/API readiness

> Swarm รอบแรกของ Lab 05 · harness = OpenCode (`backend`) · skill = `public-site-safe`
> เพดาน 20 turns — **หยุดเพราะ done ก่อนเพดาน**

- Run at: 2026-09-25 15:18–15:25 +07:00
- Turns used: **7 / 20**
- Outcome: **DONE — ทุก done criterion ผ่าน ไม่มีช่องว่างคงค้างจาก swarm นี้**

## Done criteria

| Criterion | ผล | หลักฐาน |
|---|---|---|
| `npm run test:labs` เขียว | ✅ | `lab05-api.test.ts` 2/2 (insertContact persist · guestbook roundtrip) |
| ส่งฟอร์ม guestbook/contact demo บน localhost ได้ | ✅ | `npm run dev` → สัญญา API ครบทุก branch (ตารางด้านล่าง) · หน้า `/`, `/guestbook`, `/contact` ตอบ 200 |

## Demo บน localhost (สัญญา API ตรงตาม handoff 04 / D5–D6)

| เคส | Endpoint | ผลจริง |
|---|---|---|
| valid | POST `/api/guestbook` | 201 + row JSON (`{id,name,message,created_at}`) |
| honeypot (`website` มีค่า) | POST guestbook + contact | 201 `{ok:true}` · **ไม่บันทึก** (ยืนยันด้วย GET count คงที่) |
| over-limit (name 50 > 40) | POST `/api/guestbook` | 400 `{"error":"bad request"}` — ไม่ leak ข้อความดิบ |
| valid | POST `/api/contact` | 201 `{id,name,created_at}` — **ไม่มี key `email`** |
| invalid email | POST `/api/contact` | 400 `{"error":"bad request"}` |
| GET list | GET `/api/guestbook` | 200 `{entries:[...]}` |
| UTF-8 ไทย | POST + GET | roundtrip **exact match** (Node fetch เทียบ string ตรง 100%) |
| หน้าเว็บ | `/` `/guestbook` `/contact` | 200 ทั้งหมด |
| script ลบ (M6/D10) | `scripts/guestbook-delete.mjs <id>` | ลบ id 3–5 (แถว demo) สำเร็จ · DB กลับสู่สถานะก่อน demo |

## หมายเหตุ / gaps

- ส่งฟอร์มระดับ **API contract ยืนยันครบแล้ว** แต่การคลิกฟอร์มจริงในเบราว์เซอร์ (client-side fetch ของ `guestbook.astro` / `contact.astro`) ยังไม่ได้ทำใน swarm นี้ — เป็นขอบเขต **Lab 06 QA (Claude/Playwright)** ตาม ownership ไม่ใช่ช่องว่างของ BE
- mojibake ที่เห็นระหว่าง demo เป็น display ของ PowerShell console เท่านั้น — ยืนยันแล้วว่า storage เก็บ UTF-8 ถูกต้อง (roundtrip exact match)
- ไม่มีการแก้โค้ดใน swarm นี้ — งาน implement เสร็จและ merge ไปแล้วใน PR #10 (`7bf070e`) · swarm นี้คือการ verify ปลายทาง + สาธิตสัญญา

## กติกาที่ถือตลอดรอบ

- ไม่แก้ไฟล์ test · ไม่ commit/print secret · ไม่เคลม deploy (demo = localhost เท่านั้น) · ไม่ใช้ MCP เป็นท่อ
---

# รอบ 2 — ฟอร์มจริงในเบราว์เซอร์ (Claude `frontend` + subagent `reviewer`)

> ปิดช่องว่างจากรอบ 1 ("การคลิกฟอร์มจริงในเบราว์เซอร์ยังไม่ได้ทำ") · skill = `public-site-safe` · ไม่แก้โค้ด / เทสต์

- Run at: 2026-09-25 15:20–15:30 +07:00
- Ceiling: 20 turns (นับ tool round ของ Claude + tool call ของ subagent)
- Turns used: **15 / 20** — หยุดเพราะ done ก่อนเพดาน
- Outcome: **DONE**

## Done criteria

| Criterion | ผล | หลักฐาน |
|---|---|---|
| `npm test` + `npm run test:labs` เขียว | ✅ | 3 files / 13 tests · labs 1 file / 2 tests |
| ส่งฟอร์ม guestbook/contact demo ในเบราว์เซอร์จริงบน localhost | ✅ | `astro dev` + Playwright (Edge ที่มีในเครื่อง) · `DATA_DIR` ชี้ scratch นอก repo |
| ไม่มี error ดิบ / HTML ของผู้ใช้หลุดขึ้นหน้า | ✅ | `main` ไม่มี `bad request`/`server error`/SQL · `<b>` ในข้อความ render เป็นตัวอักษร (0 element) |

## Log

| Turn | Who | What |
|---|---|---|
| 1–2 | Claude | อ่าน DECISIONS/STATUS/SWARM รอบ 1 · `test:labs` เขียวอยู่แล้ว → ตั้ง done criteria ฝั่ง FE |
| 3 | Claude | start dev server (scratch DB) · `npm test` 13/13 |
| 3–7 (ขนาน) | `reviewer` subagent (5 tool calls, read-only) | เทียบข้อความทุก status ของฟอร์มกับ API · maxlength = limit server ทุกช่อง · ไม่มี `innerHTML` กับข้อมูลผู้ใช้ · **ไม่มี Must** |
| 4–6 | Claude | Playwright MCP หลุด → เปลี่ยนไปใช้ `@playwright/test` script · browser ไม่ได้ติดตั้ง |
| 12 | Claude | ใช้ `channel: 'msedge'` (ไม่ดาวน์โหลดลงเครื่องที่ใช้ร่วม) → รันครบทุกเคส |
| 13 | Claude | ยืนยัน DB: contact ที่บันทึก 1 แถว (honeypot ไม่บันทึก) · `test:labs` ซ้ำ |
| 14–15 | Claude | เขียน SWARM / STATUS / OPEN_LOOPS · commit |

## ผลในเบราว์เซอร์

| เคส | API | ข้อความบนหน้า |
|---|---|---|
| Guestbook ผ่าน | POST 201 → GET 200 · list 0 → 1 | "ฝากข้อความแล้วค่ะ ขอบคุณที่แวะมาทักทายนะคะ" |
| Guestbook honeypot | POST 201 · list 1 → 1 (reload ยัง 1) | ข้อความสำเร็จเดิม (ไม่บอกบอท) |
| Guestbook เกิน limit (ลบ `maxlength` เพื่อยิงถึง server) | POST 400 | "ฝากข้อความไม่สำเร็จค่ะ ลองเช็คความยาวข้อความ…" |
| Contact ผ่าน | POST 201 | "ได้รับแล้วค่ะ ฉันจะแวะอ่านเป็นระยะ ๆ นะคะ" (D5) |
| Contact อีเมลผิด | ไม่ยิง (ตรวจฝั่ง client) | "รบกวนกรอกชื่อ อีเมลที่ถูกต้อง และข้อความให้ครบก่อนนะคะ" |
| Contact honeypot | POST 201 · ไม่บันทึก | ข้อความสำเร็จเดิม |
| UTF-8 ไทย + emoji | roundtrip ตรง | render ด้วย `textContent` |

## Gaps (ไม่บล็อก)

- **Should (BE · OpenCode):** POST ที่พังฝั่ง server (DB/disk) ตอบ 400 ตามสัญญาเดิม → ผู้ใช้เห็น "เช็คความยาว" แทน "ระบบขัดข้อง" (`api/guestbook.ts:44`, `api/contact.ts:33`) → OPEN_LOOPS L14
- **Nice:** ถ้า GET หลังโพสต์สำเร็จพัง สถานะฟอร์มบอกสำเร็จ แต่ list บอกโหลดไม่ได้ — ยอมรับได้
- สคริปต์ครั้งนี้อยู่ใน scratchpad ไม่ได้ commit — ย้ายเป็น E2E ถาวรใน `playwright/` ใน Lab 06 (L12)
- Playwright MCP หลุดระหว่างรอบ + browser ของ Playwright ไม่ได้ติดตั้ง → Lab 06 ต้อง `npx playwright install` หรือใช้ `channel: 'msedge'`
