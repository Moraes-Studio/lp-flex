import Image from 'next/image';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { mapsUrl, siteConfig, whatsappUrl } from '@/config/site';
import { mediaConfig } from '@/config/media';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';
import { MapaContato } from '@/app/(home)/_components/mapa-contato';

export function Contato() {
  const endereco = `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.state}, ${siteConfig.address.zip}`;
  const mapaQuery = encodeURIComponent(endereco);
  const abrirNoMapsUrl = mapsUrl();

  return (
    // bg-surface-200 (não bg-background-alt): último degrau frio antes do azul
    // cheio do rodapé — ritmo de superfícies V1.5 §1/§2.
    <section id="contato" className="bg-surface-200 border-border border-y px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        {/* Sem eyebrow (rodada 2026-10-26): o único rótulo acima de título na
         * home é o do hero. */}
        <SectionHeading title="Venha conhecer." />

        {/* Coluna da esquerda: ação + fachada; mapa à direita. O horário de
         * funcionamento não se repete aqui (rodada 2026-10-26): vive só na faixa
         * grande (#funcionamento), e o link abaixo leva até ela.
         * lg:items-stretch: o mapa (flex-1) estica até a altura da coluna da
         * fachada. */}
        <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-stretch lg:gap-x-24">
          <div className="flex flex-col">
            <Button asChild className="w-full sm:w-auto">
              <a
                href={whatsappUrl('Olá! Vim pelo site e quero saber mais sobre os planos.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappGlyph className="h-4 w-4" />
                Quero treinar agora
              </a>
            </Button>
            <a
              href="#funcionamento"
              className="text-flex-blue-700 hover:text-flex-blue-600 focus-visible:ring-flex-blue-600 mt-4 self-start rounded-sm text-[14.5px] font-medium normal-case underline decoration-current/30 underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
            >
              Ver horário de funcionamento
            </a>

            {/* Fachada (rodada 2026-10-24, saiu do mosaico de Modalidades): aqui
             * ela tem função, mostra o prédio que a pessoa vai procurar na
             * rua. Legenda abaixo, nada sobre a foto. */}
            <figure className="mt-10">
              {/* Duas fotos da fachada lado a lado, estáticas (2026-10-27): em
               * troca automática o salto entre o prédio inteiro e a entrada de
               * perto ficava duro. Prédio à esquerda (o que a pessoa procura na
               * rua), entrada com o letreiro à direita. Nada sobre as fotos. */}
              <div className="grid grid-cols-2 gap-2.5">
                {[mediaConfig.fachada, mediaConfig.fachadaEntrada].map((foto) => (
                  <div key={foto.src} className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    <Image
                      src={foto.src}
                      alt={foto.alt}
                      fill
                      sizes="(min-width: 1024px) 210px, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <figcaption className="text-muted-foreground mt-2.5 text-[13.5px] normal-case">
                {siteConfig.address.street}
              </figcaption>
            </figure>
          </div>

          <div className="border-border shadow-panel flex flex-col overflow-hidden rounded-2xl border bg-white">
            {/* Cores invertidas (feedback 2026-10-08): o rótulo fica neutro e o
             * azul vai pra ação principal, "Abrir no Google Maps". */}
            <div className="border-border text-flex-blue-700 flex items-center gap-2 border-b px-5 py-3.5">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono text-[12px] tracking-[0.16em] uppercase">Como chegar</span>
            </div>
            <div className="bg-background-alt relative min-h-[340px] flex-1 lg:min-h-[400px]">
              <MapaContato src={`https://www.google.com/maps?q=${mapaQuery}&output=embed`} />
            </div>
            <a
              href={abrirNoMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-flex-blue-600 hover:bg-flex-blue-700 focus-visible:ring-flex-blue-600 group flex items-center justify-between gap-2 px-5 py-3.5 text-sm font-bold text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Abrir no Google Maps
              <ArrowUpRight
                className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
