import { sortBy } from 'remeda';

import type { MockPlayer, MockPlayerState, MockWorld } from '../../lesta-mock.types';
import type { RankField, Ranking, RankingInput } from './rankings.types';

import { MOCK_TIME } from '../../config';
import { accountTotals, globalRating } from '../profile';
import { playerStateAt } from '../simulation';
import { damageRatio, targetWinRate } from '../skill';
import { RANK_FIELDS, RANKINGS } from './rankings.constants';

const cache = new Map<string, Ranking>();

const RANK_FIELD_SET: ReadonlySet<string> = new Set(RANK_FIELDS);

export const isRankField = (value: string): value is RankField => RANK_FIELD_SET.has(value);

const ratio = (value: number, by: number, digits = 2): number => (by > 0 ? Number((value / by).toFixed(digits)) : 0);

export const exactValue = (field: RankField, state: MockPlayerState): number => {
  const { random } = accountTotals(state);

  switch (field) {
    case 'global_rating':
      return globalRating(state);
    case 'battles_count':
      return random.battles;
    case 'wins_ratio':
      return ratio(random.wins * 100, random.battles);
    case 'damage_avg':
      return ratio(random.damageDealt, random.battles);
    case 'damage_dealt':
      return random.damageDealt;
    case 'frags_avg':
      return ratio(random.frags, random.battles);
    case 'frags_count':
      return random.frags;
    case 'xp_avg':
      return ratio(random.xp, random.battles);
    case 'xp_amount':
      return random.xp;
    case 'xp_max':
      return random.maxXp;
    case 'spotted_avg':
      return ratio(random.spotted, random.battles);
    case 'spotted_count':
      return random.spotted;
    case 'survived_ratio':
      return ratio(random.survived * 100, random.battles);
    case 'hits_ratio':
      return ratio(random.hits * 100, random.shots);
    case 'capture_points':
      return random.capturePoints;
  }
};

const estimate = (field: RankField, player: MockPlayer, at: number): number => {
  const days = Math.max(0, (at - MOCK_TIME.anchor) / MOCK_TIME.daySec);
  const battles = player.careerBattles + days * player.dayChance * player.sessionBattles;
  const skill = damageRatio(player);

  switch (field) {
    case 'battles_count':
      return battles;
    case 'wins_ratio':
      return targetWinRate(player);
    case 'global_rating':
      return skill * 4000 + targetWinRate(player) * 60 + Math.log10(1 + battles / 2000) * 500;
    case 'damage_dealt':
    case 'frags_count':
    case 'xp_amount':
    case 'spotted_count':
    case 'capture_points':
      return battles * skill;
    default:
      return skill;
  }
};

const eligible = (world: MockWorld, at: number): MockPlayer[] =>
  world.players.filter((player) => player.createdAt < at && player.activity !== 'lapsed' && player.careerBattles >= RANKINGS.minBattles);

export const ranking = ({ world, field, at, depth }: RankingInput): Ranking => {
  const day = Math.floor(at / MOCK_TIME.daySec);
  const key = `${world.seed}:${field}:${day}`;
  const cached = cache.get(key);

  if (cached && cached.depth >= Math.min(depth, RANKINGS.exactCandidates)) {
    return cached;
  }

  const date = day * MOCK_TIME.daySec;
  const estimated = sortBy(
    eligible(world, date).map((player) => ({ player, value: estimate(field, player, date) })),
    [({ value }) => value, 'desc']
  );

  const exact = sortBy(
    estimated
      .slice(0, Math.min(depth, RANKINGS.exactCandidates))
      .map(({ player }) => ({ player, value: exactValue(field, playerStateAt(world, player, date)) })),
    [({ value }) => value, 'desc']
  );

  const entries = [...exact, ...estimated.slice(exact.length)];
  const created = { date, depth: exact.length, entries, rankOf: new Map(entries.map((entry, index) => [entry.player.accountId, index + 1])) };

  for (const existing of cache.keys()) {
    if (!existing.endsWith(`:${day}`)) {
      cache.delete(existing);
    }
  }

  cache.set(key, created);

  return created;
};
