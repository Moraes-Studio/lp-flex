import { getProfessores, temPerfilCompleto } from '@/lib/content/professores';
import { SectionHeading } from '@/components/shared/section-heading';
import { Photo } from '@/components/shared/photo';
import { Reveal } from '@/components/shared/reveal';

/** content/professores.json guarda vaga placeholder (nome genérico
 * "Professor 0X") pra cada modalidade sem profissional confirmado ainda —
 * necessário pra checagem de cobertura modalidade↔professor (SDD.md §5).
 * Só ganha lugar na home quem já tem perfil de verdade preenchido
 * (`temPerfilCompleto`). Esses "nome confirmado, perfil pendente" ainda
 * contam no stat "professores confirmados" do Hero — só não aparecem aqui. */
export function Professores() {
  const professores = getProfessores();
  const confirmados = professores.filter(temPerfilCompleto);
  // V2 (direção de arte) — a seção era a fraqueza apontada: tudo com o mesmo
  // peso, "flat", mesmo sem foto. Resposta: hierarquia, não caixa. O primeiro
  // confirmado (ordem já existente do JSON, nenhum critério novo inventado)
  // vira a "voz" da seção — a bio DELE (texto real, já existente) ganha
  // tratamento de citação editorial grande; os outros continuam na lista,
  // com a bio própria, só sem repetir a dele ali (evita duplicar o mesmo
  // texto duas vezes na página).
  const destaque = confirmados[0] ?? null;

  return (
    // bg-surface-200 — um degrau mais frio que Modalidades (V1.5 §1/§2):
    // Horários (grafite) fica entre as duas, então não é repetição de tom.
    <section id="professores" className="bg-surface-200 border-border border-y px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Coluna grande — a "voz" da equipe: heading maior (size="large",
           * único lugar além de 1992 com esse peso) + uma frase real de um
           * professor, tratada como citação editorial, não mais uma linha de
           * bio igual às outras. */}
          <div>
            <SectionHeading
              className="mb-8 lg:mb-10"
              eyebrow="Equipe"
              size="large"
              title={
                <>
                  Seu treino montado
                  <br />
                  por um professor.
                </>
              }
              description="Todos formados em Educação Física."
            />
            {destaque ? (
              <Reveal className="border-flex-blue-600 max-w-[460px] border-l-2 pl-5">
                <span
                  aria-hidden="true"
                  className="font-heading text-flex-blue-600/30 block text-[72px] leading-[0.4]"
                >
                  “
                </span>
                <p className="text-foreground -mt-1 text-[19px] leading-relaxed normal-case">
                  {destaque.bio}
                </p>
                <p className="text-muted-foreground mt-4 font-mono text-[11.5px] tracking-[0.1em] uppercase">
                  {destaque.nome} · {destaque.papel}
                </p>
              </Reveal>
            ) : null}
          </div>

          {/* Coluna do roster — lista, não grid de cards. 2 colunas até
           * antes do lg (a página ainda tem largura de sobra pra isso),
           * vira lista única de cima a baixo a partir do lg (dividindo
           * espaço com a coluna da citação). */}
          <Reveal className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-y-1">
            {confirmados.map((professor) => {
              const isDestaque = professor.id === destaque?.id;
              return (
                <article
                  key={professor.id}
                  className="group border-flex-blue-600/20 relative grid grid-cols-[26px_1fr] gap-x-3 border-t py-5 pl-3 transition-colors duration-200 lg:hover:bg-surface-100/60"
                >
                  <span
                    aria-hidden="true"
                    className="bg-flex-blue-600 absolute top-0 left-0 h-full w-[2px] origin-top scale-y-0 transition-transform duration-200 group-hover:scale-y-100"
                  />
                  <span className="text-flex-blue-700 mt-0.5 font-mono text-[12px] tracking-[0.1em]">
                    {professor.num}
                  </span>
                  <div>
                    <Photo
                      src={professor.fotoUrl}
                      alt={professor.nome}
                      label={`professor ${professor.nome}`}
                      ratio="square"
                      className="mb-3 w-16"
                    />
                    <h3 className="text-[18px] leading-tight">{professor.nome}</h3>
                    <p className="text-muted-foreground mt-1 font-mono text-[11px] tracking-[0.08em] uppercase">
                      {professor.papel} · {professor.desde}
                    </p>
                    {!isDestaque ? (
                      <p className="text-muted-foreground mt-2.5 max-w-[420px] text-[14px] leading-relaxed">
                        {professor.bio}
                      </p>
                    ) : null}
                    {professor.formacao ? (
                      <p className="text-muted-foreground mt-2 max-w-[420px] text-[12.5px] normal-case">
                        {professor.formacao}
                      </p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
