import { getProfessores, temPerfilCompleto } from '@/lib/content/professores';
import { SectionHeading } from '@/components/shared/section-heading';
import { Photo } from '@/components/shared/photo';
import { Reveal } from '@/components/shared/reveal';

/** content/professores.json guarda vaga placeholder (nome genérico
 * "Professor 0X") pra cada modalidade sem profissional confirmado ainda —
 * necessário pra checagem de cobertura modalidade↔professor (SDD.md §5).
 * Só ganha card na home quem já tem perfil de verdade preenchido
 * (`temPerfilCompleto`) — nome real sozinho (sem bio/foto) já foi tentado e
 * ficou feio (7 cards iguais com "perfil completo em breve"), por isso não
 * basta ter saído do nome genérico. Esses "nome confirmado, perfil pendente"
 * ainda contam no stat "professores confirmados" do Hero (via
 * `contarConfirmados`/`isProfessorConfirmado`) — só não aparecem aqui. */
export function Professores() {
  const professores = getProfessores();
  const confirmados = professores.filter(temPerfilCompleto);

  return (
    <section id="professores" className="bg-background-alt border-border border-y px-[6%] py-16 md:py-20">
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

        <Reveal className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {confirmados.map((professor) => (
            <article
              key={professor.id}
              className="border-border border-t-flex-blue-600 shadow-card hover:shadow-card-hover flex flex-col rounded-[4px] border border-t-4 bg-white p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1"
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
        </Reveal>
      </div>
    </section>
  );
}
