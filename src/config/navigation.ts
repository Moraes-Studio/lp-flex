export interface NavItem {
  label: string;
  href: string;
}

/** Âncoras da home, na ordem fixada no SDD.md §4. */
export const navigation: NavItem[] = [
  { label: 'Professores', href: '#professores' },
  { label: 'Comunidade', href: '#comunidade' },
  { label: 'Planos', href: '#planos' },
  { label: 'Modalidades', href: '#modalidades' },
  { label: 'Horários', href: '#horarios' },
  { label: 'Sobre', href: '#sobre' },
];
