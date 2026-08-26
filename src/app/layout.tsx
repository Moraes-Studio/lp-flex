import type { Metadata, Viewport } from 'next';
import { Barlow, IBM_Plex_Mono, Oswald } from 'next/font/google';
import { publicEnv } from '@/config/env.public';
import { siteConfig } from '@/config/site';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsappFloat } from '@/components/shared/whatsapp-float';
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

const description =
  'Academia na Vila Helena, Santo André, desde 1992. Musculação e aulas coletivas com professor em sala montando o treino. Veja grade de horários e planos.';
const ogDescription =
  'Musculação e aulas coletivas desde 1992, com professor em sala montando o treino.';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Vila Helena, Santo André`,
    template: `%s — ${siteConfig.name}`,
  },
  description,
  keywords: ['academia', 'Santo André', 'Vila Helena', 'musculação', 'aulas coletivas', 'pilates', 'yoga', 'zumba'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Vila Helena, Santo André`,
    description: ogDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — Vila Helena, Santo André`,
    description: ogDescription,
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
      </body>
    </html>
  );
}
