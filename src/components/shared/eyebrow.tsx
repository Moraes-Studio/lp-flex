import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const eyebrowVariants = cva(
  'mb-4 flex items-center gap-3 font-mono text-[13.5px] font-semibold tracking-[0.16em] uppercase',
  {
    variants: {
      variant: {
        bright: 'text-flex-blue-600',
        ice: 'text-muted-foreground',
        /** Sobre fundo escuro (ex: seção Horários em grafite) — mesma família
         * azul, só mais clara pra manter contraste em cima de fundo escuro. */
        inverted: 'text-flex-blue-300',
      },
    },
    defaultVariants: {
      variant: 'bright',
    },
  }
);

/** Cor da linha editorial (`.eyebrow-line`, ver globals.css §6.B) — separada
 * do cva de texto porque, diferente de antes (pseudo-elemento `before:`
 * dentro do mesmo cva), a linha agora é um `<span>` real: precisa crescer
 * (scaleX) ao entrar em viewport/no load, o que `before:` não permite fazer
 * de forma independente do texto sem duplicar a regra em CSS puro mesmo
 * assim — então vira elemento, e a cor vem de um mapa próprio. */
const lineColor: Record<NonNullable<EyebrowProps['variant']>, string> = {
  bright: 'bg-flex-blue-600',
  ice: 'bg-border',
  inverted: 'bg-flex-blue-300',
};

export interface EyebrowProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof eyebrowVariants> {}

function Eyebrow({ className, variant, children, ...props }: EyebrowProps) {
  const resolvedVariant = variant ?? 'bright';
  return (
    <div className={cn(eyebrowVariants({ variant, className }))} {...props}>
      <span
        className={cn('eyebrow-line h-[3px] w-7 shrink-0 rounded-full', lineColor[resolvedVariant])}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

export { Eyebrow, eyebrowVariants };
