import { expect, test } from '@playwright/test';

/**
 * O mapa do Google só carrega com uma ação do visitante ("Mostrar mapa").
 * É isso que dispensa o banner de cookies (rodada 2026-10-26): o banner
 * antigo não controlava o iframe, que carregava sempre, e no celular cobria
 * o CTA do hero. Esta suíte garante as duas coisas: nada vai ao Google antes
 * do clique, e nenhum overlay volta a cobrir o hero.
 */
test.describe('Mapa do Contato carrega só com clique', () => {
  test('nenhuma requisição ao Google antes do clique; o iframe aparece depois', async ({
    page,
  }) => {
    const google: string[] = [];
    page.on('request', (req) => {
      if (/google\./.test(new URL(req.url()).hostname)) google.push(req.url());
    });

    await page.goto('/');
    const contato = page.locator('#contato');
    await contato.scrollIntoViewIfNeeded();
    await page.waitForLoadState('networkidle');

    await expect(contato.locator('iframe')).toHaveCount(0);
    expect(google).toEqual([]);

    await contato.getByRole('button', { name: 'Mostrar mapa' }).click();
    await expect(contato.locator('iframe[title="Localização da Academia Flex"]')).toBeAttached();
  });

  test('aviso de que o mapa vem do Google fica no ponto da decisão', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.locator('#contato').getByText('O mapa é carregado do Google', { exact: false })
    ).toBeVisible();
  });

  test('teclado: Enter no botão carrega o mapa', async ({ page }) => {
    await page.goto('/');
    const botao = page.locator('#contato').getByRole('button', { name: 'Mostrar mapa' });
    await botao.focus();
    await expect(botao).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('#contato iframe')).toBeAttached();
  });
});

test.describe('Sem banner de cookies', () => {
  test('nenhum overlay cobre o CTA do hero no celular', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'Preferências de cookies' })).toHaveCount(0);

    const cta = page.locator('main').getByRole('link', { name: /ver planos/i });
    await expect(cta).toBeVisible();
    const coberto = await cta.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const topo = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return Boolean(topo && topo !== el && !el.contains(topo));
    });
    expect(coberto).toBe(false);
  });
});
