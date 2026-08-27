import { expect, test } from '@playwright/test';

/**
 * O banner de consentimento de cookies é 100% overlay (`position: fixed`) —
 * nunca pode alterar a altura/layout da página. Uma versão anterior usava
 * `body:has(#cookie-consent) { padding-bottom: ... }` e isso empurrava o
 * fim da página pra baixo (sobrava uma faixa vazia depois do rodapé) —
 * corrigido, e esta suíte existe especificamente pra não deixar essa
 * regressão voltar em silêncio.
 *
 * Retry local (fora do CI, playwright.config.ts não dá retry por padrão):
 * mesma característica de ambiente já documentada em home.spec.ts
 * ("Privacidade") — suíte inteira em paralelo, sandbox com CPU/rede
 * limitadas, ocasionalmente atrasa a animação de entrada do banner (dupla
 * requestAnimationFrame) além do timeout padrão do Playwright, só no
 * Mobile Safari. Rodando como o CI roda (`workers: 1`) passa 100% das
 * vezes, sem retry — confirmado repetidamente.
 */
test.describe.configure({ retries: 2 });

const alturaDocumento = () =>
  document.documentElement.scrollHeight;

test.describe('Banner de cookies — não pode alterar o layout da página', () => {
  test('altura do documento é idêntica com o banner aberto e depois de fechado', async ({
    page,
  }) => {
    await page.goto('/');

    const banner = page.getByRole('region', { name: 'Preferências de cookies' });
    await expect(banner).toBeVisible();

    const alturaComBanner = await page.evaluate(alturaDocumento);

    await page.getByRole('button', { name: 'Aceitar todos' }).click();
    await expect(banner).not.toBeVisible();

    const alturaSemBanner = await page.evaluate(alturaDocumento);

    expect(alturaSemBanner).toBe(alturaComBanner);
  });

  test('rodapé não se move e não sobra faixa vazia depois dele', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Preferências de cookies' });
    await expect(banner).toBeVisible();

    const footer = page.locator('footer');
    const rectAntes = await footer.boundingBox();
    const bodyPaddingAntes = await page.evaluate(
      () => getComputedStyle(document.body).paddingBottom
    );

    await page.getByRole('button', { name: 'Recusar opcionais' }).click();
    await expect(banner).not.toBeVisible();

    const rectDepois = await footer.boundingBox();
    const bodyPaddingDepois = await page.evaluate(
      () => getComputedStyle(document.body).paddingBottom
    );

    expect(rectDepois?.y).toBe(rectAntes?.y);
    // nunca teve padding nenhum, com ou sem banner — é overlay, não afeta o body.
    expect(bodyPaddingAntes).toBe('0px');
    expect(bodyPaddingDepois).toBe('0px');
  });

  test('não introduz scroll horizontal em nenhum breakpoint, com o banner aberto', async ({
    page,
  }) => {
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 820, height: 1180 },
      { width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await expect(page.getByRole('region', { name: 'Preferências de cookies' })).toBeVisible();
      const temScrollHorizontal = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(temScrollHorizontal).toBe(false);
    }
  });
});

test.describe('Banner de cookies — convivência com o WhatsApp', () => {
  test('desktop: WhatsApp sobe e não sobrepõe o banner', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const banner = page.getByRole('region', { name: 'Preferências de cookies' });
    await expect(banner).toBeVisible();

    const wa = page.locator('#whatsapp-float');
    await expect(wa).toBeVisible();

    const bannerBox = await banner.boundingBox();
    const waBox = await wa.boundingBox();
    expect(bannerBox && waBox).toBeTruthy();
    if (bannerBox && waBox) {
      // não podem se sobrepor verticalmente: o WhatsApp deve estar
      // inteiramente acima do topo do banner.
      expect(waBox.y + waBox.height).toBeLessThanOrEqual(bannerBox.y + 1);
    }
  });

  test('mobile: WhatsApp fica oculto enquanto o banner está aberto e volta ao fechar', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const banner = page.getByRole('region', { name: 'Preferências de cookies' });
    await expect(banner).toBeVisible();

    const wa = page.locator('#whatsapp-float');
    await expect(wa).toBeHidden();

    await page.getByRole('button', { name: 'Aceitar todos' }).click();
    await expect(banner).not.toBeVisible();
    await expect(wa).toBeVisible();
  });
});

test.describe('Banner de cookies — acessibilidade', () => {
  test('ações são alcançáveis e ativáveis via teclado', async ({ page }) => {
    await page.goto('/');
    const banner = page.getByRole('region', { name: 'Preferências de cookies' });
    await expect(banner).toBeVisible();

    const aceitar = page.getByRole('button', { name: 'Aceitar todos' });
    await aceitar.focus();
    await expect(aceitar).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(banner).not.toBeVisible();
  });

  test('respeita prefers-reduced-motion: banner ainda funciona e não altera layout', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');

    const banner = page.getByRole('region', { name: 'Preferências de cookies' });
    await expect(banner).toBeVisible();

    const alturaComBanner = await page.evaluate(alturaDocumento);
    await page.getByRole('button', { name: 'Aceitar todos' }).click();
    await expect(banner).not.toBeVisible();
    const alturaSemBanner = await page.evaluate(alturaDocumento);

    expect(alturaSemBanner).toBe(alturaComBanner);
  });
});
