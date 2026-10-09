import Image from 'next/image';
import Link from 'next/link';
import { navigation } from '@/config/navigation';
import { siteConfig, whatsappUrl } from '@/config/site';
import { getFuncionamento } from '@/lib/content/funcionamento';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { StatusChip } from '@/components/layout/status-chip';
import { HeaderShell } from '@/components/layout/header-shell';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';

/**
 * Header único (a barra azul do topo com "desde 1992 · Vila Helena" saiu na
 * rodada de 2026-10-07: a mesma informação já abre o hero e repeti-la três
 * vezes era vício de template). O chip "aberto agora" veio do hero pra cá,
 * só a partir de `xl`, pra navegação continuar numa linha só em `lg`.
 *
 * Iteração imersiva: a casca (`HeaderShell`, client) fica transparente sobre
 * o hero em tela cheia e sólida no resto. Este conteúdo continua no servidor;
 * só as cores mudam, via `group-data-[modo=transparente]/header:*`. O chip
 * tem fundo claro próprio; o CTA é azul no modo sólido e contornado sobre a foto.
 */
export function Header() {
  const funcionamento = getFuncionamento();

  return (
    <HeaderShell>
      <Link href="/" aria-label={`${siteConfig.name}, página inicial`} className="shrink-0">
        {/* 102×96 = tamanho nativo do arquivo-fonte (public/logo.png) —
         * teto sem ficar borrado. Já aumentado uma vez (68×64) e o cliente
         * ainda achou pequeno; isto é o máximo que dá pra crescer sem pedir
         * um arquivo de logo maior/vetor (ver mesma pendência em footer.tsx). */}
        {/* `priority` foi deprecado no Next 16 em favor de `preload`. O logo
         * mantém `preload`, mas sem `fetchPriority="high"`: desde a rodada
         * 2026-10-07 a primeira foto do hero é o LCP, e o logo não compete
         * com ela por banda no mobile. */}
        <Image src="/logo.png" alt="" width={102} height={96} className="h-24 w-[102px]" preload />
      </Link>

      <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-foreground/75 hover:text-flex-blue-600 text-[13px] font-medium tracking-wide uppercase transition-colors duration-200 group-data-[modo=transparente]/header:text-white/90 group-data-[modo=transparente]/header:hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <StatusChip funcionamento={funcionamento} className="hidden xl:inline-flex" />
        {/* Mesmo botão nos dois modos; só as classes trocam. Sobre a foto
         * (modo transparente) o azul quase some contra a camada azul-escura
         * (1.1 a 1.9:1). Ele vira contornado (idioma `secondaryOnDark`), e não
         * branco cheio: o "Ver planos" do hero já é branco cheio, e dois
         * botões brancos lado a lado tinham o mesmo peso (feedback 2026-10-08).
         * Sem a seta: o ícone do WhatsApp já diz que abre outro app. */}
        <Button
          asChild
          size="sm"
          className="group group-data-[modo=transparente]/header:focus-visible:ring-offset-flex-blue-950 hidden border border-transparent transition-[transform,background-color,border-color,color,box-shadow] group-data-[modo=transparente]/header:border-white/45 group-data-[modo=transparente]/header:bg-white/12 group-data-[modo=transparente]/header:text-white group-data-[modo=transparente]/header:shadow-none group-data-[modo=transparente]/header:hover:border-white/70 group-data-[modo=transparente]/header:hover:bg-white/22 group-data-[modo=transparente]/header:focus-visible:ring-white md:inline-flex"
        >
          <a
            href={whatsappUrl('Olá! Quero treinar na Academia Flex.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappGlyph className="h-4 w-4" />
            Quero treinar agora
          </a>
        </Button>
        <MobileMenu />
      </div>
    </HeaderShell>
  );
}
