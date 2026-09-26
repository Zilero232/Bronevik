import type { LeaderboardQuery } from '@otmetki/schemas';

import { leaderboardQuerySchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { LEADERBOARD_MIN_BATTLES, RISING_STARS } from '../../config';
import { LeaderboardService } from '../leaderboard.service';

const query = (overrides: Partial<LeaderboardQuery>): LeaderboardQuery => ({ ...leaderboardQuerySchema.parse({}), ...overrides });

const createService = (rows: unknown[] = []) => {
  const prisma = mockDeep<PrismaService>();

  prisma.$queryRaw.mockResolvedValue(rows);

  return new LeaderboardService(prisma);
};

describe('LeaderboardService.leaderboard', () => {
  it('reports the battles threshold it applied to players', async () => {
    const board = await createService().leaderboard(query({ scope: 'players', period: '7d' }));

    expect(board.minBattles).toBe(LEADERBOARD_MIN_BATTLES['7d']);
  });

  it('reports an explicit threshold as given', async () => {
    expect((await createService().leaderboard(query({ scope: 'players', minBattles: 3 }))).minBattles).toBe(3);
  });

  it('reports no threshold for scopes that have none', async () => {
    expect((await createService().leaderboard(query({ scope: 'clans' }))).minBattles).toBeNull();
    expect((await createService().leaderboard(query({ scope: 'marks' }))).minBattles).toBeNull();
  });

  it('uses the fallback period of rising stars for the overall period', async () => {
    const board = await createService().leaderboard(query({ scope: 'risingStars', period: 'overall' }));

    expect(board.minBattles).toBe(LEADERBOARD_MIN_BATTLES[RISING_STARS.fallbackPeriod]);
  });

  it('passes the clan colour through', async () => {
    const board = await createService([
      { accountId: null, clanId: 10n, name: 'Три отметки', clanTag: 'BRNVK', color: '#ff0000', value: 1_800, battles: 10, delta: null, total: 1n }
    ]).leaderboard(query({ scope: 'clans' }));

    expect(board.entries[0]?.color).toBe('#ff0000');
  });
});
