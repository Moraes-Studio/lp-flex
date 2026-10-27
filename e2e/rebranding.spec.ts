import { expect, test } from '@playwright/test';

// Rodada 2026-10-26: o horário de funcionamento vive num lugar só (a faixa
// grande, #funcionamento). Antes o Contato repetia a tabela inteira.
test.describe('Contato: horário de funcionamento não se repete', () => {
  test('Contato não tem a tabela de horário e o link leva à faixa', async ({ page }) => {
    await page.goto('/');
    const contato = page.locator('#contato');
    await contato.scrollIntoViewIfNeeded();
    await expect(contato.getByTestId('grupo-funcionamento')).toHaveCount(0);
    await expect(contato).not.toContainText('05:00');
    await expect(contato).not.toContainText('–');
    await expect(contato).not.toContainText('—');

    const link = contato.getByRole('link', { name: 'Ver horário de funcionamento' });
    await expect(link).toHaveAttribute('href', '#funcionamento');
    await expect(page.locator('#funcionamento')).toHaveAttribute(
      'aria-label',
      'Horário de funcionamento'
    );
  });

  test('CTA do contato usa o rótulo único', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.locator('#contato').getByRole('link', { name: 'Quero treinar agora' })
    ).toBeAttached();
  });
});

test.describe('Contato: fachada', () => {
  test('foto da fachada com o endereço abaixo, nada por cima', async ({ page }) => {
    await page.goto('/');
    const figura = page.locator('#contato figure');
    await figura.scrollIntoViewIfNeeded();
    // duas fotos em troca lenta (2026-10-26): confere a primeira, a da fachada inteira
    await expect(figura.locator('img').first()).toHaveAttribute('alt', /Fachada/);
    const img = await figura.locator('img').first().boundingBox();
    const legenda = await figura.locator('figcaption').boundingBox();
    expect(img && legenda && legenda.y >= img.y + img.height - 1).toBe(true);
  });
});

test.describe('Horários: grade da semana', () => {
  test('todas as colunas da grade com a mesma largura (desktop)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'a tabela só aparece no desktop');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const larguras = await page
      .locator('#horarios table thead th')
      .evaluateAll((ths) => ths.map((th) => Math.round(th.getBoundingClientRect().width)));
    expect(larguras.length).toBeGreaterThan(1);
    expect(Math.max(...larguras) - Math.min(...larguras)).toBeLessThanOrEqual(1);
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

  test('CTA do header: contornado sobre o hero, azul institucional no modo sólido', async ({
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
    // Contornado e translúcido: não pode ter o mesmo peso do "Ver planos" (branco cheio).
    await expect.poll(fundo).not.toBe('rgb(255, 255, 255)');
    await expect
      .poll(() => cta.evaluate((el) => getComputedStyle(el).color))
      .toBe('rgb(255, 255, 255)');
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(header).toHaveAttribute('data-modo', 'solido');
    await expect.poll(fundo).toBe('rgb(11, 77, 162)');
  });

  test('voltando pra home pelo logo, abre no topo com header transparente', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const header = page.locator('header').first();
    await expect(header).toHaveAttribute('data-modo', 'solido');
    // Navegação client-side (rodapé e depois logo), como a pessoa faz; um
    // `goto` recarregaria a página e não reproduziria a rolagem do Next.
    await page.locator('footer a[href="/privacidade"]').first().click();
    await page.waitForURL('**/privacidade');
    await page.getByRole('link', { name: /página inicial/ }).click();
    await page.waitForURL((url) => url.pathname === '/');
    await expect(header).toHaveAttribute('data-modo', 'transparente');
    // O Next rola até o topo do <main>; ele precisa começar em 0, senão a
    // home abre 121px abaixo e o eyebrow do hero fica por baixo do logo.
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
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
    await expect(rotator).toHaveAttribute('data-ativo', '1', { timeout: 13000 });
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
  test('mosaico dos ambientes e todas as aulas como etiquetas', async ({ page }) => {
    await page.goto('/');
    const secao = page.locator('#modalidades');
    await secao.scrollIntoViewIfNeeded();
    await expect(secao.getByTestId('espaco-mosaico')).toBeVisible();
    await expect(secao.getByTestId('aula-coletiva')).toHaveCount(10);
    await expect(secao.getByRole('heading', { name: 'Aulas coletivas' })).toBeVisible();
  });

  test('fotos do espaço só em Modalidades: o Sobre não repete nenhuma', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sobre img')).toHaveCount(0);
  });
});

test.describe('Mosaico do espaço (Modalidades) e números do Sobre', () => {
  test('4 ambientes à vista, com as 12 fotos acessíveis e nome abaixo da foto', async ({
    page,
  }) => {
    await page.goto('/');
    const mosaico = page.getByTestId('espaco-mosaico');
    await mosaico.scrollIntoViewIfNeeded();
    const blocos = mosaico.getByRole('button');
    await expect(blocos).toHaveCount(4);
    const rotulos = await blocos.evaluateAll((els) =>
      els.map((el) => el.getAttribute('aria-label') ?? '')
    );
    const total = rotulos.reduce((soma, r) => soma + Number(r.match(/ (\d+) fotos/)?.[1] ?? 0), 0);
    expect(total).toBe(12);
    // Nada sobreposto às fotos: o texto do bloco começa abaixo da imagem.
    for (const bloco of await blocos.all()) {
      const img = await bloco.locator('img').boundingBox();
      const nome = await bloco.locator('span.font-heading').boundingBox();
      expect(img && nome && nome.y >= img.y + img.height - 1).toBe(true);
    }
  });

  test('toque abre o visualizador, setas visíveis e "próxima" segue para o ambiente seguinte', async ({
    page,
  }) => {
    await page.goto('/');
    const bloco = page.getByRole('button', { name: /Sala de cardio 3 fotos/ });
    await bloco.scrollIntoViewIfNeeded();
    await bloco.click();
    const visualizador = page.getByTestId('espaco-visualizador');
    await expect(visualizador.getByRole('heading', { name: 'Sala de cardio' })).toBeVisible();
    const proxima = visualizador.getByRole('button', { name: 'Próxima foto' });
    const anterior = visualizador.getByRole('button', { name: 'Foto anterior' });
    await expect(proxima).toBeVisible();
    await expect(anterior).toBeVisible();
    const contador = visualizador.locator('[aria-live]');
    await expect(contador).toHaveText('1 de 3');
    await proxima.click();
    await expect(contador).toHaveText('2 de 3');
    await proxima.click();
    await proxima.click();
    await expect(visualizador.getByRole('heading', { name: 'Salão de aulas' })).toBeVisible();
    await expect(contador).toHaveText('1 de 2');
    const transborda = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(transborda).toBe(false);
  });

  test('teclado: setas navegam, Esc fecha e o foco volta ao bloco', async ({ page, isMobile }) => {
    test.skip(isMobile, 'teclado só no desktop');
    await page.goto('/');
    const bloco = page.getByRole('button', { name: /Musculação 4 fotos/ });
    await bloco.scrollIntoViewIfNeeded();
    await bloco.focus();
    await page.keyboard.press('Enter');
    const visualizador = page.getByTestId('espaco-visualizador');
    const contador = visualizador.locator('[aria-live]');
    await expect(contador).toHaveText('1 de 4');
    await page.keyboard.press('ArrowRight');
    await expect(contador).toHaveText('2 de 4');
    await page.keyboard.press('ArrowLeft');
    await expect(contador).toHaveText('1 de 4');
    await page.keyboard.press('Escape');
    await expect(visualizador).toHaveCount(0);
    await expect(bloco).toBeFocused();
  });

  test('fotos do visualizador carregam e têm alt descritivo', async ({ page }) => {
    await page.goto('/');
    const bloco = page.getByRole('button', { name: /Musculação 4 fotos/ });
    await bloco.scrollIntoViewIfNeeded();
    await bloco.click();
    const fotos = page.getByTestId('espaco-visualizador').locator('img');
    await expect(fotos).toHaveCount(4);
    await expect
      .poll(() =>
        fotos.evaluateAll((imgs) =>
          imgs.every(
            (img) =>
              (img as HTMLImageElement).complete &&
              (img as HTMLImageElement).naturalWidth > 0 &&
              (img.getAttribute('alt') ?? '').length > 10
          )
        )
      )
      .toBe(true);
  });

  // Rodada 2026-10-26: a contagem de aulas fica só em Modalidades; o Sobre
  // não repete o número (antes o teste exigia os dois iguais).
  test('contagem de aulas aparece em Modalidades e não se repete no Sobre', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#modalidades').getByText(/\d+ aulas no mesmo plano/)).toBeAttached();
    await expect(page.locator('#sobre')).not.toContainText('aulas coletivas');
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
      await expect(page.getByTestId('espaco-mosaico').locator('img').first()).toBeAttached();
      const transborda = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(transborda).toBe(false);
    });
  }
});

test.describe('Eyebrows', () => {
  // Rodada 2026-10-26: rótulo acima de título só no hero (antes: até 3, com
  // Horários e Contato, o que deixava as seções inconsistentes entre si).
  test('só o do hero na home', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main .eyebrow-line')).toHaveCount(1);
    await expect(page.locator('main section:has(h1) .eyebrow-line')).toHaveCount(1);
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

  test('nomes dos ambientes em branco sobre o azul de Modalidades', async ({ page }) => {
    await page.goto('/');
    const cor = await page
      .getByTestId('espaco-mosaico')
      .locator('span.font-heading')
      .first()
      .evaluate((el) => getComputedStyle(el).color);
    expect(cor).toBe('rgb(255, 255, 255)');
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
    // O resto da semana fica abaixo da foto: sem ele, o visitante lê
    // "só abre de segunda a quinta".
    const resto = faixa.getByTestId('faixa-resto-semana');
    await expect(resto).toContainText('Sexta');
    await expect(resto).toContainText('05:00 às 22:00');
    await expect(resto).toContainText('Sábado');
    await expect(resto).toContainText('09:00 às 15:00');
    await expect(resto).toContainText('Domingo e feriados');
    await expect(resto).toContainText('09:30 às 12:30');
    await expect(faixa).not.toContainText('–');
    await expect(faixa).not.toContainText('—');
    const ordem = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('main > section')].map(
        (s) => s.id || s.getAttribute('aria-label') || ''
      );
      return [
        ids.indexOf('modalidades'),
        // a faixa ganhou id="funcionamento" (alvo do link do Contato), que tem
        // precedência sobre o aria-label neste mapeamento
        ids.indexOf('funcionamento'),
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

// Rodada 2026-10-26: o que todos os planos incluem aparece uma vez, abaixo dos
// cards (é igual nos três), e o mapeamento diz o que é, não só o preço.
test.describe('Planos: o que inclui', () => {
  test('faixa única com o que todos os planos incluem e o mapeamento explicado', async ({
    page,
  }) => {
    await page.goto('/');
    const planos = page.locator('#planos');
    await expect(planos.getByRole('heading', { name: 'Todos os planos incluem' })).toHaveCount(1);
    await expect(planos).toContainText('Todas as aulas coletivas');
    await expect(planos).toContainText('Professores na sala para orientar todos os alunos');
    await expect(planos).toContainText(
      'Mapeamento (bioimpedância): R$ 50,00, cobrado à parte em qualquer plano.'
    );
    // a lista não se repete dentro dos cards
    await expect(planos.getByText('Todas as aulas coletivas')).toHaveCount(1);
  });
});

// Rodada 2026-10-26: cada aula diz o que é, e a nota do Google aparece no
// Sobre com link pras avaliações (prova social local).
test.describe('Aulas explicadas e reputação no Google', () => {
  test('aulas com descrição curta; aula sem texto confirmado fica só com o nome', async ({
    page,
  }) => {
    await page.goto('/');
    const aulas = page.locator('#modalidades').getByTestId('aula-coletiva');
    // nome exato: "contém GAP" sem diferenciar maiúsculas casava com mais de uma aula
    const aula = (nome: string) => aulas.filter({ has: page.getByText(nome, { exact: true }) });
    await expect(aula('GAP')).toContainText('glúteos, abdômen e pernas');
    await expect(aula('Ritbox')).toContainText('Movimentos de luta');
    await expect(aula('Flex Training').locator('p')).toHaveCount(1);
  });

  test('nota do Google no Sobre, com link pras avaliações em nova aba', async ({ page }) => {
    await page.goto('/');
    const sobre = page.locator('#sobre');
    await expect(sobre.locator('dl')).toContainText('4,5');
    const link = sobre.getByRole('link', { name: /avaliações no Google/ });
    await expect(link).toHaveAttribute('href', /^https:\/\/www\.google\.com\/maps\//);
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('estrelas com a nota proporcional, no Sobre e no selo do rodapé', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#sobre').getByRole('img', { name: 'Nota 4,5 de 5' })).toBeAttached();
    const selo = page.locator('footer').getByRole('link', { name: /avaliações no Google/ });
    await expect(selo).toContainText('4,5');
    await expect(selo.getByRole('img', { name: 'Nota 4,5 de 5' })).toBeAttached();
  });
});
