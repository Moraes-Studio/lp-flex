import { z } from 'zod';
import { DIAS, type RawAulaSlot } from '@/lib/content/horarios-shared';

/**
 * Validação (zod) de `content/horarios.json` — separada de
 * `horarios-shared.ts` de propósito, pra nunca ser importada por um Client
 * Component (ver comentário lá pro porquê). Só `horarios.ts` (server-only,
 * lê o arquivo via `node:fs`) importa este módulo.
 */
export const rawAulaSlotSchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/, 'time deve estar no formato HH:MM'),
  day: z.enum(DIAS),
  aula: z.string().min(1),
}) satisfies z.ZodType<RawAulaSlot>;

export const rawHorariosSchema = z.array(rawAulaSlotSchema).min(1);

export function parseHorarios(raw: unknown): RawAulaSlot[] {
  return rawHorariosSchema.parse(raw);
}
