import { siteConfig } from '@/config/site';
import { mediaConfig } from '@/config/media';
import { getModalidades, separarModalidades } from '@/lib/content/modalidades';
import { contarConfirmados, getProfessores } from '@/lib/content/professores';
import { CountUp } from '@/components/shared/count-up';
import { PhotoCarousel } from '@/components/shared/photo-carousel';
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
 */
export function Sobre() {
  const anos = new Date().getFullYear() - siteConfig.foundedYear;
  const modalidades = getModalidades();
  const { aulas } = separarModalidades(modalidades);
  const professores = getProfessores();

  const stats = [
    { valor: `${anos}+`, label: 'anos na Vila Helena' },
    { valor: String(aulas.length), label: 'aulas coletivas inclusas' },
    { valor: String(contarConfirmados(professores)), label: 'professores confirmados' },
  ];

  return (
    <section id="sobre" className="bg-flex-blue-700 px-[6%] py-20 text-white md:py-28">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="max-w-[960px]">
          <h2 className="heading-reveal text-[clamp(34px,5vw,72px)] leading-[1.1] text-balance text-white">
            Academia completa,{' '}
            <span className="whitespace-nowrap">desde {siteConfig.foundedYear}.</span>
          </h2>
          <p className="mt-6 max-w-[560px] text-[17px] text-pretty text-white/80 normal-case">
            Musculação e as {aulas.length} aulas coletivas no mesmo plano, na Vila Helena desde{' '}
            {siteConfig.foundedYear}.
          </p>
        </Reveal>

        <dl className="mt-12 grid max-w-[880px] grid-cols-3 divide-x divide-white/15 border-t border-white/15 pt-8 md:mt-14">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn('flex flex-col-reverse justify-end', i > 0 && 'pl-4 sm:pl-6')}
            >
              <dt className="mt-2.5 text-[12.5px] leading-snug text-white/70 normal-case sm:text-[14px]">
                {stat.label}
              </dt>
              <dd className="font-heading text-[clamp(48px,6vw,88px)] leading-none text-white tabular-nums">
                <CountUp value={stat.valor} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 md:mt-14">
          <PhotoCarousel
            fotos={mediaConfig.sobreGaleria}
            rotulo="Fotos da Academia Flex"
            tone="dark"
          />
        </div>
      </div>
    </section>
  );
}
