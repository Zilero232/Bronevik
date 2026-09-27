import { describe, expect, it } from 'vitest';

import { replaySearchQuerySchema } from '../../../dto/replays.schemas';
import { publicReplayWhere, searchOrder, searchWhere } from '../replay-search';

const query = (raw: Record<string, string>) => replaySearchQuerySchema.parse(raw);

describe('searchWhere', () => {
  it('only ever lists public parsed replays', () => {
    expect(searchWhere({ query: query({}), playerAccountId: null })).toEqual(publicReplayWhere);
  });

  it('maps every filter onto its column', () => {
    const where = searchWhere({
      query: query({ tankId: '1', arenaId: '05_prohorovka', mode: 'ctf', minDamage: '3000', result: 'win' }),
      playerAccountId: null
    });

    expect(where).toMatchObject({ tankId: 1, arenaId: '05_prohorovka', gameplayMode: 'ctf', result: 'win', damageDealt: { gte: 3000 } });
  });

  it('prefers an explicit account id over a resolved nickname', () => {
    expect(searchWhere({ query: query({ accountId: '7' }), playerAccountId: 9n }).playerAccountIds).toEqual({ has: 7n });
    expect(searchWhere({ query: query({}), playerAccountId: 9n }).playerAccountIds).toEqual({ has: 9n });
  });

  it('treats a zero minimum damage as a filter, not as absent', () => {
    expect(searchWhere({ query: query({ minDamage: '0' }), playerAccountId: null }).damageDealt).toEqual({ gte: 0 });
  });
});

describe('searchOrder', () => {
  it('breaks ties on the play date for every sort', () => {
    for (const sort of ['damage', 'xp', 'views'] as const) {
      expect(searchOrder(sort).at(-1)).toEqual({ playedAt: 'desc' });
    }
  });
});
