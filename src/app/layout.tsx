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

// Só o subset `latin`: ele já cobre todo o português (ã, ç, é, õ…). O
// `latin-ext` dobrava os arquivos pré-carregados (14 → 7) sem nenhum
// caractere em uso, e as fontes competiam com o logo e a foto do hero no LCP mobile.
const oswald = Oswald({
  variable: '--font-oswald',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

// Título final da homepage — cada afirmação conferida contra o conteúdo real
// (SEO, rodada final). A description fica em `siteConfig.descricaoSeo`, que o
// JSON-LD também usa.
const title = 'Academia Flex | Musculação e Aulas em Santo André';
const description = siteConfig.descricaoSeo;
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
  keywords: [
    'academia',
    'Santo André',
    'Vila Helena',
    'musculação',
    'aulas coletivas',
    'pilates',
    'yoga',
    'zumba',
  ],
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
