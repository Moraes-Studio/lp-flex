'use client';

import * as React from 'react';
import { DIA_NOME_COMPLETO, paraMinutos, type AulaSlot, type Dia } from '@/lib/content/horarios-shared';
import { agoraEmSaoPaulo } from '@/lib/timezone';
import { cn } from '@/lib/utils';

/**
 * Aulas de hoje, no topo de Horários (antes era o quadro "HOJE" do hero:
 * saiu de lá na rodada de 2026-10-07 pra o hero ficar só texto + foto, sem
 * nada sobreposto). Sempre no fuso de São Paulo (`@/lib/timezone`), só
 * depois de montar no cliente: a home é estática, um `new Date()` no
 * servidor congelaria o dia no build.
 */
export function HojeStrip({ slots }: { slots: AulaSlot[] }) {
  const [estado, setEstado] = React.useState<{ dia: Dia; minutos: number } | null>(null);

  React.useEffect(() => {
    const atualizar = () => setEstado(agoraEmSaoPaulo());
    atualizar();
    const id = window.setInterval(atualizar, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const doDia = estado
    ? slots
        .filter((s) => s.day === estado.dia)
        .slice()
        .sort((a, b) => paraMinutos(a.time) - paraMinutos(b.time))
    : [];

  return (
    <div
      data-testid="hoje-strip"
      className="mb-10 grid gap-4 border-y border-white/12 py-5 md:grid-cols-[160px_1fr] md:items-center md:gap-8"
    >
      <p className="flex items-baseline gap-2.5 text-white">
        <strong className="font-heading text-[22px] tracking-[0.02em] uppercase">Hoje</strong>
        <span className="text-flex-blue-300 font-mono text-[11px] tracking-[0.14em] uppercase" suppressHydrationWarning>
          {estado ? DIA_NOME_COMPLETO[estado.dia] : ''}
        </span>
      </p>

      {estado && doDia.length === 0 ? (
        <p className="text-sm text-white/70">
          Sem aulas coletivas hoje. A musculação funciona no horário normal, com professor na sala.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-x-6 gap-y-3" aria-live="polite">
          {doDia.map((slot) => {
            const rodando =
              estado !== null &&
              estado.minutos >= paraMinutos(slot.time) &&
              estado.minutos < paraMinutos(slot.time) + 60;
            return (
              <li
                key={`${slot.day}-${slot.time}-${slot.aula}`}
                className={cn(
                  'flex items-baseline gap-2.5 text-white/80',
                  rodando && 'text-white'
                )}
              >
                <time className="text-flex-blue-300 font-mono text-[13px] tabular-nums">{slot.time}</time>
                <span className={cn('text-[15px]', rodando && 'font-semibold')}>{slot.aula}</span>
                {rodando ? (
                  <span className="bg-flex-blue-600 rounded-pill px-2 py-0.5 font-mono text-[9.5px] tracking-[0.14em] text-white uppercase">
                    agora
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
