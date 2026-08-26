import type { NextConfig } from 'next';

/**
 * Headers de segurança pro deploy público na Vercel. Site é 100% estático
 * (sem API routes, sem Server Actions, sem CMS) — deliberadamente SEM CSP
 * baseado em nonce (que a doc oficial recomenda como "mais forte"): nonce
 * exige renderização dinâmica em toda página (node_modules/next/dist/docs/
 * 01-app/02-guides/content-security-policy.md, seção "Static vs Dynamic
 * Rendering"), o que quebraria a geração estática e o gate de Lighthouse
 * 95+ do SDD.md §10. Usando a variante "Without Nonces" da mesma doc.
 *
 * script-src/style-src precisam de 'unsafe-inline' porque o app usa
 * `style={{...}}` inline (hero, marquee, opengraph-image, photo-placeholder)
 * e o próprio Next injeta script inline de hydration — sem isso a home
 * quebra em produção. 'unsafe-eval' só em dev (React usa eval só nesse
 * modo, pra stack trace — nunca em build de produção).
 *
 * frame-src libera só o host do embed do Google Maps usado em Contato
 * (src/app/(home)/_components/contato.tsx) — sem isso o mapa não carrega.
 *
 * `upgrade-insecure-requests` só em produção (nunca em dev): achado real
 * rodando o e2e completo no Mobile Safari (webkit) contra `next dev` em
 * `http://localhost` — o WebKit tentava fazer handshake TLS pra buscar os
 * assets porque a diretiva manda promover TODA requisição pra https, mesmo
 * localhost sem TLS nenhum ("Error performing TLS handshake: An unexpected
 * TLS packet was received", CSS/JS nunca carregavam, nav do header ficava
 * sem o `hidden lg:flex` aplicado, 9 testes falhando). Chromium tolera isso
 * silenciosamente (por isso passou em Desktop/Mobile Chrome); WebKit não.
 * Em produção real (Vercel, só HTTPS) a diretiva não muda nada — é reforço
 * inofensivo — então só faz sentido incluir fora de dev/teste.
 */
const isDev = process.env.NODE_ENV === 'development';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  frame-src https://www.google.com;
  connect-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  ${isDev ? '' : 'upgrade-insecure-requests;'}
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  { key: 'Content-Security-Policy', value: cspHeader },
  // Reforça frame-ancestors pra navegador antigo sem suporte a CSP nível 2.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
