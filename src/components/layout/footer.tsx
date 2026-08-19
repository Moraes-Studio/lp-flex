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

/**
 * Rodapé compacto — texto pequeno/discreto do mesmo peso visual da barra de
 * copyright embaixo, sem blocos com título grande ("NAVEGAÇÃO"/"CONTATO").
 * Terceira versão desta seção na sessão: foi 2 colunas → 3 colunas → 2
 * colunas de novo → isto (rodapé inteiro no estilo enxuto da barra final).
 */
export function Footer() {
  const ano = new Date().getFullYear();
  const endereco = `${siteConfig.address.street}, ${siteConfig.address.city} — ${siteConfig.address.state}`;

  return (
    <footer className="bg-flex-blue-700 text-white">
      <div className="mx-auto max-w-[1180px] px-[6%] py-10">
        <div className="flex items-center gap-3">
          {/* Arquivo fonte (public/logo.png) só tem 102×96px — abaixo disso
           * fica borrado por falta de resolução, não por CSS. Pendência
           * real: pedir um arquivo de logo maior (ideal: vetor/SVG). */}
          <Image src="/logo.png" alt="" width={34} height={32} className="h-8 w-[34px]" priority={false} />
          <span className="font-heading text-sm tracking-wide">{siteConfig.name}</span>
        </div>

        <p className="mt-3 text-xs text-white/60">
          {siteConfig.tagline} · CNPJ {siteConfig.cnpj}
        </p>

        <nav
          className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/70"
          aria-label="Navegação do rodapé"
        >
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-white hover:underline">
              {item.label}
            </a>
          ))}
        </nav>

        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/60">
          <span>{endereco}</span>
          <span className="text-white/30">·</span>
          <a
            href={whatsappUrl('Olá! Vim pelo site e quero saber mais sobre os planos.')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white hover:underline"
          >
            <WhatsappGlyph className="h-3 w-3" />
            Falar no WhatsApp
          </a>
          <span className="text-white/30">·</span>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-white hover:underline"
          >
            <InstagramGlyph className="h-3 w-3" />
            Instagram
          </a>
          {siteConfig.facebookUrl ? (
            <>
              <span className="text-white/30">·</span>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-white hover:underline"
              >
                <FacebookGlyph className="h-3 w-3" />
                Facebook
              </a>
            </>
          ) : null}
        </p>
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
