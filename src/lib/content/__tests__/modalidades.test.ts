import { describe, expect, it } from 'vitest';
import { getModalidades, parseModalidades } from '@/lib/content/modalidades';

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
