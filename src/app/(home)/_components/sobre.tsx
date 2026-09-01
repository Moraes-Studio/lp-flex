import { siteConfig } from '@/config/site';
import { mediaConfig } from '@/config/media';
import { Eyebrow } from '@/components/shared/eyebrow';
import { Photo } from '@/components/shared/photo';
import { Reveal } from '@/components/shared/reveal';

/**
 * V2 (direção de arte) — o principal momento gráfico da página. Antes (V1.5)
 * era "número grande dentro da seção clara"; agora é uma composição de marca
 * de verdade: metade da viewport vira superfície Flex Blue (grid de 2
 * colunas em largura total, não o `max-w-[1180px]` do resto do site — é o
 * próprio grid quem faz o "bleed", sem precisar de calc(50vw) nem
 * overflow-hidden de página inteira). Texto real continua disciplinado
 * (mesmo `px-[6%]`/max-width de sempre) — só a superfície escapa.
 */
export function Sobre() {
  const anos = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <section id="sobre">
      <div className="lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:items-stretch">
        {/* Metade azul — patrimônio. overflow-hidden contém o "1992" quando
         * ele excede a coluna (crop intencional, nunca vira scroll). */}
        <div className="bg-flex-blue-700 relative overflow-hidden px-[6%] py-16 md:py-20 lg:flex lg:items-center lg:py-0">
          <div className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:ml-auto lg:mr-12 lg:max-w-[440px]">
            <p className="font-mono text-flex-blue-200 text-[11px] tracking-[0.32em] uppercase">Est.</p>
            {/* aria-hidden: decorativo — o ano real já está em texto legível
             * logo abaixo ("{anos}+ anos") e no h2 da coluna branca ("desde
             * {ano}"). whitespace-nowrap + clamp: em telas muito largas o
             * numeral excede os 440px do bloco de propósito e é cortado pelo
             * overflow-hidden do pai — "parcialmente cortado, mas intencional". */}
            <p
              aria-hidden="true"
              className="font-heading text-white -mt-1 text-[clamp(110px,15vw,230px)] leading-[0.78] whitespace-nowrap normal-case"
            >
              {siteConfig.foundedYear}
            </p>
            <div className="mt-5 flex items-center gap-2.5 border-t border-white/20 pt-5">
              <span className="bg-flex-blue-300 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
              <p className="font-mono text-[11px] tracking-[0.14em] text-white/80 uppercase">
                {anos}+ anos na Vila Helena
              </p>
            </div>
            <p className="mt-1.5 font-mono text-[11px] tracking-[0.14em] text-white/50 uppercase">
              Vila Helena · {siteConfig.address.city}
            </p>

            {/* Continua null até existir foto real (política de fotografia,
             * CLAUDE.md) — quando existir, encaixa como uma foto presa no
             * canto do painel, sem precisar tocar nesta composição. */}
            <Photo
              src={mediaConfig.sobreFoto}
              alt={`Fachada e equipe da ${siteConfig.name}`}
              label="fachada / equipe Flex"
              ratio="square"
              className="border-white/30 absolute right-0 bottom-0 w-28 shadow-xl sm:w-36 lg:-right-4 lg:-bottom-4 lg:w-40"
            />
          </div>
        </div>

        {/* Metade branca — a mesma leitura de antes, só que agora reage à
         * escala do lado azul em vez de dividir a seção ao meio de forma
         * neutra. */}
        <div className="flex items-center px-[6%] py-16 md:py-20">
          <Reveal className="w-full max-w-[540px]">
            <Eyebrow>Sobre a Flex</Eyebrow>
            <h2 className="heading-reveal text-[clamp(28px,3.6vw,42px)] leading-[1.1]">
              Academia completa,
              <br />
              desde {siteConfig.foundedYear}.
            </h2>
            <p className="text-muted-foreground mt-5 max-w-[540px] text-[16.5px] normal-case">
              Professores de Educação Física ficam em sala durante o horário de funcionamento,
              montam o treino do aluno e orientam a execução dos exercícios.
            </p>
            <p className="text-muted-foreground mt-4 max-w-[540px] text-[16.5px] normal-case">
              Musculação e todas as aulas coletivas entram no mesmo plano: pilates, yoga, zumba,
              jump, fit dance, step, GAP, ritbox, flex training e cross training.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
