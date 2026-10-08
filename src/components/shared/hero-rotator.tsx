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
 * Iteração imersiva: preenche o hero em tela cheia (sizes 100vw); o hero
 * aplica por cima só uma camada de cor sólida, nada de placa/legenda.
 * - Só a primeira foto é prioridade de carregamento (é o LCP). As outras ficam
 *   empilhadas por baixo, dentro da viewport, então o lazy nativo não as
 *   segurava: entravam no carregamento inicial com prioridade alta. Agora só
 *   são montadas depois do `load` da página, e a rotação só começa aí.
 * - Cada foto tem o próprio `alt`; as inativas ficam `aria-hidden`, então só a
 *   foto ativa é exposta a leitores de tela.
 * - Com `prefers-reduced-motion: reduce`, nunca troca: fica na primeira, e as
 *   outras nem são baixadas.
 * - Pausa com a aba oculta, pra não acumular trocas em segundo plano.
 */
export function HeroRotator({ fotos, intervaloMs = 6000 }: HeroRotatorProps) {
  const [ativo, setAtivo] = React.useState(0);
  // Slide que acabou de sair: mantém o zoom até o fim do fade, sem salto de escala.
  const [anterior, setAnterior] = React.useState<number | null>(null);
  const ativoRef = React.useRef(0);
  const [montarTodas, setMontarTodas] = React.useState(false);

  React.useEffect(() => {
    if (fotos.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const montar = () => setMontarTodas(true);
    if (document.readyState === 'complete') {
      montar();
      return;
    }
    window.addEventListener('load', montar, { once: true });
    return () => window.removeEventListener('load', montar);
  }, [fotos.length]);

  React.useEffect(() => {
    if (!montarTodas) return;

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
  }, [montarTodas, fotos.length, intervaloMs]);

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
          {i === 0 || montarTodas ? (
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              sizes="100vw"
              preload={i === 0}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              className={cn('object-cover', (i === ativo || i === anterior) && 'hero-zoom')}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
