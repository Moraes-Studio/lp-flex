/**
 * Tipos e funções puras da grade de horários — sem `node:fs` e, de
 * propósito, sem `zod` — importável por Client Component (ex:
 * `horarios-mobile.tsx`, `hero-board.tsx`). Toda leitura de arquivo fica
 * isolada em `horarios.ts` (server-only); o Turbopack recusa bundlar
 * `node:fs` num Client Component mesmo que o import use só um símbolo puro
 * do mesmo módulo — por isso a separação existe.
 *
 * `zod` fica só em `horarios-schema.ts`: um `z.object({...})` real aciona o
 * compilador JIT do Zod v4 (`$ZodObjectJIT`) assim que o módulo é avaliado
 * — não só quando `.parse()` roda — e esse JIT usa `Function(...)`
 * internamente, bloqueado pela CSP do site (`script-src` sem `unsafe-eval`
 * em produção, ver `next.config.ts`). Isso é invisível em dev (sem CSP) e
 * só aparece rodando Lighthouse/DevTools de verdade contra o build de
 * produção — achado real fazendo o gate de Lighthouse 95+ do SDD.md §10.
 */

export const DIAS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] as const;
export type Dia = (typeof DIAS)[number];

export type AulaSlot = {
  time: string;
  day: Dia;
  aula: string;
  profId: string | null;
};

/** Slot já validado, mas antes de resolver `profId` — formato que
 * `resolveHorarios` recebe. Estrutura idêntica ao `rawAulaSlotSchema` de
 * `horarios-schema.ts`, mas como tipo puro (sem depender de zod aqui). */
export type RawAulaSlot = {
  time: string;
  day: Dia;
  aula: string;
};

/** Índice 0 = domingo .. 6 = sábado, pra bater com `Date.prototype.getDay()`. */
export const DIA_JS_PARA_LABEL: Record<number, Dia> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
};

export const DIA_NOME_COMPLETO: Record<Dia, string> = {
  Seg: 'Segunda',
  Ter: 'Terça',
  Qua: 'Quarta',
  Qui: 'Quinta',
  Sex: 'Sexta',
  Sáb: 'Sábado',
  Dom: 'Domingo',
};

export function paraMinutos(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Resolve o professor de cada horário pela modalidade (papel), nunca hardcoded
 * manualmente no conteúdo (SDD.md §5). Falha se `aula` referenciar uma
 * modalidade que não existe no conjunto fechado de content/modalidades.json.
 */
export function resolveHorarios(
  rawSlots: RawAulaSlot[],
  modalidades: { nome: string }[],
  professores: { id: string; papel: string }[]
): AulaSlot[] {
  const modalidadesValidas = new Set(modalidades.map((m) => m.nome));
  const profPorModalidade = new Map<string, string>();
  professores.forEach((p) => {
    if (!profPorModalidade.has(p.papel)) profPorModalidade.set(p.papel, p.id);
  });

  return rawSlots.map((slot) => {
    if (!modalidadesValidas.has(slot.aula)) {
      throw new Error(
        `content/horarios.json: horário ${slot.day} ${slot.time} referencia a modalidade "${slot.aula}", que não existe em content/modalidades.json.`
      );
    }
    return { ...slot, profId: profPorModalidade.get(slot.aula) ?? null };
  });
}
