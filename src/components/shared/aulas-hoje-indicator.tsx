'use client';

import * as React from 'react';
import type { AulaSlot, Dia } from '@/lib/content/horarios-shared';
import { diaDaSemanaEmSaoPaulo } from '@/lib/timezone';

/**
 * Indicador técnico "X aulas hoje" ao lado do heading de Horários (V2 §13 —
 * linguagem de painel operacional). Depende de "que dia é hoje", então só
 * computa depois de montar no cliente, no fuso oficial de São Paulo — nunca
 * no corpo do Server Component pai (`horarios.tsx`), que faz parte de uma
 * página 100% estática (ver next.config.ts): um `new Date()` ali rodaria
 * uma vez no build da Vercel e ficaria congelado até o próximo deploy —
 * exatamente a causa do bug real de produção corrigido nesta rodada. Mesmo
 * padrão já usado por HeroBoard/StatusChip/HorariosMobile.
 */
export function AulasHojeIndicator({ horarios }: { horarios: AulaSlot[] }) {
  const [hoje, setHoje] = React.useState<Dia | null>(null);

  React.useEffect(() => {
    const atualizar = () => setHoje(diaDaSemanaEmSaoPaulo(new Date()));
    atualizar();
  }, []);

  const aulasHoje = hoje ? horarios.filter((s) => s.day === hoje).length : null;

  return (
    <div className="border-flex-blue-400/30 flex items-baseline gap-2 border-l pl-4 font-mono text-white/70 uppercase">
      <span
        className="text-flex-blue-300 text-[26px] leading-none font-semibold tabular-nums"
        suppressHydrationWarning
      >
        {aulasHoje ?? '–'}
      </span>
      <span className="text-[10.5px] tracking-[0.14em]" suppressHydrationWarning>
        {aulasHoje === null ? 'aulas hoje' : `aula${aulasHoje === 1 ? '' : 's'} hoje · ${hoje}`}
      </span>
    </div>
  );
}
