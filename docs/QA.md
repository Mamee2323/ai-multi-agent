# QA — Personal Site

> Lab 06 · Claude `frontend` · skill `public-site-safe` · 2026-09-25 15:30–15:45 +07:00

## วิธีทดสอบ

- Server: `astro dev --port 4322` · `DATA_DIR` ชี้ scratch นอก repo (ไม่แตะ `./data`)
- เครื่องมือ: **Playwright MCP** (`browser_navigate` + `browser_run_code_unsafe`) — เบราว์เซอร์จริง ไม่ใช่ unit test
- ข้อจำกัดที่เจอ: MCP รีเซ็ตหน้าเป็น `about:blank` ระหว่าง tool call → screenshot แยก call ได้ภาพขาว · แก้โดยรันทุก step ใน `browser_run_code_unsafe` call เดียว
- Astro dev toolbar แทรก `<h1>` ของตัวเอง → locator ใช้ `main h1` และซ่อน `astro-dev-toolbar` ก่อน screenshot (ไม่มีใน production build)

## E2E Playwright

| # | Step | Result |
|---|---|---|
| 1 | Home `/` — status | **Pass** — 200 |
| 2 | Home — `h1` = Name จาก PROFILE | **Pass** — "13หมาหมี 13Mamee" |
| 3 | Home — Headline จาก PROFILE | **Pass** — "คนธรรมดาที่ชอบเรียนรู้ — …" ปรากฏ 1 ครั้ง |
| 4 | คลิกเมนู "เกี่ยวกับฉัน" → `/about` | **Pass** — 200 · h1 "เกี่ยวกับฉัน" |
| 5 | คลิกเมนู "สิ่งที่สนใจ" → `/interests` | **Pass** — 200 · h1 "สิ่งที่ฉันสนใจ" |
| 6 | คลิกเมนู "ติดต่อ" → `/contact` | **Pass** — 200 · h1 "ติดต่อฉัน" |
| 7 | คลิกเมนู "สมุดเยี่ยม" → `/guestbook` | **Pass** — 200 · h1 "สมุดเยี่ยม" |
| 8 | `/does-not-exist` | **Pass** — 404 (คาดไว้) |
| 9 | Contact — อีเมลผิด `not-an-email` | **Pass** — ไม่ยิง POST (0 request) · "รบกวนกรอกชื่อ อีเมลที่ถูกต้อง และข้อความให้ครบก่อนนะคะ" |
| 10 | Contact — demo `demo@example.com` | **Pass** — POST 201 `{id, name, created_at}` (ไม่ echo email · D5) · "ได้รับแล้วค่ะ ฉันจะแวะอ่านเป็นระยะ ๆ นะคะ" · ฟอร์ม reset |
| 11 | Guestbook — demo ไทย + emoji + `<b>x</b>` | **Pass** — POST 201 · "ฝากข้อความแล้วค่ะ …" · list 0 → 1 · `<b>` render เป็นตัวอักษร (0 element) |
| 12 | 360px — ทั้ง 5 หน้า | **Pass** — `scrollWidth` = `clientWidth` (345/345) ไม่มี scroll แนวนอน (L12) |
| 13 | Keyboard — Tab ครั้งแรก | **Pass** — โฟกัส skip link "ข้ามไปที่เนื้อหา" |
| 14 | Console | **Pass** — มีแค่ 404 ของ step 8 (คาดไว้) |
| 15 | `playwright/smoke.spec.ts` (repo) | **Fail (คาดการณ์ · ไม่ได้รัน)** — หา label `Name`/`Email`/`Message` แต่หน้าเป็นไทย → ดู action item P0-1 |

Screenshots (`docs/screenshots/`):

- `01-home.png` — Home desktop 1280
- `02-contact-success.png` — Contact หลังส่งสำเร็จ
- `03-guestbook.png` — Guestbook หลังฝากข้อความ
- `04-contact-360.png` — Contact มือถือ 360px

## a11y Debate

ข้อมูลที่วัดได้ (Contact, desktop): `lang="th"` · heading H1→H2→H2 · label `for` ครบทุกช่อง · email มี `aria-describedby` → hint · status `role="status" aria-live="polite"` · honeypot อยู่ใน `aria-hidden` + `tabindex="-1"` · `:focus-visible` 3px `#2563eb` offset 3px · contrast: nav `#5b4f66` ≈ 7.6:1 · label 15.2:1 · hint 7.6:1 · ปุ่ม (ขาวบน `#b0205a`) 5.9:1 · footer 7.3:1 — **ผ่าน AA ทุกจุดที่วัด**

### Advocate

- **ข้อผิดพลาดไม่ชี้ช่อง:** submit ไม่ผ่าน → ข้อความรวม "กรอกชื่อ อีเมล และข้อความให้ครบ" ไม่บอกว่าช่องไหน · ไม่มี `aria-invalid` ในช่องที่ผิด (วัดแล้ว: ทุกช่อง `-`) · พึ่ง bubble ของ `reportValidity()` ซึ่ง screen reader บางตัวอ่านไม่ครบ
- **ไม่บอกว่าช่องไหนบังคับ:** label ไม่มีเครื่องหมาย/คำว่า "จำเป็น" (มี `required` ให้ AT แต่คนสายตาปกติไม่เห็น) — ที่จริงทุกช่องบังคับ ควรบอกครั้งเดียวด้านบนฟอร์ม
- **ลำดับอ่าน:** hint อีเมลกับ status อยู่*ใต้*ปุ่มส่ง — คนใช้ screen magnifier อาจไม่เห็นผลลัพธ์หลังกดส่ง
- **E2E ภาษาไทยยังไม่มีใน repo:** `smoke.spec.ts` ใช้ label อังกฤษ → regression ด้าน label จะไม่มีใครจับได้
- ยังไม่ได้ทดสอบกับ screen reader จริง (NVDA) และยังไม่ได้รัน axe

### Pragmatist

- พื้นฐานแข็งแล้ว (label, focus, contrast, skip link, lang, live region) — **ไม่มีอะไรบล็อก ship**
- ก่อน ship: แก้ smoke spec ให้เป็นไทย (ไม่งั้น E2E ของ repo แดงตลอด = ไม่มีใครเชื่อ) · เพิ่ม `aria-invalid` ตอน submit ไม่ผ่าน (โค้ด ~5 บรรทัดใน script เดิม)
- หลัง ship: บอกช่องบังคับ · ย้าย status ไว้เหนือปุ่ม · axe + NVDA รอบเต็ม — ทำได้แต่ไม่คุ้มก่อน deploy ครั้งแรก
- ข้อความ error แยกทีละช่อง = copy ใหม่หลายชุด → รอดูว่ามีคนกรอกผิดจริงไหมก่อน

## a11y Action items

| ID | Priority | Item | เวลา | Owner |
|---|---|---|---|---|
| P0-1 | P0 | แก้ `playwright/smoke.spec.ts` ใช้ label ไทย (`ชื่อของคุณ` / `อีเมล` / `ข้อความ`) + เพิ่มเคสส่งฟอร์ม demo | 10 นาที | Claude |
| P1-1 | P1 | Contact + Guestbook: submit ไม่ผ่าน → ตั้ง `aria-invalid="true"` ช่องที่ `!validity.valid` · ล้างเมื่อแก้ | 15 นาที | Claude `frontend` |
| P1-2 | P1 | บอก "ทุกช่องจำเป็นต้องกรอก" ครั้งเดียวเหนือฟอร์ม Contact | 5 นาที | Claude `frontend` |
| P2-1 | P2 | ย้าย `#contact-status` ไว้เหนือปุ่มส่ง (หรือถัดจากปุ่มทันที ก่อน hint) | 5 นาที | Claude `frontend` |
| P2-2 | P2 | รัน axe (`@axe-core/playwright`) + NVDA ทั้ง 5 หน้า หลัง deploy | 30 นาที | Claude/Playwright |
| P2-3 | P2 | ข้อความ error แยกทีละช่อง (ชื่อ/อีเมล/ข้อความ) | 20 นาที | Claude `frontend` |

### Diff ที่เสนอ (รอยืนยันก่อนแก้)

P0-1 — `playwright/smoke.spec.ts`:

```diff
-  await expect(page.getByLabel('Name')).toBeVisible();
-  await expect(page.getByLabel('Email')).toBeVisible();
-  await expect(page.getByLabel('Message')).toBeVisible();
+  await expect(page.getByLabel('ชื่อของคุณ')).toBeVisible();
+  await expect(page.getByLabel('อีเมล')).toBeVisible();
+  await expect(page.getByLabel('ข้อความ')).toBeVisible();
```

P1-1 — `src/pages/contact.astro` (script):

```diff
     if (!form.checkValidity()) {
+      form.querySelectorAll('input:not([name=website]), textarea').forEach((el) => {
+        const f = el as HTMLInputElement;
+        if (f.validity.valid) f.removeAttribute('aria-invalid');
+        else f.setAttribute('aria-invalid', 'true'); // ค่าว่าง = false ตาม ARIA
+      });
       setStatus(MSG.invalid, 'error');
       form.reportValidity();
       return;
     }
+    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
```
