import { agruparFuncionamento, getFuncionamento } from '@/lib/content/funcionamento';
import { DIAS, paraMinutos, getHorarios } from '@/lib/content/horarios';
import { SectionHeading } from '@/components/shared/section-heading';
import { HorariosMobile } from '@/components/shared/horarios-mobile';
import { HorariosDesktop } from '@/components/shared/horarios-desktop';
import { HojeStrip } from '@/components/shared/hoje-strip';

export function Horarios() {
  const horarios = getHorarios();
  const funcionamento = getFuncionamento();

  const diasComAula = DIAS.filter((dia) => horarios.some((s) => s.day === dia));
  const colunas = diasComAula.filter((d) => d !== 'Dom');
  const horas = [
    ...new Set(colunas.flatMap((d) => horarios.filter((s) => s.day === d).map((s) => s.time))),
  ].sort((a, b) => paraMinutos(a) - paraMinutos(b));

  const resumoFuncionamento = `Funcionamento: ${agruparFuncionamento(funcionamento)
    .map((g) => `${g.rotulo.toLowerCase()} ${g.horario}`)
    .join(' · ')}`;

  return (
    <section id="horarios" className="bg-flex-graphite px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        {/* size="compact": Horários é a seção de PRECISÃO, não de impacto.
         * "Hoje" depende do relógio, então quem decide isso é o `HojeStrip`
         * no cliente; este Server Component nunca chama `new Date()` (a home
         * é estática: um `new Date()` aqui congelaria "hoje" no build). */}
        <SectionHeading
          className="mb-8"
          tone="dark"
          size="compact"
          eyebrow="Grade de aulas coletivas"
          title="Horários"
          description="A grade completa da semana. No celular, escolha o dia."
        />

        <HojeStrip slots={horarios} />

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
