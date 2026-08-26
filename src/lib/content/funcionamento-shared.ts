/**
 * Tipos e funções puras — sem `node:fs` e, de propósito, sem `zod` — pra
 * ser seguro importar de um Client Component (ex: `status-chip.tsx`).
 *
 * `zod` fica só em `funcionamento-schema.ts`: um `z.object({...})` real
 * aciona o compilador JIT do Zod v4 (`$ZodObjectJIT`) assim que o módulo é
 * avaliado — não só quando `.parse()` roda — e esse JIT usa `Function(...)`
 * internamente, bloqueado pela CSP do site (`script-src` sem `unsafe-eval`
 * em produção, ver `next.config.ts`). Isso é invisível em dev (sem CSP) e
 * só aparece rodando Lighthouse/DevTools de verdade contra o build de
 * produção — achado real fazendo o gate de Lighthouse 95+ do SDD.md §10.
 * Ver nota equivalente em `horarios-shared.ts`.
 */

export interface DiaFuncionamento {
  dia: string;
  diaCurto: string;
  abre: string | null;
  fecha: string | null;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export interface StatusFuncionamento {
  aberto: boolean;
  texto: string;
}

/**
 * Deriva o status "aberto agora / fecha às / abre às" a partir da grade de
 * funcionamento e de um instante (`now`). `now` é sempre recebido como
 * parâmetro (nunca `new Date()` direto na função) pra manter isto testável
 * sem mockar relógio global.
 */
export function calcularStatus(funcionamento: DiaFuncionamento[], now: Date): StatusFuncionamento {
  const hoje = funcionamento[now.getDay()];
  if (!hoje || !hoje.abre || !hoje.fecha) {
    return { aberto: false, texto: 'Fechado hoje' };
  }
  const minutosAgora = now.getHours() * 60 + now.getMinutes();
  const abre = toMinutes(hoje.abre);
  const fecha = toMinutes(hoje.fecha);
  if (minutosAgora >= abre && minutosAgora < fecha) {
    return { aberto: true, texto: `Aberto agora · fecha às ${hoje.fecha}` };
  }
  if (minutosAgora < abre) {
    return { aberto: false, texto: `Abre hoje às ${hoje.abre}` };
  }
  return { aberto: false, texto: 'Fechado · abre amanhã' };
}
