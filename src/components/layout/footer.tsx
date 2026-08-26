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
 * copyright embaixo. Bloco principal em 2 colunas (marca/dados/endereço à
 * esquerda, navegação à direita) — mas sem título grande tipo "NAVEGAÇÃO"
 * acima da lista de links: essa versão com bloco de título já foi tentada e
 * revertida nesta mesma sessão (ver histórico do arquivo) por destoar do
 * resto do rodapé, que é todo discreto/sem blocos com título.
 */
export function Footer() {
  const ano = new Date().getFullYear();
  const endereco = `${siteConfig.address.street}, ${siteConfig.address.city} — ${siteConfig.address.state}`;

  return (
    <footer className="bg-flex-blue-700 text-white">
      <div className="mx-auto max-w-[1180px] px-[6%] py-10">
        {/* Esquerda (marca/dados/endereço) × direita (navegação) — coluna de
         * navegação vira lista vertical em vez da linha horizontal com quebra,
         * mas sem rótulo "NAVEGAÇÃO" em destaque: o comentário acima já
         * documenta que um bloco com título grande foi tentado e revertido
         * nesta mesma sessão, e os 6 links (nomes de seção) já se explicam
         * sozinhos nessa posição. */}
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-12">
          <div>
            <div className="flex items-center gap-3">
              {/* Arquivo fonte (public/logo.png) só tem 102×96px — acima disso
               * fica borrado por falta de resolução, não por CSS. Pendência
               * real: pedir um arquivo de logo maior (ideal: vetor/SVG).
               * Aumentado junto com o do header (feedback do cliente: "ainda
               * está pequeno"), mantendo o header maior que o footer. */}
              <Image src="/logo.png" alt="" width={48} height={45} className="h-[45px] w-12" priority={false} />
              <span className="font-heading text-sm tracking-wide">{siteConfig.name}</span>
            </div>

            <p className="mt-3 text-xs text-white/60">
              {siteConfig.tagline} · CNPJ {siteConfig.cnpj}
            </p>

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

          <nav
            className="flex flex-col gap-2 text-xs text-white/70 sm:pt-1"
            aria-label="Navegação do rodapé"
          >
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white hover:underline">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/15">
        {/* 2 colunas de verdade (esquerda/direita), não 3 linhas empilhadas
         * no mobile — texto de copyright/política quebra dentro da própria
         * coluna (min-w-0 + flex-wrap) em vez de forçar "Desenvolvido por"
         * pra uma terceira linha e deixar um vão vazio antes do botão
         * flutuante do WhatsApp. */}
        <div className="mx-auto flex max-w-[1180px] items-start justify-between gap-x-6 gap-y-1 px-[6%] py-5 pb-24 text-xs text-white/60 sm:items-center sm:pb-5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              © {ano} {siteConfig.name}. Todos os direitos reservados.
            </span>
            <Link href="/privacidade" className="hover:text-white hover:underline">
              Política de privacidade
            </Link>
          </div>
          <span className="shrink-0">Desenvolvido por MoraesStudio</span>
        </div>
      </div>
    </footer>
  );
}
