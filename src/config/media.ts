/**
 * Slots de foto real que ainda não existem no repo (política de fotografia
 * do CLAUDE.md — documental real ou placeholder explícito, nunca gerado por
 * IA). Trocar de placeholder pra foto de verdade é *só* isto: colocar o
 * arquivo em `public/fotos/` e preencher o caminho aqui (ou o `fotoUrl` de
 * cada professor em `content/professores.json`). Nenhum componente precisa
 * mudar — `<Photo>` já resolve sozinho entre placeholder e imagem real.
 */
export const mediaConfig = {
  heroFoto: null as string | null,
  sobreFoto: null as string | null,
  /** Até 3 — o que sobrar do array continua placeholder. */
  comunidadeFotos: [] as string[],
};
