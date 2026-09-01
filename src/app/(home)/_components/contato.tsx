import { ArrowUpRight, MapPin } from 'lucide-react';
import { getFuncionamento } from '@/lib/content/funcionamento';
import { siteConfig, whatsappUrl } from '@/config/site';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';
import { CtaArrow } from '@/components/shared/cta-arrow';

export function Contato() {
  const funcionamento = getFuncionamento();
  const endereco = `${siteConfig.address.street}, ${siteConfig.address.city} — ${siteConfig.address.state}, ${siteConfig.address.zip}`;
  const mapaQuery = encodeURIComponent(endereco);
  const abrirNoMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapaQuery}`;

  return (
    // bg-surface-200 (não bg-background-alt): último degrau frio antes do azul
    // cheio do rodapé — ritmo de superfícies V1.5 §1/§2.
    <section id="contato" className="bg-surface-200 border-border border-y px-[6%] py-16 md:py-20">
      <div className="mx-auto max-w-[1180px]">
        <SectionHeading eyebrow="Contato" title="Venha conhecer." />

        {/* Mapa maior + coluna de horários mais compacta (420px fixos, não
         * fração) — V2: "mapa pode ocupar mais espaço, horários podem
         * assumir aparência editorial", revisado depois de achado real:
         * 0.85fr numa seção de até 1180px dava ~480px pra coluna de
         * horários, largo demais pro conteúdo (dia + hora), sobrando vão
         * horizontal solto entre os dois. 420px é o suficiente pro texto
         * mais longo ("Domingo e feriados" + "09:30 – 12:30") sem sobra.
         * lg:items-start: cada coluna só ocupa a altura que o próprio
         * conteúdo pede (sem stretch esticando o card do mapa). */}
        <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start lg:gap-x-24">
          {/* Mesma anatomia conceitual das duas colunas — header / conteúdo
           * / ação — pra alinhar de verdade com a coluna do mapa: o "header"
           * aqui usa a MESMA altura estrutural do header colorido ao lado
           * (idêntico py-3.5 + items-center), só sem fundo azul (não é
           * necessário pra esse lado). É isso que faz "HORÁRIO DE
           * FUNCIONAMENTO" e "COMO CHEGAR" começarem na mesma linha visual —
           * antes um era texto cru (sem padding) e o outro uma barra colorida
           * com padding, então mesmo com items-start no grid (topo do BOX
           * igual) o texto de dentro começava em alturas diferentes. */}
          <div className="flex flex-col">
            <div className="flex items-center py-3.5">
              <h3 className="font-heading text-sm tracking-[0.1em]">Horário de funcionamento</h3>
            </div>
            <div>
              {funcionamento
                .slice(1)
                .concat(funcionamento[0])
                .map((dia) => (
                  <div
                    key={dia.dia}
                    className="border-border flex items-baseline justify-between gap-3 border-b py-3 normal-case"
                  >
                    <span className="text-[15.5px] font-medium">{dia.dia}</span>
                    <span className="text-flex-blue-700 font-mono text-[14px] tabular-nums">
                      {dia.abre && dia.fecha ? `${dia.abre} – ${dia.fecha}` : 'Fechado'}
                    </span>
                  </div>
                ))}
            </div>

            <Button asChild className="group mt-7 w-full sm:w-auto">
              <a
                href={whatsappUrl('Olá! Vim pelo site e quero saber mais sobre os planos.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappGlyph className="h-4 w-4" />
                Falar no WhatsApp
                <CtaArrow variant="up-right" />
              </a>
            </Button>
          </div>

          <div className="border-border shadow-panel flex flex-col overflow-hidden rounded-2xl border bg-white">
            <div className="bg-flex-blue-600 flex items-center gap-2 px-5 py-3.5 text-white">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase">Como chegar</span>
            </div>
            <div className="bg-background-alt relative min-h-[340px] flex-1 lg:min-h-[400px]">
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
