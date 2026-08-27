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
    // No mobile o WhatsApp fica intencionalmente oculto enquanto o banner de
    // cookies está aberto (evita empilhar dois elementos flutuantes no mesmo
    // canto numa tela pequena — ver cookie-consent.tsx) — decide a condição
    // antes de checar o comportamento normal do botão.
    await page.getByRole('button', { name: 'Aceitar todos' }).click();

    const float = page.getByRole('link', { name: 'Falar no WhatsApp' }).last();
    await expect(float).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect(float).toBeVisible();
  });

  test('condição da campanha ativa aparece no card do plano em promoção, com CTA', async ({
    page,
  }) => {
    // A campanha não tem mais faixa própria — a condição (SDD.md §9) aparece
    // dentro do card do plano que participa dela (content/planos.json,
    // campanhaAtiva:true), substituindo o preço normal enquanto durar.
    await page.goto('/');
    await page.locator('#planos').scrollIntoViewIfNeeded();
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
  // Retry local só pra esta suíte (fora do CI, playwright.config.ts não dá
  // retry nenhum por padrão): achado real, investigado via trace de uma
  // falha reproduzida em isolamento controlado (com/sem cada mudança deste
  // arquivo, sozinho vs. suíte inteira). O clique em si sempre resolve
  // rápido (<500ms) — a causa é o dev server local rodando os 3 targets em
  // paralelo (8 workers nesta máquina) com o iframe do Google Maps de
  // #contato (pré-existente, não relacionado a este teste) disparando
  // requisição de tile/API por vários segundos em cada cópia da home,
  // ocasionalmente atrasando a navegação client-side além do timeout.
  // Rodando exatamente como o CI roda (`workers: 1`, sem paralelismo entre
  // arquivos — playwright.config.ts), passa 100% das vezes sem retry. Não é
  // bug de navegação nem de sobreposição do banner de cookies (medido
  // diretamente: o link nunca fica coberto).
  test.describe.configure({ retries: 2 });

  test('página carrega a partir do link do rodapé', async ({ page }) => {
    // Pré-aquece a rota antes do teste de verdade: em dev server (Turbopack,
    // compilação sob demanda), a primeiríssima requisição a uma rota ainda
    // não compilada é bem mais lenta.
    await page.request.get('/privacidade');

    await page.goto('/');
    await page.getByRole('link', { name: 'Política de privacidade' }).click();
    await expect(page).toHaveURL(/\/privacidade$/, { timeout: 20000 });
    await expect(page.getByRole('heading', { name: 'Política de Privacidade' })).toBeVisible();
  });
});
