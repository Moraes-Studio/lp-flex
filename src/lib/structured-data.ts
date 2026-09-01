import { siteConfig } from '@/config/site';
import type { DiaFuncionamento } from '@/lib/content/funcionamento-shared';

/** Schema.org só aceita o nome em inglês do dia da semana (string curta,
 * amplamente aceita como alternativa às URIs completas https://schema.org/Monday). */
const DIA_CURTO_PARA_SCHEMA_ORG: Record<string, string> = {
  Dom: 'Sunday',
  Seg: 'Monday',
  Ter: 'Tuesday',
  Qua: 'Wednesday',
  Qui: 'Thursday',
  Sex: 'Friday',
  Sáb: 'Saturday',
};

/**
 * JSON-LD do negócio (schema.org) — SportsActivityLocation, o tipo mais
 * específico que ainda descreve corretamente uma academia de bairro com
 * endereço físico e grade de horários (é um LocalBusiness/Place na prática).
 *
 * Só campos confirmados no projeto entram aqui — nada de
 * telefone/avaliação/geolocalização/faixa de preço inventados (RULES.md
 * Regra 0: spec incompleto não vira suposição). `telephone` fica de fora de
 * propósito: o único contato "tipo telefone" confirmado é o WhatsApp
 * (`siteConfig.whatsappNumber`), e o projeto sempre trata isso como canal de
 * WhatsApp (links `wa.me`), nunca como linha telefônica geral — schema.org
 * não tem uma propriedade própria pra "WhatsApp", então fica fora do
 * JSON-LD em vez de forçar num campo que não é bem isso.
 */
export function gerarJsonLdNegocio(funcionamento: DiaFuncionamento[]) {
  const endereco = siteConfig.address;

  const openingHoursSpecification = funcionamento
    .filter((dia) => dia.abre && dia.fecha)
    .map((dia) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DIA_CURTO_PARA_SCHEMA_ORG[dia.diaCurto] ?? dia.diaCurto,
      opens: dia.abre,
      closes: dia.fecha,
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    image: `${siteConfig.url}/opengraph-image`,
    description: siteConfig.tagline,
    address: {
      '@type': 'PostalAddress',
      streetAddress: endereco.street,
      addressLocality: endereco.city,
      addressRegion: endereco.state,
      postalCode: endereco.zip,
      addressCountry: 'BR',
    },
    openingHoursSpecification,
    sameAs: [siteConfig.instagramUrl].filter((url): url is string => Boolean(url)),
  };
}
