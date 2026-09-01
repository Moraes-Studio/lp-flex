'use client';

import * as React from 'react';

interface CountUpProps {
  /** Valor final já formatado como vai aparecer, ex: "34+", "11", "10" — só
   * o prefixo numérico é animado, o resto (sufixo tipo "+") é preservado
   * como veio. Se não começar com dígito, mostra o valor como está, sem
   * animação (fallback seguro pra conteúdo inesperado). */
  value: string;
  durationMs?: number;
  className?: string;
}

/**
 * Motion signature §6.A (V1.5): 0 → valor final quando o elemento entra em
 * viewport, uma vez só. Mesma base de reveal.tsx (IntersectionObserver puro,
 * sem lib externa) em vez de reusar <Reveal> — aqui o que anima é o
 * conteúdo numérico (texto), não opacity/transform do wrapper.
 */
export function CountUp({ value, durationMs = 850, className }: CountUpProps) {
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';

  const ref = React.useRef<HTMLSpanElement>(null);
  const startedRef = React.useRef(false);
  const [display, setDisplay] = React.useState(target === null ? value : String(target));

  React.useEffect(() => {
    if (target === null) return;
    const node = ref.current;
    if (!node) return;

    const reduzido =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduzido) {
      // Já renderiza o valor final por padrão (ver useState acima) — nada a
      // fazer, só não anima.
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();

        setDisplay('0');
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(String(Math.round(target * eased)));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return (
    <span ref={ref} className={className}>
      {target === null ? value : display}
      {suffix}
    </span>
  );
}
