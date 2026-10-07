import * as React from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // rounded-lg (não rounded-pill): V1.5 pede CTAs "mais geométricos, menos
  // cápsula" — pill fica reservado pra badge/tag (ver badge.tsx), não botão.
  'focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-[transform,background-color,border-color] duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-[0_10px_28px_-10px_rgba(var(--flex-glow-rgb),0.55)] hover:bg-flex-blue-700 hover:-translate-y-0.5',
        ghost:
          'border border-border bg-transparent text-foreground hover:border-flex-blue-600 hover:text-flex-blue-600',
        /** CTA primário sobre azul institucional (flex-blue-700): o `primary`
         * (azul sobre azul) some, então inverte — fundo branco, texto azul
         * (contraste ~10:1). Mesmo lift do hover do `primary`. */
        onDark:
          'bg-white text-flex-blue-700 hover:bg-flex-ice hover:-translate-y-0.5 focus-visible:ring-white focus-visible:ring-offset-flex-blue-700',
        /** Equivalente ao `ghost`, mas pra superfície escura (grafite/azul
         * institucional) — `ghost` (texto escuro, borda cinza-claro) fica
         * ilegível em fundo escuro. Mesmo idioma "ghost" já usado nos pills
         * do Marquee escuro (border-white/25 bg-white/10 text-white). */
        secondaryOnDark:
          'border border-white/30 bg-white/12 text-white hover:border-white/45 hover:bg-white/22 focus-visible:ring-white focus-visible:ring-offset-flex-blue-700',
      },
      size: {
        default: 'px-[26px] py-[14px]',
        sm: 'px-5 py-2.5 text-[13px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
