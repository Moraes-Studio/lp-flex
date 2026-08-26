import 'server-only';
import { z } from 'zod';
import { loadEnv } from '@/config/load-env';

/**
 * Segredos de servidor (nunca prefixo NEXT_PUBLIC_). O import de
 * 'server-only' no topo faz o build falhar explicitamente se este módulo
 * for puxado, mesmo que indiretamente, por um Client Component — em vez de
 * descobrir isso tarde, num grep manual do bundle antes de conectar
 * credencial real (RULES.md regra absoluta 1, SDD.md §11 portão 3).
 *
 * Nenhum valor daqui é usado ainda: NEXTFIT_API_KEY e
 * PAYMENT_GATEWAY_CLIENT_SECRET são das etapas 6 do SDD.md §12 (integração
 * Next Fit / gateway de pagamento), que ainda não começaram — por isso
 * `serverEnv` não tem nenhum importador em `src/` hoje, o que é esperado
 * (a validação abaixo só passa a rodar de verdade quando esse import
 * existir). Esse módulo existe agora pra já ter a barreira pronta quando
 * esse dia chegar — não é pra ser importado por nada hoje.
 */
const serverEnvSchema = z.object({
  NEXTFIT_API_KEY: z.string().optional(),
  PAYMENT_GATEWAY_CLIENT_SECRET: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export const serverEnv = loadEnv(
  serverEnvSchema,
  {
    NEXTFIT_API_KEY: process.env.NEXTFIT_API_KEY,
    PAYMENT_GATEWAY_CLIENT_SECRET: process.env.PAYMENT_GATEWAY_CLIENT_SECRET,
  },
  'de servidor'
);
