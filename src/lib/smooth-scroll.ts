'use client';

/**
 * Rolagem suave até uma seção da home, com duração fixa (não escala com a
 * distância como o `scroll-behavior: smooth` nativo do CSS). A home tem
 * ~7800px de altura no mobile — com scroll-behavior nativo, navegar do menu
 * até "Contato" levava 1,5s+ de rolagem, período em que a tela fica
 * majoritariamente em branco (nada do conteúdo ainda visível) e lê como se
 * o site tivesse travado. UI/UX Pro Max (`ux` › Animation › Duration Timing):
 * animações de interface devem ficar entre 150–300ms, nunca acima de ~500ms.
 *
 * Sempre soma a altura do header sticky, senão o título da seção fica atrás
 * dele. Pula direto pro destino (sem animação) se `prefers-reduced-motion`
 * estiver ativo.
 */

const SCROLL_OFFSET_PX = 16;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getHeaderHeight(): number {
  const header = document.querySelector('header');
  return header ? header.getBoundingClientRect().height : 0;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * O menu mobile (Radix Dialog) trava o scroll do `<body>` (`overflow:
 * hidden`) enquanto está aberto/fechando. Se a rolagem começar antes da
 * trava sair, `window.scrollTo` roda sem efeito visual até o release e o
 * usuário vê um "salto" seco em vez de suave. Espera a trava sair (com teto
 * de segurança) em vez de chutar um número fixo de ms pra sincronizar com a
 * animação de fechamento do Dialog.
 */
function waitForScrollUnlock(maxWaitMs = 500): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now();
    function check() {
      const locked = getComputedStyle(document.body).overflow === 'hidden';
      if (!locked || performance.now() - start > maxWaitMs) {
        resolve();
        return;
      }
      requestAnimationFrame(check);
    }
    check();
  });
}

export async function scrollToHash(hash: string, { duration = 420 }: { duration?: number } = {}) {
  const id = hash.replace(/^#/, '');
  if (!document.getElementById(id)) return;

  await waitForScrollUnlock();

  // reconsulta depois da espera: o fechamento do menu pode ter mudado o
  // layout (ex: liberar o scroll lock recalcula a altura da página)
  const target = document.getElementById(id);
  if (!target) return;
  const targetY =
    target.getBoundingClientRect().top + window.scrollY - getHeaderHeight() - SCROLL_OFFSET_PX;

  if (prefersReducedMotion()) {
    window.scrollTo(0, Math.max(targetY, 0));
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now: number) {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
