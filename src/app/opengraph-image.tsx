import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${siteConfig.name} — Vila Helena, Santo André`;

/**
 * Gráfico de marca gerado em runtime (Satori) — logo oficial real
 * (public/logo.png, embutido como base64: `next/og` roda fora do
 * filesystem público em edge, `runtime = 'nodejs'` acima permite ler o
 * arquivo direto) + texto institucional, não foto. Fora da política de
 * fotografia do CLAUDE.md (que trata de fotografia documental de
 * pessoas/espaço) — é o mesmo tipo de elemento decorativo/de interface que
 * ícones e diagramas.
 *
 * Fundo sólido (não gradiente) — SEO §NÃO ALTERAR O VISUAL desta rodada:
 * mesmo princípio de "cor cheia" já usado no resto do site (Footer, Sobre,
 * plano recomendado), sem inventar tratamento novo só pra este asset.
 */
export default function OpengraphImage() {
  const logoBuffer = readFileSync(path.join(process.cwd(), 'public', 'logo.png'));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '88px 96px',
          background: '#083a7c',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <img src={logoSrc} width={116} height={109} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 56, fontWeight: 700, letterSpacing: -1 }}>
              {siteConfig.name}
            </div>
            <div style={{ display: 'flex', fontSize: 26, opacity: 0.85, marginTop: 6, letterSpacing: 1 }}>
              Vila Helena · {siteConfig.address.city} — {siteConfig.address.state}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', width: 64, height: 3, background: 'rgba(255,255,255,0.4)', marginTop: 48, marginBottom: 30 }} />
        <div style={{ display: 'flex', fontSize: 30, opacity: 0.92, maxWidth: 860 }}>{siteConfig.tagline}</div>
      </div>
    ),
    { ...size }
  );
}
