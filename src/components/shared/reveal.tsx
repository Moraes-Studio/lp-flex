'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Atraso do fade-in em ms, pra escalonar um pequeno grupo (ex: cards de um
   * grid) sem precisar de um observer por item. */
  delayMs?: number;
}

/**
 * Entrada única ao rolar (reveal-once), sem depender de biblioteca — só
 * IntersectionObserver + CSS (ver globals.css `.reveal`/`.reveal-hidden`).
 *
 * Progressive enhancement de verdade (item 9 da lapidação): o filho é
 * renderizado normalmente no servidor, sem nenhuma classe que esconda
 * conteúdo — se o JS nunca rodar, o texto nunca fica preso em opacity:0.
 * Só depois de montar, em `useLayoutEffect` (antes do próximo paint, evita
 * flash), é que decide: se o elemento já está visível na tela nesse momento
 * (ex: item no topo em telas grandes), não faz nada — não tem por que
 * animar algo que já apareceu. Só arma o estado escondido pra quem começa
 * fora da viewport, e revela (uma vez, sem desfazer) quando o
 * IntersectionObserver confirma a entrada — diferente da tentativa anterior
 * (`animation-timeline: view()`), que reescondia o elemento sempre que o
 * scroll voltava pra cima.
 */
export function Reveal({ children, delayMs = 0, className, style, ...props }: RevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [armed, setArmed] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const jaVisivel = rect.top < window.innerHeight && rect.bottom > 0;
    if (jaVisivel) return;

    setArmed(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(armed && 'reveal', armed && !visible && 'reveal-hidden', className)}
      style={delayMs ? ({ ...style, '--reveal-delay': `${delayMs}ms` } as React.CSSProperties) : style}
      {...props}
    >
      {children}
    </div>
  );
}
