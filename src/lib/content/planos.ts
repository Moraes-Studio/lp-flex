import { readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

export const planoSchema = z
  .object({
    id: z.string().min(1),
    nome: z.string().min(1),
    /** Opcionais — o layout de referência do cliente mostra só nome/preço/parcelamento
     * pro plano, sem subtítulo nem checklist de benefícios. Continuam aceitos pra
     * planos que quiserem essa versão mais detalhada, sem forçar todo mundo a ter. */
    descricao: z.string().min(1).optional(),
    precoBase: z.number().positive().nullable(),
    periodo: z.string(),
    beneficios: z.array(z.string().min(1)).optional(),
    destaque: z.boolean(),
    badge: z.string().min(1).optional(),
    /** Selo permanente adicional (ex: "Clube+") — independente de campanha,
     * não some quando a campanha sazonal desligar. */
    badgeExtra: z.string().min(1).optional(),
    campanhaAtiva: z.boolean(),
    discountPct: z.number().min(0).max(1),
    obs: z.string().optional(),
    /** Selo e benefícios exclusivos da campanha sazonal (ex: "Na promoção",
     * "Sem taxa de matrícula") — só aparecem quando `campaign.active` E
     * `campanhaAtiva` do plano forem `true`; somem 100% quando a campanha
     * desligar (SDD.md §9, Regra Absoluta 3). Nunca confundir com
     * `discountPct`, que já cuida do preço — estes campos são conteúdo. */
    badgeCampanha: z.string().min(1).optional(),
    beneficiosCampanha: z.array(z.string().min(1)).optional(),
  })
  .superRefine((plano, ctx) => {
    if (plano.badge && !plano.destaque) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'badge só pode existir quando destaque é true (SDD.md §5).',
        path: ['badge'],
      });
    }
    if ((plano.badgeCampanha || plano.beneficiosCampanha) && !plano.campanhaAtiva) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'badgeCampanha/beneficiosCampanha só podem existir quando campanhaAtiva é true.',
        path: ['campanhaAtiva'],
      });
    }
  });

export type Plano = z.infer<typeof planoSchema>;

const planosSchema = z
  .array(planoSchema)
  .min(1)
  .superRefine((planos, ctx) => {
    const destacados = planos.filter((p) => p.destaque);
    if (destacados.length > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `No máximo 1 plano com destaque:true por vez (SDD.md §5) — encontrados ${destacados.length}.`,
      });
    }
  });

export function parsePlanos(raw: unknown): Plano[] {
  return planosSchema.parse(raw);
}

export function getPlanos(): Plano[] {
  const filePath = path.join(process.cwd(), 'content', 'planos.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  return parsePlanos(raw);
}

/**
 * Preço final = precoBase * (1 - discountPct), calculado em runtime (RULES.md #2).
 * Nunca copiar esse cálculo em outro componente — importar e recalcular aqui.
 */
export function calcularPrecoFinal(plano: Plano, campanhaAtiva: boolean): number | null {
  if (plano.precoBase === null) return null;
  const aplicaDesconto = campanhaAtiva && plano.campanhaAtiva && plano.discountPct > 0;
  if (!aplicaDesconto) return plano.precoBase;
  return Number((plano.precoBase * (1 - plano.discountPct)).toFixed(2));
}
