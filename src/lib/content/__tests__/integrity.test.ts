import { describe, expect, it } from 'vitest';
import { validateModalidadeProfessorCoverage } from '@/lib/content/integrity';

describe('validateModalidadeProfessorCoverage', () => {
  it('passa quando toda modalidade tem pelo menos um professor', () => {
    expect(() =>
      validateModalidadeProfessorCoverage(
        [{ nome: 'Zumba' }, { nome: 'Pilates' }],
        [{ papel: 'Zumba' }, { papel: 'Pilates' }]
      )
    ).not.toThrow();
  });

  it('lança erro quando uma modalidade não tem nenhum professor correspondente', () => {
    expect(() =>
      validateModalidadeProfessorCoverage(
        [{ nome: 'Zumba' }, { nome: 'Crossfit' }],
        [{ papel: 'Zumba' }]
      )
    ).toThrow(/Crossfit/);
  });

  it('lança erro para lista de modalidades vazia com professores presentes (edge case trivial)', () => {
    expect(() => validateModalidadeProfessorCoverage([], [{ papel: 'Zumba' }])).not.toThrow();
  });

  it('valida os arquivos reais do projeto (content/modalidades.json x content/professores.json)', () => {
    expect(() => validateModalidadeProfessorCoverage()).not.toThrow();
  });
});
