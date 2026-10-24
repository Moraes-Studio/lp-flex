// Exporta as fotos escolhidas (originais em public/0*_*/, fora do git) para
// public/fotos/, prontas para o next/image. Uso: node scripts/otimizar-fotos.mjs
// Para trocar uma foto: editar a lista abaixo, rodar de novo e atualizar
// src/config/media.ts se o slug mudar.
//
// Tratamento (rodada 2026-10-24): algumas fotos vieram escuras. `clarear`
// aplica uma curva de gama (sobe meios-tons e sombras sem estourar as
// janelas nem mexer no preto e no branco) e um toque de saturação. É ajuste
// de exposição, nada além disso: nenhum objeto é removido, trocado ou
// inventado (política de fotografia do CLAUDE.md). Os originais não mudam.
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ORIGEM = 'public';
const DESTINO = 'public/fotos';
const LADO_MAIOR = 2000;

/** [origem, slug, clarear?] — clarear = fator da curva (1 = sem ajuste). */
const FOTOS = [
  ['03_musculacao/IMG_2616.jpg', 'hero-musculacao'],
  ['02_cardio/IMG_2510.jpg', 'hero-cardio'],
  ['04_salao_aulas/IMG_2565.jpg', 'hero-salao'],
  ['02_cardio/IMG_2543.jpg', 'faixa-esteiras', 1.2],
  // Mosaico de Modalidades, por ambiente
  ['03_musculacao/IMG_2644.jpg', 'espaco-musculacao'],
  ['03_musculacao/IMG_2733.jpg', 'espaco-articulado'],
  ['03_musculacao/IMG_2686.jpg', 'espaco-articulado-amarelo', 1.1],
  ['03_musculacao/IMG_2593.jpg', 'espaco-articulado-anilhas', 1.22],
  ['03_musculacao/IMG_2845.jpg', 'espaco-articulado-verde'],
  ['03_musculacao/IMG_2675.jpg', 'espaco-halteres', 1.18],
  ['03_musculacao/IMG_2759.jpg', 'espaco-racks', 1.22],
  ['03_musculacao/IMG_2862.jpg', 'espaco-carga-livre'],
  ['02_cardio/IMG_2544.jpg', 'espaco-cardio', 1.12],
  ['02_cardio/IMG_2528.jpg', 'espaco-elipticos'],
  ['02_cardio/IMG_2550.jpg', 'espaco-bikes'],
  ['04_salao_aulas/IMG_2575.jpg', 'espaco-salao'],
  ['04_salao_aulas/IMG_2568.jpg', 'espaco-salao-material'],
  // Contato
  ['01_fachada/IMG_2895.jpg', 'espaco-fachada'],
];

await mkdir(DESTINO, { recursive: true });

for (const [origem, slug, clarear = 1] of FOTOS) {
  const entrada = path.join(ORIGEM, origem);
  const saida = path.join(DESTINO, `${slug}.jpg`);
  let imagem = sharp(entrada)
    .rotate()
    .resize(LADO_MAIOR, LADO_MAIOR, { fit: 'inside', withoutEnlargement: true });
  if (clarear !== 1) {
    imagem = imagem.gamma(2.2, 2.2 * clarear).modulate({ saturation: 1.04 });
  }
  await imagem.jpeg({ quality: 80, mozjpeg: true }).toFile(saida);
  const { size } = await stat(saida);
  console.log(`${saida}  ${(size / 1024).toFixed(0)} KB`);
}
