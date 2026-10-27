import { describe, expect, it } from 'vitest';
import { getModalidades, parseModalidades, separarModalidades } from '@/lib/content/modalidades';

describe('parseModalidades', () => {
  it('aceita uma lista válida', () => {
    const result = parseModalidades([
      { nome: 'Zumba', icone: 'zumba' },
      { nome: 'Pilates', icone: 'pilates' },
    ]);
    expect(result).toHaveLength(2);
  });

  it('rejeita lista vazia', () => {
    expect(() => parseModalidades([])).toThrow();
  });

  it('rejeita item com nome ausente (JSON malformado)', () => {
    expect(() => parseModalidades([{ icone: 'zumba' }])).toThrow();
  });

  it('rejeita ícone reaproveitado entre duas modalidades', () => {
    expect(() =>
      parseModalidades([
        { nome: 'Zumba', icone: 'dança' },
        { nome: 'FitDance', icone: 'dança' },
      ])
    ).toThrow(/reaproveitado/);
  });
});

describe('getModalidades (arquivo real)', () => {
  it('content/modalidades.json é válido', () => {
    expect(() => getModalidades()).not.toThrow();
    expect(getModalidades().length).toBeGreaterThan(0);
  });
});

describe('separarModalidades', () => {
  it('dados reais: 10 aulas e musculação definida', () => {
    const { musculacao, aulas } = separarModalidades(getModalidades());
    expect(aulas).toHaveLength(10);
    expect(musculacao).toBeDefined();
  });

  it('lista vazia', () => {
    expect(separarModalidades([])).toEqual({ musculacao: undefined, aulas: [] });
  });

  it('preserva a ordem das aulas', () => {
    const { aulas } = separarModalidades([
      { nome: 'Zumba', icone: 'zumba' },
      { nome: 'Musculação', icone: 'musculacao' },
      { nome: 'Pilates', icone: 'pilates' },
    ]);
    expect(aulas.map((a) => a.nome)).toEqual(['Zumba', 'Pilates']);
  });
});

describe('descricao das aulas', () => {
  it('é opcional: aula sem descrição continua válida (ex.: aula própria ainda sem texto confirmado)', () => {
    expect(parseModalidades([{ nome: 'Flex Training', icone: 'flex-training' }])).toHaveLength(1);
  });

  it('rejeita descrição longa demais para uma frase curta (edge case)', () => {
    expect(() =>
      parseModalidades([{ nome: 'GAP', icone: 'gap', descricao: 'x'.repeat(121) }])
    ).toThrow();
  });

  it('arquivo real: toda descrição existente cabe numa frase curta', () => {
    for (const m of getModalidades()) {
      if (m.descricao) expect(m.descricao.length).toBeLessThanOrEqual(120);
    }
  });
});
