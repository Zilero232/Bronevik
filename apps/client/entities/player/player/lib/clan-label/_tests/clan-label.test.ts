import { describe, expect, it } from 'vitest';

import { clanLabel } from '../clan-label';

describe('clanLabel', () => {
  it('wraps the tag in brackets', () => {
    expect(clanLabel({ tag: 'KOPM' })).toBe('[KOPM]');
  });

  it('adds the clan name after the tag when known', () => {
    expect(clanLabel({ tag: 'KOPM', name: 'Корм' })).toBe('[KOPM] Корм');
    expect(clanLabel({ tag: 'KOPM', name: null })).toBe('[KOPM]');
  });
});
