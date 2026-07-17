import { expect, test } from '@playwright/test';

test('home carrega e responde com título correto', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Academia Flex');
});
