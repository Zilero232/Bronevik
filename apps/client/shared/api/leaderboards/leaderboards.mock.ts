import type { RatingScale } from '@bronevik/ratings';
import type { Leaderboard, LeaderboardEntry, RatingKind } from '@bronevik/schemas';

import { ratingTier } from '@bronevik/ratings';
import { sortBy } from 'remeda';

import { seededRandom } from '@/shared/lib';
import { MOCK_CLANS, MOCK_PLAYERS } from '@/shared/mocks';

import type { LeaderboardFilter } from './leaderboards.types';

import { LEADERBOARD_REQUEST, MOCK_LEADER_NICKNAMES, MOCK_LEADERBOARD } from './leaderboards.constants';

const SCALE_OF: Partial<Record<RatingKind, RatingScale>> = { wn8: 'wn8', eff: 'eff', broneIndex: 'bronyaIndex', winRate: 'winRate' };

const RANGE: Record<RatingKind, [number, number]> = {
  wn8: [2_300, 4_600],
  eff: [1_500, 2_600],
  broneIndex: [8_200, 9_950],
  winRate: [56, 74],
  avgDamage: [2_400, 4_300]
};

const DIGITS: Record<RatingKind, number> = { wn8: 1, eff: 1, broneIndex: 1, winRate: 100, avgDamage: 1 };

const seedOf = ({ scope, metric, period, tier, type, tankId }: LeaderboardFilter) =>
  [scope, metric, period, tier, type, tankId]
    .join('|')
    .split('')
    .reduce((hash, char) => hash * 31 + (char.codePointAt(0) ?? 0), 7) % 1_000_003;

const playerPool = () => [
  ...MOCK_PLAYERS.map(({ id, nickname, clanTag }) => ({ id, nickname, clanTag })),
  ...MOCK_LEADER_NICKNAMES.map((nickname, index) => ({
    id: 30_000_000 + index * 3_331,
    nickname,
    clanTag: MOCK_CLANS[index % MOCK_CLANS.length].tag
  }))
];

const thresholdOf = (filter: LeaderboardFilter) =>
  MOCK_LEADERBOARD.thresholdScopes.includes(filter.scope) ? (filter.minBattles ?? MOCK_LEADERBOARD.minBattles[filter.period]) : null;

const entriesFor = (filter: LeaderboardFilter): LeaderboardEntry[] => {
  const random = seededRandom(seedOf(filter));
  const [min, max] = RANGE[filter.metric];
  const scale = SCALE_OF[filter.metric];

  if (filter.scope === 'clans') {
    return MOCK_CLANS.map((clan) => ({ clan, value: min + random() * (max - min) })).map(({ clan, value }, index) => ({
      rank: index + 1,
      accountId: null,
      clanId: clan.id,
      name: clan.name,
      clanTag: clan.tag,
      color: MOCK_LEADERBOARD.clanColors[index % MOCK_LEADERBOARD.clanColors.length],
      value: Math.round(value * DIGITS[filter.metric]) / DIGITS[filter.metric],
      tier: null,
      battles: Math.round(40_000 + random() * 900_000),
      delta: null
    }));
  }

  return playerPool().map(({ id, nickname, clanTag }) => {
    const raw = min + random() * (max - min);
    const value =
      filter.scope === 'marks' ? Math.round(20 + random() * random() * 320) : Math.round(raw * DIGITS[filter.metric]) / DIGITS[filter.metric];

    return {
      rank: 0,
      accountId: id,
      clanId: null,
      name: nickname,
      clanTag,
      color: null,
      value,
      tier: scale && filter.scope !== 'marks' ? ratingTier({ scale, value }) : null,
      battles: Math.round(filter.scope === 'marks' ? 20_000 + random() * 60_000 : (thresholdOf(filter) ?? 0) + 60 + random() * 1_800),
      delta: filter.scope === 'risingStars' ? Math.round(random() * 900 + 150) : null
    };
  });
};

export const mockLeaderboard = (filter: LeaderboardFilter): Leaderboard => {
  const key = filter.scope === 'risingStars' ? 'delta' : 'value';
  const ranked = sortBy(entriesFor(filter), [(entry) => entry[key] ?? 0, 'desc'])
    .slice(0, filter.limit ?? LEADERBOARD_REQUEST.limit)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  return {
    scope: filter.scope,
    metric: filter.metric,
    period: filter.period,
    total: ranked.length,
    minBattles: thresholdOf(filter),
    entries: ranked
  };
};
