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

/** Um ambiente de treino no mosaico de Modalidades (rodada 2026-10-24: o
 * cliente achou que o site mostrava pouco da estrutura). A primeira foto é
 * a vista ampla do ambiente; as outras, os equipamentos de perto.
 * `descricao` só cita o que aparece nas fotos. */
export interface Ambiente {
  nome: string;
  descricao: string;
  fotos: Foto[];
}

export const mediaConfig: {
  heroFotos: Foto[];
  ambientes: Ambiente[];
  faixaFoto: Foto;
  fachada: Foto;
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
  faixaFoto: {
    src: '/fotos/faixa-esteiras.jpg',
    alt: 'Fileira de esteiras da sala de cardio de frente para os janelões, com a cidade ao fundo',
  },
  ambientes: [
    {
      nome: 'Musculação',
      descricao: 'Aparelhos articulados e máquinas com carga de anilhas.',
      fotos: [
        {
          src: '/fotos/espaco-musculacao.jpg',
          alt: 'Vista ampla da área de musculação, com aparelhos, bancos e suportes de halteres sobre piso de madeira',
        },
        {
          src: '/fotos/espaco-articulado.jpg',
          alt: 'Aparelho articulado com anilhas ao lado dos janelões da sala de musculação',
        },
        {
          src: '/fotos/espaco-articulado-anilhas.jpg',
          alt: 'Aparelho articulado de carga livre com apoio de peito laranja',
        },
        {
          src: '/fotos/espaco-articulado-amarelo.jpg',
          alt: 'Área de musculação com aparelhos articulados de alavanca amarela e bancos reguláveis',
        },
        {
          src: '/fotos/espaco-articulado-verde.jpg',
          alt: 'Aparelho articulado de alavancas verdes com anilhas, ao lado de bancos reguláveis',
        },
      ],
    },
    {
      nome: 'Pesos livres',
      descricao: 'Halteres, barras, anilhas e racks.',
      fotos: [
        {
          src: '/fotos/espaco-halteres.jpg',
          alt: 'Suportes com halteres, barras e anilhas organizados junto à parede azul',
        },
        {
          src: '/fotos/espaco-racks.jpg',
          alt: 'Racks amarelos com barra montada diante do espelho',
        },
        {
          src: '/fotos/espaco-carga-livre.jpg',
          alt: 'Máquina com anilhas e outros aparelhos de carga livre sobre piso emborrachado',
        },
      ],
    },
    {
      nome: 'Sala de cardio',
      descricao: 'Esteiras, elípticos e bicicletas, de frente para os janelões.',
      fotos: [
        {
          src: '/fotos/espaco-cardio.jpg',
          alt: 'Sala de cardio com esteiras, elípticos e bicicletas, janelões à esquerda e parede azul ao fundo',
        },
        {
          src: '/fotos/espaco-elipticos.jpg',
          alt: 'Fileira de elípticos com prédios da cidade ao fundo',
        },
        {
          src: '/fotos/espaco-bikes.jpg',
          alt: 'Bicicletas ergométricas e bicicleta de spinning vermelha e preta',
        },
      ],
    },
    {
      nome: 'Salão de aulas',
      descricao: 'Piso de madeira, espelhos e o material das aulas coletivas.',
      fotos: [
        {
          src: '/fotos/espaco-salao.jpg',
          alt: 'Salão de aulas coletivas visto de ponta a ponta, com espelhos e piso de madeira',
        },
        {
          src: '/fotos/espaco-salao-material.jpg',
          alt: 'Fundo do salão de aulas com bolas, steps e outros materiais organizados',
        },
      ],
    },
  ],
  fachada: {
    src: '/fotos/espaco-fachada.jpg',
    alt: 'Fachada do prédio da Academia Flex na Rua das Hortênsias, Vila Helena',
  },
};

/** Todas as fotos da galeria, na ordem em que aparecem. */
export const fotosDosAmbientes = (): Foto[] => mediaConfig.ambientes.flatMap((a) => a.fotos);
