import { getModalidades } from '@/lib/content/modalidades';
import { SectionHeading } from '@/components/shared/section-heading';
import { ModalidadeIcon } from '@/components/shared/modalidade-icon';
import { Reveal } from '@/components/shared/reveal';

export function Modalidades() {
  const modalidades = getModalidades();

  return (
    <section id="modalidades" className="bg-background-alt border-border border-y px-[6%] py-14 md:py-16">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading eyebrow="Modalidades" title="O que você treina aqui." />
        {/* Card horizontal (ícone ao lado do nome, não empilhado) em vez de
         * vertical: era o maior gerador de "área branca morta" — um card alto
         * pra só um ícone + uma palavra. Densidade também vem do grid: 11
         * modalidades em 5 colunas sobrava uma linha órfã com 1 item sozinho;
         * xl:6 (só a partir de telas largas o bastante pra não apertar o
         * nome mais longo, "Jump Funcional") deixa 6+5, bem mais equilibrado. */}
        {/* Reveal no grid inteiro (o conjunto entra junto), não card por card
         * — 11 modalidades aparecendo uma a uma seria chamativo demais pro
         * que o briefing pede ("discreto"). */}
        <Reveal className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {modalidades.map((modalidade) => (
            <div
              key={modalidade.nome}
              className="border-border group flex items-center gap-3 rounded-[12px] border bg-white px-3.5 py-3 transition-[transform,border-color,box-shadow] duration-250 hover:-translate-y-0.5 hover:border-flex-blue-600/40 hover:shadow-[0_16px_32px_-20px_rgba(11,77,162,0.35)]"
            >
              <span className="bg-flex-ice flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-250 group-hover:bg-flex-blue-600/15">
                <ModalidadeIcon
                  icone={modalidade.icone}
                  className="text-flex-blue-600 h-6 w-6 transition-transform duration-250 group-hover:scale-110"
                />
              </span>
              <span className="text-[14.5px] leading-tight font-semibold">{modalidade.nome}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
