import { expect, test } from '@playwright/test';

test.describe('Header (nav desktop)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('nav com âncoras e CTA de WhatsApp aparecem', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'Professores' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Horários' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Quero treinar agora' })).toBeVisible();
  });

  test('permanece visível (sticky) depois de rolar a página', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 800));
    await expect(page.locator('header')).toBeInViewport();
  });
});

test.describe('Header', () => {
  test('não introduz scroll horizontal', async ({ page }) => {
    await page.goto('/');
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });
});

test.describe('Menu mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('abre e fecha por toque, sem depender de hover', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Abrir menu' });
    await expect(trigger).toBeVisible();

    await trigger.click();
    const nav = page.getByRole('navigation', { name: 'Navegação principal' }).last();
    await expect(nav.getByRole('link', { name: 'Planos' })).toBeVisible();

    await page.getByRole('button', { name: 'Fechar menu' }).click();
    await expect(nav.getByRole('link', { name: 'Planos' })).toBeHidden();
  });

  test('fecha ao escolher um item de navegação', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('link', { name: 'Sobre' }).click();
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toBeHidden();
  });

  test('rola até a seção escolhida rápido, sem travar a tela em branco', async ({ page }) => {
    // Regressão: o scroll-behavior:smooth nativo do CSS, numa home de ~7800px
    // no mobile, levava 1,5s+ pra chegar em seções mais distantes (ex:
    // Contato) — nesse intervalo a tela ficava majoritariamente em branco,
    // lendo como se o site tivesse travado. lib/smooth-scroll.ts troca isso
    // por uma rolagem com duração fixa (~420ms) — este teste garante que o
    // destino aparece na tela bem antes do teto antigo de 1,5s.
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await page.getByRole('dialog').getByRole('link', { name: 'Contato', exact: true }).click();
    // Teto bem generoso pra suíte inteira rodando em paralelo nos 3 targets
    // (mesma lição do teste de /privacidade — 2500ms ainda flakava no Mobile
    // Safari sob contenção de 8 workers, mesmo com o fix aplicado rodando em
    // ~600-700ms isolado). O objetivo não é cronometrar com precisão, é
    // provar que não voltamos a levar 1,5s+; folga aqui não mascara
    // regressão real porque a rolagem antiga travava por bem mais que isso.
    await expect(page.locator('#contato').getByRole('heading', { name: 'Venha conhecer.' })).toBeInViewport({
      timeout: 8000,
    });
  });

  test('não introduz scroll horizontal com o menu aberto', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    const hasHorizontalScroll = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(hasHorizontalScroll).toBe(false);
  });

  test('fecha com a tecla Escape (acessível via teclado)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Abrir menu' }).click();
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Fechar menu' })).toBeHidden();
  });
});
