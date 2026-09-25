import type { PlayerProfile, RecentPeriodStats } from '@bronevik/schemas';

import { RECENT_PERIODS } from '@bronevik/ratings';
import { subHours, subMinutes } from 'date-fns';

import type { MockPlayer } from '@/shared/mocks';

import { seededRandom } from '@/shared/lib';
import { MOCK_CLANS } from '@/shared/mocks';

import { mockPlayerByLookup } from './mock-player';
import { isoDaysAgo, mockStatsBlock, round } from './mock.helpers';

const PERIOD_BATTLES = {
  '24h': [0, 28],
  '7d': [40, 150],
  '30d': [220, 520],
  '60d': [480, 900],
  '1000': [1000, 1000]
} as const;

const PERIOD_DAYS = { '24h': 1, '7d': 7, '30d': 30, '60d': 60, '1000': 75 } as const;

const recentOf = (player: MockPlayer): RecentPeriodStats[] => {
  const random = seededRandom(player.id + 17);

  return RECENT_PERIODS.map((period) => {
    const [min, max] = PERIOD_BATTLES[period];
    const battles = round(min + random() * (max - min));
    const form = 0.88 + random() * 0.3;

    return {
      period,
      from: isoDaysAgo(PERIOD_DAYS[period]),
      to: new Date().toISOString(),
      stats:
        battles < 3
          ? null
          : mockStatsBlock({
              battles,
              winRate: player.winRate + (form - 1) * 14,
              avgDamage: player.avgDamage * form,
              wn8: player.wn8 * form,
              broneIndex: Math.min(9_990, player.broneIndex * (0.96 + (form - 1) * 0.5)),
              random
            })
    };
  });
};

export const mockProfileOf = (player: MockPlayer): PlayerProfile => {
  const random = seededRandom(player.id);
  const clan = MOCK_CLANS.find(({ tag }) => tag === player.clanTag);
  const tanksOwned = round(120 + random() * 220);

  return {
    summary: {
      accountId: player.id,
      nickname: player.nickname,
      clan: clan
        ? { clanId: clan.id, tag: clan.tag, name: clan.name, role: 'private', emblem: null, joinedAt: isoDaysAgo(round(40 + random() * 900)) }
        : null,
      createdAt: isoDaysAgo(round(900 + random() * 3_600)),
      lastBattleAt: subHours(new Date(), round(1 + random() * 20)).toISOString(),
      updatedAt: subMinutes(new Date(), round(3 + random() * 40)).toISOString(),
      isTracked: true,
      overall: mockStatsBlock({
        battles: player.battles,
        winRate: player.winRate,
        avgDamage: player.avgDamage,
        wn8: player.wn8,
        broneIndex: player.broneIndex,
        random
      }),
      marks: {
        moe3: player.marks3,
        moe2: round(player.marks3 * 1.3 + random() * 20),
        moe1: round(player.marks3 * 1.6 + random() * 40),
        mastery: player.masters,
        tanksOwned: Math.max(tanksOwned, player.marks3 + 40)
      }
    },
    recent: recentOf(player)
  };
};

export const mockProfile = (idOrNick: string): PlayerProfile => mockProfileOf(mockPlayerByLookup(idOrNick));
