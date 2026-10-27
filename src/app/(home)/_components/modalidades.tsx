import { getModalidades, separarModalidades } from '@/lib/content/modalidades';
import { mediaConfig } from '@/config/media';
import { SectionHeading } from '@/components/shared/section-heading';
import { ModalidadeIcon } from '@/components/shared/modalidade-icon';
import { EspacoMosaico } from '@/components/shared/espaco-mosaico';
import { Reveal } from '@/components/shared/reveal';

/**
 * Modalidades (rodada 2026-10-07): em vez de 11 linhas numeradas com
 * hairline (o padrão de lista mais genérico), a seção mostra o espaço real.
 * Cada aula mantém o próprio ícone (nunca reaproveitado entre modalidades,
 * RULES). Sem eyebrow (máximo 3 na home).
 * Iteração imersiva: fundo azul profundo (flex-blue-900) pra dar contraste
 * de ritmo entre Planos (branco) e Horários (grafite).
 * Rodada 2026-10-24: as duas fotos (musculação e salão) deram lugar ao
 * mosaico dos ambientes, que antes ficava no Sobre e repetia essas mesmas
 * fotos e o mesmo texto. As fotos da academia agora moram num lugar só.
 * O bloco "Musculação" abaixo do mosaico saiu (o nome já está no bloco
 * grande); a frase dele virou a descrição da seção.
 */
export function Modalidades() {
  const { aulas } = separarModalidades(getModalidades());

  return (
    <section id="modalidades" className="bg-flex-blue-900 px-[6%] py-20 text-white md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          tone="dark"
          title="O que você vai treinar aqui."
          description="Aparelhos, pesos livres e área de cardio, abertos em todo o horário de funcionamento."
        />

        <Reveal>
          <EspacoMosaico ambientes={mediaConfig.ambientes} />
        </Reveal>

        <div className="mt-14 border-t border-white/15 pt-10 md:mt-16">
          {/* Desktop: título e texto à esquerda, etiquetas à direita (sozinho
           * embaixo do mosaico, o bloco em coluna única deixava as etiquetas
           * espremidas de um lado). */}
          <Reveal
            delayMs={60}
            className="lg:grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-start lg:gap-x-12"
          >
            <div>
              <h3 className="text-[clamp(24px,2.2vw,30px)] text-white">Aulas coletivas</h3>
              <p className="mt-2 max-w-[360px] text-[16px] text-white/75 normal-case">
                {aulas.length} aulas no mesmo plano. Confira os dias na{' '}
                <a
                  href="#horarios"
                  className="text-flex-blue-300 decoration-flex-blue-300/50 hover:decoration-flex-blue-300 font-medium underline underline-offset-4 transition-colors"
                >
                  grade de horários
                </a>
                .
              </p>
            </div>
            {/* Rodada 2026-10-26: cada aula com uma frase dizendo o que é (quem
             * não conhece GAP ou Ritbox não sabe se a aula é pra ela). Aula sem
             * descrição confirmada aparece só com o nome. */}
            <ul className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:mt-1">
              {aulas.map((aula) => (
                <li key={aula.nome} data-testid="aula-coletiva" className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10">
                    <ModalidadeIcon icone={aula.icone} className="text-flex-blue-300 h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[16px] leading-tight font-medium text-white normal-case">
                      {aula.nome}
                    </p>
                    {aula.descricao ? (
                      <p className="mt-1 text-[14px] leading-snug text-white/70 normal-case">
                        {aula.descricao}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
