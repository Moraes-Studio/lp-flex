'use client';

import * as React from 'react';
import {
  DIA_NOME_COMPLETO,
  paraMinutos,
  type AulaSlot,
  type Dia,
} from '@/lib/content/horarios-shared';
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

  const ordenar = (lista: AulaSlot[]) =>
    [...lista].sort((a, b) => paraMinutos(a.time) - paraMinutos(b.time));

  const doDia = estado ? ordenar(slots.filter((s) => s.day === estado.dia)) : [];

  // Altura reservada: o dia com mais aulas, calculado só a partir de `slots`
  // (igual no servidor e no cliente). Fica empilhado na mesma célula do
  // conteúdo real, invisível, então a faixa nunca encolhe nem cresce ao montar.
  const maisCheio = React.useMemo(() => {
    const porDia = new Map<Dia, AulaSlot[]>();
    for (const s of slots) porDia.set(s.day, [...(porDia.get(s.day) ?? []), s]);
    let melhor: AulaSlot[] = [];
    for (const lista of porDia.values()) if (lista.length > melhor.length) melhor = lista;
    return ordenar(melhor);
  }, [slots]);

  const classeLista = 'flex flex-wrap gap-x-6 gap-y-3';
  const classeItem = 'flex items-baseline gap-2.5 text-white/80';

  return (
    <div
      data-testid="hoje-strip"
      className="mb-10 grid gap-4 border-y border-white/12 py-5 md:grid-cols-[160px_1fr] md:items-center md:gap-8"
    >
      <p className="flex items-baseline gap-2.5 text-white">
        <strong className="font-heading text-[22px] tracking-[0.02em] uppercase">Hoje</strong>
        <span className="text-flex-blue-300 font-mono text-[11px] tracking-[0.14em] uppercase">
          {estado ? DIA_NOME_COMPLETO[estado.dia] : ''}
        </span>
      </p>

      <div className="grid">
        <ul aria-hidden="true" className={cn(classeLista, 'invisible col-start-1 row-start-1')}>
          {maisCheio.map((slot) => (
            <li key={`${slot.day}-${slot.time}-${slot.aula}`} className={classeItem}>
              <time dateTime={slot.time} className="font-mono text-[13px] tabular-nums">
                {slot.time}
              </time>
              <span className="text-[15px]">{slot.aula}</span>
            </li>
          ))}
        </ul>

        <div className="col-start-1 row-start-1">
          {estado && doDia.length === 0 ? (
            <p className="text-sm text-white/70">
              Sem aulas coletivas hoje. A musculação funciona no horário normal, com professor na
              sala.
            </p>
          ) : (
            <ul className={classeLista}>
              {doDia.map((slot) => {
                const rodando =
                  estado !== null &&
                  estado.minutos >= paraMinutos(slot.time) &&
                  estado.minutos < paraMinutos(slot.time) + 60;
                return (
                  <li
                    key={`${slot.day}-${slot.time}-${slot.aula}`}
                    className={cn(classeItem, rodando && 'text-white')}
                  >
                    <time
                      dateTime={slot.time}
                      className="text-flex-blue-300 font-mono text-[13px] tabular-nums"
                    >
                      {slot.time}
                    </time>
                    <span className={cn('text-[15px]', rodando && 'font-semibold')}>
                      {slot.aula}
                    </span>
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
      </div>
    </div>
  );
}
