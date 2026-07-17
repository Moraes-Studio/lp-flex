import { readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

export const professorSchema = z.object({
  id: z.string().min(1),
  num: z.string().regex(/^\d{2}$/, 'num deve ter dois dígitos, ex: "01"'),
  nome: z.string().min(1),
  papel: z.string().min(1),
  desde: z.string().min(1),
  bio: z.string().min(1),
  fotoUrl: z.string().min(1).nullable(),
});

export type Professor = z.infer<typeof professorSchema>;

const professoresSchema = z.array(professorSchema).min(1);

export function parseProfessores(raw: unknown): Professor[] {
  return professoresSchema.parse(raw);
}

export function getProfessores(): Professor[] {
  const filePath = path.join(process.cwd(), 'content', 'professores.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  return parseProfessores(raw);
}
