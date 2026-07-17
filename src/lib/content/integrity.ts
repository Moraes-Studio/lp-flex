import { getModalidades } from '@/lib/content/modalidades';
import { getProfessores } from '@/lib/content/professores';

/**
 * Falha o build se alguma modalidade não tiver nenhum professor correspondente
 * (Professor.papel) — cenário que já passou despercebido neste projeto até
 * revisão manual (SDD.md §5).
 */
export function validateModalidadeProfessorCoverage(
  modalidades: { nome: string }[] = getModalidades(),
  professores: { papel: string }[] = getProfessores()
): void {
  const papeisComProfessor = new Set(professores.map((p) => p.papel));
  const semProfessor = modalidades.filter((m) => !papeisComProfessor.has(m.nome));
  if (semProfessor.length > 0) {
    throw new Error(
      `content/modalidades.json: modalidade(s) sem nenhum professor correspondente: ${semProfessor
        .map((m) => m.nome)
        .join(', ')}.`
    );
  }
}
