import { defineConfig, devices } from '@playwright/test';

/** Porta do dev server dos testes. 3000 é o padrão; nesta máquina a 3000
 * costuma estar ocupada por outro projeto, e com `reuseExistingServer` o
 * Playwright testaria o app errado em silêncio. Usar `E2E_PORT=3100`. */
const PORT = Number(process.env.E2E_PORT ?? 3000);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
