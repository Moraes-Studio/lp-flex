import { z } from 'zod';

/** Tipos e funções puras — sem `node:fs`, importável por Client Component
 * (ex: `status-chip.tsx`). Ver nota equivalente em `horarios-shared.ts`. */

const horaSchema = z.string().regex(/^\d{2}:\d{2}$/, 'deve estar no formato HH:MM');

export const diaFuncionamentoSchema = z.object({
  dia: z.string().min(1),
  diaCurto: z.string().min(1),
  abre: horaSchema.nullable(),
  fecha: horaSchema.nullable(),
});

export type DiaFuncionamento = z.infer<typeof diaFuncionamentoSchema>;

/**
 * Exatamente 7 entradas, índice 0 = domingo .. 6 = sábado, pra bater com
 * `Date.prototype.getDay()` sem tradução em runtime.
 */
export const funcionamentoSchema = z.array(diaFuncionamentoSchema).length(7);

export function parseFuncionamento(raw: unknown): DiaFuncionamento[] {
  return funcionamentoSchema.parse(raw);
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
