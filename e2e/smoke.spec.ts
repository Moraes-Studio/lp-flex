import { expect, test } from '@playwright/test';

test('home carrega e responde com título correto', async ({ page }) => {
  await page.goto('/');
  // Título final de SEO (rodada de auditoria técnica/local) — nome + o que
  // é + onde fica, formato "Marca | Descrição", mais forte pra busca local
  // que a versão anterior só com bairro/cidade.
  await expect(page).toHaveTitle('Academia Flex | Musculação e Aulas em Santo André');
});
