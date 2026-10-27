'use client';

import * as React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Mapa do Google só carrega quando o visitante pede (clique em "Mostrar
 * mapa"). Antes disso nenhuma requisição vai ao Google, então o site não
 * define cookie de terceiro sem uma ação explícita — foi o que tornou o
 * banner de cookies desnecessário (rodada 2026-10-26): o banner antigo não
 * controlava o iframe, que carregava sempre, e cobria o CTA do hero no
 * celular. O aviso fica aqui, no ponto da decisão, não num overlay global.
 */
export function MapaContato({ src }: { src: string }) {
  const [carregado, setCarregado] = React.useState(false);

  if (carregado) {
    return (
      <iframe
        title="Localização da Academia Flex"
        src={src}
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0 [filter:grayscale(38%)_contrast(1.05)_saturate(1.1)]"
      />
    );
  }

  return (
    <div className="absolute inset-0">
      {/* Mapa estilizado, genérico (ruas e quadras desenhadas, não é o mapa
       * real): o painel lê como "mapa esperando carregar" em vez de um
       * retângulo vazio. Ilustração de interface, nada é baixado do Google. */}
      <svg
        aria-hidden="true"
        className="text-flex-blue-600 absolute inset-0 h-full w-full"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="300" fill="currentColor" opacity="0.06" />
        <g fill="currentColor" opacity="0.07">
          <rect x="18" y="20" width="96" height="70" rx="6" />
          <rect x="136" y="20" width="118" height="70" rx="6" />
          <rect x="276" y="20" width="110" height="70" rx="6" />
          <rect x="18" y="112" width="96" height="78" rx="6" />
          <rect x="276" y="112" width="110" height="78" rx="6" />
          <rect x="18" y="212" width="236" height="74" rx="6" />
          <rect x="276" y="212" width="110" height="74" rx="6" />
        </g>
        <g stroke="white" strokeLinecap="round" fill="none">
          <path d="M0 101 H400 M0 201 H400 M125 0 V300 M265 0 V300" strokeWidth="12" />
          <path d="M-20 300 C 120 220, 220 160, 420 40" strokeWidth="18" />
        </g>
      </svg>

      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        {/* Sem o endereço aqui: ele já é a legenda da foto da fachada, ao lado. */}
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
          <MapPin className="text-flex-blue-600 h-6 w-6" aria-hidden="true" />
        </span>
        <Button size="sm" onClick={() => setCarregado(true)}>
          Mostrar mapa
        </Button>
        <p className="text-foreground/70 max-w-[300px] rounded-md bg-white/80 px-3 py-1.5 text-[13.5px] leading-snug normal-case">
          O mapa é carregado do Google, que pode registrar dados de navegação.
        </p>
      </div>
    </div>
  );
}
