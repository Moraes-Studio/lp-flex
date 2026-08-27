import { whatsappUrl } from '@/config/site';
import { WhatsappGlyph } from '@/components/shared/whatsapp-glyph';

/**
 * Botão flutuante de WhatsApp, sempre visível ao rolar — presente no
 * protótipo de referência original, em todas as páginas.
 */
export function WhatsappFloat() {
  return (
    <a
      href={whatsappUrl('Olá! Vim pelo site e quero saber mais sobre os planos.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      // id="whatsapp-float": alvo do seletor `body:has(#cookie-consent)
      // #whatsapp-float` em globals.css — enquanto o banner de cookies
      // existir no DOM, essa regra CSS reposiciona/esconde o botão (nunca
      // sobrepõe o banner), sem nenhum JS neste componente pra saber do
      // banner. Transição (transform/bottom/opacity/visibility) também
      // vive só em globals.css — as 4 propriedades precisam de timing
      // coordenado (visibility com delay diferente ao entrar/sair), o que
      // as utilities de transition do Tailwind não expressam bem sozinhas.
      id="whatsapp-float"
      className="fixed right-4 bottom-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#22A45D] text-white shadow-[0_10px_26px_-8px_rgba(0,0,0,0.45)] hover:-translate-y-0.5"
    >
      <WhatsappGlyph className="h-7 w-7" />
    </a>
  );
}
