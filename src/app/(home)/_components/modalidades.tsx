import { ArrowRight } from 'lucide-react';
import { getModalidades } from '@/lib/content/modalidades';
import { SectionHeading } from '@/components/shared/section-heading';
import { ModalidadeIcon } from '@/components/shared/modalidade-icon';
import { Reveal } from '@/components/shared/reveal';

export function Modalidades() {
  const modalidades = getModalidades();

  return (
    // bg-surface-100 (não bg-background-alt) — nomeado explicitamente na
    // escala nova (V1.5 §1), primeiro degrau frio depois do branco/azul do
    // Marquee, antes do grafite de Horários.
    <section id="modalidades" className="bg-surface-100 border-border border-y px-[6%] py-14 md:py-16">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading eyebrow="Modalidades" title="O que você treina aqui." />
        {/* V1.5 §8 — trocado de card horizontal (caixa branca com borda/sombra)
         * pra linha de catálogo (número + ícone + nome + hairline), pedido
         * explícito pra tirar a "cara de grid de SaaS" sem perder densidade.
         * `hover:bg-surface-100/0` não existe — a mudança de superfície é o
         * `hover:bg-surface-200/70` no item inteiro; a linha azul embaixo
         * (span absoluto, scaleX) e o ícone (scale) respondem junto, nada
         * muda de posição/tamanho de layout (RULES.md #5 — decorativo, não
         * esconde nenhuma função por trás do hover: o nome já está sempre
         * visível). */}
        <Reveal className="border-border grid grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-3">
          {modalidades.map((modalidade, i) => (
            <div
              key={modalidade.nome}
              className="group border-border relative flex items-center gap-4 border-b px-1 py-4 transition-colors duration-200 hover:bg-surface-200/70 sm:px-3"
            >
              {/* aria-hidden: numeração decorativa (a ordem já é visual, o
               * grid), não é informação própria — o nome da modalidade
               * sozinho já é o conteúdo acessível. Evita depender de
               * contraste AA numa cor translúcida pequena que é só estilo.
               * V2 §Modalidades ("o número muda"): no hover/foco, o número
               * cede lugar a uma seta — mesma linguagem de interação dos
               * CTAs (categoria "interaction motion", não uma nova). */}
              <span aria-hidden="true" className="relative h-4 w-7 shrink-0 font-mono text-[12.5px]">
                <span className="text-flex-blue-600/50 absolute inset-0 tabular-nums transition-opacity duration-200 group-hover:opacity-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <ArrowRight className="text-flex-blue-600 absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
              </span>
              <span className="bg-surface-200 flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors duration-200 group-hover:bg-flex-blue-600/15">
                <ModalidadeIcon
                  icone={modalidade.icone}
                  className="text-flex-blue-600 h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-110"
                />
              </span>
              <span className="text-[14.5px] leading-tight font-semibold">{modalidade.nome}</span>
              <span
                className="bg-flex-blue-600 absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                aria-hidden="true"
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
