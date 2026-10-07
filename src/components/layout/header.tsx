import Image from 'next/image';
import Link from 'next/link';
import { navigation } from '@/config/navigation';
import { siteConfig, whatsappUrl } from '@/config/site';
import { getFuncionamento } from '@/lib/content/funcionamento';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { StatusChip } from '@/components/layout/status-chip';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';
import { CtaArrow } from '@/components/shared/cta-arrow';

/**
 * Header único (a barra azul do topo com "desde 1992 · Vila Helena" saiu na
 * rodada de 2026-10-07: a mesma informação já abre o hero e repeti-la três
 * vezes era vício de template). O chip "aberto agora" veio do hero pra cá,
 * só a partir de `xl`, pra navegação continuar numa linha só em `lg`.
 */
export function Header() {
  const funcionamento = getFuncionamento();

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-background border-border flex items-center justify-between gap-4 border-b px-[6%] py-3">
        <Link href="/" aria-label={`${siteConfig.name}, página inicial`} className="shrink-0">
          {/* 102×96 = tamanho nativo do arquivo-fonte (public/logo.png) —
           * teto sem ficar borrado. Já aumentado uma vez (68×64) e o cliente
           * ainda achou pequeno; isto é o máximo que dá pra crescer sem pedir
           * um arquivo de logo maior/vetor (ver mesma pendência em footer.tsx). */}
          {/* `priority` foi deprecado no Next 16 em favor de `preload`, e nenhum
           * dos dois seta prioridade de fetch sozinho mais (confirmado em
           * node_modules/next/dist/docs/.../image.md) — sem `fetchPriority`
           * explícito essa imagem (LCP real da home, medido via Lighthouse
           * mobile local) baixava sem prioridade nenhuma, atrás das 14 fontes
           * e do CSS bloqueante: ~1,3s dos ~3,1s do LCP. */}
          <Image
            src="/logo.png"
            alt=""
            width={102}
            height={96}
            className="h-24 w-[102px]"
            preload
            fetchPriority="high"
          />
        </Link>

        <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-foreground/75 hover:text-flex-blue-600 text-[13px] font-medium tracking-wide uppercase transition-colors duration-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <StatusChip funcionamento={funcionamento} className="hidden xl:inline-flex" />
          <Button asChild size="sm" className="group hidden md:inline-flex">
            <a
              href={whatsappUrl('Olá! Quero treinar na Academia Flex.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappGlyph className="h-4 w-4" />
              Quero treinar agora
              <CtaArrow variant="up-right" />
            </a>
          </Button>
          <MobileMenu />
        </div>
      </header>
    </div>
  );
}
