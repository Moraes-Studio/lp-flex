import * as React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[];
  durationSeconds?: number;
  /** 'light' (padrão original: tarja branca, pill com borda azul) ou 'dark'
   * (faixa azul institucional cheia, pill "ghost" branco — mesma cor da
   * tarja do header/footer, reuso de token, não é cor nova). */
  tone?: 'light' | 'dark';
}

/**
 * Faixa de movimento ambiental contínuo — CSS puro (`@keyframes marquee` em
 * globals.css), sem JS. `transform: translateX(-50%)` desloca o track por
 * exatamente metade da própria largura; pra isso ficar 100% costurado, as
 * duas metades (`Group`) precisam ser pixel-idênticas E cada uma sozinha
 * precisa ser mais larga que qualquer viewport — senão, na janela de tempo
 * em que o fim de um grupo já saiu e o próximo ainda não entrou, sobra track
 * vazio visível (achado real: 11 modalidades ≈ 2000px de largura, menor que
 * 1920/2560px de desktop largo). Cada grupo repete a lista de modalidades 2x
 * (`Sequence`), então a largura de um grupo passa a ser ~4x a de uma lista
 * só — folga confortável acima de 2560px. O segundo grupo é aria-hidden (a
 * lista real já foi lida na primeira metade, isto é só o resto do loop).
 */
function Marquee({ items, durationSeconds = 22, tone = 'light', className, ...props }: MarqueeProps) {
  return (
    <div
      className={cn(
        'overflow-hidden border-t border-b whitespace-nowrap',
        tone === 'dark' ? 'bg-flex-blue-700 border-white/15' : 'border-border bg-card',
        className
      )}
      {...props}
    >
      <div
        className="flex w-max animate-marquee py-4 motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        <Group items={items} tone={tone} />
        <Group items={items} tone={tone} ariaHidden />
      </div>
    </div>
  );
}

/** Uma das duas metades do track — a lista de modalidades repetida 2x
 * (`Sequence`), sempre mais larga que a viewport (ver comentário acima). */
function Group({
  items,
  tone,
  ariaHidden,
}: {
  items: React.ReactNode[];
  tone: 'light' | 'dark';
  ariaHidden?: boolean;
}) {
  return (
    <div className="flex shrink-0" aria-hidden={ariaHidden ? 'true' : undefined}>
      <Sequence items={items} tone={tone} />
      <Sequence items={items} tone={tone} />
    </div>
  );
}

/** Uma repetição da lista completa. `gap-3` entre as pills + `pr-3` no fim
 * da sequência (mesma medida do gap) — a mesma geometria de espaçamento
 * vale dentro da sequência E entre uma sequência e a próxima, sem depender
 * de `mr-3`/`last:mr-0` por pill (isso fazia a última pill de cada
 * repetição ter espaçamento diferente das outras). */
function Sequence({ items, tone }: { items: React.ReactNode[]; tone: 'light' | 'dark' }) {
  return (
    <div className="flex shrink-0 gap-3 pr-3">
      {items.map((item, i) => (
        <Pill key={i} item={item} tone={tone} />
      ))}
    </div>
  );
}

function Pill({ item, tone }: { item: React.ReactNode; tone: 'light' | 'dark' }) {
  return (
    <span
      className={cn(
        'inline-block shrink-0 rounded-[10px] border px-4 py-[7px] font-mono text-[12.5px] tracking-[0.06em] uppercase',
        tone === 'dark'
          ? 'border-white/25 bg-white/10 text-white'
          : /* text-flex-blue-600 (não text-flex-bright): nesse tamanho (12.5px,
             * peso normal) o azul de acento dá só 4.27:1 de contraste em fundo
             * branco — abaixo do 4.5:1 exigido pra texto pequeno (WCAG AA),
             * achado num Lighthouse audit real. flex-blue-600 é o institucional
             * (mesmo azul do logo), 8:1 de contraste, sem inventar cor nova. */
            'border-border text-flex-blue-600'
      )}
    >
      {item}
    </span>
  );
}

export { Marquee };
