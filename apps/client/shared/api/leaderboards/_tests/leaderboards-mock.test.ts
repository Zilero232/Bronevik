import { leaderboardSchema, leaderboardScopeSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { MOCK_LEADERBOARD } from '../leaderboards.constants';
import { mockLeaderboard } from '../leaderboards.mock';

const boards = leaderboardScopeSchema.options.map((scope) => mockLeaderboard({ scope, metric: 'winRate', period: '30d' }));

describe('mockLeaderboard', () => {
  it('answers every scope in the contract shape', () => {
    boards.forEach((board) => expect(() => leaderboardSchema.parse(board)).not.toThrow());
  });

  it('ranks entries from one without gaps', () => {
    boards.forEach(({ entries }) => expect(entries.map(({ rank }) => rank)).toEqual(entries.map((_, index) => index + 1)));
  });

  it('reports a battles threshold only for the scopes that apply one, and honours it', () => {
    boards.forEach(({ scope, minBattles, entries }) => {
      const hasThreshold = MOCK_LEADERBOARD.thresholdScopes.includes(scope);

      expect(minBattles !== null).toBe(hasThreshold);
      entries.forEach(({ battles }) => expect(battles).toBeGreaterThanOrEqual(minBattles ?? 0));
    });
  });

  it('colours clan rows and only clan rows', () => {
    boards.forEach(({ entries }) => entries.forEach(({ clanId, color }) => expect(color !== null).toBe(clanId !== null)));
  });
});
