import { z } from 'zod';
import type { DiaFuncionamento } from '@/lib/content/funcionamento-shared';

/**
 * Validação (zod) de `content/funcionamento.json` — separada de
 * `funcionamento-shared.ts` de propósito, pra nunca ser importada por um
 * Client Component (ver comentário lá pro porquê). Só `funcionamento.ts`
 * (server-only, lê o arquivo via `node:fs`) importa este módulo.
 */
const horaSchema = z.string().regex(/^\d{2}:\d{2}$/, 'deve estar no formato HH:MM');

export const diaFuncionamentoSchema = z.object({
  dia: z.string().min(1),
  diaCurto: z.string().min(1),
  abre: horaSchema.nullable(),
  fecha: horaSchema.nullable(),
}) satisfies z.ZodType<DiaFuncionamento>;

/**
 * Exatamente 7 entradas, índice 0 = domingo .. 6 = sábado, pra bater com
 * `Date.prototype.getDay()` sem tradução em runtime.
 */
export const funcionamentoSchema = z.array(diaFuncionamentoSchema).length(7);

export function parseFuncionamento(raw: unknown): DiaFuncionamento[] {
  return funcionamentoSchema.parse(raw);
}
