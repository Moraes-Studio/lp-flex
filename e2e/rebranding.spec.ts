import { expect, test, type Page } from '@playwright/test';

/** O banner de cookies cobre o canto inferior no mobile; fechar antes de
 * interagir com elementos da página (mesmo padrão de home.spec.ts). */
async function aceitarCookies(page: Page) {
  const aceitar = page.getByRole('button', { name: 'Aceitar todos' });
  if (await aceitar.isVisible().catch(() => false)) await aceitar.click();
}

test.describe('Contato: horário de funcionamento agrupado', () => {
  test('mostra 4 grupos com hífen, sem travessão', async ({ page }) => {
    await page.goto('/');
    const contato = page.locator('#contato');
    await contato.scrollIntoViewIfNeeded();
    const linhas = contato.getByTestId('grupo-funcionamento');
    await expect(linhas).toHaveCount(4);
    await expect(linhas.first()).toContainText('Seg a Qui');
    await expect(linhas.first()).toContainText('05:00-23:00');
    await expect(contato).not.toContainText('–');
    await expect(contato).not.toContainText('—');
  });

  test('CTA do contato usa o rótulo único', async ({ page }) => {
    await page.goto('/');
    await aceitarCookies(page);
    await expect(page.locator('#contato').getByRole('link', { name: 'Quero treinar agora' })).toBeAttached();
  });
});

test.describe('Horários: faixa HOJE', () => {
  test('a faixa HOJE fica em #horarios e não existe mais no hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#horarios').getByTestId('hoje-strip')).toBeAttached();
    await expect(page.getByTestId('hoje-strip')).toHaveCount(1);
    await expect(page.locator('main > section').first().getByText('Hoje', { exact: true })).toHaveCount(0);
  });

  test('resumo de funcionamento da grade sem travessão', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#horarios')).not.toContainText('–');
  });
});

test.describe('Header e rótulos', () => {
  test('sem barra azul do topo e sem "Falar no WhatsApp" na página', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('formando a vizinhança')).toHaveCount(0);
    await expect(page.getByText('Falar no WhatsApp')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Falar no WhatsApp' })).toHaveCount(0);
  });

  test('chip de funcionamento aparece no header em telas largas', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await expect(page.locator('header').getByText(/Aberto agora|Abre hoje|Fechado/)).toBeVisible();
  });

  test('header e rodapé sem travessão', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).not.toContainText('—');
    await expect(page.locator('footer')).not.toContainText('—');
  });
});
