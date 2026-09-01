import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CtaArrowProps {
  /** 'right' pra navegação interna (âncora da própria página, ex: "Ver
   * planos"). 'up-right' pra ação que sai do site (ex: WhatsApp em nova
   * aba) — mesma semântica do ArrowUpRight já usado em contato.tsx. */
  variant?: 'right' | 'up-right';
  className?: string;
}

/**
 * Seta de CTA (V1.5 §5) — decoração de um botão já clicável (o clique
 * funciona sem ela), não um controle revelado só por hover (RULES.md #5 é
 * sobre isso, não se aplica aqui). Responde a `.group` no ancestral: passar
 * `className="group"` pro <Button> (ou outro elemento clicável) que a
 * envolve. `group-focus-visible` junto de `group-hover` porque o movimento é
 * feedback de interação, não só de mouse.
 */
export function CtaArrow({ variant = 'right', className }: CtaArrowProps) {
  const Icon = variant === 'up-right' ? ArrowUpRight : ArrowRight;
  return (
    <Icon
      className={cn(
        'h-4 w-4 shrink-0 transition-transform duration-[220ms] ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1',
        className
      )}
      aria-hidden="true"
    />
  );
}
