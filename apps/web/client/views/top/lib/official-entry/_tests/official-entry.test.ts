import { describe, expect, it } from 'vitest';

import { ROUTES } from '@/shared/constants';

import { officialEntryLink } from '../official-entry';

describe('officialEntryLink', () => {
  it('links a named player by nickname', () => {
    expect(officialEntryLink({ accountId: 7, nickname: 'Tanker' })).toEqual({ href: ROUTES.players.profile('Tanker'), label: 'Tanker' });
  });

  it('falls back to the account id when Lesta did not name the player', () => {
    expect(officialEntryLink({ accountId: 7, nickname: null })).toEqual({ href: ROUTES.players.profile('7'), label: '#7' });
  });
});
