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