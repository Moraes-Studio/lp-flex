import { readFileSync } from 'node:fs';
import path from 'node:path';
import { calcularStatus, type DiaFuncionamento, type StatusFuncionamento } from '@/lib/content/funcionamento-shared';
import { parseFuncionamento } from '@/lib/content/funcionamento-schema';

// Server-only (lê `content/funcionamento.json` via `node:fs`) — reexporta os
// símbolos puros de `funcionamento-shared.ts` (e o `parseFuncionamento`,
// que usa zod, de `funcionamento-schema.ts`) pra quem já importava daqui.
// Client Component precisa importar `funcionamento-shared` diretamente —
// nunca `funcionamento-schema` (ver comentário lá).
export { calcularStatus, parseFuncionamento };
export type { DiaFuncionamento, StatusFuncionamento };

export function getFuncionamento(): DiaFuncionamento[] {
  const filePath = path.join(process.cwd(), 'content', 'funcionamento.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  return parseFuncionamento(raw);
}
