'use client';

import * as React from 'react';
import { DIA_NOME_COMPLETO, paraMinutos, type AulaSlot, type Dia } from '@/lib/content/horarios-shared';
import { agoraEmSaoPaulo } from '@/lib/timezone';
import { cn } from '@/lib/utils';

/**
 * Elemento de assinatura da home: o quadro de aulas de hoje, como o mural
 * físico de uma academia de bairro, digitalizado. Depende do relógio —
 * sempre o horário oficial de São Paulo (`@/lib/timezone`), nunca o fuso do
 * navegador do visitante nem do servidor — então só computa depois de
 * montar no cliente pra não arriscar mismatch de hidratação.
 */
export function HeroBoard({ slots }: { slots: AulaSlot[] }) {
  const [estado, setEstado] = React.useState<{ dia: Dia; minutos: number } | null>(null);

  React.useEffect(() => {
    const atualizar = () => setEstado(agoraEmSaoPaulo());
    atualizar();
    const id = window.setInterval(atualizar, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const diaHoje = estado?.dia ?? 'Seg';
  const doDia = slots
    .filter((s) => s.day === diaHoje)
    .slice()
    .sort((a, b) => paraMinutos(a.time) - paraMinutos(b.time));

  return (
    // rounded-md + border (sem shadow-panel): V2 pede que o quadro "Hoje"
    // pareça painel operacional, não card de SaaS — o desenho de card fica
    // pro Planos, que é comercial de propósito; aqui a linguagem é a mesma
    // que Horários (precisão). (Removido o selo "Est. 1992" que ficava aqui
    // — redundante, "1992"/"desde 1992" já aparece na barra do topo, no
    // eyebrow do Hero e na seção Sobre; não precisava de mais um lugar.)
    <div className="border-border rounded-md border bg-white">
      <div className="overflow-hidden rounded-md">
        <div className="bg-flex-blue-600 flex items-baseline gap-2.5 px-5 py-3.5 font-mono text-[11px] tracking-[0.16em] text-white uppercase">
          <strong className="font-heading text-[17px] tracking-[0.02em]">Hoje</strong>
          <span suppressHydrationWarning>{estado ? DIA_NOME_COMPLETO[diaHoje] : ''}</span>
        </div>
        <div className="py-1">
          {doDia.length === 0 ? (
            <p className="text-muted-foreground px-5 py-6 text-sm">
              Sem aulas coletivas hoje. A musculação funciona no horário normal, com professor na
              sala.
            </p>
          ) : (
            doDia.map((slot) => {
              const rodando =
                estado !== null &&
                estado.minutos >= paraMinutos(slot.time) &&
                estado.minutos < paraMinutos(slot.time) + 60;
              return (
                <div
                  key={`${slot.day}-${slot.time}-${slot.aula}`}
                  className={cn(
                    'border-border grid grid-cols-[64px_1fr] items-center gap-3 border-b px-5 py-2.5 last:border-b-0',
                    rodando && 'bg-flex-ice'
                  )}
                >
                  <time className="text-flex-blue-600 font-mono text-[13px] font-medium">
                    {slot.time}
                  </time>
                  <span className="text-[15px] font-semibold">
                    {slot.aula}
                    {rodando ? (
                      <span className="bg-flex-blue-600 ml-2 inline-flex items-center gap-1.5 rounded-pill px-2 py-0.5 align-middle font-mono text-[9.5px] tracking-[0.14em] text-white uppercase">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                        </span>
                        agora
                      </span>
                    ) : null}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
