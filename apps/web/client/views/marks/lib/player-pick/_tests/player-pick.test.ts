import type { PlayerSearchResult, SearchResult } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { isAccountId, pickPlayer } from '../player-pick';

const player = (accountId: number, nickname: string): PlayerSearchResult => ({
  kind: 'player',
  accountId,
  nickname,
  clanTag: null,
  matchedNickname: null,
  wn8: { value: null, tier: null },
  battles: null
});

const RESULTS: SearchResult[] = [player(1, 'Stalevar'), player(2, 'stalevar_1987')];

describe('isAccountId', () => {
  it('accepts a bare number and rejects a nickname', () => {
    expect(isAccountId('123456')).toBe(true);
    expect(isAccountId('Stalevar')).toBe(false);
  });
});

describe('pickPlayer', () => {
  it('prefers the exact nickname regardless of case', () => {
    expect(pickPlayer({ player: 'STALEVAR_1987', results: RESULTS })?.accountId).toBe(2);
  });

  it('falls back to the first player result', () => {
    expect(pickPlayer({ player: 'Stal', results: RESULTS })?.accountId).toBe(1);
  });

  it('returns null when the search found no players', () => {
    expect(pickPlayer({ player: 'nobody', results: [] })).toBeNull();
  });
});
