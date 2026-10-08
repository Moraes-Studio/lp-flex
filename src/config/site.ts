import { publicEnv } from '@/config/env.public';

/**
 * Dados institucionais estáticos (endereço, CNPJ, fundação). Diferente de
 * `content/*.json`, isto muda raramente e não é editado por quem não é dev.
 * CNPJ e WhatsApp (env) confirmados pelo cliente em 2026-08-18. Endereço
 * confirmado pelo cliente em 2026-08-25 (RULES.md #7, SDD.md §11.4).
 */
export const siteConfig = {
  name: 'Academia Flex',
  tagline: 'Musculação e aulas coletivas desde 1992.',
  // Meta description da home e `description` do JSON-LD (uma fonte só).
  // Cada afirmação conferida contra o conteúdo real: "Vila Helena, Santo
  // André, desde 1992", "professor em sala" (SDD.md §7) e modalidades que
  // existem em content/modalidades.json ("e mais" cobre as outras).
  descricaoSeo:
    'Academia em Vila Helena, Santo André, desde 1992. Musculação com professor em sala e aulas de Pilates, Yoga, Zumba, Jump, Fit Dance e mais.',
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  whatsappNumber: publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER,
  instagramUrl: publicEnv.NEXT_PUBLIC_INSTAGRAM_URL,
  facebookUrl: null as string | null,
  foundedYear: 1992,
  cnpj: '68.934.850/0001-09',
  razaoSocial: null as string | null,
  address: {
    street: 'R. das Hortênsias, 104, Vila Helena',
    city: 'Santo André',
    state: 'SP',
    zip: '09175-500',
  },
};

export function whatsappUrl(message: string): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${siteConfig.whatsappNumber}?${params.toString()}`;
}

/** Link "Abrir no Google Maps" (Contato) e `hasMap` do JSON-LD. */
export function mapsUrl(): string {
  const { street, city, state, zip } = siteConfig.address;
  const query = encodeURIComponent(`${street}, ${city}, ${state}, ${zip}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
