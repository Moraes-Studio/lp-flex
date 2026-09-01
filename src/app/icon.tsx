import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/**
 * Favicon gerado em runtime (mesma técnica de `opengraph-image.tsx`:
 * Satori/`next/og`, não foto — fora da política de fotografia do
 * CLAUDE.md, que trata de gente/espaço real, não elemento de interface).
 * Substitui o `favicon.ico` genérico do scaffold do Next.js (nunca
 * customizado, ainda o triângulo padrão).
 *
 * Design: badge circular azul institucional com uma barra de anilhas
 * (barbell) em silhueta branca no meio — o mesmo motivo do logo real
 * (public/logo.png: círculo + barra), reduzido ao essencial pra continuar
 * legível em 16×16/32×32. Sem texto: "ACADEMIA FLEX" inteiro não sobrevive
 * a esse tamanho, a barra sozinha já lê como "academia" instantaneamente.
 */
export default function Icon() {
  const s = size.width;
  const barWidth = s * 0.62;
  const barHeight = s * 0.09;
  const plateWidth = s * 0.17;
  const plateHeight = s * 0.4;
  const plateRadius = plateWidth * 0.3;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: '#0b4da2',
        }}
      >
        <div style={{ position: 'relative', width: barWidth, height: plateHeight, display: 'flex' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: (plateHeight - barHeight) / 2,
              height: barHeight,
              background: '#ffffff',
              borderRadius: barHeight / 2,
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -plateWidth * 0.15,
              top: 0,
              width: plateWidth,
              height: plateHeight,
              background: '#ffffff',
              borderRadius: plateRadius,
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: -plateWidth * 0.15,
              top: 0,
              width: plateWidth,
              height: plateHeight,
              background: '#ffffff',
              borderRadius: plateRadius,
              display: 'flex',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
