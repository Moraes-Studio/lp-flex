import { siteConfig, whatsappUrl } from '@/config/site';
import { getFuncionamento } from '@/lib/content/funcionamento';
import { getHorarios } from '@/lib/content/horarios';
import { getModalidades } from '@/lib/content/modalidades';
import { contarConfirmados, getProfessores } from '@/lib/content/professores';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/shared/eyebrow';
import { HeroBoard } from '@/components/shared/hero-board';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';
import { StatusChip } from '@/components/layout/status-chip';
import { CtaArrow } from '@/components/shared/cta-arrow';
import { CountUp } from '@/components/shared/count-up';
import { cn } from '@/lib/utils';

export function Hero() {
  const horarios = getHorarios();
  const funcionamento = getFuncionamento();
  const modalidades = getModalidades();
  const professores = getProfessores();
  const anos = new Date().getFullYear() - siteConfig.foundedYear;

  const stats = [
    { valor: `${anos}+`, label: 'anos na Vila Helena' },
    { valor: String(modalidades.length), label: 'modalidades inclusas' },
    { valor: String(contarConfirmados(professores)), label: 'professores confirmados' },
  ];

  return (
    <section className="px-[6%] pt-10 pb-12 md:pt-14 md:pb-14">
      {/* items-center (não items-start): o quadro "Hoje" (7 aulas) é bem mais
       * curto que a coluna de texto (headline+parágrafo+CTAs+status) — com
       * items-start sobrava um vão vazio grande embaixo dele (achado real,
       * medido: ~173px de buraco). Centralizado, o mesmo espaço "sobrando"
       * fica dividido em cima/embaixo e lê como composição, não como bug. */}
      <div className="mx-auto grid max-w-[1180px] items-center gap-x-14 gap-y-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <Eyebrow className="enter" style={{ '--enter-delay': '0ms' } as React.CSSProperties}>
            Vila Helena · {siteConfig.address.city} · desde {siteConfig.foundedYear}
          </Eyebrow>
          {/* (Removida a linha que atravessava o grid atrás do "SALA." —
           * ficou feia na prática, não sobreviveu à revisão visual.) */}
          <h1
            className="enter heading-reveal text-[clamp(34px,6.2vw,64px)] leading-[1.2]"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            Musculação e aulas
            <br />
            com professor <span className="text-flex-blue-600">em sala</span>.
          </h1>
          <p
            className="enter text-muted-foreground mt-5 max-w-[500px] text-[17px] font-normal normal-case"
            style={{ '--enter-delay': '140ms' } as React.CSSProperties}
          >
            Na Flex, seu treino é montado por um professor de Educação Física. Durante todo o
            horário de funcionamento, há sempre um professor em sala para orientar a execução dos
            exercícios e tirar dúvidas.
          </p>

          <div
            className="enter mt-7 flex flex-wrap gap-3"
            style={{ '--enter-delay': '210ms' } as React.CSSProperties}
          >
            <Button asChild className="group">
              <a
                href={whatsappUrl('Olá! Quero treinar na Academia Flex.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappGlyph className="h-4 w-4" />
                Falar no WhatsApp
                <CtaArrow variant="up-right" />
              </a>
            </Button>
            <Button asChild variant="ghost" className="group">
              <a href="#planos">
                Ver planos
                <CtaArrow variant="right" />
              </a>
            </Button>
          </div>

          <StatusChip
            funcionamento={funcionamento}
            className="enter mt-6"
            style={{ '--enter-delay': '250ms' } as React.CSSProperties}
          />
        </div>

        <div className="enter relative z-10" style={{ '--enter-delay': '120ms' } as React.CSSProperties}>
          <HeroBoard slots={horarios} />
        </div>

        {/* Placar de stats — V2: virou grafismo de largura cheia (não mais
         * confinado à coluna de texto), números bem maiores, cruza por baixo
         * das duas colunas em vez de ficar preso numa delas. */}
        <dl className="border-flex-blue-600/15 divide-flex-blue-600/15 mt-1 grid grid-cols-3 divide-x border-t pt-5 lg:col-span-2 lg:mt-4 lg:max-w-[620px]">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={cn('enter flex flex-col-reverse', i > 0 && 'pl-4 sm:pl-6')}
              style={{ '--enter-delay': `${280 + i * 60}ms` } as React.CSSProperties}
            >
              <dt className="text-muted-foreground mt-1.5 text-[11.5px] leading-snug normal-case">
                {stat.label}
              </dt>
              <dd className="font-heading text-flex-blue-700 text-[38px] leading-none normal-case tabular-nums sm:text-[46px]">
                <CountUp value={stat.valor} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
