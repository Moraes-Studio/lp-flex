import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${siteConfig.name} — Vila Helena, Santo André`;

/**
 * Gráfico de marca gerado em runtime (Satori) — texto + cores institucionais,
 * não foto. Não entra na política de fotografia do CLAUDE.md (que trata de
 * fotografia documental de pessoas/espaço); é o mesmo tipo de elemento
 * decorativo/de interface que ícones e diagramas, explicitamente fora dessa
 * restrição. Usado pelo Next.js como `og:image` — a primeira coisa que
 * aparece quando o link do site é compartilhado no WhatsApp/Instagram/Meta.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          background: 'linear-gradient(135deg, #0b4da2 0%, #083a7c 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: 0.85,
          }}
        >
          <div style={{ width: 44, height: 3, background: '#ffffff' }} />
          Academia
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 190,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1,
            marginTop: 6,
          }}
        >
          FLEX
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            marginTop: 28,
            opacity: 0.92,
          }}
        >
          Vila Helena · Santo André · desde {siteConfig.foundedYear}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            marginTop: 14,
            opacity: 0.78,
          }}
        >
          Musculação e aulas coletivas com professor em sala montando o treino.
        </div>
      </div>
    ),
    { ...size }
  );
}
