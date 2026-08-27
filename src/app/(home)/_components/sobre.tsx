import { siteConfig } from '@/config/site';
import { mediaConfig } from '@/config/media';
import { Eyebrow } from '@/components/shared/eyebrow';
import { Photo } from '@/components/shared/photo';

export function Sobre() {
  const anos = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <section id="sobre" className="px-[6%] py-16 md:py-20">
      <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <div className="flex flex-col items-start gap-6">
          {/* Preenchimento azul sólido em vez de caixa branca com borda: mesmo
           * princípio das faixas de seção (Marquee/Horários), aplicado num
           * bloco contido em vez da seção inteira — a seção Sobre continua
           * clara, só este bloco vira "cor cheia". */}
          <div className="bg-flex-blue-700 inline-block rounded-[6px] px-7 py-6">
            <p className="text-flex-blue-200 font-mono text-[10.5px] tracking-[0.26em] uppercase">
              Fundada em
            </p>
            <p className="font-heading my-1.5 text-[64px] leading-[0.9] text-white normal-case sm:text-[76px]">
              {siteConfig.foundedYear}
            </p>
            <div className="mb-3 h-0.5 w-full bg-white/25" />
            <p className="font-mono text-[11px] tracking-[0.1em] text-white/70 uppercase">
              {anos}+ anos na Vila Helena
            </p>
          </div>
          <Photo
            src={mediaConfig.sobreFoto}
            alt={`Fachada e equipe da ${siteConfig.name}`}
            label="fachada / equipe Flex"
            ratio="wide"
            className="w-full"
          />
        </div>

        <div>
          <Eyebrow>Sobre a Flex</Eyebrow>
          <h2 className="text-[clamp(28px,3.6vw,42px)] leading-[1.1]">
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
        </div>
      </div>
    </section>
  );
}
