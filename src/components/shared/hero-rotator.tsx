'use client';

import * as React from 'react';
import Image from 'next/image';
import type { Foto } from '@/config/media';
import { cn } from '@/lib/utils';

interface HeroRotatorProps {
  fotos: Foto[];
  intervaloMs?: number;
}

/**
 * Fotos do hero em crossfade lento (o "site vivo" pedido pelo cliente, sem
 * setas nem bolinhas: o visitante não precisa controlar, é ambientação).
 * Nada é sobreposto à foto (decisão de 2026-10-07).
 * - Só a primeira foto é prioridade de carregamento (é o LCP).
 * - Com `prefers-reduced-motion: reduce`, nunca troca: fica na primeira.
 * - Pausa com a aba oculta, pra não acumular trocas em segundo plano.
 */
export function HeroRotator({ fotos, intervaloMs = 6000 }: HeroRotatorProps) {
  const [ativo, setAtivo] = React.useState(0);
  // Slide que acabou de sair: mantém o zoom até o fim do fade, sem salto de escala.
  const [anterior, setAnterior] = React.useState<number | null>(null);
  const ativoRef = React.useRef(0);

  React.useEffect(() => {
    if (fotos.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let id: number | undefined;
    const iniciar = () => {
      window.clearInterval(id);
      id = window.setInterval(() => {
        setAnterior(ativoRef.current);
        ativoRef.current = (ativoRef.current + 1) % fotos.length;
        setAtivo(ativoRef.current);
      }, intervaloMs);
    };
    const aoMudarVisibilidade = () => {
      if (document.hidden) window.clearInterval(id);
      else iniciar();
    };

    iniciar();
    document.addEventListener('visibilitychange', aoMudarVisibilidade);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', aoMudarVisibilidade);
    };
  }, [fotos.length, intervaloMs]);

  return (
    <div
      data-testid="hero-rotator"
      data-ativo={ativo}
      className="relative h-full w-full overflow-hidden"
    >
      {fotos.map((foto, i) => (
        <div
          key={foto.src}
          aria-hidden={i !== ativo}
          className={cn(
            'absolute inset-0 transition-opacity duration-[1200ms] ease-out',
            i === ativo ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={foto.src}
            alt={i === 0 ? foto.alt : ''}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            preload={i === 0}
            fetchPriority={i === 0 ? 'high' : 'auto'}
            className={cn('object-cover', (i === ativo || i === anterior) && 'hero-zoom')}
          />
        </div>
      ))}
    </div>
  );
}
