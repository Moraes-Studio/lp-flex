'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'flex-cookie-consent';

type Escolha = 'accepted' | 'rejected';
type SnapshotSalvo = Escolha | 'no-choice' | 'loading';
/** Ciclo de vida próprio do componente, independente da escolha salva —
 * existe só pra controlar a animação de entrada/saída (ver `decidir`
 * abaixo). 'entrando'/'fechando' são os dois estados "escondidos" visuais
 * (mesmas classes), diferindo só em pra onde vão em seguida. */
type Estado = 'idle' | 'entrando' | 'aberto' | 'fechando';

function readSnapshot(): SnapshotSalvo {
  try {
    const valor = window.localStorage.getItem(STORAGE_KEY);
    return valor === 'accepted' || valor === 'rejected' ? valor : 'no-choice';
  } catch {
    // localStorage pode falhar (modo privado, storage bloqueado) — trata
    // como "sem escolha", o banner só volta a aparecer a cada visita.
    return 'no-choice';
  }
}

function getServerSnapshot(): SnapshotSalvo {
  return 'loading';
}

function subscribe(callback: () => void) {
  // 'storage' só dispara em ABAS diferentes da que chamou setItem — cobre o
  // caso de já existir uma escolha salva quando este componente monta numa
  // aba nova; não é usado pra reagir a mudança depois de já aberto (ver
  // `decidir`, que fecha localmente sem depender disso).
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function salvarEscolha(escolha: Escolha) {
  try {
    window.localStorage.setItem(STORAGE_KEY, escolha);
  } catch {
    // ver comentário em readSnapshot — decisão só não persiste entre
    // visitas nesse caso, não é motivo pra travar a interação.
  }
}

const classesEscondido = 'opacity-0 translate-y-2';
const classesVisivel = 'opacity-100 translate-y-0';

/**
 * Card de consentimento de cookies — 100% overlay (`position: fixed`),
 * nunca reserva espaço na página (ver globals.css: nada de padding/margin
 * no body por causa dele — achado real de uma versão anterior, corrigido).
 *
 * Canto inferior direito no desktop, quase full-width no mobile. Fundo
 * grafite do design system com uma diferença sutil de superfície (não é
 * glassmorphism), borda de baixo contraste, sombra própria de overlay
 * (`shadow-overlay`, diferente da sombra de card), e uma barra azul fina no
 * topo como assinatura — mesma linguagem de "faixa de cor" já usada em
 * HeroBoard/Horários/Contato, não um ícone novo.
 *
 * Não é modal: sem overlay de fundo, sem foco preso — a página continua
 * 100% usável com o banner aberto. Some só quando o visitante decide
 * (aceitar ou recusar), nunca via "X" ambíguo — as duas ações reais têm o
 * mesmo peso visual (nenhuma escondida atrás da outra).
 */
export function CookieConsent() {
  const escolhaSalva = React.useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
  const [estado, setEstado] = React.useState<Estado>('idle');
  const jaDecidiuAbrir = React.useRef(false);

  React.useEffect(() => {
    if (jaDecidiuAbrir.current || escolhaSalva === 'loading') return;
    jaDecidiuAbrir.current = true;
    if (escolhaSalva !== 'no-choice') return;

    // Sincronizando de um sistema externo (localStorage via
    // useSyncExternalStore), não de um valor derivado de props/state — é o
    // caso que a própria doc do React cita como legítimo pra setState em
    // effect, mesmo com o lint genérico marcando.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado('entrando');
    // Dois rAF (não um): garante que o navegador realmente pintou o frame
    // "escondido" antes de aplicar o "aberto" — com um só, alguns browsers
    // colapsam as duas mudanças no mesmo frame e a transição não roda.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setEstado('aberto'));
    });
  }, [escolhaSalva]);

  const decidir = (escolha: Escolha) => {
    // Persiste JÁ — a decisão nunca espera a animação de saída.
    salvarEscolha(escolha);

    const reduzido =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduzido) {
      setEstado('idle');
      return;
    }
    setEstado('fechando');
    window.setTimeout(() => setEstado('idle'), 260);
  };

  if (estado === 'idle') return null;

  return (
    <div
      id="cookie-consent"
      role="region"
      aria-label="Preferências de cookies"
      aria-live="polite"
      className={cn(
        'shadow-overlay fixed right-3 bottom-3 left-3 z-[70] overflow-hidden rounded-2xl border border-white/15 transition-[opacity,transform] duration-[250ms] ease-out sm:right-6 sm:bottom-6 sm:left-auto sm:w-[400px] sm:max-w-[calc(100vw-3rem)]',
        estado === 'aberto' ? classesVisivel : classesEscondido
      )}
      style={{ background: 'linear-gradient(165deg, var(--flex-graphite-surface), var(--flex-graphite) 65%)' }}
    >
      {/* Barra azul fina no topo — assinatura mínima da Flex (mesma
       * linguagem de faixa de cor de HeroBoard/Horários/Contato), não um
       * ícone ou logo novo. */}
      <div className="bg-flex-blue-600 h-1 w-full" aria-hidden="true" />

      <div className="p-5 sm:p-6">
        <h2 className="font-heading text-[19px] leading-tight font-semibold text-white normal-case">
          Sua privacidade, sua escolha.
        </h2>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/75">
          Usamos cookies essenciais para o site funcionar, além de recursos do Google (mapa) que
          podem registrar dados de navegação.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button
            size="sm"
            className="focus-visible:ring-offset-flex-graphite"
            onClick={() => decidir('accepted')}
          >
            Aceitar todos
          </Button>
          <Button
            size="sm"
            variant="secondaryOnDark"
            className="focus-visible:ring-offset-flex-graphite"
            onClick={() => decidir('rejected')}
          >
            Recusar opcionais
          </Button>
        </div>

        <Link
          href="/privacidade#cookies"
          className="mt-3 inline-block rounded-sm text-[12.5px] font-medium text-white/60 underline decoration-white/25 underline-offset-2 transition-colors hover:text-white hover:decoration-white/50 focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
        >
          Personalizar preferências
        </Link>
      </div>
    </div>
  );
}
