import { getProfessores, isProfessorConfirmado } from '@/lib/content/professores';
import { SectionHeading } from '@/components/shared/section-heading';
import { Photo } from '@/components/shared/photo';

/** content/professores.json guarda vaga placeholder (nome genérico
 * "Professor 0X") pra cada modalidade sem profissional confirmado ainda —
 * necessário pra checagem de cobertura modalidade↔professor (SDD.md §5),
 * mas só o time confirmado ganha card na home. */
export function Professores() {
  const professores = getProfessores();
  const confirmados = professores.filter(isProfessorConfirmado);

  return (
    <section id="professores" className="px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          eyebrow="Equipe"
          title={
            <>
              Seu treino montado
              <br />
              por um professor.
            </>
          }
          description="Todos formados em Educação Física."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {confirmados.map((professor) => (
            <article
              key={professor.id}
              className="border-border border-t-flex-blue-600 flex flex-col rounded-[4px] border border-t-4 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(11,77,162,0.32)]"
            >
              <Photo
                src={professor.fotoUrl}
                alt={professor.nome}
                label={`professor ${professor.nome}`}
                ratio="square"
                className="mb-5"
              />
              <h3 className="text-[21px] leading-tight">{professor.nome}</h3>
              <p className="text-muted-foreground border-border mt-2.5 border-b pb-4 font-mono text-[11.5px] tracking-[0.08em] uppercase">
                {professor.papel} · {professor.desde}
              </p>
              <p className="text-muted-foreground mt-4 text-[15px] leading-relaxed">
                {professor.bio}
              </p>
              {professor.formacao ? (
                <p className="text-muted-foreground border-border mt-4 border-t pt-3.5 text-[13.5px] normal-case">
                  {professor.formacao}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
