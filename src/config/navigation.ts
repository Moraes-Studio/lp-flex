export interface NavItem {
  label: string;
  href: string;
}

/**
 * Âncoras da home. Ordem segue o layout de referência do cliente (Planos →
 * Modalidades → Horários → Professores → Sobre → Contato) — desvio
 * deliberado do `SDD.md §4` (que pedia Professores antes de Planos),
 * decidido explicitamente pelo cliente depois de ver as duas versões.
 */
export const navigation: NavItem[] = [
  { label: 'Planos', href: '#planos' },
  { label: 'Modalidades', href: '#modalidades' },
  { label: 'Horários', href: '#horarios' },
  { label: 'Professores', href: '#professores' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
];
