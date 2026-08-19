import Image from 'next/image';
import Link from 'next/link';
import { navigation } from '@/config/navigation';
import { siteConfig, whatsappUrl } from '@/config/site';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';

/** lucide-react não inclui logos de marca (removidos da lib) — traço simples
 * próprio, mesmo peso visual dos ícones do resto do site (strokeWidth 1.75). */
function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.6h2.6l.4-3h-3v-1.9c0-.9.2-1.5 1.5-1.5h1.6V4.3C15.9 4.2 15 4.1 14 4.1c-2.4 0-4 1.4-4 4.1v2.3H7.4v3H10V21h3.5z" />
    </svg>
  );
}

export function Footer() {
  const ano = new Date().getFullYear();
  const endereco = `${siteConfig.address.street}, ${siteConfig.address.city} — ${siteConfig.address.state}`;

  return (
    <footer className="bg-flex-blue-700 text-white">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-[6%] py-14 md:grid-cols-[1.6fr_1fr]">
        <div>
          {/* logo nas cores originais (sem inverter pra branco) — bem maior
           * pra ter destaque, sem esticar a altura do rodapé: espaçamentos
           * dos itens abaixo foram enxutos pra compensar. */}
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={124}
            height={116}
            className="mb-2 h-[116px] w-[124px]"
            priority={false}
          />
          <p className="max-w-[380px] text-sm text-white/75">{siteConfig.tagline}</p>
          <p className="mt-1.5 text-xs text-white/60">CNPJ {siteConfig.cnpj}</p>

          <p className="mt-3 flex max-w-[420px] flex-wrap items-center gap-x-2 text-sm text-white/75">
            <span>{endereco}</span>
            <span className="text-white/35">·</span>
            <a
              href={whatsappUrl('Olá! Vim pelo site e quero saber mais sobre os planos.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-white/75 hover:text-white hover:underline"
            >
              <WhatsappGlyph className="h-3.5 w-3.5" />
              Falar no WhatsApp
            </a>
          </p>

          <div className="mt-3 flex gap-2.5">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Academia Flex no Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/25 transition-colors hover:bg-white/10"
            >
              <InstagramGlyph className="h-[18px] w-[18px]" />
            </a>
            {siteConfig.facebookUrl ? (
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Academia Flex no Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/25 transition-colors hover:bg-white/10"
              >
                <FacebookGlyph className="h-[18px] w-[18px]" />
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <h4 className="font-heading mb-4 text-sm font-medium tracking-[0.1em] uppercase">
            Navegação
          </h4>
          <ul className="space-y-2.5 text-sm text-white/80">
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-white hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-2 px-[6%] py-5 pb-24 text-xs text-white/60 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:pb-5">
          <span>
            © {ano} {siteConfig.name}. Todos os direitos reservados.
          </span>
          <Link href="/privacidade" className="hover:text-white hover:underline">
            Política de privacidade
          </Link>
          <span className="sm:ml-auto">Desenvolvido por MoraesStudio</span>
        </div>
      </div>
    </footer>
  );
}
