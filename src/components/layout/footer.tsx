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

/** Classe de foco compartilhada pelos links do rodapé — mesmo idioma visual
 * do hover (fica branco/sublinha), só que perceptível também no teclado
 * (antes só existia :hover, sem estado próprio pra foco). Usa só `white`,
 * já presente em todo o resto do rodapé — nenhum token novo. */
const linkFocus =
  'outline-none focus-visible:text-white focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60';

/**
 * Rodapé compacto — texto pequeno/discreto do mesmo peso visual da barra de
 * copyright embaixo. Duas colunas reais (marca/dados/endereço à esquerda —
 * principal; navegação à direita — secundária), sem título grande tipo
 * "NAVEGAÇÃO" acima da lista de links (já tentado e revertido antes, destoa
 * do resto do rodapé). O "FLEX" gigante é decoração de fundo, fora do fluxo
 * — não é uma 3ª coluna (ver comentário na `<span>` abaixo).
 */
export function Footer() {
  const ano = new Date().getFullYear();
  const endereco = `${siteConfig.address.street}, ${siteConfig.address.city} — ${siteConfig.address.state}`;

  return (
    // `isolate` (não só `relative`): cria stacking context próprio pro
    // footer — sem isso, o `-z-10` do watermark "escapa" pro stacking
    // context raiz da página (position:relative sozinho, sem z-index
    // explícito, não cria stacking context) e acaba pintando ATRÁS do
    // próprio fundo azul do footer, ficando 100% invisível.
    <footer className="bg-flex-blue-700 relative isolate text-white">
      {/* py-8 (era py-10) — lapidação final: densidade um pouco maior sem
       * apertar. overflow-hidden contém o watermark (nunca cruza a linha
       * divisória logo abaixo, nem cria scroll horizontal). */}
      <div className="relative mx-auto max-w-[1180px] overflow-hidden px-[6%] py-8">
        {/* Watermark — decoração de fundo pura, fora do fluxo do grid (não é
         * mais uma coluna reservada: tentativas anteriores reservavam um
         * `flex-1` vazio só pra caber o texto, o que fazia o layout de cima
         * ter 3 "colunas" e o watermark ditar a geometria — exatamente o que
         * o briefing desta rodada pede pra não fazer), opacidade bem baixa
         * (mesmo branco já usado em todo o resto do rodapé, sem cor nova),
         * atrás de tudo (`-z-10`). `hidden sm:block`: numa coluna estreita de
         * mobile um grafismo desse tamanho atrapalha mais do que ajuda, então
         * some (autorizado pelo briefing).
         * Reposicionado depois de achado real: `right-[-1%]` deixava ficava
         * direto atrás da navegação (Planos/Modalidades/.../Contato) — lia
         * como "texto atrás do menu", não textura de fundo. `left-[65%]`
         * (medido nos dois breakpoints pedidos, 1440 e 1920 — o vão entre o
         * fim do bloco de endereço e o início do menu não fica exatamente no
         * mesmo % nos dois, então o valor é o meio-termo com folga limpa nos
         * dois) + tamanho reduzido (170px→112px, sem precisar de um segundo
         * degrau responsivo — o vão não cresce com a viewport, então o
         * grafismo também não deveria) mantém as letras dentro do vão vazio,
         * sem cruzar nem o texto da esquerda nem o menu. Opacidade 7%→4.5%. */}
        <span
          aria-hidden="true"
          className="font-heading pointer-events-none absolute top-1/2 left-[65%] -z-10 hidden -translate-x-1/2 -translate-y-1/2 text-[112px] leading-none font-semibold tracking-tight text-white/[0.045] select-none sm:block"
        >
          FLEX
        </span>

        {/* Só 2 colunas de conteúdo real — esquerda (principal) × navegação
         * (secundária, à direita). justify-between, sem coluna do meio. */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
          <div>
            <div className="flex items-center gap-3">
              {/* Arquivo fonte (public/logo.png) só tem 102×96px — acima disso
               * fica borrado por falta de resolução, não por CSS. Pendência
               * real: pedir um arquivo de logo maior (ideal: vetor/SVG). */}
              <Image src="/logo.png" alt="" width={48} height={45} className="h-[45px] w-12" priority={false} />
              <span className="font-heading text-sm tracking-wide">{siteConfig.name}</span>
            </div>

            <p className="mt-2.5 text-xs text-white/60">
              {siteConfig.tagline} · CNPJ {siteConfig.cnpj}
            </p>

            <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/60">
              <span>{endereco}</span>
              <span className="text-white/30">·</span>
              <a
                href={whatsappUrl('Olá! Vim pelo site e quero saber mais sobre os planos.')}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 hover:text-white hover:underline ${linkFocus}`}
              >
                <WhatsappGlyph className="h-3 w-3" />
                Falar no WhatsApp
              </a>
              <span className="text-white/30">·</span>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 hover:text-white hover:underline ${linkFocus}`}
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
                    className={`inline-flex items-center gap-1 hover:text-white hover:underline ${linkFocus}`}
                  >
                    <FacebookGlyph className="h-3 w-3" />
                    Facebook
                  </a>
                </>
              ) : null}
            </p>
          </div>

          <nav
            className="flex flex-col gap-2 text-xs text-white/70 sm:shrink-0"
            aria-label="Navegação do rodapé"
          >
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`hover:text-white hover:underline ${linkFocus}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/15">
        {/* 2 colunas de verdade (esquerda/direita), mesma baseline no
         * desktop (items-center) — texto de copyright/política quebra
         * dentro da própria coluna (min-w-0 + flex-wrap) em vez de forçar
         * "Desenvolvido por" pra uma terceira linha. py-4 (era py-5) —
         * lapidação de densidade; pb-24 no mobile é funcional (não estético:
         * respiro pro botão flutuante do WhatsApp), preservado como está. */}
        <div className="mx-auto flex max-w-[1180px] items-start justify-between gap-x-6 gap-y-1 px-[6%] py-4 pb-24 text-xs text-white/60 sm:items-center sm:pb-4">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <span>
              © {ano} {siteConfig.name}. Todos os direitos reservados.
            </span>
            <Link href="/privacidade" className={`hover:text-white hover:underline ${linkFocus}`}>
              Política de privacidade
            </Link>
          </div>
          <span className="shrink-0">Desenvolvido por MoraesStudio</span>
        </div>
      </div>
    </footer>
  );
}
