import { readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

/** Nota pública da Flex no Google (prova social local). Valor estático,
 * copiado do perfil no Google com a data da consulta: o número muda com o
 * tempo, então quem atualiza a nota atualiza a data junto. Atualização
 * automática exigiria a API do Google Places (chave paga do cliente). */
export const reputacaoSchema = z.object({
  google: z.object({
    nota: z.number().min(1).max(5),
    avaliacoes: z.number().int().positive(),
    consultadoEm: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'data no formato AAAA-MM-DD'),
    url: z
      .string()
      .url()
      .regex(/^https:\/\/(www\.)?google\.com\//, 'link do Google'),
  }),
});

export type Reputacao = z.infer<typeof reputacaoSchema>;

export function parseReputacao(raw: unknown): Reputacao {
  return reputacaoSchema.parse(raw);
}

export function getReputacao(): Reputacao {
  const filePath = path.join(process.cwd(), 'content', 'reputacao.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  return parseReputacao(raw);
}

export function formatarNota(nota: number): string {
  return nota.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
