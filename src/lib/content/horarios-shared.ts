import { z } from 'zod';

/**
 * Tipos e funções puras da grade de horários — sem `node:fs`, importável
 * por Client Component (ex: `horarios-mobile.tsx`, `hero-board.tsx`). Toda
 * leitura de arquivo fica isolada em `horarios.ts` (server-only); o
 * Turbopack recusa bundlar `node:fs` num Client Component mesmo que o import
 * use só um símbolo puro do mesmo módulo — por isso a separação existe.
 */

export const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const;
export type Dia = (typeof DIAS)[number];

export type AulaSlot = {
  time: string;
  day: Dia;
  aula: string;
  profId: string | null;
};

/** Índice 0 = domingo .. 6 = sábado, pra bater com `Date.prototype.getDay()`. */
export const DIA_JS_PARA_LABEL: Record<number, Dia> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
};

export const DIA_NOME_COMPLETO: Record<Dia, string> = {
  Seg: 'Segunda',
  Ter: 'Terça',
  Qua: 'Quarta',
  Qui: 'Quinta',
  Sex: 'Sexta',
  Sáb: 'Sábado',
  Dom: 'Domingo',
};

export function paraMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export const rawAulaSlotSchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/, 'time deve estar no formato HH:MM'),
  day: z.enum(DIAS),
  aula: z.string().min(1),
});

export const rawHorariosSchema = z.array(rawAulaSlotSchema).min(1);

/**
 * Resolve o professor de cada horário pela modalidade (papel), nunca hardcoded
 * manualmente no conteúdo (SDD.md §5). Falha se `aula` referenciar uma
 * modalidade que não existe no conjunto fechado de content/modalidades.json.
 */
export function resolveHorarios(
  rawSlots: z.infer<typeof rawAulaSlotSchema>[],
  modalidades: { nome: string }[],
  professores: { id: string; papel: string }[]
): AulaSlot[] {
  const modalidadesValidas = new Set(modalidades.map((m) => m.nome));
  const profPorModalidade = new Map<string, string>();
  professores.forEach((p) => {
    if (!profPorModalidade.has(p.papel)) profPorModalidade.set(p.papel, p.id);
  });

  return rawSlots.map((slot) => {
    if (!modalidadesValidas.has(slot.aula)) {
      throw new Error(
        `content/horarios.json: horário ${slot.day} ${slot.time} referencia a modalidade "${slot.aula}", que não existe em content/modalidades.json.`
      );
    }
    return { ...slot, profId: profPorModalidade.get(slot.aula) ?? null };
  });
}

export function parseHorarios(raw: unknown): z.infer<typeof rawAulaSlotSchema>[] {
  return rawHorariosSchema.parse(raw);
}
