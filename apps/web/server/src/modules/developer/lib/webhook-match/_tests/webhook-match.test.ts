import { describe, expect, it } from 'vitest';

import { matchesSubject, readWebhookFilter } from '../webhook-match';

describe('matchesSubject', () => {
  const filter = { accountIds: [1], clanIds: [10] };

  it('matches a followed player', () => {
    expect(matchesSubject({ filter, subject: { accountIds: [1], clanIds: [] } })).toBe(true);
  });

  it('matches any member of a followed clan', () => {
    expect(matchesSubject({ filter, subject: { accountIds: [2], clanIds: [10] } })).toBe(true);
  });

  it('ignores players and clans nobody follows', () => {
    expect(matchesSubject({ filter, subject: { accountIds: [2], clanIds: [20] } })).toBe(false);
  });

  it('matches nothing when the stored filter is unreadable', () => {
    expect(matchesSubject({ filter: 'broken', subject: { accountIds: [1], clanIds: [10] } })).toBe(false);
  });
});

describe('readWebhookFilter', () => {
  it('fills in the missing lists', () => {
    expect(readWebhookFilter({ clanIds: [10] })).toEqual({ accountIds: [], clanIds: [10] });
    expect(readWebhookFilter(null)).toEqual({ accountIds: [], clanIds: [] });
  });
});
