import { expect, test } from '@playwright/test';

test.describe('Home — layout geral', () => {
  test('não introduz scroll horizontal com a página inteira carregada', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  test('todas as seções da home (layout do cliente) estão presentes', async ({ page }) => {
    await page.goto('/');
    for (const id of ['planos', 'modalidades', 'horarios', 'professores', 'sobre', 'contato']) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
  });

  test('botão flutuante de WhatsApp aparece em qualquer scroll', async ({ page }) => {
    await page.goto('/');
    const float = page.getByRole('link', { name: 'Falar no WhatsApp' }).last();
    await expect(float).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect(float).toBeVisible();
  });

  test('faixa de campanha ativa aparece com CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Primeiro mês por R$ 9,90')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Quero essa condição' })).toBeVisible();
  });
});

test.describe('Horários — filtro por dia (mobile)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('troca de dia por toque, sem depender de hover', async ({ page }) => {
    await page.goto('/');
    const grade = page.locator('#horarios');
    await grade.scrollIntoViewIfNeeded();

    const abas = grade.getByRole('group', { name: 'Dias da semana' }).getByRole('button');
    await expect(abas.first()).toBeVisible();

    const segunda = grade.getByRole('button', { name: 'Seg' });
    await segunda.click();
    await expect(segunda).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('Privacidade', () => {
  test('página carrega a partir do link do rodapé', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Política de privacidade' }).click();
    // timeout maior que o padrão: navegação client-side do Next.js Link em
    // dev server sob carga (suíte inteira nos 3 targets em paralelo) pode
    // passar de 5s enquanto a rota compila sob concorrência — flakiness de
    // ambiente observada especificamente no Mobile Safari, não regressão de
    // navegação (rerun isolado e rerun completo confirmaram 100% de sucesso).
    await expect(page).toHaveURL(/\/privacidade$/, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'Política de Privacidade' })).toBeVisible();
  });
});
