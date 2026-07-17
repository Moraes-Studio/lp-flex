import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('junta classes simples', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('resolve conflito do Tailwind mantendo a última classe', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('ignora valores falsy', () => {
    expect(cn('a', false, undefined, null, '', 'b')).toBe('a b');
  });
});
