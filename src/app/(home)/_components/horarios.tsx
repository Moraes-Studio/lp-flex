import { getFuncionamento } from '@/lib/content/funcionamento';
import { DIAS, paraMinutos, getHorarios } from '@/lib/content/horarios';
import { SectionHeading } from '@/components/shared/section-heading';
import { HorariosMobile } from '@/components/shared/horarios-mobile';
import { HorariosDesktop } from '@/components/shared/horarios-desktop';
import { AulasHojeIndicator } from '@/components/shared/aulas-hoje-indicator';

export function Horarios() {
  const horarios = getHorarios();
  const funcionamento = getFuncionamento();

  const diasComAula = DIAS.filter((dia) => horarios.some((s) => s.day === dia));
  const colunas = diasComAula.filter((d) => d !== 'Dom');
  const horas = [...new Set(colunas.flatMap((d) => horarios.filter((s) => s.day === d).map((s) => s.time)))].sort(
    (a, b) => paraMinutos(a) - paraMinutos(b)
  );

  const seg = funcionamento[1];
  const sex = funcionamento[5];
  const sab = funcionamento[6];
  const dom = funcionamento[0];
  const resumoFuncionamento = `Funcionamento: seg a qui ${seg.abre}–${seg.fecha} · sex ${sex.abre}–${sex.fecha} · sáb ${sab.abre}–${sab.fecha} · dom e feriados ${dom.abre ?? 'fechado'}${dom.fecha ? `–${dom.fecha}` : ''}`;

  return (
    <section id="horarios" className="bg-flex-graphite px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        {/* size="compact": Horários é a seção de PRECISÃO, não de impacto —
         * contraste de escala do V2 (small/medium/LARGE/MASSIVE) em vez de
         * todo heading do mesmo tamanho. O indicador ao lado é dado real
         * (contagem de aulas de hoje), não decoração — e, como "hoje"
         * depende do relógio, ele mesmo decide isso no cliente (ver
         * `aulas-hoje-indicator.tsx`); este Server Component nunca chama
         * `new Date()` — achado real de produção: a home é uma página 100%
         * estática, então um `new Date()` aqui congelaria "hoje" no momento
         * do build/deploy até o próximo deploy. */}
        <div className="mb-13 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <SectionHeading
            className="mb-0"
            tone="dark"
            size="compact"
            eyebrow="Grade de aulas coletivas"
            title="Horários"
            description="A grade completa da semana. No celular, escolha o dia."
          />
          <AulasHojeIndicator horarios={horarios} />
        </div>

        <HorariosDesktop
          colunas={colunas}
          horas={horas}
          horarios={horarios}
          resumoFuncionamento={resumoFuncionamento}
        />

        <HorariosMobile slots={horarios} diasComAula={diasComAula} />
      </div>
    </section>
  );
}
