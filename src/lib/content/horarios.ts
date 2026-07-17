import { readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { getModalidades } from '@/lib/content/modalidades';
import { getProfessores } from '@/lib/content/professores';

export const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const;
export type Dia = (typeof DIAS)[number];

const rawAulaSlotSchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/, 'time deve estar no formato HH:MM'),
  day: z.enum(DIAS),
  aula: z.string().min(1),
});

export type AulaSlot = {
  time: string;
  day: Dia;
  aula: string;
  profId: string | null;
};

const rawHorariosSchema = z.array(rawAulaSlotSchema).min(1);

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

export function getHorarios(): AulaSlot[] {
  const filePath = path.join(process.cwd(), 'content', 'horarios.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  const rawSlots = parseHorarios(raw);
  return resolveHorarios(rawSlots, getModalidades(), getProfessores());
}
