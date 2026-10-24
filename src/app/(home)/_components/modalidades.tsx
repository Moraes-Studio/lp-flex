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
            <ul className="mt-5 flex flex-wrap gap-2.5 lg:mt-1">
              {aulas.map((aula) => (
                <li
                  key={aula.nome}
                  data-testid="aula-coletiva"
                  className="rounded-pill inline-flex items-center gap-2 border border-white/20 bg-white/10 px-3.5 py-2 text-[14px] font-medium text-white"
                >
                  <ModalidadeIcon icone={aula.icone} className="text-flex-blue-300 h-4 w-4" />
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
