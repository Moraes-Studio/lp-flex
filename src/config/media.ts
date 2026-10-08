/**
 * Fonte única das fotos reais da home (política de fotografia do CLAUDE.md:
 * fotografia documental real, nunca gerada por IA nem banco de imagem).
 * Os arquivos em `public/fotos/` saem de `scripts/otimizar-fotos.mjs` a
 * partir dos originais (fora do git). Trocar uma foto = rodar o script com
 * a lista nova e ajustar a entrada aqui; nenhum componente precisa mudar.
 *
 * Regra de composição (decisão do cliente, 2026-10-07): nada é sobreposto
 * às fotos. `legenda`, quando existe, é renderizada abaixo da imagem.
 */
export interface Foto {
  src: string;
  alt: string;
  legenda?: string;
}

export const mediaConfig: {
  heroFotos: Foto[];
  modalidades: { musculacao: Foto; aulas: Foto };
  sobreGaleria: Foto[];
  faixaFoto: Foto;
} = {
  heroFotos: [
    {
      src: '/fotos/hero-musculacao.jpg',
      alt: 'Área de musculação da Academia Flex, com aparelhos alinhados junto à parede azul',
    },
    {
      src: '/fotos/hero-cardio.jpg',
      alt: 'Sala de cardio com esteiras e bicicletas de frente para janelões com vista da cidade',
    },
    {
      src: '/fotos/hero-salao.jpg',
      alt: 'Salão de aulas coletivas com piso de madeira, espelhos e equipamentos organizados',
    },
  ],
  modalidades: {
    musculacao: {
      src: '/fotos/modalidades-musculacao.jpg',
      alt: 'Aparelhos de musculação sobre piso de madeira na Academia Flex',
    },
    aulas: {
      src: '/fotos/modalidades-aulas.jpg',
      alt: 'Salão amplo onde acontecem as aulas coletivas da Academia Flex',
    },
  },
  faixaFoto: {
    src: '/fotos/faixa-cardio.jpg',
    alt: 'Fileira de esteiras da sala de cardio de frente para os janelões, com a cidade ao fundo',
  },
  sobreGaleria: [
    {
      src: '/fotos/sobre-fachada.jpg',
      alt: 'Fachada do prédio da Academia Flex na Rua das Hortênsias, Vila Helena',
      legenda: 'Fachada',
    },
    {
      src: '/fotos/sobre-entrada.jpg',
      alt: 'Entrada da Academia Flex com o letreiro azul e a recepção ao fundo',
      legenda: 'Entrada e recepção',
    },
    {
      src: '/fotos/sobre-cardio.jpg',
      alt: 'Fileira de esteiras na sala de cardio com janelas de vidro',
      legenda: 'Sala de cardio',
    },
    {
      src: '/fotos/sobre-pesos.jpg',
      alt: 'Suportes de halteres e barras na área de pesos livres',
      legenda: 'Pesos livres',
    },
    {
      src: '/fotos/sobre-maquinas.jpg',
      alt: 'Aparelhos de musculação articulados na área de máquinas',
      legenda: 'Área de máquinas',
    },
    {
      src: '/fotos/sobre-salao.jpg',
      alt: 'Salão de aulas coletivas visto da entrada, com espelhos na parede',
      legenda: 'Salão de aulas',
    },
    {
      src: '/fotos/sobre-anilhas.jpg',
      alt: 'Anilhas e barras organizadas no suporte da área de musculação',
      legenda: 'Detalhe da musculação',
    },
  ],
};
