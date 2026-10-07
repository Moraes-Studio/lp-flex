import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow, type EyebrowProps } from '@/components/shared/eyebrow';
import { Reveal } from '@/components/shared/reveal';

interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Opcional: a home usa no máximo 3 eyebrows (Hero, Horários, Contato).
   * Eyebrow em toda seção é o vício de template nº 1 (revisão taste-skill,
   * 2026-10-07). Sem eyebrow, o título sozinho abre a seção. */
  eyebrow?: React.ReactNode;
  eyebrowVariant?: EyebrowProps['variant'];
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Escala como narrativa (V2 — direção de arte): 'compact' pras seções de
   * dado/precisão (Horários), 'default' pras de conversão/leitura rápida
   * (Planos, Modalidades, Contato), 'large' pro único momento que precisa
   * pesar mais que os outros sem virar 1992 (Professores). Ver docs desta
   * rodada — contraste de escala small/medium/LARGE em vez de tudo igual.
   * Iteração imersiva: escala sobe pra nível de hero (até 72/80px em 1440),
   * com `text-balance` contra palavra órfã e largura de 960px pra nenhum
   * título passar de 3 linhas. */
  size?: 'compact' | 'default' | 'large';
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
    <Reveal className={cn('mb-12 max-w-[960px]', className)} {...props}>
      {eyebrow ? (
        <Eyebrow variant={eyebrowVariant ?? (tone === 'dark' ? 'inverted' : 'bright')}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2
        className={cn(
          'heading-reveal text-balance',
          size === 'large' && 'text-[clamp(38px,5.6vw,80px)]',
          size === 'default' && 'text-[clamp(34px,5vw,72px)]',
          size === 'compact' && 'text-[clamp(28px,3.4vw,48px)]',
          // Depois do tamanho: no tailwind-merge, `text-[...]` remove um
          // `leading-*` anterior (font-size do v4 carrega line-height).
          'leading-[1.1]',
          tone === 'dark' && 'text-white'
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'mt-5 max-w-[520px] text-[15px] text-pretty normal-case',
            tone === 'dark' ? 'text-white/75' : 'text-foreground/75'
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

export { SectionHeading };
