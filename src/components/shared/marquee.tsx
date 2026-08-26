import * as React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  durationSeconds?: number;
}

function Marquee({ items, durationSeconds = 30, className, ...props }: MarqueeProps) {
  return (
    <div
      className={cn(
        'border-border bg-card overflow-hidden border-t border-b whitespace-nowrap',
        className
      )}
      {...props}
    >
      <div
        className="animate-marquee inline-block py-4 motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            /* text-flex-blue-600 (não text-flex-bright): nesse tamanho (12.5px,
             * peso normal) o azul de acento dá só 4.27:1 de contraste em fundo
             * branco — abaixo do 4.5:1 exigido pra texto pequeno (WCAG AA),
             * achado num Lighthouse audit real. flex-blue-600 é o institucional
             * (mesmo azul do logo), 8:1 de contraste, sem inventar cor nova. */
            className="border-border text-flex-blue-600 mr-3 inline-block rounded-[10px] border px-4 py-[7px] font-mono text-[12.5px] tracking-[0.06em] uppercase last:mr-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export { Marquee };
