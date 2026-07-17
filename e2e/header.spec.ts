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
