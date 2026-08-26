import { describe, expect, it } from 'vitest';
import {
  BIO_PENDENTE,
  contarConfirmados,
  getProfessores,
  isProfessorConfirmado,
  parseProfessores,
  temPerfilCompleto,
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

describe('temPerfilCompleto', () => {
  it('nome real + bio de verdade conta como perfil completo', () => {
    expect(temPerfilCompleto({ nome: 'Vanessa Fukazawa', bio: 'Bio de verdade.' })).toBe(true);
  });

  it('nome real mas bio ainda pendente NÃO conta como perfil completo', () => {
    expect(temPerfilCompleto({ nome: 'Rafael', bio: BIO_PENDENTE })).toBe(false);
  });

  it('nome placeholder "Professor 0X" NÃO conta como perfil completo, mesmo com bio real (edge case)', () => {
    expect(temPerfilCompleto({ nome: 'Professor 04', bio: 'Bio de verdade.' })).toBe(false);
  });

  it('diverge de isProfessorConfirmado pro caso "nome real + bio pendente" — é exatamente essa diferença que existe pra não mostrar card feio (ver professores.tsx)', () => {
    const professor = { nome: 'Rafael', bio: BIO_PENDENTE };
    expect(isProfessorConfirmado(professor)).toBe(true);
    expect(temPerfilCompleto(professor)).toBe(false);
  });
});
