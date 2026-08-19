'use client';

import * as React from 'react';
import { calcularStatus, type DiaFuncionamento } from '@/lib/content/funcionamento-shared';
import { cn } from '@/lib/utils';

interface StatusChipProps {
  funcionamento: DiaFuncionamento[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * "Aberto agora" depende do relógio do visitante — não pode ser calculado no
 * servidor sem arriscar mismatch de hidratação (RSC roda num instante,
 * o navegador hidrata noutro). Por isso só computa depois de montar no
 * cliente; até lá mostra um estado neutro do mesmo tamanho, sem "pular" o
 * layout quando o valor real chega.
 */
export function StatusChip({ funcionamento, className, style }: StatusChipProps) {
  const [status, setStatus] = React.useState<{ aberto: boolean; texto: string } | null>(null);

  React.useEffect(() => {
    const atualizar = () => setStatus(calcularStatus(funcionamento, new Date()));
    atualizar();
    const id = window.setInterval(atualizar, 60_000);
    return () => window.clearInterval(id);
  }, [funcionamento]);

  return (
    <div
      className={cn(
        'border-border bg-flex-ice inline-flex items-center gap-2 rounded-pill border px-3.5 py-2 text-[13px] font-medium',
        status && !status.aberto && 'bg-background-alt',
        className
      )}
      style={style}
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        {status?.aberto ? (
          <span className="bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
        ) : null}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            status === null ? 'bg-border' : status.aberto ? 'bg-success' : 'bg-muted-foreground'
          )}
        />
      </span>
      <span className="text-flex-blue-700">{status?.texto ?? 'Vila Helena · Santo André'}</span>
    </div>
  );
}
