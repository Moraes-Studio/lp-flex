import Image from 'next/image';
import Link from 'next/link';
import { navigation } from '@/config/navigation';
import { siteConfig, whatsappUrl } from '@/config/site';
import { Button } from '@/components/ui/button';
import { MobileMenu } from '@/components/layout/mobile-menu';

export function Header() {
  return (
    <header className="bg-background/85 border-border sticky top-0 z-50 flex items-center justify-between gap-4 border-b px-[6%] py-3 backdrop-blur-lg">
      <Link href="/" aria-label={`${siteConfig.name} — página inicial`} className="shrink-0">
        <Image src="/logo.png" alt="" width={56} height={53} priority />
      </Link>

      <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-foreground/70 hover:text-foreground text-[13px] font-medium tracking-wide uppercase transition-colors duration-200"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Button asChild size="sm" className="hidden md:inline-flex">
          <a
            href={whatsappUrl('Olá! Quero treinar na Academia Flex.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quero treinar agora
          </a>
        </Button>
        <MobileMenu />
      </div>
    </header>
  );
}
