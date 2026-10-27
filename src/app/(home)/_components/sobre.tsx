import { siteConfig } from '@/config/site';
import { contarConfirmados, getProfessores } from '@/lib/content/professores';
import { formatarNota, getReputacao } from '@/lib/content/reputacao';
import { Estrelas } from '@/components/shared/estrelas';
import { CountUp } from '@/components/shared/count-up';
import { Reveal } from '@/components/shared/reveal';
import { cn } from '@/lib/utils';

/**
 * Sobre (rodada 2026-10-07): pilha vertical, não split. Hero e Professores
 * já são duas colunas, e Contato também; três seções seguidas no mesmo
 * formato é zigue-zague de template. Título, texto curto, os números que
 * saíram do hero e o carrossel com o espaço real (fachada primeiro). Sem
 * eyebrow e sem o bloco azul com o "1992" gigante.
 * Iteração imersiva: a seção inteira vira azul (flex-blue-700), com os
 * números grandes em branco (não é o "1992" decorativo: são dados reais).
 * Rodada 2026-10-24: sem fotos. O carrossel virou o mosaico de ambientes
 * em Modalidades (as fotos ficam num lugar só), e saiu o parágrafo que
 * repetia "musculação e aulas no mesmo plano", já dito em Planos e em
 * Modalidades. Ficam o título e os números.
 * Rodada 2026-10-26: sai o número de aulas coletivas (já dito em
 * Modalidades, "10 aulas no mesmo plano") e, no desktop, título e números
 * ficam lado a lado, alinhados pela base, em vez de o título ocupar meia
 * largura com a outra metade vazia. No celular continuam empilhados.
 * Entra também a nota da Flex no Google (prova social local, com link pras
 * avaliações), que as redes grandes não têm como mostrar.
 */
export function Sobre() {
  const anos = new Date().getFullYear() - siteConfig.foundedYear;
  const professores = getProfessores();
  const { google } = getReputacao();

  const stats: { valor: string; label: string; href?: string; estrelas?: number }[] = [
    { valor: `${anos}+`, label: 'anos na Vila Helena' },
    { valor: String(contarConfirmados(professores)), label: 'professores' },
    {
      valor: formatarNota(google.nota),
      label: `${google.avaliacoes.toLocaleString('pt-BR')} avaliações no Google`,
      href: google.url,
      estrelas: google.nota,
    },
  ];

  return (
    <section id="sobre" className="bg-flex-blue-700 px-[6%] py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-12 md:gap-14 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-16">
        <Reveal>
          <h2 className="heading-reveal text-[clamp(34px,5vw,72px)] leading-[1.1] text-balance text-white">
            Academia completa,{' '}
            <span className="whitespace-nowrap">desde {siteConfig.foundedYear}.</span>
          </h2>
        </Reveal>

        <dl className="grid grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn('flex flex-col-reverse justify-end', i > 0 && 'pl-4 sm:pl-6')}
            >
              <dt className="mt-2.5 text-[13.5px] leading-snug text-white/70 normal-case sm:text-[15px]">
                {stat.estrelas ? (
                  <Estrelas nota={stat.estrelas} tamanho={15} className="mb-2 flex w-fit" />
                ) : null}
                {stat.href ? (
                  <a
                    href={stat.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
                  >
                    {stat.label}
                  </a>
                ) : (
                  stat.label
                )}
              </dt>
              <dd className="font-heading text-[clamp(48px,6vw,88px)] leading-none text-white tabular-nums">
                <CountUp value={stat.valor} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
