import { describe, expect, it } from 'vitest';
import { getHorarios, parseHorarios, resolveHorarios } from '@/lib/content/horarios';

const modalidades = [{ nome: 'Zumba' }, { nome: 'Pilates' }];
const professores = [
  { id: 'professor-01', papel: 'Zumba' },
  { id: 'professor-02', papel: 'Pilates' },
];

describe('parseHorarios', () => {
  it('aceita uma lista válida', () => {
    expect(parseHorarios([{ time: '08:00', day: 'Seg', aula: 'Zumba' }])).toHaveLength(1);
  });

  it('rejeita time fora do formato HH:MM (JSON malformado)', () => {
    expect(() => parseHorarios([{ time: '8:00', day: 'Seg', aula: 'Zumba' }])).toThrow();
  });

  it('rejeita day fora do conjunto fechado', () => {
    expect(() => parseHorarios([{ time: '08:00', day: 'Segunda', aula: 'Zumba' }])).toThrow();
  });
});

describe('resolveHorarios', () => {
  it('resolve o profId pela modalidade (papel), não hardcoded', () => {
    const raw = parseHorarios([{ time: '08:00', day: 'Seg', aula: 'Zumba' }]);
    const resolved = resolveHorarios(raw, modalidades, professores);
    expect(resolved[0].profId).toBe('professor-01');
  });

  it('profId fica null quando nenhum professor cobre a modalidade (edge case)', () => {
    const raw = parseHorarios([{ time: '08:00', day: 'Seg', aula: 'Zumba' }]);
    const resolved = resolveHorarios(raw, modalidades, []);
    expect(resolved[0].profId).toBeNull();
  });

  it('lança erro quando o horário referencia modalidade que não existe (referência quebrada)', () => {
    const raw = parseHorarios([{ time: '08:00', day: 'Seg', aula: 'Crossfit' }]);
    expect(() => resolveHorarios(raw, modalidades, professores)).toThrow(
      /não existe em content\/modalidades\.json/
    );
  });
});

describe('getHorarios (arquivo real)', () => {
  it('content/horarios.json é válido e todo profId resolve pra um professor real', () => {
    const horarios = getHorarios();
    expect(horarios.length).toBeGreaterThan(0);
    horarios.forEach((slot) => expect(slot.profId).not.toBeNull());
  });
});
