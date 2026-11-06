import { getProfessores, temPerfilCompleto } from '@/lib/content/professores';
import { SectionHeading } from '@/components/shared/section-heading';
import { Photo } from '@/components/shared/photo';
import { Reveal } from '@/components/shared/reveal';

/** content/professores.json guarda vaga placeholder (nome genérico
 * "Professor 0X") pra cada modalidade sem profissional confirmado ainda —
 * necessário pra checagem de cobertura modalidade↔professor (SDD.md §5).
 * Só ganha card quem cumpre o critério do cliente: nome no padrão +
 * formulário preenchido + foto da sessão da equipe (`temPerfilCompleto`).
 * Os demais nomes confirmados ainda contam no stat de professores — só não
 * aparecem aqui. */
export function Professores() {
  const professores = getProfessores();
  const comCard = professores.filter(temPerfilCompleto);

  return (
    // bg-surface-200 — um degrau mais frio que Modalidades (V1.5 §1/§2):
    // Horários (grafite) fica entre as duas, então não é repetição de tom.
    <section
      id="professores"
      className="bg-surface-200 border-border border-y px-[6%] py-16 md:py-12"
    >
      {/* Título em cima e cards embaixo, lado a lado no tamanho fixo de card
       * (com o título ao lado, a coluna dele sobrava vazia embaixo). */}
      <div className="mx-auto grid max-w-[1180px] gap-6">
        {/* Título revisado contra SDD §7 (portão 1, rodada 2026-10-07): o anterior, "Seu treino montado por um professor", ficava perto de "Seu professor"/acompanhamento individual. */}
        <SectionHeading size="compact" className="mb-0" title="Professores presentes na sala." />

        {/* Cards com a foto da sessão da equipe (mesmo fundo e luz em todas,
         * por isso a grade fica uniforme). Nome e textos sempre abaixo da
         * foto, nunca sobre ela (regra de fotos do projeto). Sem numeração:
         * professores não são uma sequência. */}
        {/* Abaixo de lg, card que sobra sozinho na linha fica centralizado. */}
        <Reveal className="flex flex-wrap justify-center gap-x-6 gap-y-10 lg:justify-start">
          {comCard.map((professor) => (
            <article key={professor.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[300px]">
              <Photo
                src={professor.fotoUrl}
                alt={`${professor.nome}, equipe de ${professor.papel.toLowerCase()} da Academia Flex`}
                label={`professor ${professor.nome}`}
                ratio="portrait"
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
                className="rounded-2xl"
              />
              <h3 className="mt-4 text-[20px] leading-tight">{professor.nome}</h3>
              <p className="text-flex-blue-700 mt-1 font-mono text-[12.5px] tracking-[0.08em] uppercase">
                {professor.papel} · {professor.desde}
              </p>
              <p className="text-foreground/80 mt-3 text-[15px] leading-relaxed">{professor.bio}</p>
              {professor.formacao ? (
                <p className="text-muted-foreground mt-2.5 text-[14px] leading-snug normal-case">
                  {professor.formacao}
                </p>
              ) : null}
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
