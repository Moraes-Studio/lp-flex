import { ArrowUpRight, MapPin } from 'lucide-react';
import { getFuncionamento } from '@/lib/content/funcionamento';
import { siteConfig, whatsappUrl } from '@/config/site';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';

export function Contato() {
  const funcionamento = getFuncionamento();
  const endereco = `${siteConfig.address.street}, ${siteConfig.address.city} — ${siteConfig.address.state}, ${siteConfig.address.zip}`;
  const mapaQuery = encodeURIComponent(endereco);
  const abrirNoMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapaQuery}`;

  return (
    <section id="contato" className="bg-background-alt border-border border-y px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading eyebrow="Contato" title="Venha conhecer." />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <h3 className="font-heading mb-1.5 text-sm tracking-[0.1em]">
              Horário de funcionamento
            </h3>
            {funcionamento
              .slice(1)
              .concat(funcionamento[0])
              .map((dia) => (
                <div
                  key={dia.dia}
                  className="border-border flex justify-between gap-3 border-b py-2.5 text-[14.5px] normal-case"
                >
                  <span>{dia.dia}</span>
                  <span className="text-flex-blue-700 font-mono">
                    {dia.abre && dia.fecha ? `${dia.abre} – ${dia.fecha}` : 'Fechado'}
                  </span>
                </div>
              ))}

            <Button asChild className="mt-7">
              <a
                href={whatsappUrl('Olá! Vim pelo site e quero saber mais sobre os planos.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappGlyph className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </Button>
          </div>

          <div className="border-border shadow-panel flex flex-col overflow-hidden rounded-2xl border bg-white">
            <div className="bg-flex-blue-600 flex items-center gap-2 px-5 py-3.5 text-white">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase">Como chegar</span>
            </div>
            <div className="bg-background-alt relative min-h-[300px] flex-1">
              <iframe
                title="Localização da Academia Flex"
                src={`https://www.google.com/maps?q=${mapaQuery}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 [filter:grayscale(38%)_contrast(1.05)_saturate(1.1)]"
              />
            </div>
            <a
              href={abrirNoMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border hover:bg-background-alt group flex items-center justify-between gap-2 border-t px-5 py-3.5 text-sm font-medium transition-colors"
            >
              Abrir no Google Maps
              <ArrowUpRight
                className="text-flex-blue-600 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
