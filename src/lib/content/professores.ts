import { readFileSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

export const professorSchema = z.object({
  id: z.string().min(1),
  num: z.string().regex(/^\d{2}$/, 'num deve ter dois dígitos, ex: "01"'),
  nome: z.string().min(1),
  papel: z.string().min(1),
  desde: z.string().min(1),
  bio: z.string().min(1),
  /** Formação/titulação — opcional, do layout de referência do cliente. */
  formacao: z.string().min(1).optional(),
  fotoUrl: z.string().min(1).nullable(),
});

export type Professor = z.infer<typeof professorSchema>;

const professoresSchema = z.array(professorSchema).min(1);

export function parseProfessores(raw: unknown): Professor[] {
  return professoresSchema.parse(raw);
}

export function getProfessores(): Professor[] {
  const filePath = path.join(process.cwd(), 'content', 'professores.json');
  const raw: unknown = JSON.parse(readFileSync(filePath, 'utf-8'));
  return parseProfessores(raw);
}

/** Nome genérico "Professor 0X" = vaga com modalidade confirmada na grade,
 * mas perfil ainda não coletado com o profissional (heurística de exibição,
 * não é campo do schema — ver nota em `professores.tsx`). Compartilhado
 * entre a seção Professores e o stat do Hero pra nunca mostrar dois números
 * diferentes de "quantos professores" no mesmo site. */
const PLACEHOLDER_NOME = /^Professor \d+$/;

export function isProfessorConfirmado(professor: Pick<Professor, 'nome'>): boolean {
  return !PLACEHOLDER_NOME.test(professor.nome);
}

export function contarConfirmados(professores: Professor[]): number {
  return professores.filter(isProfessorConfirmado).length;
}

/** Bio genérica usada quando já se sabe o nome real do professor (confirmado
 * na grade/WhatsApp) mas o formulário de perfil ainda não voltou preenchido.
 * Compartilhada com `content/professores.json` — nunca duplicar essa string
 * em outro lugar, senão a checagem de "perfil completo" abaixo perde o par. */
export const BIO_PENDENTE = 'Professor de Educação Física — perfil completo em breve.';

/** Nome real ≠ perfil pronto pra virar card público: um professor recém-
 * confirmado (só o nome, bio ainda genérica) conta no stat de "professores
 * confirmados" (via `contarConfirmados`) mas não deve virar card na seção
 * Professores — card sem bio de verdade e sem foto (7 iguais lado a lado)
 * ficou feio o bastante pro cliente pedir pra esconder. Card só aparece
 * quando o formulário de fato voltou preenchido (bio deixou de ser a
 * genérica `BIO_PENDENTE`). */
export function temPerfilCompleto(professor: Pick<Professor, 'nome' | 'bio'>): boolean {
  return isProfessorConfirmado(professor) && professor.bio !== BIO_PENDENTE;
}
