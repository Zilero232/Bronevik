import { describe, expect, it } from 'vitest';

import { challengeKey, levelKey, purchaseKey, seasonRewardKey } from '../ledger-keys';

const level = { accountId: 7n, tankId: 1, level: 3 };
const challenge = { accountId: 7n, tankId: 1, week: '2026-09-21', code: 'wins' };
const season = { userId: 'u', season: '2026-q3', level: 3 };
const purchase = { userId: 'u', code: 'badge-gold' };

describe('levelKey', () => {
  it('is stable for the same tank level', () => {
    expect(levelKey(level)).toBe(levelKey({ ...level }));
  });

  it('differs per account, tank and level', () => {
    const keys = new Set([
      levelKey(level),
      levelKey({ ...level, accountId: 8n }),
      levelKey({ ...level, tankId: 2 }),
      levelKey({ ...level, level: 4 })
    ]);

    expect(keys.size).toBe(4);
  });
});

describe('challengeKey', () => {
  it('differs per week and per challenge code', () => {
    const keys = new Set([
      challengeKey(challenge),
      challengeKey({ ...challenge, week: '2026-09-28' }),
      challengeKey({ ...challenge, code: 'frags' })
    ]);

    expect(keys.size).toBe(3);
  });
});

describe('seasonRewardKey', () => {
  it('differs per season, user and level', () => {
    const keys = new Set([
      seasonRewardKey(season),
      seasonRewardKey({ ...season, season: '2026-q4' }),
      seasonRewardKey({ ...season, userId: 'v' }),
      seasonRewardKey({ ...season, level: 4 })
    ]);

    expect(keys.size).toBe(4);
  });
});

describe('purchaseKey', () => {
  it('allows one purchase per user and cosmetic', () => {
    expect(purchaseKey(purchase)).toBe(purchaseKey({ ...purchase }));
    expect(purchaseKey(purchase)).not.toBe(purchaseKey({ ...purchase, userId: 'v' }));
  });
});

describe('ledger key namespaces', () => {
  it('never collide between reasons with the same numbers', () => {
    const keys = [levelKey(level), challengeKey(challenge), seasonRewardKey(season), purchaseKey(purchase)];

    expect(new Set(keys).size).toBe(keys.length);
    expect(new Set(keys.map((key) => key.split(':')[0])).size).toBe(keys.length);
  });
});
