import type { Metadata, Viewport } from 'next';
import { Barlow, IBM_Plex_Mono, Oswald } from 'next/font/google';
import { publicEnv } from '@/config/env.public';
import { siteConfig } from '@/config/site';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsappFloat } from '@/components/shared/whatsapp-float';
import { CookieConsent } from '@/components/shared/cookie-consent';
import { AnchorScrollHandler } from '@/components/shared/anchor-scroll-handler';
import './globals.css';

const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
});

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
});

// Título e description finais da homepage — cada afirmação conferida contra
// o conteúdo real antes de usar (SEO, rodada final): "Vila Helena, Santo
// André, desde 1992" (siteConfig), "professor em sala" (diferencial real,
// SDD.md §7), "Pilates, Yoga, Zumba, Jump[ Funcional], Fit Dance" (todas em
// content/modalidades.json — "e mais" cobre as outras 6: Step Funcional,
// GAP, Ritbox, Flex Training, Cross Training). Nada inventado.
const title = 'Academia Flex | Musculação e Aulas em Santo André';
const description =
  'Academia em Vila Helena, Santo André, desde 1992. Musculação com professor em sala e aulas de Pilates, Yoga, Zumba, Jump, Fit Dance e mais.';
// URL canônica absoluta da home. Um só cálculo, reusado em `alternates.canonical`
// E `openGraph.url` (nunca duas fontes divergentes pra "a URL canônica").
// Nota: o próprio Next.js normaliza a barra final pra fora ao renderizar
// estas tags (`https://www.academiaflex.com.br`, não `.../`) — confirmado
// testando com `new URL(...)` puro (mantém a barra) vs. o HTML final
// gerado pelo Next (remove); é comportamento nativo do framework ligado ao
// `trailingSlash` padrão, não um bug — as duas formas são a mesma URL pra
// qualquer crawler/Search Console, e aqui só existe UM valor de canonical
// (nunca duplicado), que é a exigência real por trás do pedido.
const canonicalUrl = new URL('/', siteConfig.url).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: title,
    template: `%s — ${siteConfig.name}`,
  },
  description,
  keywords: ['academia', 'Santo André', 'Vila Helena', 'musculação', 'aulas coletivas', 'pilates', 'yoga', 'zumba'],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: canonicalUrl,
    siteName: siteConfig.name,
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: { index: true, follow: true },
  // Cadastro de domínio no Meta Business Manager (opcional, ver .env.example) —
  // sem a env, a tag simplesmente não é renderizada.
  verification: publicEnv.NEXT_PUBLIC_META_DOMAIN_VERIFICATION
    ? { other: { 'facebook-domain-verification': publicEnv.NEXT_PUBLIC_META_DOMAIN_VERIFICATION } }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: '#0b4da2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${oswald.variable} ${barlow.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AnchorScrollHandler />
        <Header />
        {children}
        <Footer />
        <WhatsappFloat />
        <CookieConsent />
      </body>
    </html>
  );
}
