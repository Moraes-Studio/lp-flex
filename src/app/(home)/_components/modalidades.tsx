import { getModalidades } from '@/lib/content/modalidades';
import { mediaConfig } from '@/config/media';
import { SectionHeading } from '@/components/shared/section-heading';
import { ModalidadeIcon } from '@/components/shared/modalidade-icon';
import { Photo } from '@/components/shared/photo';
import { Reveal } from '@/components/shared/reveal';

/**
 * Modalidades (rodada 2026-10-07): em vez de 11 linhas numeradas com
 * hairline (o padrão de lista mais genérico), dois blocos com foto real:
 * a musculação e o salão onde acontecem as aulas coletivas. Cada aula
 * mantém o próprio ícone (nunca reaproveitado entre modalidades, RULES).
 * Sem eyebrow (máximo 3 na home).
 */
export function Modalidades() {
  const modalidades = getModalidades();
  const aulas = modalidades.filter((m) => m.icone !== 'musculacao');

  return (
    <section
      id="modalidades"
      className="bg-surface-100 border-border border-y px-[6%] py-16 md:py-20"
    >
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading title="O que você treina aqui." />

        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <Reveal>
            <Photo
              src={mediaConfig.modalidades.musculacao.src}
              alt={mediaConfig.modalidades.musculacao.alt}
              label="musculação"
              ratio="square"
              className="rounded-xl"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <h3 className="mt-5 text-[22px]">Musculação</h3>
            <p className="text-muted-foreground mt-2 max-w-[420px] text-[15.5px] normal-case">
              Aparelhos, pesos livres e área de cardio, abertos em todo o horário de funcionamento.
            </p>
          </Reveal>

          <Reveal delayMs={60}>
            <Photo
              src={mediaConfig.modalidades.aulas.src}
              alt={mediaConfig.modalidades.aulas.alt}
              label="salão de aulas"
              ratio="wide"
              className="rounded-xl"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />
            <h3 className="mt-5 text-[22px]">Aulas coletivas</h3>
            <p className="text-muted-foreground mt-2 text-[15.5px] normal-case">
              {aulas.length} aulas no mesmo plano. Confira os dias na grade de horários.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {aulas.map((aula) => (
                <li
                  key={aula.nome}
                  data-testid="aula-coletiva"
                  className="border-border rounded-pill inline-flex items-center gap-2 border bg-white px-3.5 py-2 text-[14px] font-medium"
                >
                  <ModalidadeIcon icone={aula.icone} className="text-flex-blue-600 h-4 w-4" />
                  {aula.nome}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
