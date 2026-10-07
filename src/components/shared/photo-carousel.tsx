'use client';

import * as React from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Foto } from '@/config/media';

interface PhotoCarouselProps {
  fotos: Foto[];
  /** Nome acessível da região, ex.: "Fotos da Academia Flex". */
  rotulo: string;
}

/**
 * Carrossel de fotos do espaço (Sobre, rodada 2026-10-07).
 * - Scroll nativo com scroll-snap: toque, trackpad e arraste funcionam sem JS.
 * - Setas SEMPRE visíveis, nunca só no hover (RULES #5: a seta do carrossel
 *   antigo de professores ficou invisível em touch, bug real de produção).
 * - Fim/início detectados por IntersectionObserver no primeiro/último slide
 *   (nada de listener de scroll).
 * - Sem autoplay e sem contador "03 / 08". Legenda abaixo da foto.
 */
export function PhotoCarousel({ fotos, rotulo }: PhotoCarouselProps) {
  const trilho = React.useRef<HTMLDivElement>(null);
  const primeiro = React.useRef<HTMLElement | null>(null);
  const ultimo = React.useRef<HTMLElement | null>(null);
  const [noInicio, setNoInicio] = React.useState(true);
  const [noFim, setNoFim] = React.useState(false);

  React.useEffect(() => {
    const root = trilho.current;
    const alvos = [primeiro.current, ultimo.current].filter((el): el is HTMLElement => el !== null);
    if (!root || alvos.length === 0) return;
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const visivel = e.intersectionRatio > 0.9;
          if (e.target === primeiro.current) setNoInicio(visivel);
          if (e.target === ultimo.current) setNoFim(visivel);
        }
      },
      { root, threshold: [0, 0.9, 1] }
    );
    for (const alvo of new Set(alvos)) observer.observe(alvo);
    return () => observer.disconnect();
  }, []);

  const mover = React.useCallback((direcao: 1 | -1) => {
    const el = trilho.current;
    const slide = el?.querySelector<HTMLElement>('figure');
    if (!el || !slide) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: direcao * (slide.offsetWidth + gap), behavior: reduzido ? 'auto' : 'smooth' });
  }, []);

  const aoTeclar = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      mover(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      mover(-1);
    }
  };

  const botao =
    'border-border text-flex-blue-700 hover:bg-flex-ice flex h-11 w-11 items-center justify-center rounded-full border bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flex-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-35';

  return (
    <div>
      <div
        ref={trilho}
        role="region"
        aria-roledescription="carrossel"
        aria-label={rotulo}
        tabIndex={0}
        onKeyDown={aoTeclar}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flex-blue-600 md:gap-5 [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((foto, i) => (
          <figure
            key={foto.src}
            ref={(el) => {
              if (i === 0) primeiro.current = el;
              if (i === fotos.length - 1) ultimo.current = el;
            }}
            className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-[31.5%]"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 82vw"
                className="object-cover"
              />
            </div>
            {foto.legenda ? (
              <figcaption className="text-muted-foreground mt-2.5 text-[13.5px]">{foto.legenda}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      <div className="mt-5 flex gap-2.5">
        <button type="button" aria-label="Foto anterior" onClick={() => {
            if (!noInicio) mover(-1);
          }}
          aria-disabled={noInicio}
          className={botao}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" aria-label="Próxima foto" onClick={() => {
            if (!noFim) mover(1);
          }}
          aria-disabled={noFim}
          className={botao}>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
