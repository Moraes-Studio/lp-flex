import { siteConfig } from '@/config/site';
import { mediaConfig } from '@/config/media';
import { getModalidades } from '@/lib/content/modalidades';
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
 */
export function Sobre() {
  const anos = new Date().getFullYear() - siteConfig.foundedYear;
  const modalidades = getModalidades();
  const professores = getProfessores();

  const stats = [
    { valor: `${anos}+`, label: 'anos na Vila Helena' },
    { valor: String(modalidades.length), label: 'modalidades inclusas' },
    { valor: String(contarConfirmados(professores)), label: 'professores confirmados' },
  ];

  return (
    <section id="sobre" className="px-[6%] py-16 md:py-24">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="max-w-[640px]">
          <h2 className="heading-reveal text-balance text-[clamp(28px,3.6vw,44px)] leading-[1.1]">
            Academia completa,{' '}
            <span className="whitespace-nowrap">desde {siteConfig.foundedYear}.</span>
          </h2>
          <p className="text-muted-foreground mt-5 text-[17px] normal-case">
            Musculação e as {modalidades.length - 1} aulas coletivas no mesmo plano, na Vila Helena
            desde {siteConfig.foundedYear}.
          </p>
        </Reveal>

        <dl className="border-flex-blue-600/15 divide-flex-blue-600/15 mt-10 grid max-w-[620px] grid-cols-3 divide-x border-t pt-6">
          {stats.map((stat, i) => (
            <div key={stat.label} className={cn('flex flex-col-reverse', i > 0 && 'pl-4 sm:pl-6')}>
              <dt className="text-muted-foreground mt-1.5 text-[12px] leading-snug normal-case">{stat.label}</dt>
              <dd className="font-heading text-flex-blue-700 text-[38px] leading-none tabular-nums sm:text-[46px]">
                <CountUp value={stat.valor} />
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 md:mt-14">
          <PhotoCarousel fotos={mediaConfig.sobreGaleria} rotulo="Fotos da Academia Flex" />
        </div>
      </div>
    </section>
  );
}
