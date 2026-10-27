import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Auditoria automática de acessibilidade (axe-core, WCAG 2.1 A/AA e boas
 * práticas) nas duas páginas do site. Rodada 2026-10-27: zerou as violações
 * (nome acessível do mosaico com o texto visível, link de texto sublinhado
 * na privacidade, WhatsApp flutuante dentro de uma região). Qualquer
 * violação nova falha aqui. Contraste de texto sobre foto o axe não consegue
 * medir (fica como "incompleto", não violação); isso é coberto pela
 * inspeção visual.
 */
for (const rota of ['/', '/privacidade']) {
  test(`sem violações de acessibilidade em ${rota}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(rota);
    // rola a página inteira para tudo que aparece ao rolar estar no DOM final
    const altura = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < altura; y += 700) await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.evaluate(() => window.scrollTo(0, 0));

    const resultado = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    const resumo = resultado.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`
    );
    expect(resumo).toEqual([]);
  });
}
