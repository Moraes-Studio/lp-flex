import { siteConfig, whatsappUrl } from '@/config/site';
import { mediaConfig } from '@/config/media';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/shared/eyebrow';
import { HeroRotator } from '@/components/shared/hero-rotator';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';
import { CtaArrow } from '@/components/shared/cta-arrow';

/**
 * Hero (rodada 2026-10-07): texto à esquerda no fundo claro, fotos reais à
 * direita até a borda da tela, nada sobreposto à foto. No máximo 4
 * elementos de texto (eyebrow, h1, subtexto ≤ 20 palavras, CTAs). O quadro
 * HOJE foi pra Horários, o chip "aberto agora" pro header e os números pro
 * Sobre.
 *
 * Subtexto revisado contra SDD §7 (portão 1): só frases permitidas
 * ("professor presente na sala", "orientação", "tirar dúvidas"), nada que
 * implique acompanhamento individual incluso no plano.
 */
export function Hero() {
  return (
    <section className="grid lg:min-h-[min(720px,calc(100dvh-121px))] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative aspect-[4/3] w-full lg:order-2 lg:aspect-auto">
        <HeroRotator fotos={mediaConfig.heroFotos} />
      </div>

      <div className="flex items-center px-[6%] py-12 md:py-16 lg:order-1 lg:py-20 lg:pr-8 lg:pl-[6vw]">
        <div className="mx-auto w-full max-w-[640px] lg:mx-0">
          <Eyebrow className="enter" style={{ '--enter-delay': '0ms' } as React.CSSProperties}>
            Vila Helena · {siteConfig.address.city} · desde {siteConfig.foundedYear}
          </Eyebrow>
          <h1
            className="enter heading-reveal text-[clamp(34px,3.8vw,56px)] leading-[1.12]"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            Musculação e aulas com professor{' '}
            <span className="text-flex-blue-600 whitespace-nowrap">em sala</span>.
          </h1>
          <p
            className="enter text-muted-foreground mt-5 max-w-[460px] text-[17px] font-normal normal-case"
            style={{ '--enter-delay': '140ms' } as React.CSSProperties}
          >
            Professor de Educação Física presente na sala em todo o horário, orientando a execução e
            tirando dúvidas.
          </p>

          <div
            className="enter mt-8 flex flex-wrap gap-3"
            style={{ '--enter-delay': '210ms' } as React.CSSProperties}
          >
            <Button asChild className="group">
              <a
                href={whatsappUrl('Olá! Quero treinar na Academia Flex.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappGlyph className="h-4 w-4" />
                Quero treinar agora
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
        </div>
      </div>
    </section>
  );
}
