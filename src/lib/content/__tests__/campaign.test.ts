import { describe, expect, it } from 'vitest';
import { campanhaVisivel, getCampaign, parseCampaign } from '@/lib/content/campaign';

describe('parseCampaign', () => {
  it('aceita campanha inativa sem os campos de texto', () => {
    expect(parseCampaign({ active: false, season: 'outubroRosa' })).toEqual({
      active: false,
      season: 'outubroRosa',
    });
  });

  it('aceita campanha ativa com tag/titulo/sub preenchidos', () => {
    const campanha = {
      active: true,
      season: 'diaDosPais',
      tag: 'Campanha Dia dos Pais',
      titulo: 'Primeiro mês por R$ 9,90',
      sub: 'Depois 11x de R$ 129,90.',
      terminaEm: '2026-08-31',
    };
    expect(parseCampaign(campanha)).toEqual(campanha);
  });

  it('rejeita campanha ativa sem tag/titulo/sub (JSON malformado)', () => {
    expect(() => parseCampaign({ active: true, season: 'diaDosPais' })).toThrow();
  });

  it('rejeita active com tipo errado (JSON malformado)', () => {
    expect(() => parseCampaign({ active: 'false', season: 'outubroRosa' })).toThrow();
  });

  it('rejeita season vazio', () => {
    expect(() => parseCampaign({ active: false, season: '' })).toThrow();
  });
});

describe('getCampaign (arquivo real)', () => {
  it('content/campaign.json é válido', () => {
    expect(() => getCampaign()).not.toThrow();
  });
});

describe('campanhaVisivel', () => {
  const base = {
    active: true,
    season: 'diaDosPais',
    tag: 'Campanha Dia dos Pais',
    titulo: 'Primeiro mês por R$ 9,90',
    sub: 'Depois 11x de R$ 129,90.',
  };

  it('true quando active e sem data de término', () => {
    expect(campanhaVisivel(base, new Date('2026-08-18'))).toBe(true);
  });

  it('false quando active:false, mesmo dentro do prazo', () => {
    expect(campanhaVisivel({ ...base, active: false }, new Date('2026-08-18'))).toBe(false);
  });

  it('true até o fim do dia de terminaEm (edge case)', () => {
    const comPrazo = { ...base, terminaEm: '2026-08-31' };
    expect(campanhaVisivel(comPrazo, new Date('2026-08-31T22:00:00'))).toBe(true);
  });

  it('false depois de terminaEm', () => {
    const comPrazo = { ...base, terminaEm: '2026-08-31' };
    expect(campanhaVisivel(comPrazo, new Date('2026-09-01T00:00:01'))).toBe(false);
  });
});
