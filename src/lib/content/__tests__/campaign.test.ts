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

  it('true até o fim do dia de terminaEm em São Paulo (edge case)', () => {
    // 22:00 de 31/08 em São Paulo = 2026-09-01T01:00:00Z — instante que já é
    // "01/09" em UTC, mas ainda "31/08" em São Paulo, e terminaEm significa
    // "válido durante todo o dia 31/08 em São Paulo".
    const comPrazo = { ...base, terminaEm: '2026-08-31' };
    expect(campanhaVisivel(comPrazo, new Date('2026-09-01T01:00:00Z'))).toBe(true);
  });

  it('false depois do fim do dia de terminaEm em São Paulo', () => {
    // 2026-09-01T03:00:00Z = 2026-09-01T00:00:00-03:00 — meia-noite exata de
    // 1º de setembro em São Paulo, já fora do prazo.
    const comPrazo = { ...base, terminaEm: '2026-08-31' };
    expect(campanhaVisivel(comPrazo, new Date('2026-09-01T03:00:00Z'))).toBe(false);
  });

  it('não usa new Date(string sem timezone) — mesma string interpretada com \'Z\' e sem \'Z\' não pode divergir no resultado', () => {
    // Reforça a correção: antes, `new Date(`${terminaEm}T23:59:59`)` sem
    // timezone dependia do fuso do processo. Aqui comparamos o limite real
    // (calculado via fimDoDiaEmSaoPaulo, indiretamente através de
    // campanhaVisivel) contra um instante 1ms antes e 1ms depois — o
    // resultado não pode depender de em que fuso o teste roda.
    const comPrazo = { ...base, terminaEm: '2026-08-31' };
    const limite = new Date('2026-09-01T02:59:59.999Z');
    const umMsAntes = new Date(limite.getTime() - 1);
    const umMsDepois = new Date(limite.getTime() + 1);
    expect(campanhaVisivel(comPrazo, umMsAntes)).toBe(true);
    expect(campanhaVisivel(comPrazo, limite)).toBe(true);
    expect(campanhaVisivel(comPrazo, umMsDepois)).toBe(false);
  });
});
