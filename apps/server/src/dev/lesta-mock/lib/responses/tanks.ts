import type { LestaMockEnvelope, MockTankState } from '../../lesta-mock.types';
import type { MockContext, MockRoute } from './responses.types';

import { tankAchievements } from '../achievements';
import { selectFields } from '../fields';
import { percentileOf, populationSample } from '../simulation';
import { emptyTotals, mergeTotals, toStatsBlock } from '../stats';
import { masteryOf, playerAt, stateOf } from './account';
import { fail, hasExtra, idList, listOf, ok } from './envelope';
import { ZERO_BLOCK_KEYS } from './responses.constants';

const singleAccount = (context: MockContext): { accountId: number } | { error: LestaMockEnvelope } => {
  const raw = context.params.account_id;

  if (!raw) {
    return { error: fail({ code: 402, message: 'ACCOUNT_ID_NOT_SPECIFIED', field: 'account_id' }) };
  }

  if (!/^\d{1,12}$/.test(raw)) {
    return { error: fail({ code: 407, message: 'INVALID_ACCOUNT_ID', field: 'account_id', value: raw }) };
  }

  return { accountId: Number(raw) };
};

const tanksOf = (context: MockContext, accountId: number): MockTankState[] | null => {
  const player = playerAt(context, accountId);
  const filter = new Set(listOf(context.params, 'tank_id').map(Number));

  if (!player) {
    return null;
  }

  return [...stateOf(context, player).tanks.values()].filter((tank) => filter.size === 0 || filter.has(tank.vehicle.tankId));
};

const tankStats = (context: MockContext, accountId: number, tank: MockTankState) => {
  const all = mergeTotals({ ...tank.random }, tank.other);

  return {
    tank_id: tank.vehicle.tankId,
    account_id: accountId,
    mark_of_mastery: masteryOf(context, tank),
    max_frags: all.maxFrags,
    max_xp: all.maxXp,
    in_garage: context.tokenAccountId === accountId ? true : null,
    frags: null,
    all: toStatsBlock(all),
    stronghold_skirmish: toStatsBlock(tank.other),
    ...Object.fromEntries(ZERO_BLOCK_KEYS.tank.map((key) => [key, toStatsBlock(emptyTotals())])),
    ...(hasExtra(context, 'random') ? { random: toStatsBlock(tank.random) } : {})
  };
};

export const tanksStats: MockRoute = (context) => {
  const account = singleAccount(context);

  if ('error' in account) {
    return account.error;
  }

  const tanks = tanksOf(context, account.accountId);
  const data = tanks?.map((tank) => selectFields(tankStats(context, account.accountId, tank), context.fields)) ?? null;

  return ok({ [String(account.accountId)]: data }, { count: 1 });
};

export const tanksAchievements: MockRoute = (context) => {
  const account = singleAccount(context);

  if ('error' in account) {
    return account.error;
  }

  const player = playerAt(context, account.accountId);
  const tanks = tanksOf(context, account.accountId);
  const data = player && tanks ? tanks.map((tank) => selectFields(tankAchievements({ world: context.world, player, tank }), context.fields)) : null;

  return ok({ [String(account.accountId)]: data }, { count: 1 });
};

export const tanksMastery: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'tank_id' });
  const distribution = context.params.distribution ?? 'xp';
  const percentiles = listOf(context.params, 'percentile').map(Number);

  if ('error' in parsed) {
    return parsed.error;
  }

  if (distribution !== 'xp' && distribution !== 'damage' && distribution !== 'frags') {
    return fail({ code: 407, message: 'INVALID_DISTRIBUTION', field: 'distribution', value: distribution });
  }

  const data = Object.fromEntries(
    parsed.ids.flatMap((tankId) => {
      const vehicle = context.world.catalog.vehicleById.get(tankId);

      if (!vehicle?.playable) {
        return [];
      }

      const sample = populationSample(context.world.seed, vehicle)[distribution];

      return [
        [
          String(tankId),
          Object.fromEntries(
            (percentiles.length > 0 ? percentiles : [50, 80, 95, 99]).map((percentile) => [String(percentile), percentileOf(sample, percentile)])
          )
        ]
      ];
    })
  );

  return ok({ distribution: data }, { count: Object.keys(data).length });
};
