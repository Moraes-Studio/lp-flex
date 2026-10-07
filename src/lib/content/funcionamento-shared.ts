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

import { minutosDoDiaEmSaoPaulo, numeroDoDiaEmSaoPaulo } from '@/lib/timezone';

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
 * sem mockar relógio global — e sempre interpretado no fuso oficial da Flex
 * (`America/Sao_Paulo`, via `@/lib/timezone`), nunca no fuso do processo que
 * roda o código (achado real: servidor de produção roda em UTC).
 */
export function calcularStatus(funcionamento: DiaFuncionamento[], now: Date): StatusFuncionamento {
  const hoje = funcionamento[numeroDoDiaEmSaoPaulo(now)];
  if (!hoje || !hoje.abre || !hoje.fecha) {
    return { aberto: false, texto: 'Fechado hoje' };
  }
  const minutosAgora = minutosDoDiaEmSaoPaulo(now);
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

export interface GrupoFuncionamento {
  rotulo: string;
  horario: string;
}

function formatarHorario(dia: DiaFuncionamento): string {
  return dia.abre && dia.fecha ? `${dia.abre}-${dia.fecha}` : 'Fechado';
}

/**
 * Agrupa dias consecutivos (Seg→Sáb) com o mesmo horário, pra tabela de
 * funcionamento ter 4 linhas em vez de 7 (revisão taste-skill, 2026-10-07).
 * Domingo fica sempre num grupo próprio no fim: ele carrega "e feriados"
 * no nome e é lido separado pelo público. Entrada na ordem de
 * `content/funcionamento.json` (índice 0 = domingo). Hífen como separador
 * de faixa, nunca travessão.
 */
export function agruparFuncionamento(funcionamento: DiaFuncionamento[]): GrupoFuncionamento[] {
  const semana = funcionamento.slice(1);
  const domingo = funcionamento[0];
  const grupos: { dias: DiaFuncionamento[]; horario: string }[] = [];

  for (const dia of semana) {
    const horario = formatarHorario(dia);
    const ultimo = grupos.at(-1);
    if (ultimo && ultimo.horario === horario) {
      ultimo.dias.push(dia);
    } else {
      grupos.push({ dias: [dia], horario });
    }
  }
  if (domingo) {
    grupos.push({ dias: [domingo], horario: formatarHorario(domingo) });
  }

  return grupos.map(({ dias, horario }) => ({
    rotulo:
      dias.length === 1 ? dias[0].dia : `${dias[0].diaCurto} a ${dias[dias.length - 1].diaCurto}`,
    horario,
  }));
}
