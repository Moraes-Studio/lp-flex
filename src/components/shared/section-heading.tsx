import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow, type EyebrowProps } from '@/components/shared/eyebrow';
import { Reveal } from '@/components/shared/reveal';

interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  eyebrow: React.ReactNode;
  eyebrowVariant?: EyebrowProps['variant'];
  title: React.ReactNode;
  description?: React.ReactNode;
  size?: 'default' | 'large';
  /** 'light' (padrão, texto escuro sobre fundo claro) ou 'dark' (seção com
   * fundo escuro, ex: Horários em grafite) — troca título/descrição/eyebrow
   * pra tons claros automaticamente, sem precisar sobrescrever cada um. */
  tone?: 'light' | 'dark';
}

function SectionHeading({
  className,
  eyebrow,
  eyebrowVariant,
  title,
  description,
  size = 'default',
  tone = 'light',
  ...props
}: SectionHeadingProps) {
  return (
    <Reveal className={cn('mb-13 max-w-[640px]', className)} {...props}>
      <Eyebrow variant={eyebrowVariant ?? (tone === 'dark' ? 'inverted' : 'bright')}>
        {eyebrow}
      </Eyebrow>
      <h2
        className={cn(
          'leading-[1.12]',
          size === 'large' ? 'text-[clamp(34px,4.4vw,56px)]' : 'text-[clamp(28px,3.1vw,42px)]',
          tone === 'dark' && 'text-white'
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-3.5 max-w-[520px] text-sm',
            tone === 'dark' ? 'text-white/65' : 'text-muted-foreground'
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

export { SectionHeading };
