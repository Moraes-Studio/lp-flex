import { readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

export const campaignSchema = z
  .object({
    active: z.boolean(),
    season: z.string().min(1),
    /** Texto da faixa promocional — só obrigatório quando `active:true`
     * (checado no `superRefine` abaixo). Renderizado só no elemento de
     * campanha isolado (RULES.md #3), nunca na cor institucional. */
    tag: z.string().min(1).optional(),
    titulo: z.string().min(1).optional(),
    sub: z.string().min(1).optional(),
    /** ISO date — a faixa some sozinha depois dessa data, sem precisar
     * lembrar de desligar `active` manualmente. */
    terminaEm: z.string().min(1).optional(),
  })
  .superRefine((campaign, ctx) => {
    if (!campaign.active) return;
    (['tag', 'titulo', 'sub'] as const).forEach((campo) => {
      if (!campaign[campo]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `"${campo}" é obrigatório quando active:true.`,
          path: [campo],
        });
      }
    });
  });

export type Campaign = z.infer<typeof campaignSchema>;

export function parseCampaign(raw: unknown): Campaign {
  return campaignSchema.parse(raw);
}

export function getCampaign(): Campaign {
  const filePath = path.join(process.cwd(), 'content', 'campaign.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  return parseCampaign(raw);
}

/**
 * A faixa só aparece se `active:true` E a data de término (se houver) ainda
 * não passou — assim ninguém precisa lembrar de desligar `active` na mão
 * quando a campanha acabar.
 */
export function campanhaVisivel(campaign: Campaign, now: Date): boolean {
  if (!campaign.active) return false;
  if (!campaign.terminaEm) return true;
  const fimDoDia = new Date(`${campaign.terminaEm}T23:59:59`);
  return now <= fimDoDia;
}
