import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { fotosDosAmbientes, mediaConfig, type Foto } from '@/config/media';

const todas: Foto[] = [
  ...mediaConfig.heroFotos,
  ...fotosDosAmbientes(),
  mediaConfig.faixaFoto,
  mediaConfig.fachada,
  mediaConfig.fachadaEntrada,
];

describe('mediaConfig', () => {
  it('tem 3 fotos no hero e cada ambiente da galeria tem de 2 a 4 fotos', () => {
    expect(mediaConfig.heroFotos).toHaveLength(3);
    expect(mediaConfig.ambientes.length).toBeGreaterThanOrEqual(4);
    for (const ambiente of mediaConfig.ambientes) {
      expect(ambiente.fotos.length, ambiente.nome).toBeGreaterThanOrEqual(2);
      expect(ambiente.fotos.length, ambiente.nome).toBeLessThanOrEqual(5);
      expect(ambiente.descricao).not.toMatch(/[—–]/);
    }
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
