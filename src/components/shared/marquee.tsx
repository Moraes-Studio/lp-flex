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
            className="border-border text-flex-bright mr-3 inline-block rounded-[10px] border px-4 py-[7px] font-mono text-[12.5px] tracking-[0.06em] uppercase last:mr-0"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export { Marquee };
