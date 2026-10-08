import { readFileSync } from 'node:fs';
import path from 'node:path';
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

    const float = page.getByRole('link', { name: 'Quero treinar agora' }).last();
    await expect(float).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 2000));
    await expect(float).toBeVisible();
  });

  test('condição da campanha aparece só até terminaEm (fim do dia em São Paulo)', async ({
    page,
  }) => {
    // A campanha não tem faixa própria — a condição (SDD.md §9) aparece
    // dentro do card do plano que participa dela (content/planos.json,
    // campanhaAtiva:true), substituindo o preço normal enquanto durar. O
    // teste segue a data real do conteúdo, em vez de supor campanha no ar.
    const campanha = JSON.parse(
      readFileSync(path.join(process.cwd(), 'content', 'campaign.json'), 'utf-8')
    ) as { active: boolean; titulo: string; terminaEm: string };
    const hojeSaoPaulo = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
    const noAr = campanha.active && hojeSaoPaulo <= campanha.terminaEm;

    await page.goto('/');
    await page.locator('#planos').scrollIntoViewIfNeeded();
    const condicao = page.getByText(campanha.titulo);
    const cta = page.getByRole('link', { name: 'Quero essa condição' });
    if (noAr) {
      await expect(condicao).toBeVisible();
      await expect(cta).toBeVisible();
    } else {
      await expect(condicao).toHaveCount(0);
      await expect(cta).toHaveCount(0);
    }
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
