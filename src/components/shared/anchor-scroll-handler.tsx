'use client';

import { useEffect } from 'react';
import { scrollToHash } from '@/lib/smooth-scroll';

/**
 * Intercepta clique em qualquer link `href="#id"` da página (nav do header,
 * menu mobile, footer, CTA "Ver planos" no hero) e troca a rolagem nativa
 * pela rolagem com duração fixa de `lib/smooth-scroll.ts` — ver o comentário
 * lá pro motivo. Um único listener delegado em vez de repetir onClick em
 * cada componente que tem link de âncora.
 */
export function AnchorScrollHandler() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = (event.target as HTMLElement | null)?.closest('a[href^="#"]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      if (!document.getElementById(hash.slice(1))) return;

      event.preventDefault();
      scrollToHash(hash);
      history.pushState(null, '', hash);
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
