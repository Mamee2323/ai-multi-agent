import { test, expect } from '@playwright/test';

test('home renders nav and heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.locator('main h1')).toBeVisible();
});

test('contact page has form fields', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByLabel('ชื่อของคุณ', { exact: true })).toBeVisible();
  await expect(page.getByLabel('อีเมล', { exact: true })).toBeVisible();
  await expect(page.getByLabel('ข้อความ', { exact: true })).toBeVisible();
});

test('contact invalid email marks field and does not post', async ({ page }) => {
  await page.goto('/contact');
  let posts = 0;
  page.on('request', (r) => { if (r.method() === 'POST') posts++; });
  await page.getByLabel('ชื่อของคุณ', { exact: true }).fill('Demo QA');
  await page.getByLabel('อีเมล', { exact: true }).fill('not-an-email');
  await page.getByLabel('ข้อความ', { exact: true }).fill('ทดสอบ');
  await page.getByRole('button', { name: 'ส่งข้อความ' }).click();
  await expect(page.getByLabel('อีเมล', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('ชื่อของคุณ', { exact: true })).not.toHaveAttribute('aria-invalid', /.*/);
  expect(posts).toBe(0);
  // Fixing the field clears aria-invalid right away (no resubmit needed)
  await page.getByLabel('อีเมล', { exact: true }).fill('demo@example.com');
  await expect(page.getByLabel('อีเมล', { exact: true })).not.toHaveAttribute('aria-invalid', /.*/);
});

test('contact demo submit succeeds', async ({ page, baseURL }) => {
  // Writes a real row — only against a local server (default webServer uses a throwaway DATA_DIR).
  test.skip(!/^https?:\/\/(127\.0\.0\.1|localhost)(:|\/|$)/.test(baseURL ?? ''), 'demo submit runs on localhost only');
  await page.goto('/contact');
  await page.getByLabel('ชื่อของคุณ', { exact: true }).fill('Demo QA');
  await page.getByLabel('อีเมล', { exact: true }).fill('demo@example.com');
  await page.getByLabel('ข้อความ', { exact: true }).fill('ทดสอบจาก smoke spec');
  const [res] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/contact') && r.request().method() === 'POST'),
    page.getByRole('button', { name: 'ส่งข้อความ' }).click(),
  ]);
  expect(res.status()).toBe(201);
  await expect(page.getByRole('status')).toContainText('ได้รับแล้วค่ะ');
});
