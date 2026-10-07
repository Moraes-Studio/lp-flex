import { siteConfig } from '@/config/site';
import { mediaConfig } from '@/config/media';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/shared/eyebrow';
import { HeroRotator } from '@/components/shared/hero-rotator';
import { CtaArrow } from '@/components/shared/cta-arrow';

/**
 * Hero imersivo (iteração pós-comparação com SmartFit/Bluefit): foto real em
 * tela cheia, uma camada de cor sólida Flex Blue por cima (nunca gradiente,
 * brilho ou vidro) e o texto alinhado à esquerda na mesma margem do logo
 * (`px-[6%]`), assentado na metade de baixo.
 *
 * - Puxado pra baixo do header sticky com `-mt-[121px]` (logo 96 + `py-3`
 *   24 + borda 1) e o mesmo valor de padding-top: a foto começa no topo da
 *   viewport e o header fica transparente por cima (header-shell.tsx).
 * - Um único botão, "Ver planos". O WhatsApp acima da dobra é só o do
 *   header ("Quero treinar agora").
 * - Opacidade da camada medida nas 3 fotos (pixel mais claro sob o texto):
 *   70% é o mínimo em que "em sala" (flex-blue-300) passa 3:1 nas 3 fotos
 *   (60% dá 2.6:1); o branco fica ≥ 7.3:1 até sobre lâmpada estourada.
 *   O eyebrow é branco (não o azul-300 do `inverted`) pelo mesmo motivo:
 *   texto pequeno pede 4.5:1. A linha do eyebrow continua azul.
 *
 * Copy revisada contra SDD §7 (portão 1): só frases permitidas ("professor
 * presente na sala", "orientação", "tirar dúvidas").
 */
export function Hero() {
  return (
    <section
      data-hero-imersivo
      className="bg-flex-blue-950 relative isolate -mt-[121px] flex min-h-[100dvh] flex-col"
    >
      <div className="absolute inset-0 -z-10">
        <HeroRotator fotos={mediaConfig.heroFotos} />
      </div>
      <div className="bg-flex-blue-950/70 absolute inset-0 -z-10" aria-hidden="true" />

      <div className="flex flex-1 items-end px-[6%] pt-[calc(121px+40px)] pb-[clamp(48px,11dvh,128px)]">
        <div className="w-full max-w-[1100px]">
          <Eyebrow
            variant="inverted"
            className="enter mb-3 text-white md:mb-5"
            style={{ '--enter-delay': '0ms' } as React.CSSProperties}
          >
            {/* No mobile quebra em "Vila Helena · Santo André" / "desde 1992",
             * em vez de deixar um "·" solto no fim da linha. */}
            <span>
              Vila Helena · {siteConfig.address.city}
              <span className="max-sm:hidden"> · </span>
              <br className="sm:hidden" />
              desde {siteConfig.foundedYear}
            </span>
          </Eyebrow>
          {/* `pt-[0.14em]`: com entrelinha 0.95 o til de "Ã" passa do topo da
           * caixa e o clip-path do `heading-reveal` cortava o acento. */}
          <h1
            className="enter heading-reveal pt-[0.14em] text-[clamp(48px,min(8.4vw,13.5dvh),124px)] leading-[0.95] font-bold tracking-[0.005em] text-balance text-white md:text-wrap"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            Musculação <br className="hidden md:block" />e aulas com{' '}
            <br className="hidden md:block" />
            professor <span className="text-flex-blue-300 whitespace-nowrap">em sala</span>.
          </h1>
          <p
            className="enter mt-6 max-w-[520px] text-[17px] leading-[1.55] font-normal text-white/90 normal-case md:mt-8 md:text-[19px] lg:max-w-[560px] lg:text-[20px]"
            style={{ '--enter-delay': '140ms' } as React.CSSProperties}
          >
            Professor de Educação Física presente na sala em todo o horário, orientando a execução
            e tirando dúvidas.
          </p>

          <div
            className="enter mt-8 md:mt-10"
            style={{ '--enter-delay': '210ms' } as React.CSSProperties}
          >
            <Button
              asChild
              variant="onDark"
              className="group px-8 py-[18px] text-[15px] tracking-wide uppercase focus-visible:ring-offset-flex-blue-950"
            >
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
