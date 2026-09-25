import { RECENT_PERIODS } from '@bronevik/ratings';
import {
  activitySchema,
  insightsPeriodSchema,
  nicknameHistorySchema,
  playerInsightsSchema,
  playerMarksSchema,
  playerProfileSchema,
  playerTanksPageSchema,
  playtimeSchema,
  popularPlayersSchema,
  sessionSchema,
  sessionsPageSchema,
  timeSeriesMetricSchema,
  timeSeriesSchema
} from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { NotFoundError } from '../../source';
import {
  mockActivity,
  mockHistory,
  mockInsights,
  mockMarks,
  mockNicknames,
  mockPlaytime,
  mockPopularPlayers,
  mockProfile,
  mockSession,
  mockSessions,
  mockTanks
} from '../mock';

const { accountId } = mockProfile('Stalevar_1987').summary;

describe('players mocks', () => {
  it('answer the profile, tanks and sessions endpoints in the contract shape', () => {
    expect(() => playerProfileSchema.parse(mockProfile('Stalevar_1987'))).not.toThrow();
    expect(() => playerTanksPageSchema.parse(mockTanks({ accountId }))).not.toThrow();
    expect(() => sessionsPageSchema.parse(mockSessions({ accountId, limit: 5, offset: 0 }))).not.toThrow();
  });

  it('answer every history metric in the contract shape', () => {
    timeSeriesMetricSchema.options.forEach((metric) => {
      expect(() => timeSeriesSchema.parse(mockHistory({ accountId, metric, granularity: 'week' }))).not.toThrow();
    });
  });

  it('answer activity, marks, playtime and nickname history in the contract shape', () => {
    expect(() => activitySchema.parse(mockActivity({ accountId, days: 90 }))).not.toThrow();
    expect(() => playerMarksSchema.parse(mockMarks(accountId))).not.toThrow();
    expect(() => playtimeSchema.parse(mockPlaytime(accountId))).not.toThrow();
    expect(() => nicknameHistorySchema.parse(mockNicknames(accountId))).not.toThrow();
  });

  it('answer insights for every period in the contract shape', () => {
    insightsPeriodSchema.options.forEach((period) => {
      expect(() => playerInsightsSchema.parse(mockInsights({ accountId, period }))).not.toThrow();
    });
  });

  it('open every session of the list in the contract shape', () => {
    mockSessions({ accountId, limit: 10, offset: 0 }).items.forEach(({ id }) => {
      expect(() => sessionSchema.parse(mockSession({ accountId, sessionId: id }))).not.toThrow();
    });
  });

  it('rank popular players by views within the requested limit', () => {
    const popular = popularPlayersSchema.parse(mockPopularPlayers({ days: 7, limit: 3 }));
    const views = popular.items.map((item) => item.views);

    expect(popular.items.length).toBeLessThanOrEqual(3);
    expect(views).toEqual([...views].sort((a, b) => b - a));
  });

  it('keep the insight delta equal to the gap between the player and the server', () => {
    const { byClass, weakTanks } = mockInsights({ accountId, period: '30d' });

    [...byClass, ...weakTanks].forEach(({ winRate, serverWinRate, winRateDelta }) => {
      expect(winRateDelta).toBeCloseTo((winRate ?? 0) - (serverWinRate ?? 0), 1);
    });
  });

  it('name where the combined damage of a mark row came from', () => {
    mockMarks(accountId).items.forEach(({ avgCombinedDamage, combinedDamageSource }) => {
      expect(combinedDamageSource === null).toBe(avgCombinedDamage === null);
    });
  });

  it('count every playtime battle in the total', () => {
    const { battles, cells } = mockPlaytime(accountId);

    expect(battles).toBe(cells.reduce((total, cell) => total + cell.battles, 0));
  });

  it('describe the same player the same way on every visit', () => {
    expect(mockProfile('Some_New_Tanker').summary.overall).toEqual(mockProfile('some_new_tanker').summary.overall);
  });

  it('carry every recent period the profile switch offers', () => {
    expect(mockProfile('Stalevar_1987').recent.map(({ period }) => period)).toEqual([...RECENT_PERIODS]);
  });

  it('report a missing player as not found', () => {
    expect(() => mockProfile('nobody')).toThrow(NotFoundError);
  });

  it('apply the tier filter to the tank list', () => {
    const { items } = mockTanks({ accountId, filter: { tiers: [8] } });

    expect(items.length).toBeGreaterThan(0);
    items.forEach(({ vehicle }) => expect(vehicle.tier).toBe(8));
  });

  it('open a session listed on the sessions page', () => {
    const [first] = mockSessions({ accountId, limit: 1, offset: 0 }).items;

    expect(mockSession({ accountId, sessionId: first.id }).id).toBe(first.id);
  });
});
