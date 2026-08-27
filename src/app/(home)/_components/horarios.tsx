import { getFuncionamento } from '@/lib/content/funcionamento';
import { DIAS, DIA_JS_PARA_LABEL, paraMinutos, getHorarios, type Dia } from '@/lib/content/horarios';
import { SectionHeading } from '@/components/shared/section-heading';
import { HorariosMobile } from '@/components/shared/horarios-mobile';
import { cn } from '@/lib/utils';

export function Horarios() {
  const horarios = getHorarios();
  const funcionamento = getFuncionamento();
  const hojeLabel = DIA_JS_PARA_LABEL[new Date().getDay()];

  const diasComAula = DIAS.filter((dia) => horarios.some((s) => s.day === dia));
  const colunas = diasComAula.filter((d) => d !== 'Dom');
  const horas = [...new Set(colunas.flatMap((d) => horarios.filter((s) => s.day === d).map((s) => s.time)))].sort(
    (a, b) => paraMinutos(a) - paraMinutos(b)
  );

  const buscar = (dia: Dia, hora: string) => horarios.find((s) => s.day === dia && s.time === hora);

  const seg = funcionamento[1];
  const sex = funcionamento[5];
  const sab = funcionamento[6];
  const dom = funcionamento[0];

  return (
    <section id="horarios" className="bg-flex-graphite px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          tone="dark"
          eyebrow="Grade de aulas coletivas"
          title="Horários"
          description="A grade completa da semana. No celular, escolha o dia."
        />

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
                        dia === hojeLabel && 'bg-flex-blue-700'
                      )}
                    >
                      {dia}
                      {dia === hojeLabel ? (
                        <span className="mt-0.5 block font-mono text-[9px] tracking-[0.16em] opacity-85">
                          hoje
                        </span>
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
                      const ehHoje = dia === hojeLabel;
                      return (
                        <td
                          key={dia}
                          className={cn(
                            // border-flex-blue-600/10 em vez de border-border: linhas de
                            // grade com um fio de azul institucional (identidade), não
                            // cinza neutro — parte do que tirava a "cara de planilha".
                            'border-flex-blue-600/10 border-r border-b px-3 py-3 text-center align-middle text-[13.5px] last:border-r-0',
                            // Coluna de hoje: wash azul mais presente + borda esquerda
                            // sólida (indicador vertical, não só cor) — border-l porque
                            // border-r já tem `last:border-r-0` (se "hoje" cair na última
                            // coluna, um acento na direita sumiria; na esquerda nunca).
                            ehHoje && 'border-l-flex-blue-600/50 bg-flex-blue-100/60 border-l-2'
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
                                className={cn(
                                  'block font-semibold',
                                  ehHoje ? 'text-flex-blue-800' : 'text-foreground'
                                )}
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
            Funcionamento: seg a qui {seg.abre}–{seg.fecha} · sex {sex.abre}–{sex.fecha} · sáb {sab.abre}
            –{sab.fecha} · dom e feriados {dom.abre ?? 'fechado'}
            {dom.fecha ? `–${dom.fecha}` : ''}
          </p>
        </div>

        <HorariosMobile slots={horarios} diasComAula={diasComAula} />
      </div>
    </section>
  );
}
