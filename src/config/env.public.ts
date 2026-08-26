/**
 * Só variáveis `NEXT_PUBLIC_*` — as únicas que podem legitimamente aparecer
 * no bundle do navegador. Seguro importar daqui em Client Component.
 * Contraparte: `env.server.ts`, que nunca deve ser importado fora de código
 * que só roda no servidor (ver comentário lá e RULES.md regra absoluta 1).
 *
 * Validação manual (sem zod) de propósito, mesmo que `env.server.ts` use
 * zod: este módulo é importado por `site.ts`, que por sua vez é importado
 * por Client Components (header, footer, mobile-menu...) — cada import
 * roda de novo dentro do bundle do navegador. Um `z.object({...})` real
 * aciona o compilador JIT do Zod v4 (`$ZodObjectJIT`), que usa
 * `Function(...)` internamente — bloqueado pela CSP (`script-src` sem
 * `'unsafe-eval'` em produção, de propósito, ver `next.config.ts`) e
 * reportado como falha em "Issues" no Chrome DevTools / audit
 * `inspector-issues` do Lighthouse (achado rodando Lighthouse de verdade
 * pro gate do SDD.md §10). O fallback do Zod sem JIT ainda funciona, mas é
 * peso de biblioteca e uma violação de CSP reais no navegador só pra
 * validar 3 strings — checagem manual resolve sem nenhuma das duas coisas.
 */
export interface PublicEnv {
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_WHATSAPP_NUMBER: string;
  NEXT_PUBLIC_INSTAGRAM_URL: string;
  NEXT_PUBLIC_META_DOMAIN_VERIFICATION?: string;
}

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Variável de ambiente pública inválida: ${name} está vazia/ausente.`);
  }
  return value;
}

export const publicEnv: PublicEnv = {
  NEXT_PUBLIC_SITE_URL: required('NEXT_PUBLIC_SITE_URL', process.env.NEXT_PUBLIC_SITE_URL),
  NEXT_PUBLIC_WHATSAPP_NUMBER: required(
    'NEXT_PUBLIC_WHATSAPP_NUMBER',
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  ),
  NEXT_PUBLIC_INSTAGRAM_URL: required(
    'NEXT_PUBLIC_INSTAGRAM_URL',
    process.env.NEXT_PUBLIC_INSTAGRAM_URL
  ),
  // Opcional de propósito — ver comentário no schema antigo/em layout.tsx:
  // só existe depois que o cliente cadastra o domínio no Meta Business
  // Manager.
  NEXT_PUBLIC_META_DOMAIN_VERIFICATION: process.env.NEXT_PUBLIC_META_DOMAIN_VERIFICATION,
};
