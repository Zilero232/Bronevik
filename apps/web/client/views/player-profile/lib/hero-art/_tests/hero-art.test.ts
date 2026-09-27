import { describe, expect, it } from 'vitest';

import { heroArt } from '../hero-art';

const CLAN = { clanId: 1, tag: 'TAG', name: 'Clan', color: null, role: 'private', emblem: 'https://example.com/e.png', joinedAt: null };

describe('heroArt', () => {
  it('prefers the clan emblem', () => {
    expect(heroArt({ clan: CLAN, rows: [] })).toEqual({ kind: 'clan', emblem: CLAN.emblem });
  });

  it('is empty without clan and battles', () => {
    expect(heroArt({ clan: null, rows: [] })).toBeUndefined();
    expect(heroArt({ clan: { ...CLAN, emblem: null }, rows: [] })).toBeUndefined();
  });
});
