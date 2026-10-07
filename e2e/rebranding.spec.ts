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

test.describe('Hero', () => {
  test('troca de foto depois do intervalo', async ({ page }) => {
    await page.goto('/');
    const rotator = page.getByTestId('hero-rotator');
    await expect(rotator).toHaveAttribute('data-ativo', '0');
    await expect(rotator).toHaveAttribute('data-ativo', '1', { timeout: 9000 });
  });

  test.describe('com movimento reduzido', () => {
    test.use({ contextOptions: { reducedMotion: 'reduce' } });

    test('fica parado na primeira foto', async ({ page }) => {
      await page.goto('/');
      const rotator = page.getByTestId('hero-rotator');
      await expect(rotator).toHaveAttribute('data-ativo', '0');
      await page.waitForTimeout(7000);
      await expect(rotator).toHaveAttribute('data-ativo', '0');
    });
  });

  test('hero tem no máximo 2 CTAs e nenhum chip ou número de stats', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('main > section').first();
    await expect(hero.getByRole('link')).toHaveCount(2);
    await expect(hero.getByText('anos na Vila Helena')).toHaveCount(0);
    await expect(hero.getByText(/Aberto agora|Abre hoje/)).toHaveCount(0);
  });

  for (const [w, h] of [
    [1280, 800],
    [1440, 900],
  ]) {
    test(`H1 em no máximo 2 linhas no desktop (${w}x${h})`, async ({ page, isMobile }) => {
      test.skip(isMobile, 'só desktop');
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');
      const medidas = await page.locator('h1').first().evaluate((el) => ({
        altura: el.getBoundingClientRect().height,
        linha: parseFloat(getComputedStyle(el).lineHeight),
      }));
      expect(medidas.altura).toBeLessThanOrEqual(2.2 * medidas.linha);
      const xH1 = (await page.locator('h1').first().boundingBox())!.x;
      const xLogo = (await page.locator('header a').first().boundingBox())!.x;
      expect(Math.abs(xH1 - xLogo)).toBeLessThanOrEqual(2);
    });
  }

  test('primeira foto do hero carrega com prioridade alta', async ({ page }) => {
    await page.goto('/');
    const primeira = page.getByTestId('hero-rotator').locator('img').first();
    await expect(primeira).toHaveAttribute('fetchpriority', 'high');
  });
});

test.describe('Modalidades', () => {
  test('dois blocos com foto e todas as aulas como etiquetas', async ({ page }) => {
    await page.goto('/');
    const secao = page.locator('#modalidades');
    await secao.scrollIntoViewIfNeeded();
    await expect(secao.locator('img')).toHaveCount(2);
    await expect(secao.getByTestId('aula-coletiva')).toHaveCount(10);
    await expect(secao.getByRole('heading', { name: 'Musculação' })).toBeVisible();
    await expect(secao.getByRole('heading', { name: 'Aulas coletivas' })).toBeVisible();
  });
});

test.describe('Sobre: carrossel', () => {
  test('setas visíveis sem hover e navegação por toque/clique', async ({ page }) => {
    await page.goto('/');
    await aceitarCookies(page);
    const sobre = page.locator('#sobre');
    await sobre.scrollIntoViewIfNeeded();

    const anterior = sobre.getByRole('button', { name: 'Foto anterior' });
    const proxima = sobre.getByRole('button', { name: 'Próxima foto' });
    await expect(anterior).toBeVisible();
    await expect(proxima).toBeVisible();
    await expect(anterior).toHaveAttribute('aria-disabled', 'true');
    await expect(proxima).toHaveAttribute('aria-disabled', 'false');

    const trilho = sobre.getByRole('region', { name: 'Fotos da Academia Flex' });
    const antes = await trilho.evaluate((el) => el.scrollLeft);
    await proxima.click();
    await expect.poll(() => trilho.evaluate((el) => el.scrollLeft)).toBeGreaterThan(antes);
    await expect(anterior).toHaveAttribute('aria-disabled', 'false');
  });

  test('teclado: seta para a direita avança', async ({ page, isMobile }) => {
    test.skip(isMobile, 'teclado só no desktop');
    await page.goto('/');
    await aceitarCookies(page);
    const trilho = page.locator('#sobre').getByRole('region', { name: 'Fotos da Academia Flex' });
    await trilho.scrollIntoViewIfNeeded();
    await trilho.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => trilho.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  });

  test('legenda fica abaixo da foto, nunca por cima', async ({ page }) => {
    await page.goto('/');
    const primeiro = page.locator('#sobre figure').first();
    await primeiro.scrollIntoViewIfNeeded();
    const img = await primeiro.locator('img').boundingBox();
    const legenda = await primeiro.locator('figcaption').boundingBox();
    expect(img && legenda && legenda.y >= img.y + img.height - 1).toBe(true);
  });

  test('números saíram do hero e estão no Sobre', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sobre').getByText('anos na Vila Helena')).toBeAttached();
  });
});

test.describe('Sem scroll horizontal', () => {
  for (const largura of [375, 768, 1440]) {
    test(`largura ${largura}px`, async ({ page }) => {
      await page.setViewportSize({ width: largura, height: 900 });
      await page.goto('/');
      await page.waitForLoadState('load');
      await expect(page.locator('#sobre figure').first()).toBeVisible();
      const transborda = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(transborda).toBe(false);
    });
  }
});

test.describe('Eyebrows', () => {
  test('no máximo 3 na home', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main .eyebrow-line')).toHaveCount(3);
  });

  test('título de Professores revisado (SDD §7)', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.locator('#professores').getByRole('heading', { name: 'Professores presentes na sala.' })
    ).toBeAttached();
  });
});
