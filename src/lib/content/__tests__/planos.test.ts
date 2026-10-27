import { describe, expect, it } from 'vitest';
import {
  calcularPrecoFinal,
  getPlanos,
  getPlanosInclusos,
  parsePlanos,
  parsePlanosInclusos,
  type Plano,
} from '@/lib/content/planos';

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

  it('aceita plano sem descricao/beneficios (layout de referência do cliente, edge case)', () => {
    const semDetalhe: Plano = { ...planoBase };
    delete semDetalhe.descricao;
    delete semDetalhe.beneficios;
    expect(parsePlanos([semDetalhe])).toHaveLength(1);
  });

  it('aceita badgeExtra, badgeCampanha e beneficiosCampanha quando campanhaAtiva é true', () => {
    const planoComCampanha: Plano = {
      ...planoBase,
      badgeExtra: 'Clube+',
      badgeCampanha: 'Na promoção',
      beneficiosCampanha: ['Sem taxa de matrícula'],
    };
    expect(parsePlanos([planoComCampanha])).toHaveLength(1);
  });

  it('rejeita badgeCampanha/beneficiosCampanha quando campanhaAtiva é false (SDD.md §9)', () => {
    expect(() =>
      parsePlanos([{ ...planoBase, campanhaAtiva: false, badgeCampanha: 'Na promoção' }])
    ).toThrow(/badgeCampanha\/beneficiosCampanha só podem existir/);
    expect(() =>
      parsePlanos([
        { ...planoBase, campanhaAtiva: false, beneficiosCampanha: ['Sem taxa de matrícula'] },
      ])
    ).toThrow(/badgeCampanha\/beneficiosCampanha só podem existir/);
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

describe('parsePlanosInclusos', () => {
  const valido = {
    inclui: ['Musculação', 'Todas as aulas coletivas'],
    aParte: [{ nome: 'Mapeamento (bioimpedância)', valor: 50 }],
  };

  it('aceita a lista do que todos os planos incluem e os serviços à parte', () => {
    expect(parsePlanosInclusos(valido).inclui).toHaveLength(2);
  });

  it('rejeita lista "inclui" vazia (a faixa ficaria sem conteúdo)', () => {
    expect(() => parsePlanosInclusos({ ...valido, inclui: [] })).toThrow();
  });

  it('rejeita valor de serviço à parte negativo ou zero (edge case)', () => {
    expect(() =>
      parsePlanosInclusos({ ...valido, aParte: [{ nome: 'Mapeamento', valor: 0 }] })
    ).toThrow();
  });

  it('aceita sem serviços à parte (lista vazia é válida)', () => {
    expect(parsePlanosInclusos({ ...valido, aParte: [] }).aParte).toEqual([]);
  });
});

describe('getPlanosInclusos (arquivo real)', () => {
  it('content/planos-inclusos.json é válido e cita o mapeamento à parte', () => {
    const dados = getPlanosInclusos();
    expect(dados.inclui.length).toBeGreaterThan(0);
    expect(dados.aParte.some((s) => /mapeamento/i.test(s.nome))).toBe(true);
  });
});
