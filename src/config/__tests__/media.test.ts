import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { mediaConfig, type Foto } from '@/config/media';

const todas: Foto[] = [
  ...mediaConfig.heroFotos,
  mediaConfig.modalidades.musculacao,
  mediaConfig.modalidades.aulas,
  ...mediaConfig.sobreGaleria,
  mediaConfig.faixaFoto,
];

describe('mediaConfig', () => {
  it('tem 3 fotos no hero e de 6 a 8 na galeria do Sobre', () => {
    expect(mediaConfig.heroFotos).toHaveLength(3);
    expect(mediaConfig.sobreGaleria.length).toBeGreaterThanOrEqual(6);
    expect(mediaConfig.sobreGaleria.length).toBeLessThanOrEqual(8);
  });

  it.each(todas.map((f) => [f.src, f] as const))('%s existe em public/', (_src, foto) => {
    expect(foto.src.startsWith('/fotos/')).toBe(true);
    expect(existsSync(path.join(process.cwd(), 'public', foto.src))).toBe(true);
  });

  it('todo alt é descritivo e sem travessão', () => {
    for (const foto of todas) {
      expect(foto.alt.trim().length).toBeGreaterThan(10);
      expect(foto.alt).not.toMatch(/[—–]/);
      expect(foto.legenda ?? '').not.toMatch(/[—–]/);
    }
  });

  it('não repete a mesma foto em dois lugares', () => {
    const srcs = todas.map((f) => f.src);
    expect(new Set(srcs).size).toBe(srcs.length);
  });
});
