import type { LeaderboardEntry } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { entrantLink } from '../entrant-link';

const PLAYER: LeaderboardEntry = {
  rank: 1,
  accountId: 1,
  clanId: null,
  name: 'Player',
  clanTag: 'TAG',
  color: null,
  value: 1,
  tier: null,
  battles: 1,
  delta: null
};

describe('entrantLink', () => {
  it('links a player row to the profile', () => {
    expect(entrantLink(PLAYER)).toEqual({ href: ROUTES.players.profile('Player'), label: 'Player' });
  });

  it('links a clan row to the clan by its tag', () => {
    expect(entrantLink({ ...PLAYER, accountId: null, name: 'Clan' }).href).toBe(ROUTES.clans.detail('TAG'));
  });
});
