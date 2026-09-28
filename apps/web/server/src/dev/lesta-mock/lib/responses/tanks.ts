import type { LestaMockEnvelope, MockTankState } from '../../lesta-mock.types';
import type { MockContext, MockRoute, TanksOfInput, TankStatsInput } from './responses.types';

import { MOCK_MODE_BLOCKS } from '../../config';
import { tankAchievements } from '../achievements';
import { selectFields } from '../fields';
import { tankModeOf } from '../mode-blocks';
import { isInGarage } from '../ownership';
import { percentileOf, populationSample } from '../simulation';
import { emptyTotals, mergeTotals, toStatsBlock } from '../stats';
import { masteryOf, playerAt, stateOf, tokenError } from './account';
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

const ownsGarage = (context: MockContext, accountId: number): boolean => context.tokenAccountId === accountId;

const tanksOf = ({ context, accountId }: TanksOfInput): MockTankState[] | null => {
  const player = playerAt({ context, accountId });
  const filter = new Set(listOf({ params: context.params, key: 'tank_id' }).map(Number));
  const onlyInGarage = context.params.in_garage === '1' && ownsGarage(context, accountId);

  if (!player) {
    return null;
  }

  return [...stateOf({ context, player }).tanks.values()].filter(
    (tank) =>
      (filter.size === 0 || filter.has(tank.vehicle.tankId)) &&
      (!onlyInGarage || isInGarage({ seed: context.world.seed, accountId, tank, at: context.now }))
  );
};

const servedModeKeys = (context: MockContext): string[] =>
  MOCK_MODE_BLOCKS.tank.filter((key) => {
    const extraOnly = MOCK_MODE_BLOCKS.extraOnly.tank.find((name) => name === key);

    return !extraOnly || hasExtra({ context, extra: extraOnly });
  });

const tankModeBlocks = ({ context, accountId, tank }: TankStatsInput) => {
  const played = tankModeOf({ seed: context.world.seed, accountId, tank });

  return Object.fromEntries(
    [...servedModeKeys(context), ...ZERO_BLOCK_KEYS.tank].map((key) => [key, toStatsBlock(key === played ? tank.other : emptyTotals())])
  );
};

const tankStats = ({ context, accountId, tank }: TankStatsInput) => {
  const all = mergeTotals({ target: { ...tank.random }, source: tank.other });

  return {
    tank_id: tank.vehicle.tankId,
    account_id: accountId,
    mark_of_mastery: masteryOf({ context, tank }),
    max_frags: all.maxFrags,
    max_xp: all.maxXp,
    in_garage: ownsGarage(context, accountId) ? isInGarage({ seed: context.world.seed, accountId, tank, at: context.now }) : null,
    frags: null,
    all: toStatsBlock(all),
    ...tankModeBlocks({ context, accountId, tank }),
    ...(hasExtra({ context, extra: 'random' }) ? { random: toStatsBlock(tank.random) } : {})
  };
};

export const tanksStats: MockRoute = (context) => {
  const account = singleAccount(context);
  const invalid = tokenError(context);

  if ('error' in account) {
    return account.error;
  }

  if (invalid) {
    return invalid;
  }

  const tanks = tanksOf({ context, accountId: account.accountId });
  const data =
    tanks?.map((tank) => selectFields({ value: tankStats({ context, accountId: account.accountId, tank }), fields: context.fields })) ?? null;

  return ok({ data: { [String(account.accountId)]: data }, meta: { count: 1 } });
};

export const tanksAchievements: MockRoute = (context) => {
  const account = singleAccount(context);

  if ('error' in account) {
    return account.error;
  }

  const player = playerAt({ context, accountId: account.accountId });
  const tanks = tanksOf({ context, accountId: account.accountId });
  const data =
    player && tanks
      ? tanks.map((tank) => selectFields({ value: tankAchievements({ world: context.world, player, tank }), fields: context.fields }))
      : null;

  return ok({ data: { [String(account.accountId)]: data }, meta: { count: 1 } });
};

export const tanksMastery: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'tank_id' });
  const distribution = context.params.distribution ?? 'xp';
  const percentiles = listOf({ params: context.params, key: 'percentile' }).map(Number);

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

      const sample = populationSample({ seed: context.world.seed, vehicle })[distribution];

      return [
        [
          String(tankId),
          Object.fromEntries(
            (percentiles.length > 0 ? percentiles : [50, 80, 95, 99]).map((percentile) => [
              String(percentile),
              percentileOf({ sorted: sample, percentile })
            ])
          )
        ]
      ];
    })
  );

  return ok({ data: { distribution: data }, meta: { count: Object.keys(data).length } });
};
