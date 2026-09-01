import Image from 'next/image';
import Link from 'next/link';
import { navigation } from '@/config/navigation';
import { siteConfig, whatsappUrl } from '@/config/site';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';
import { CtaArrow } from '@/components/shared/cta-arrow';

export function Header() {
  const anos = new Date().getFullYear() - siteConfig.foundedYear;

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-flex-blue-700 hidden text-white md:block">
        <div className="mx-auto flex max-w-[1180px] items-center gap-5 px-[6%] py-1.5 font-mono text-[11px] tracking-[0.13em] uppercase">
          <span>Desde {siteConfig.foundedYear}</span>
          <span className="border-l border-white/25 pl-5">
            Vila Helena · {siteConfig.address.city} — {siteConfig.address.state}
          </span>
          <span className="ml-auto normal-case tracking-normal opacity-90">
            {anos}+ anos formando a vizinhança
          </span>
        </div>
      </div>

      <header className="bg-background border-border flex items-center justify-between gap-4 border-b px-[6%] py-3">
        <Link href="/" aria-label={`${siteConfig.name} — página inicial`} className="shrink-0">
          {/* 102×96 = tamanho nativo do arquivo-fonte (public/logo.png) —
           * teto sem ficar borrado. Já aumentado uma vez (68×64) e o cliente
           * ainda achou pequeno; isto é o máximo que dá pra crescer sem pedir
           * um arquivo de logo maior/vetor (ver mesma pendência em footer.tsx). */}
          <Image
            src="/logo.png"
            alt=""
            width={102}
            height={96}
            className="h-24 w-[102px]"
            priority
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
