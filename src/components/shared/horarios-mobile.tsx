'use client';

import * as React from 'react';
import { DIA_NOME_COMPLETO, paraMinutos, type AulaSlot, type Dia } from '@/lib/content/horarios-shared';
import { diaDaSemanaEmSaoPaulo } from '@/lib/timezone';
import { cn } from '@/lib/utils';

/** Grade filtrável por dia, versão mobile: abas tocáveis (não depende de
 * hover, RULES.md #5) que trocam a lista abaixo. "Hoje" sempre no horário
 * oficial de São Paulo (`@/lib/timezone`), nunca no fuso do navegador do
 * visitante. */
export function HorariosMobile({ slots, diasComAula }: { slots: AulaSlot[]; diasComAula: Dia[] }) {
  const [hoje, setHoje] = React.useState<Dia | null>(null);
  const [selecionado, setSelecionado] = React.useState<Dia | null>(null);

  React.useEffect(() => {
    const inicializar = () => {
      const diaAtual = diaDaSemanaEmSaoPaulo(new Date());
      setHoje(diaAtual);
      setSelecionado(diasComAula.includes(diaAtual) ? diaAtual : (diasComAula[0] ?? null));
    };
    inicializar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doDia = selecionado
    ? slots.filter((s) => s.day === selecionado).slice().sort((a, b) => paraMinutos(a.time) - paraMinutos(b.time))
    : [];

  return (
    <div className="lg:hidden">
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Dias da semana">
        {diasComAula.map((dia) => {
          const ehHoje = dia === hoje;
          return (
            <button
              key={dia}
              type="button"
              aria-pressed={selecionado === dia}
              // aria-current além da cor: mesmo sinal textual/semântico do "hoje"
              // do cabeçalho desktop, não só visual.
              aria-current={ehHoje ? 'date' : undefined}
              onClick={() => setSelecionado(dia)}
              className={cn(
                'border-border rounded-pill inline-flex items-center gap-1.5 border px-4 py-2 font-mono text-[12px] tracking-[0.08em] uppercase transition-colors',
                selecionado === dia
                  ? 'bg-flex-blue-600 border-flex-blue-600 text-white'
                  : ehHoje
                    ? 'border-flex-blue-600/50 text-flex-blue-700 bg-white'
                    : 'text-muted-foreground bg-white'
              )}
            >
              {ehHoje ? (
                <span
                  className={cn(
                    'h-1.5 w-1.5 shrink-0 rounded-full',
                    selecionado === dia ? 'bg-white' : 'bg-flex-blue-600'
                  )}
                  aria-hidden="true"
                />
              ) : null}
              {dia}
            </button>
          );
        })}
      </div>

      <div className="border-border overflow-hidden rounded-2xl border bg-white">
        {doDia.length === 0 ? (
          <p className="text-muted-foreground px-5 py-6 text-sm">
            Sem aulas coletivas neste dia. A musculação funciona no horário normal.
          </p>
        ) : (
          doDia.map((slot) => {
            const rodando = selecionado === hoje;
            return (
              <div
                key={`${slot.day}-${slot.time}-${slot.aula}`}
                className="border-border grid grid-cols-[64px_1fr] items-center gap-3 border-b px-5 py-3 last:border-b-0"
              >
                <time className="text-flex-blue-600 font-mono text-[13px] font-medium">
                  {slot.time}
                </time>
                <span className="text-[15px] font-semibold">
                  {slot.aula}
                  {rodando ? (
                    <span className="sr-only"> — hoje ({DIA_NOME_COMPLETO[selecionado ?? slot.day]})</span>
                  ) : null}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
