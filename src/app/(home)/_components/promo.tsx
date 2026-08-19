import { campanhaVisivel, getCampaign } from '@/lib/content/campaign';
import { whatsappUrl } from '@/config/site';
import { Button } from '@/components/ui/button';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';

/**
 * Faixa de campanha sazonal. Cor isolada (`--campaign-accent`) só aqui —
 * nunca no CTA, que fica institucional (RULES.md Regra Absoluta #3: "cor
 * institucional... nunca muda, campanha ativa ou não"). O protótipo de
 * referência original usava o azul institucional no gradiente da faixa;
 * SDD.md §9 registra que isso já foi um bug corrigido antes, então não
 * repito aqui mesmo seguindo o resto do protótipo à risca.
 */
export function Promo() {
  const campaign = getCampaign();
  if (!campanhaVisivel(campaign, new Date())) return null;

  return (
    <section className="px-[6%] py-8">
      <div className="from-campaign-accent to-campaign-accent/80 mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 rounded-2xl bg-gradient-to-r px-7 py-6 text-[#3d2600] sm:px-9">
        <div>
          <span className="mb-2 inline-block rounded-pill bg-[#3d2600]/12 px-3 py-1 font-mono text-[11px] font-bold tracking-[0.14em] uppercase">
            {campaign.tag}
          </span>
          <h3 className="text-[clamp(22px,3vw,30px)] leading-tight">{campaign.titulo}</h3>
          <p className="mt-1 text-[14.5px] font-medium normal-case opacity-85">{campaign.sub}</p>
        </div>
        <Button asChild>
          <a
            href={whatsappUrl(`Olá! Vim pelo site e quero a condição da campanha "${campaign.titulo}".`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappGlyph className="h-4 w-4" />
            Quero essa condição
          </a>
        </Button>
      </div>
    </section>
  );
}
