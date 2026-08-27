import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const eyebrowVariants = cva(
  'mb-4 flex items-center gap-3 font-mono text-[13.5px] font-semibold tracking-[0.16em] uppercase before:h-[3px] before:w-7 before:rounded-full before:content-[""]',
  {
    variants: {
      variant: {
        bright: 'text-flex-blue-600 before:bg-flex-blue-600',
        ice: 'text-muted-foreground before:bg-border',
        /** Sobre fundo escuro (ex: seção Horários em grafite) — mesma família
         * azul, só mais clara pra manter contraste em cima de fundo escuro. */
        inverted: 'text-flex-blue-300 before:bg-flex-blue-300',
      },
    },
    defaultVariants: {
      variant: 'bright',
    },
  }
);

export interface EyebrowProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof eyebrowVariants> {}

function Eyebrow({ className, variant, ...props }: EyebrowProps) {
  return <div className={cn(eyebrowVariants({ variant, className }))} {...props} />;
}

export { Eyebrow, eyebrowVariants };
