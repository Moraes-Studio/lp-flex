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
            Na Flex o treino é montado por um professor de Educação Física, e sempre há professor
            em sala durante o horário de funcionamento para orientar a execução dos exercícios e
            tirar dúvidas.
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

          <dl
            className="enter border-border mt-10 grid grid-cols-3 gap-4 border-t pt-6 sm:max-w-[440px]"
            style={{ '--enter-delay': '280ms' } as React.CSSProperties}
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-flex-blue-700 text-[28px] leading-none normal-case sm:text-[32px]">
                  {stat.valor}
                </dd>
                <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug normal-case">
                  {stat.label}
                </p>
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
