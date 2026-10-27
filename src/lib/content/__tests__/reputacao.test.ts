import { describe, expect, it } from 'vitest';
import { formatarNota, getReputacao, parseReputacao } from '@/lib/content/reputacao';

const valida = {
  google: {
    nota: 4.5,
    avaliacoes: 458,
    consultadoEm: '2026-10-26',
    url: 'https://www.google.com/maps/search/?api=1&query=Academia%20Flex',
  },
};

describe('parseReputacao', () => {
  it('aceita nota, total de avaliações, data da consulta e link', () => {
    expect(parseReputacao(valida).google.nota).toBe(4.5);
  });

  it('rejeita nota fora de 1 a 5 (edge case)', () => {
    expect(() => parseReputacao({ google: { ...valida.google, nota: 5.2 } })).toThrow();
  });

  it('rejeita sem a data da consulta (o número muda com o tempo)', () => {
    const semData: Record<string, unknown> = { ...valida.google };
    delete semData.consultadoEm;
    expect(() => parseReputacao({ google: semData })).toThrow();
  });

  it('rejeita link que não é do Google', () => {
    expect(() =>
      parseReputacao({ google: { ...valida.google, url: 'https://exemplo.com' } })
    ).toThrow();
  });
});

describe('formatarNota', () => {
  it('usa vírgula decimal do pt-BR e uma casa', () => {
    expect(formatarNota(4.5)).toBe('4,5');
    expect(formatarNota(5)).toBe('5,0');
  });
});

describe('getReputacao (arquivo real)', () => {
  it('content/reputacao.json é válido', () => {
    expect(() => getReputacao()).not.toThrow();
  });
});
