// Exporta as fotos escolhidas (originais em public/0*_*/, fora do git) para
// public/fotos/, prontas para o next/image. Uso: node scripts/otimizar-fotos.mjs
// Para trocar uma foto: editar a lista abaixo, rodar de novo e atualizar
// src/config/media.ts se o slug mudar.
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ORIGEM = 'public';
const DESTINO = 'public/fotos';
const LADO_MAIOR = 2000;

const FOTOS = [
  ['03_musculacao/IMG_2616.jpg', 'hero-musculacao'],
  ['02_cardio/IMG_2510.jpg', 'hero-cardio'],
  ['04_salao_aulas/IMG_2565.jpg', 'hero-salao'],
  ['03_musculacao/IMG_2601.jpg', 'modalidades-musculacao'],
  ['04_salao_aulas/IMG_2556.jpg', 'modalidades-aulas'],
  ['01_fachada/IMG_2895.jpg', 'sobre-fachada'],
  ['01_fachada/IMG_2903.jpg', 'sobre-entrada'],
  ['02_cardio/IMG_2543.jpg', 'sobre-cardio'],
  ['03_musculacao/IMG_2675.jpg', 'sobre-pesos'],
  ['03_musculacao/IMG_2837.jpg', 'sobre-maquinas'],
  ['04_salao_aulas/IMG_2571.jpg', 'sobre-salao'],
  ['05_detalhes/IMG_2641.jpg', 'sobre-anilhas'],
];

await mkdir(DESTINO, { recursive: true });

for (const [origem, slug] of FOTOS) {
  const entrada = path.join(ORIGEM, origem);
  const saida = path.join(DESTINO, `${slug}.jpg`);
  await sharp(entrada)
    .rotate()
    .resize(LADO_MAIOR, LADO_MAIOR, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(saida);
  const { size } = await stat(saida);
  console.log(`${saida}  ${(size / 1024).toFixed(0)} KB`);
}
