import { expect, test } from '@playwright/test';

test('home carrega e responde com título correto', async ({ page }) => {
  await page.goto('/');
  // Título mais descritivo (nome + bairro + cidade) — SEO/preview de link
  // pro Meta reconhecer o site como ativo, não só "Academia Flex".
  await expect(page).toHaveTitle('Academia Flex — Vila Helena, Santo André');
});
