import { z } from 'zod';

/**
 * Única fonte de leitura direta de `process.env` do projeto (RULES.md).
 * Nenhuma variável sem prefixo NEXT_PUBLIC_ pode ser referenciada por um
 * Client Component — as que existem aqui hoje (NEXTFIT_API_KEY,
 * PAYMENT_GATEWAY_CLIENT_SECRET) só existem pra validar formato cedo;
 * seu uso real fica isolado em lib/payments/ e numa futura integração
 * Next Fit, nunca em componente de UI.
 */
const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().min(1),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string(),
  NEXT_PUBLIC_INSTAGRAM_URL: z.string(),
  NEXTFIT_API_KEY: z.string().optional(),
  PAYMENT_GATEWAY_CLIENT_SECRET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '',
    NEXT_PUBLIC_INSTAGRAM_URL: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '',
    NEXTFIT_API_KEY: process.env.NEXTFIT_API_KEY,
    PAYMENT_GATEWAY_CLIENT_SECRET: process.env.PAYMENT_GATEWAY_CLIENT_SECRET,
  });

  if (!parsed.success) {
    throw new Error(`Variáveis de ambiente inválidas: ${parsed.error.message}`);
  }

  return parsed.data;
}

export const env = loadEnv();
