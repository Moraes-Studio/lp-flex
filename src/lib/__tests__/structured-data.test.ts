import { describe, expect, it } from 'vitest';
import { gerarJsonLdNegocio } from '@/lib/structured-data';
import type { DiaFuncionamento } from '@/lib/content/funcionamento-shared';

const funcionamento: DiaFuncionamento[] = [
  { dia: 'Domingo e feriados', diaCurto: 'Dom', abre: '09:30', fecha: '12:30' },
  { dia: 'Segunda', diaCurto: 'Seg', abre: '05:00', fecha: '23:00' },
  { dia: 'Terça', diaCurto: 'Ter', abre: '05:00', fecha: '23:00' },
  { dia: 'Quarta', diaCurto: 'Qua', abre: '05:00', fecha: '23:00' },
  { dia: 'Quinta', diaCurto: 'Qui', abre: '05:00', fecha: '23:00' },
  { dia: 'Sexta', diaCurto: 'Sex', abre: '05:00', fecha: '22:00' },
  { dia: 'Sábado', diaCurto: 'Sáb', abre: '09:00', fecha: '15:00' },
];

describe('gerarJsonLdNegocio', () => {
  const jsonLd = gerarJsonLdNegocio(funcionamento);

  it('usa o tipo SportsActivityLocation', () => {
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('SportsActivityLocation');
  });

  it('não inventa telefone, avaliação, geolocalização ou faixa de preço', () => {
    const chaves = Object.keys(jsonLd);
    expect(chaves).not.toContain('telephone');
    expect(chaves).not.toContain('aggregateRating');
    expect(chaves).not.toContain('geo');
    expect(chaves).not.toContain('priceRange');
  });

  it('endereço bate com os dados reais confirmados', () => {
    expect(jsonLd.address).toMatchObject({
      '@type': 'PostalAddress',
      addressLocality: 'Santo André',
      addressRegion: 'SP',
      addressCountry: 'BR',
    });
    expect(jsonLd.address.streetAddress).toContain('Vila Helena');
  });

  it('gera um OpeningHoursSpecification por dia aberto, com dayOfWeek em inglês', () => {
    expect(jsonLd.openingHoursSpecification).toHaveLength(7);
    const segunda = jsonLd.openingHoursSpecification.find((d) => d.dayOfWeek === 'Monday');
    expect(segunda).toMatchObject({ '@type': 'OpeningHoursSpecification', opens: '05:00', closes: '23:00' });
  });

  it('não inclui dia sem abre/fecha (edge case)', () => {
    const semDomingo = funcionamento.map((d) => (d.diaCurto === 'Dom' ? { ...d, abre: null, fecha: null } : d));
    const resultado = gerarJsonLdNegocio(semDomingo);
    expect(resultado.openingHoursSpecification).toHaveLength(6);
  });

  it('sameAs só inclui URLs reais (Instagram configurado)', () => {
    expect(jsonLd.sameAs.length).toBeGreaterThan(0);
    jsonLd.sameAs.forEach((url) => expect(url).toMatch(/^https:\/\//));
  });
});
