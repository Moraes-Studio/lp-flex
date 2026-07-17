import { describe, expect, it } from 'vitest';
import { getCampaign, parseCampaign } from '@/lib/content/campaign';

describe('parseCampaign', () => {
  it('aceita um objeto válido', () => {
    expect(parseCampaign({ active: false, season: 'outubroRosa' })).toEqual({
      active: false,
      season: 'outubroRosa',
    });
  });

  it('rejeita active com tipo errado (JSON malformado)', () => {
    expect(() => parseCampaign({ active: 'false', season: 'outubroRosa' })).toThrow();
  });

  it('rejeita season vazio', () => {
    expect(() => parseCampaign({ active: false, season: '' })).toThrow();
  });
});

describe('getCampaign (arquivo real)', () => {
  it('content/campaign.json é válido', () => {
    expect(() => getCampaign()).not.toThrow();
  });
});
