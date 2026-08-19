import { describe, expect, it } from 'vitest';
import {
  contarConfirmados,
  getProfessores,
  isProfessorConfirmado,
  parseProfessores,
} from '@/lib/content/professores';

const professorValido = {
  id: 'professor-01',
  num: '01',
  nome: 'Professor 01',
  papel: 'Musculação',
  desde: 'na equipe desde 2016',
  bio: 'Bio de teste.',
  fotoUrl: null,
};

describe('parseProfessores', () => {
  it('aceita um professor válido com fotoUrl null', () => {
    expect(parseProfessores([professorValido])).toHaveLength(1);
  });

  it('rejeita lista vazia', () => {
    expect(() => parseProfessores([])).toThrow();
  });

  it('rejeita num fora do formato de dois dígitos (JSON malformado)', () => {
    expect(() => parseProfessores([{ ...professorValido, num: '1' }])).toThrow();
  });

  it('rejeita bio ausente', () => {
    const semBio: Partial<typeof professorValido> = { ...professorValido };
    delete semBio.bio;
    expect(() => parseProfessores([semBio])).toThrow();
  });
});

describe('getProfessores (arquivo real)', () => {
  it('content/professores.json é válido', () => {
    expect(() => getProfessores()).not.toThrow();
    expect(getProfessores().length).toBeGreaterThan(0);
  });
});

describe('isProfessorConfirmado', () => {
  it('nome real conta como confirmado', () => {
    expect(isProfessorConfirmado({ nome: 'Vanessa Fukazawa' })).toBe(true);
  });

  it('nome placeholder "Professor 0X" não conta como confirmado', () => {
    expect(isProfessorConfirmado({ nome: 'Professor 04' })).toBe(false);
  });

  it('nome com dois dígitos ainda casa com o padrão placeholder (edge case)', () => {
    expect(isProfessorConfirmado({ nome: 'Professor 11' })).toBe(false);
  });
});

describe('contarConfirmados', () => {
  it('conta só os confirmados, ignorando placeholders', () => {
    const lista = [professorValido, { ...professorValido, id: 'x', nome: 'Ana Souza' }];
    expect(contarConfirmados(lista)).toBe(1);
  });

  it('retorna 0 pra lista vazia (edge case)', () => {
    expect(contarConfirmados([])).toBe(0);
  });
});
