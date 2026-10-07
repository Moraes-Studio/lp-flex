'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Modo = 'transparente' | 'solido';

/** Altura do header (logo 96 + `py-3` 24 + borda 1). O hero imersivo usa o
 * mesmo número na margem negativa (`-mt-[121px]`, ver hero.tsx); não é
 * exportado porque valor importado de módulo 'use client' num Server
 * Component vira referência de cliente, não o número. */
const HEADER_ALTURA_PX = 121;

/**
 * Casca do header: decide o modo visual, o conteúdo vem do servidor como
 * children (header.tsx).
 * - `transparente` enquanto o hero imersivo (`[data-hero-imersivo]`) está
 *   atrás do header; `solido` fora dele ou em página sem hero.
 * - Sem listener de scroll: IntersectionObserver com a faixa do header
 *   descontada do topo da viewport.
 * - SSR: nasce `transparente` só na home (onde o hero existe) e `solido` no
 *   resto, então nem `/` nem `/privacidade` piscam ao hidratar.
 * - Os filhos se ajustam pelo grupo `group/header` + `data-modo`
 *   (`group-data-[modo=transparente]/header:*`), sem estado próprio.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Guarda a rota junto do modo: numa navegação client-side de `/` pra outra
  // página, o valor observado na home não vale mais até o efeito rodar.
  const [observado, setObservado] = React.useState<{ rota: string; modo: Modo } | null>(null);

  React.useEffect(() => {
    const hero = document.querySelector('[data-hero-imersivo]');
    // Sem hero (ex: /privacidade) o padrão por rota já é `solido`.
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entrada]) =>
        setObservado({ rota: pathname, modo: entrada.isIntersecting ? 'transparente' : 'solido' }),
      { rootMargin: `-${HEADER_ALTURA_PX}px 0px 0px 0px` }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  const modo: Modo =
    observado?.rota === pathname
      ? observado.modo
      : pathname === '/'
        ? 'transparente'
        : 'solido';

  return (
    <div className="sticky top-0 z-50">
      <header
        data-modo={modo}
        className={cn(
          'group/header flex items-center justify-between gap-4 border-b px-[6%] py-3',
          'bg-background border-border',
          'data-[modo=transparente]:border-transparent data-[modo=transparente]:bg-transparent',
          'transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none'
        )}
      >
        {children}
      </header>
    </div>
  );
}
