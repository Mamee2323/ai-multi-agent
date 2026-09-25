import { defineConfig, devices } from '@playwright/test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// PLAYWRIGHT_BASE_URL set = test a server you already run (no webServer started).
// Unset = build + start our own server on :4323 with a throwaway DATA_DIR, so demo
// submits never land in ./data. Production build also means no dev toolbar in the DOM.
const external = process.env.PLAYWRIGHT_BASE_URL;
const port = 4323;

export default defineConfig({
  testDir: './playwright',
  timeout: 30_000,
  use: {
    baseURL: external || `http://127.0.0.1:${port}`,
    ...devices['Desktop Chrome'],
    // Opt-in system browser instead of `npx playwright install`, e.g. PW_CHANNEL=msedge
    channel: process.env.PW_CHANNEL || undefined,
  },
  webServer: external
    ? undefined
    : {
        command: 'npm run build && npm start',
        url: `http://127.0.0.1:${port}`,
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          HOST: '127.0.0.1',
          PORT: String(port),
          DATA_DIR: join(tmpdir(), `site-e2e-${Date.now()}`),
        },
      },
});
