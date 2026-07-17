import { describe, expect, it } from 'vitest';
import { calcularPrecoFinal, getPlanos, parsePlanos, type Plano } from '@/lib/content/planos';

const planoBase: Plano = {
  id: 'mensal',
  nome: 'Plano Mensal',
  descricao: 'desc',
  precoBase: 100,
  periodo: '/mês',
  beneficios: ['Benefício 1'],
  destaque: false,
  campanhaAtiva: true,
  discountPct: 0.1,
};

describe('parsePlanos', () => {
  it('aceita uma lista válida', () => {
    expect(parsePlanos([planoBase])).toHaveLength(1);
  });

  it('rejeita mais de um plano com destaque:true', () => {
    expect(() =>
      parsePlanos([
        { ...planoBase, id: 'a', destaque: true, badge: 'X' },
        { ...planoBase, id: 'b', destaque: true, badge: 'Y' },
      ])
    ).toThrow(/No máximo 1 plano com destaque/);
  });

  it('rejeita badge presente sem destaque:true', () => {
    expect(() => parsePlanos([{ ...planoBase, destaque: false, badge: 'X' }])).toThrow(
      /badge só pode existir/
    );
  });

  it('rejeita precoBase negativo (JSON malformado)', () => {
    expect(() => parsePlanos([{ ...planoBase, precoBase: -10 }])).toThrow();
  });
});

describe('calcularPrecoFinal', () => {
  it('aplica o desconto quando campanha está ativa e o plano participa', () => {
    expect(calcularPrecoFinal(planoBase, true)).toBe(90);
  });

  it('não aplica desconto quando a campanha global está desligada', () => {
    expect(calcularPrecoFinal(planoBase, false)).toBe(100);
  });

  it('não aplica desconto quando o plano não participa da campanha', () => {
    expect(calcularPrecoFinal({ ...planoBase, campanhaAtiva: false }, true)).toBe(100);
  });

  it('retorna null quando precoBase é "Sob consulta" (edge case)', () => {
    expect(calcularPrecoFinal({ ...planoBase, precoBase: null }, true)).toBeNull();
  });

  it('não aplica desconto quando discountPct é 0 (edge case)', () => {
    expect(calcularPrecoFinal({ ...planoBase, discountPct: 0 }, true)).toBe(100);
  });
});

describe('getPlanos (arquivo real)', () => {
  it('content/planos.json é válido', () => {
    expect(() => getPlanos()).not.toThrow();
    expect(getPlanos().length).toBeGreaterThan(0);
  });
});
