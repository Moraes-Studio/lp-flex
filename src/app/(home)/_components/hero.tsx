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
    <section className="px-[6%] pt-12 pb-14 md:pt-16 md:pb-16">
      <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <Eyebrow className="enter" style={{ '--enter-delay': '0ms' } as React.CSSProperties}>
            Vila Helena · {siteConfig.address.city} · desde {siteConfig.foundedYear}
          </Eyebrow>
          <h1
            className="enter text-[clamp(34px,6.4vw,64px)] leading-[1.05]"
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
            <Button asChild>
              <a
                href={whatsappUrl('Olá! Quero treinar na Academia Flex.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappGlyph className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </Button>
            <Button asChild variant="ghost">
              <a href="#planos">Ver planos</a>
            </Button>
          </div>

          <StatusChip
            funcionamento={funcionamento}
            className="enter mt-6"
            style={{ '--enter-delay': '250ms' } as React.CSSProperties}
          />

          <dl className="border-border divide-border mt-10 grid grid-cols-3 divide-x border-t pt-6 sm:max-w-[460px]">
            {/* dt antes de dd (ordem semântica correta) + `flex-col-reverse`
             * pra manter o número grande visualmente em cima do rótulo —
             * antes tinha um `<p>` como terceiro filho da div junto de
             * dt/dd, e `<dl>` só aceita dt/dd (+script/template) como
             * filho direto (ou dentro de div): achado real de Lighthouse
             * (audit "definition-list", SDD.md §10 gate de 95+).
             * Números maiores + divisores verticais (`divide-x`): tratamento
             * de "placar" pedido na lapidação — o número é o elemento
             * visual, não só um dado dentro de texto. `.enter` por item (não
             * no `<dl>` inteiro) pra escalonar levemente a entrada dos 3
             * números — mesmo mecanismo em CSS puro do resto do Hero, só com
             * um delay incremental por stat. */}
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={cn('enter flex flex-col-reverse', i > 0 && 'pl-4')}
                style={{ '--enter-delay': `${280 + i * 60}ms` } as React.CSSProperties}
              >
                <dt className="text-muted-foreground mt-1.5 text-[11.5px] leading-snug normal-case">
                  {stat.label}
                </dt>
                <dd className="font-heading text-flex-blue-700 text-[36px] leading-none normal-case sm:text-[42px]">
                  {stat.valor}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="enter" style={{ '--enter-delay': '120ms' } as React.CSSProperties}>
          <HeroBoard slots={horarios} />
        </div>
      </div>
    </section>
  );
}
