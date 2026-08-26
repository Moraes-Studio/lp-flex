import { readFileSync } from 'node:fs';
import path from 'node:path';
import { getModalidades } from '@/lib/content/modalidades';
import { getProfessores } from '@/lib/content/professores';
import {
  DIAS,
  DIA_JS_PARA_LABEL,
  DIA_NOME_COMPLETO,
  paraMinutos,
  resolveHorarios,
  type AulaSlot,
  type Dia,
} from '@/lib/content/horarios-shared';
import { parseHorarios } from '@/lib/content/horarios-schema';

// Server-only (lê `content/horarios.json` via `node:fs`) — reexporta os
// símbolos puros de `horarios-shared.ts` (e o `parseHorarios`, que usa zod,
// de `horarios-schema.ts`) pra quem já importava daqui. Client Component
// precisa importar `horarios-shared` diretamente — nunca `horarios-schema`
// (ver comentário lá).
export { DIAS, DIA_JS_PARA_LABEL, DIA_NOME_COMPLETO, paraMinutos, parseHorarios, resolveHorarios };
export type { AulaSlot, Dia };

export function getHorarios(): AulaSlot[] {
  const filePath = path.join(process.cwd(), 'content', 'horarios.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  const rawSlots = parseHorarios(raw);
  return resolveHorarios(rawSlots, getModalidades(), getProfessores());
}
