import { Check } from 'lucide-react';
import { calcularPrecoFinal, getPlanos } from '@/lib/content/planos';
import { campanhaVisivel, getCampaign } from '@/lib/content/campaign';
import { SectionHeading } from '@/components/shared/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { whatsappUrl } from '@/config/site';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';
import { cn } from '@/lib/utils';

const formatarPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function Planos() {
  const planos = getPlanos();
  const campanha = getCampaign();
  // campanha.active sozinho não checa a data de término (terminaEm) — usar
  // sempre campanhaVisivel aqui, senão o preço/selo promocional deste card
  // fica ligado pra sempre depois que a campanha devia ter acabado.
  const campanhaAtivaAgora = campanhaVisivel(campanha, new Date());

  return (
    <section id="planos" className="px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading
          eyebrow="Planos"
          title={
            <>
              Musculação e todas as
              <br />
              modalidades inclusas.
            </>
          }
        />

        {/* items-start: por padrão o grid estica todo card pra altura do mais
         * alto — com o card "12 meses" carregando selos+CTA+benefícios, isso
         * deixava os outros dois com um vão vazio grande embaixo. Cada card
         * fica com a própria altura de conteúdo agora, o que também reforça
         * visualmente o destaque do card do meio (fica mais alto de verdade,
         * não só com uma borda mais grossa). */}
        <div className="grid items-start gap-5 md:grid-cols-3">
          {planos.map((plano) => {
            const precoFinal = calcularPrecoFinal(plano, campanhaAtivaAgora);
            const temDesconto = precoFinal !== null && precoFinal !== plano.precoBase;
            const emCampanha = campanhaAtivaAgora && plano.campanhaAtiva;

            return (
              <div
                key={plano.id}
                className={cn(
                  'border-border flex flex-col rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-24px_rgba(11,77,162,0.32)]',
                  plano.destaque &&
                    'border-flex-blue-600 border-2 shadow-[0_20px_44px_-22px_rgba(11,77,162,0.4)]'
                )}
              >
                <div className="mb-3 flex min-h-[22px] flex-wrap items-center gap-2">
                  {plano.destaque && plano.badge ? (
                    <Badge variant="institutional">{plano.badge}</Badge>
                  ) : null}
                  {plano.badgeExtra ? <Badge variant="institutional">{plano.badgeExtra}</Badge> : null}
                  {emCampanha && plano.badgeCampanha ? (
                    // Sólido em vez do outline claro dos outros selos: com o
                    // acento de campanha agora também azul, o outline sozinho
                    // ficava indistinguível de "Mais escolhido"/"Clube+" ao
                    // lado — o preenchimento é o que sinaliza "isso é
                    // diferente/temporário", não a cor em si.
                    <Badge
                      variant="campaign"
                      className="border-campaign-accent bg-campaign-accent text-white"
                    >
                      {plano.badgeCampanha}
                    </Badge>
                  ) : null}
                  {temDesconto && campanhaAtivaAgora ? (
                    <Badge variant="campaign">Campanha ativa</Badge>
                  ) : null}
                </div>

                <h3 className="text-[21px]">{plano.nome}</h3>
                {plano.descricao ? (
                  <p className="text-muted-foreground mt-1.5 text-sm normal-case">
                    {plano.descricao}
                  </p>
                ) : null}

                <div className="mt-5">
                  {emCampanha && campanha.titulo ? (
                    // Preço normal do plano some enquanto a campanha estiver ativa —
                    // mostrar as duas condições de pagamento juntas (a do plano e a
                    // da campanha) ao mesmo tempo confundiria mais do que ajudaria.
                    // Volta a mostrar o preço padrão sozinho quando a campanha acabar.
                    <>
                      <p className="font-heading text-campaign-accent text-[24px] leading-snug">
                        {campanha.titulo}
                      </p>
                      {campanha.sub ? (
                        <p className="text-muted-foreground mt-1.5 text-[13.5px] normal-case">
                          {campanha.sub}
                        </p>
                      ) : null}
                    </>
                  ) : precoFinal === null ? (
                    <p className="font-heading text-flex-blue-700 text-[30px]">Sob consulta</p>
                  ) : (
                    <>
                      <p className="font-heading text-flex-blue-700 leading-none">
                        <span className="text-[42px]">R$ {formatarPreco(precoFinal)}</span>
                        <span className="text-muted-foreground ml-1 text-base font-normal normal-case">
                          {plano.periodo}
                        </span>
                      </p>
                      {temDesconto && plano.precoBase !== null ? (
                        <p className="text-muted-foreground mt-1 text-[13px] normal-case line-through">
                          R$ {formatarPreco(plano.precoBase)}
                          {plano.periodo}
                        </p>
                      ) : null}
                    </>
                  )}
                </div>

                {emCampanha ? (
                  <Button asChild size="sm" className="mt-4">
                    <a
                      href={whatsappUrl(
                        `Olá! Vim pelo site e quero a condição da campanha "${campanha.titulo}".`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsappGlyph className="h-4 w-4" />
                      Quero essa condição
                    </a>
                  </Button>
                ) : null}

                {plano.obs && !emCampanha ? (
                  <p className="text-muted-foreground border-border mt-2.5 border-t pt-3 text-[13.5px] normal-case">
                    {plano.obs}
                  </p>
                ) : null}

                {(() => {
                  const beneficios = [
                    ...(plano.beneficios ?? []),
                    ...(emCampanha ? (plano.beneficiosCampanha ?? []) : []),
                  ];
                  if (beneficios.length === 0) return null;
                  return (
                    <ul className="mt-5 flex-1 space-y-2.5">
                      {beneficios.map((beneficio) => (
                        <li key={beneficio} className="flex items-start gap-2 text-sm normal-case">
                          <Check
                            className="text-flex-blue-600 mt-0.5 h-4 w-4 shrink-0"
                            aria-hidden="true"
                          />
                          {beneficio}
                        </li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            );
          })}
        </div>

        <p className="text-muted-foreground mt-6 text-sm normal-case">
          Musculação e todas as modalidades inclusas. Matrícula R$ 99,00 e mapeamento R$ 50,00 à
          parte.
        </p>
      </div>
    </section>
  );
}
