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
    await expect(
      page.locator('#contato').getByRole('link', { name: 'Quero treinar agora' })
    ).toBeAttached();
  });
});

test.describe('Horários: faixa HOJE', () => {
  test('a faixa HOJE fica em #horarios e não existe mais no hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#horarios').getByTestId('hoje-strip')).toBeAttached();
    await expect(page.getByTestId('hoje-strip')).toHaveCount(1);
    await expect(
      page.locator('main > section').first().getByText('Hoje', { exact: true })
    ).toHaveCount(0);
  });

  test('resumo de funcionamento da grade sem travessão', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#horarios')).not.toContainText('–');
    await expect(page.locator('#horarios')).not.toContainText('—');
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

  test('na home, header transparente sobre o hero e sólido depois de rolar', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toHaveAttribute('data-modo', 'transparente');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(header).toHaveAttribute('data-modo', 'solido');
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).toHaveAttribute('data-modo', 'transparente');
  });

  test('CTA do header: branco sobre o hero, azul institucional no modo sólido', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'CTA do header só aparece a partir de md');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const header = page.locator('header').first();
    const cta = header.getByRole('link', { name: 'Quero treinar agora' });
    const fundo = () => cta.evaluate((el) => getComputedStyle(el).backgroundColor);
    await expect(header).toHaveAttribute('data-modo', 'transparente');
    await expect.poll(fundo).toBe('rgb(255, 255, 255)');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(header).toHaveAttribute('data-modo', 'solido');
    await expect.poll(fundo).toBe('rgb(11, 77, 162)');
  });

  test('em /privacidade o header é sempre sólido', async ({ page }) => {
    await page.goto('/privacidade');
    const header = page.locator('header').first();
    await expect(header).toHaveAttribute('data-modo', 'solido');
    await page.waitForTimeout(500);
    await expect(header).toHaveAttribute('data-modo', 'solido');
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(header).toHaveAttribute('data-modo', 'solido');
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

    test('nunca baixa as outras fotos, que não seriam mostradas', async ({ page }) => {
      await page.goto('/', { waitUntil: 'load' });
      await page.waitForTimeout(1500);
      await expect(page.getByTestId('hero-rotator').locator('img')).toHaveCount(1);
    });
  });

  test('só a primeira foto do hero disputa o carregamento inicial', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const imgs = page.getByTestId('hero-rotator').locator('img');
    // Depois do load as demais entram, a tempo da primeira troca (6s).
    await expect(imgs).toHaveCount(3, { timeout: 5000 });
    const pedidasAntesDoLoad = await page.evaluate(() => {
      const load = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return performance
        .getEntriesByType('resource')
        .filter((r) => /hero-(cardio|salao)/.test(r.name) && r.startTime < load.loadEventStart)
        .map((r) => r.name);
    });
    expect(pedidasAntesDoLoad).toEqual([]);
  });

  test("hero tem um único link, 'Ver planos', para #planos, e nenhum stat/chip", async ({
    page,
  }) => {
    await page.goto('/');
    const hero = page.locator('[data-hero-imersivo]');
    await expect(hero).toHaveCount(1);
    const links = hero.getByRole('link');
    await expect(links).toHaveCount(1);
    await expect(links.first()).toHaveAccessibleName(/Ver planos/);
    await expect(links.first()).toHaveAttribute('href', '#planos');
    await expect(hero.getByText('anos na Vila Helena')).toHaveCount(0);
    await expect(hero.getByText(/Aberto agora|Abre hoje/)).toHaveCount(0);
  });

  for (const [w, h] of [
    [1440, 900],
    [390, 844],
  ]) {
    test(`hero em tela cheia, foto no topo e H1 visível sem rolar (${w}x${h})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/');
      const hero = (await page.locator('[data-hero-imersivo]').boundingBox())!;
      expect(hero.height).toBeGreaterThanOrEqual(0.95 * h);

      const foto = (await page.getByTestId('hero-rotator').boundingBox())!;
      expect(foto.y).toBeLessThanOrEqual(1);

      // Espera a entrada (.enter) terminar antes de medir.
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      await page.waitForTimeout(1000);
      const caixa = (await h1.boundingBox())!;
      expect(caixa.y).toBeGreaterThanOrEqual(0);
      expect(caixa.y + caixa.height).toBeLessThanOrEqual(h);
      expect(caixa.x).toBeGreaterThanOrEqual(0);
      expect(caixa.x + caixa.width).toBeLessThanOrEqual(w);
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

  test('slide do carrossel não põe role em <figure> com legenda (ARIA in HTML)', async ({
    page,
  }) => {
    // axe-core ≥ 4.13 (o do Lighthouse) reprova role="group" em <figure> com
    // <figcaption>; o papel de slide fica num wrapper, a figure dentro.
    await page.goto('/');
    const slides = page.locator('#sobre [aria-roledescription="slide"]');
    await expect(slides).toHaveCount(7);
    const tags = await slides.evaluateAll((els) => els.map((el) => el.tagName));
    expect(tags.every((tag) => tag !== 'FIGURE')).toBe(true);
    await expect(page.locator('#sobre figure[role]')).toHaveCount(0);
  });

  test('todas as fotos carregam, inclusive a última, após percorrer o carrossel', async ({
    page,
  }) => {
    await page.goto('/');
    await aceitarCookies(page);
    const sobre = page.locator('#sobre');
    await sobre.scrollIntoViewIfNeeded();
    const proxima = sobre.getByRole('button', { name: 'Próxima foto' });
    for (let i = 0; i < 20; i++) {
      if ((await proxima.getAttribute('aria-disabled')) === 'true') break;
      // dispatchEvent: o botão pode ainda estar "instável" (reveal/scroll da
      // página) e o clique do Playwright esperaria até o timeout.
      await proxima.dispatchEvent('click');
      await page.waitForTimeout(250);
    }
    await expect(proxima).toHaveAttribute('aria-disabled', 'true');
    await expect
      .poll(() =>
        page
          .locator('#sobre figure img')
          .evaluateAll((imgs) => imgs.every((img) => (img as HTMLImageElement).naturalWidth > 0))
      )
      .toBe(true);
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

test.describe('Seções: contraste e escala (iteração imersiva)', () => {
  test('#modalidades em flex-blue-900 e #sobre em flex-blue-700', async ({ page }) => {
    await page.goto('/');
    const fundo = (sel: string) =>
      page.locator(sel).evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(await fundo('#modalidades')).toBe('rgb(4, 29, 64)');
    expect(await fundo('#sobre')).toBe('rgb(8, 58, 124)');
  });

  test('títulos das seções em branco sobre os fundos azuis', async ({ page }) => {
    await page.goto('/');
    for (const sel of ['#modalidades h2', '#sobre h2']) {
      const cor = await page
        .locator(sel)
        .first()
        .evaluate((el) => getComputedStyle(el).color);
      expect(cor, sel).toBe('rgb(255, 255, 255)');
    }
  });

  test('setas do carrossel legíveis no azul (ícone branco)', async ({ page }) => {
    await page.goto('/');
    const proxima = page.locator('#sobre').getByRole('button', { name: 'Próxima foto' });
    await expect(proxima).toBeVisible();
    expect(await proxima.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(255, 255, 255)');
  });

  test('títulos grandes e com no máximo 3 linhas em 1440', async ({ page, isMobile }) => {
    test.skip(isMobile, 'medição de escala no desktop');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    for (const id of ['planos', 'modalidades', 'professores', 'sobre', 'contato']) {
      const h2 = page.locator(`#${id} h2`).first();
      const { tamanho, linhas } = await h2.evaluate((el) => {
        const s = getComputedStyle(el);
        const lh = parseFloat(s.lineHeight);
        return {
          tamanho: parseFloat(s.fontSize),
          linhas: Math.round(el.getBoundingClientRect().height / lh),
        };
      });
      expect(tamanho, id).toBeGreaterThanOrEqual(64);
      expect(linhas, id).toBeLessThanOrEqual(3);
    }
    const horarios = await page
      .locator('#horarios h2')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(horarios).toBeGreaterThanOrEqual(44);
  });
});

test.describe('Faixa de foto com horário de funcionamento', () => {
  test('fica entre Modalidades e Horários, com horário real e sem travessão', async ({ page }) => {
    await page.goto('/');
    const faixa = page.getByRole('region', { name: 'Horário de funcionamento' });
    await expect(faixa).toHaveCount(1);
    await expect(faixa).toContainText('05:00');
    await expect(faixa).toContainText('23:00');
    await expect(faixa).toContainText('segunda a quinta');
    await expect(faixa).not.toContainText('–');
    await expect(faixa).not.toContainText('—');
    const ordem = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('main > section')].map(
        (s) => s.id || s.getAttribute('aria-label') || ''
      );
      return [
        ids.indexOf('modalidades'),
        ids.indexOf('Horário de funcionamento'),
        ids.indexOf('horarios'),
      ];
    });
    expect(ordem[0]).toBeGreaterThanOrEqual(0);
    expect(ordem[1]).toBe(ordem[0] + 1);
    expect(ordem[2]).toBe(ordem[1] + 1);
  });

  test('com movimento reduzido o parallax não anima', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', baseURL });
    const page = await ctx.newPage();
    await page.goto('/');
    const nome = await page
      .locator('[data-faixa-parallax]')
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(nome).toBe('none');
    await ctx.close();
  });
});
