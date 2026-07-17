import { readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

export const modalidadeSchema = z.object({
  nome: z.string().min(1),
  icone: z.string().min(1),
});

export type Modalidade = z.infer<typeof modalidadeSchema>;

const modalidadesSchema = z
  .array(modalidadeSchema)
  .min(1)
  .superRefine((modalidades, ctx) => {
    const iconesVistos = new Map<string, number>();
    modalidades.forEach((m, i) => {
      const primeiraOcorrencia = iconesVistos.get(m.icone);
      if (primeiraOcorrencia !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Ícone "${m.icone}" reaproveitado entre "${modalidades[primeiraOcorrencia].nome}" e "${m.nome}" — cada modalidade precisa de ícone próprio (RULES.md).`,
          path: [i, 'icone'],
        });
      } else {
        iconesVistos.set(m.icone, i);
      }
    });
  });

export function parseModalidades(raw: unknown): Modalidade[] {
  return modalidadesSchema.parse(raw);
}

export function getModalidades(): Modalidade[] {
  const filePath = path.join(process.cwd(), 'content', 'modalidades.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  return parseModalidades(raw);
}
