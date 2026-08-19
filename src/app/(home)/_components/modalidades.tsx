import { getModalidades } from '@/lib/content/modalidades';
import { SectionHeading } from '@/components/shared/section-heading';
import { ModalidadeIcon } from '@/components/shared/modalidade-icon';

export function Modalidades() {
  const modalidades = getModalidades();

  return (
    <section id="modalidades" className="bg-background-alt border-border border-y px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading eyebrow="Modalidades" title="O que você treina aqui." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {modalidades.map((modalidade) => (
            <div
              key={modalidade.nome}
              className="border-border group flex flex-col items-start gap-3 rounded-[12px] border bg-white p-4 transition-[transform,border-color,box-shadow] duration-250 hover:-translate-y-0.5 hover:border-flex-blue-600/40 hover:shadow-[0_16px_32px_-20px_rgba(11,77,162,0.35)]"
            >
              <ModalidadeIcon
                icone={modalidade.icone}
                className="text-flex-blue-600 h-6 w-6 transition-transform duration-250 group-hover:scale-110"
              />
              <span className="text-[15px] leading-tight font-semibold">{modalidade.nome}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
