'use client';

import * as React from 'react';
import type { AulaSlot, Dia } from '@/lib/content/horarios-shared';
import { diaDaSemanaEmSaoPaulo } from '@/lib/timezone';
import { cn } from '@/lib/utils';

interface HorariosDesktopProps {
  colunas: Dia[];
  horas: string[];
  horarios: AulaSlot[];
  resumoFuncionamento: string;
}

/**
 * Tabela de horários (≥lg). Achado real de produção: isto vivia no corpo do
 * Server Component `horarios.tsx`, calculando "hoje" com `new Date()` direto
 * — como a home é uma página 100% estática (ver next.config.ts), esse
 * cálculo rodava uma vez no build/deploy da Vercel (UTC) e ficava congelado
 * no HTML até o próximo deploy, além de nem usar o fuso de São Paulo. Mesmo
 * padrão de correção já usado pelo componente irmão `horarios-mobile.tsx`
 * (e por HeroBoard/StatusChip): "hoje" só existe depois de montar no
 * cliente. Antes de montar (`hoje === null`), a tabela renderiza sem nenhum
 * destaque — igual ao que o servidor já mandou, sem mismatch de hidratação.
 */
export function HorariosDesktop({ colunas, horas, horarios, resumoFuncionamento }: HorariosDesktopProps) {
  const [hoje, setHoje] = React.useState<Dia | null>(null);

  React.useEffect(() => {
    const atualizar = () => setHoje(diaDaSemanaEmSaoPaulo(new Date()));
    atualizar();
  }, []);

  const buscar = (dia: Dia, hora: string) => horarios.find((s) => s.day === dia && s.time === hora);

  return (
    <div className="hidden lg:block">
      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              {colunas.map((dia) => (
                <th
                  key={dia}
                  scope="col"
                  className={cn(
                    'border-flex-blue-500/40 bg-flex-blue-600 px-3 py-3.5 font-heading border-r text-[13px] font-medium tracking-[0.08em] text-white uppercase last:border-r-0',
                    dia === hoje && 'bg-flex-blue-700'
                  )}
                >
                  {dia}
                  {dia === hoje ? (
                    <span className="mt-0.5 block font-mono text-[9px] tracking-[0.16em] opacity-85">hoje</span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((hora, i) => (
              <tr key={hora} className={i % 2 === 1 ? 'bg-background-alt' : undefined}>
                {colunas.map((dia) => {
                  const aula = buscar(dia, hora);
                  const ehHoje = dia === hoje;
                  return (
                    <td
                      key={dia}
                      className={cn(
                        // border-flex-blue-600/10 em vez de border-border: linhas de
                        // grade com um fio de azul institucional (identidade), não
                        // cinza neutro — parte do que tirava a "cara de planilha".
                        'border-flex-blue-600/10 border-r border-b px-3 py-3 text-center align-middle text-[13.5px] last:border-r-0',
                        // Coluna de hoje: wash azul + borda esquerda fina.
                        ehHoje && 'border-l-flex-blue-600/35 bg-flex-blue-100/40 border-l'
                      )}
                    >
                      {aula ? (
                        <>
                          <span
                            className={cn(
                              'block font-mono text-[12px] tabular-nums',
                              ehHoje ? 'text-flex-blue-700' : 'text-flex-blue-600'
                            )}
                          >
                            {hora}
                          </span>
                          <span
                            className={cn('block font-semibold', ehHoje ? 'text-flex-blue-800' : 'text-foreground')}
                          >
                            {aula.aula}
                          </span>
                        </>
                      ) : (
                        <span className="text-border" aria-hidden="true">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3.5 font-mono text-[11.5px] tracking-[0.06em] text-white/55 uppercase">
        {resumoFuncionamento}
      </p>
    </div>
  );
}
