import { describe, expect, it } from 'vitest';
import {
  diaDaSemanaEmSaoPaulo,
  fimDoDiaEmSaoPaulo,
  minutosDoDiaEmSaoPaulo,
  numeroDoDiaEmSaoPaulo,
} from '@/lib/timezone';

// Todos os instantes abaixo são strings ISO com 'Z' (UTC explícito) — nunca
// `new Date(y, m, d, ...)` (fuso local do processo que roda o teste) nem
// `new Date('YYYY-MM-DDTHH:MM:SS')` sem timezone (também fuso local). Isto é
// o que faz o teste ser determinístico independente de onde/quando rodar.
describe('diaDaSemanaEmSaoPaulo', () => {
  // Horário de almoço (15h UTC = meio-dia em São Paulo) evita qualquer
  // ambiguidade de fronteira de dia — só testa o mapeamento dia-da-semana.
  it.each([
    ['2026-09-01T15:00:00Z', 'Ter'], // terça
    ['2026-09-02T15:00:00Z', 'Qua'], // quarta
    ['2026-09-03T15:00:00Z', 'Qui'], // quinta
    ['2026-09-04T15:00:00Z', 'Sex'], // sexta
    ['2026-09-05T15:00:00Z', 'Sáb'], // sábado
    ['2026-09-06T15:00:00Z', 'Dom'], // domingo — nenhuma coluna da grade usa este rótulo
    ['2026-09-07T15:00:00Z', 'Seg'], // segunda
  ])('%s (meio-dia em São Paulo) -> %s', (instante, esperado) => {
    expect(diaDaSemanaEmSaoPaulo(new Date(instante))).toBe(esperado);
  });

  it('instante já é dia seguinte em UTC, mas ainda é o dia anterior em São Paulo', () => {
    // 2026-09-02T02:30:00Z = 2026-09-01T23:30:00-03:00 — em UTC já é
    // quarta-feira (dia 2), mas em São Paulo ainda são 23h30 de terça
    // (dia 1). Isto é exatamente a classe de bug relatada em produção:
    // getDay() cru no fuso do processo (UTC na Vercel) teria retornado
    // quarta aqui, errado.
    expect(diaDaSemanaEmSaoPaulo(new Date('2026-09-02T02:30:00Z'))).toBe('Ter');
  });

  it('a virada de dia acontece corretamente logo após a meia-noite em São Paulo', () => {
    // 2026-09-02T03:00:00Z = 2026-09-02T00:00:00-03:00 — meia-noite exata
    // em São Paulo, quarta-feira começando.
    expect(diaDaSemanaEmSaoPaulo(new Date('2026-09-02T03:00:00Z'))).toBe('Qua');
    // Um segundo antes: ainda terça-feira em São Paulo.
    expect(diaDaSemanaEmSaoPaulo(new Date('2026-09-02T02:59:59Z'))).toBe('Ter');
  });
});

describe('numeroDoDiaEmSaoPaulo', () => {
  it('bate com o índice de Date.prototype.getDay() (0=domingo..6=sábado)', () => {
    expect(numeroDoDiaEmSaoPaulo(new Date('2026-09-06T15:00:00Z'))).toBe(0); // domingo
    expect(numeroDoDiaEmSaoPaulo(new Date('2026-09-07T15:00:00Z'))).toBe(1); // segunda
    expect(numeroDoDiaEmSaoPaulo(new Date('2026-09-01T15:00:00Z'))).toBe(2); // terça
  });
});

describe('minutosDoDiaEmSaoPaulo', () => {
  it('calcula minutos desde a meia-noite em São Paulo, não no fuso do processo', () => {
    // 13h00 UTC = 10h00 em São Paulo (-03:00) = 600 minutos.
    expect(minutosDoDiaEmSaoPaulo(new Date('2026-09-01T13:00:00Z'))).toBe(10 * 60);
  });

  it('meia-noite em São Paulo é 0 minutos, não 1440 (edge case do ICU "24h")', () => {
    expect(minutosDoDiaEmSaoPaulo(new Date('2026-09-02T03:00:00Z'))).toBe(0);
  });
});

describe('fimDoDiaEmSaoPaulo', () => {
  it('retorna o instante UTC de 23:59:59.999 do dia em São Paulo', () => {
    // 2026-08-31 23:59:59.999 em São Paulo = 2026-09-01T02:59:59.999Z.
    const fim = fimDoDiaEmSaoPaulo('2026-08-31');
    expect(fim.toISOString()).toBe('2026-09-01T02:59:59.999Z');
  });

  it('um instante antes do fim do dia em São Paulo ainda está dentro do prazo', () => {
    const fim = fimDoDiaEmSaoPaulo('2026-08-31').getTime();
    // 2026-09-01T01:00:00Z já é "01/09" em UTC, mas em São Paulo ainda é
    // 31/08 às 22h — deve continuar dentro do prazo de "terminaEm: 2026-08-31".
    expect(new Date('2026-09-01T01:00:00Z').getTime()).toBeLessThanOrEqual(fim);
  });

  it('um instante depois do fim do dia em São Paulo já passou do prazo', () => {
    const fim = fimDoDiaEmSaoPaulo('2026-08-31').getTime();
    // 2026-09-01T03:00:00Z = 2026-09-01T00:00:00-03:00 — já é 1º de
    // setembro em São Paulo, meia-noite em ponto.
    expect(new Date('2026-09-01T03:00:00Z').getTime()).toBeGreaterThan(fim);
  });
});
