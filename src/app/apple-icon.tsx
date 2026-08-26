import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * Ícone pra tela inicial do iOS — mesmo motivo de `icon.tsx` (barra de
 * anilhas em silhueta branca), mas preenchendo o quadrado inteiro sem
 * cantos arredondados de propósito: o iOS aplica a própria máscara
 * arredondada por cima, então um fundo já recortado fica com borda dupla.
 */
export default function AppleIcon() {
  const s = size.width;
  const barWidth = s * 0.62;
  const barHeight = s * 0.085;
  const plateWidth = s * 0.16;
  const plateHeight = s * 0.38;
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
          background: 'linear-gradient(135deg, #0b4da2 0%, #083a7c 100%)',
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
