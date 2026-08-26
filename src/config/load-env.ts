import type { z } from 'zod';

/**
 * safeParse-ou-throw compartilhado por `env.public.ts` e `env.server.ts` —
 * as duas únicas variáveis são o schema e o rótulo da mensagem de erro.
 * Nenhum dos dois deve reimplementar essa lógica separadamente (isso já
 * aconteceu uma vez nesta sessão e as duas cópias já teriam divergido no
 * texto do erro).
 */
export function loadEnv<T>(schema: z.ZodType<T>, values: Record<string, unknown>, label: string): T {
  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    throw new Error(`Variáveis de ambiente ${label} inválidas: ${parsed.error.message}`);
  }

  return parsed.data;
}
