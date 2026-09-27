import type { MockPlayer, MockPlayerState, MockTankState } from '../../lesta-mock.types';
import type {
  AccountBlockInput,
  AccountInfoInput,
  MasteryOfInput,
  MockContext,
  MockRoute,
  PlayerAtInput,
  RecordTankInput,
  StateOfInput
} from './responses.types';

import { accountAchievements } from '../achievements';
import { selectFields } from '../fields';
import { accountTotals, globalRating, logoutAt, privateData } from '../profile';
import { masteryLevel, masteryThresholds, playerStateAt } from '../simulation';
import { emptyTotals, mergeTotals, toStatsBlock } from '../stats';
import { accountExistsAt, stintAt } from '../world';
import { fail, hasExtra, idList, intParam, listOf, ok } from './envelope';
import { RESPONSES, ZERO_BLOCK_KEYS } from './responses.constants';

export const playerAt = ({ context, accountId }: PlayerAtInput): MockPlayer | null => {
  const player = context.world.playerByAccountId.get(accountId);

  return player && accountExistsAt({ player, at: context.now }) ? player : null;
};

export const stateOf = ({ context, player }: StateOfInput): MockPlayerState => playerStateAt({ world: context.world, player, at: context.now });

export const masteryOf = ({ context, tank }: MasteryOfInput): number =>
  masteryLevel({
    thresholds: masteryThresholds({ seed: context.world.seed, vehicle: tank.vehicle }),
    maxXp: Math.max(tank.random.maxXp, tank.other.maxXp)
  });

const recordTank = ({ tanks, pick }: RecordTankInput) => {
  const best = tanks.reduce<MockTankState | null>((current, tank) => (!current || pick(tank) > pick(current) ? tank : current), null);

  return { value: best ? pick(best) : 0, tankId: best?.vehicle.tankId ?? null };
};

const accountBlock = ({ tanks, mode }: AccountBlockInput) => {
  const totals = tanks.reduce(
    (sum, tank) =>
      mergeTotals({ target: sum, source: mode === 'all' ? mergeTotals({ target: { ...tank.random }, source: tank.other }) : tank.random }),
    emptyTotals()
  );

  const pick = (tank: MockTankState) => (mode === 'all' ? mergeTotals({ target: { ...tank.random }, source: tank.other }) : tank.random);
  const damage = recordTank({ tanks, pick: (tank) => pick(tank).maxDamage });
  const frags = recordTank({ tanks, pick: (tank) => pick(tank).maxFrags });
  const xp = recordTank({ tanks, pick: (tank) => pick(tank).maxXp });

  return {
    ...toStatsBlock(totals),
    max_damage: damage.value,
    max_damage_tank_id: damage.tankId,
    max_frags: frags.value,
    max_frags_tank_id: frags.tankId,
    max_xp: xp.value,
    max_xp_tank_id: xp.tankId
  };
};

const zeroBlocks = (keys: readonly string[]) => Object.fromEntries(keys.map((key) => [key, toStatsBlock(emptyTotals())]));

const accountInfo = ({ context, player }: AccountInfoInput) => {
  const state = stateOf({ context, player });
  const tanks = [...state.tanks.values()];
  const { all } = accountTotals(state);
  const stint = stintAt({ player, at: context.now });
  const logout = logoutAt({ world: context.world, player, state });
  const withPrivate = context.tokenAccountId === player.accountId;

  return {
    account_id: player.accountId,
    nickname: player.nickname,
    clan_id: stint?.clanId ?? null,
    global_rating: globalRating(state),
    created_at: player.createdAt,
    last_battle_time: state.lastBattle,
    logout_at: logout,
    updated_at: Math.max(logout, state.lastBattle),
    client_language: 'ru',
    statistics: {
      all: accountBlock({ tanks, mode: 'all' }),
      ...(hasExtra({ context, extra: 'statistics.random' }) ? { random: accountBlock({ tanks, mode: 'random' }) } : {}),
      stronghold_skirmish: toStatsBlock(tanks.reduce((sum, tank) => mergeTotals({ target: sum, source: tank.other }), emptyTotals())),
      ...zeroBlocks(ZERO_BLOCK_KEYS.account),
      trees_cut: Math.round(all.battles * 2.4),
      frags: null
    },
    private: withPrivate ? privateData({ world: context.world, player, state }) : null
  };
};

const tokenError = (context: MockContext) =>
  context.hasToken && context.tokenAccountId === null
    ? fail({ code: 407, message: 'INVALID_ACCESS_TOKEN', field: 'access_token', value: context.params.access_token ?? null })
    : null;

export const accountList: MockRoute = (context) => {
  const { params, world } = context;
  const search = params.search?.trim();
  const type = params.type ?? 'startswith';
  const limit = Math.min(RESPONSES.maxListLimit, Math.max(1, intParam({ params, key: 'limit', fallback: RESPONSES.maxListLimit })));

  if (!search) {
    return fail({ code: 402, message: 'SEARCH_NOT_SPECIFIED', field: 'search' });
  }

  const names = type === 'exact' ? listOf({ params, key: 'search' }) : [search];

  if (names.some((name) => !RESPONSES.nicknamePattern.test(name))) {
    return fail({ code: 407, message: 'INVALID_SEARCH', field: 'search', value: search });
  }

  if (type !== 'exact' && search.length < RESPONSES.minSearchLength) {
    return fail({ code: 407, message: 'NOT_ENOUGH_SEARCH_LENGTH', field: 'search', value: search });
  }

  const lower = names.map((name) => name.toLowerCase());
  const found: MockPlayer[] = [];

  if (type === 'exact') {
    const wanted = new Set(lower);

    for (const [nickname, player] of world.nicknames) {
      if (wanted.has(nickname) && accountExistsAt({ player, at: context.now })) {
        found.push(player);
      }
    }
  } else {
    const [prefix = ''] = lower;
    let low = 0;
    let high = world.nicknames.length;

    while (low < high) {
      const middle = (low + high) >>> 1;

      if ((world.nicknames[middle]?.[0] ?? '') < prefix) {
        low = middle + 1;
      } else {
        high = middle;
      }
    }

    for (let index = low; index < world.nicknames.length && found.length < limit; index += 1) {
      const entry = world.nicknames[index];

      if (!entry?.[0].startsWith(prefix)) {
        break;
      }

      if (accountExistsAt({ player: entry[1], at: context.now })) {
        found.push(entry[1]);
      }
    }
  }

  const data = found
    .slice(0, limit)
    .map((player) => selectFields({ value: { nickname: player.nickname, account_id: player.accountId }, fields: context.fields }));

  return ok({ data, meta: { count: data.length } });
};

export const accountInfoRoute: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'account_id' });

  if ('error' in parsed) {
    return parsed.error;
  }

  const invalid = tokenError(context);

  if (invalid) {
    return invalid;
  }

  const data = Object.fromEntries(
    parsed.ids.map((accountId) => {
      const player = playerAt({ context, accountId });

      return [String(accountId), player ? selectFields({ value: accountInfo({ context, player }), fields: context.fields }) : null];
    })
  );

  return ok({ data, meta: { count: parsed.ids.length } });
};

export const accountTanks: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'account_id' });
  const filter = new Set(listOf({ params: context.params, key: 'tank_id' }).map(Number));

  if ('error' in parsed) {
    return parsed.error;
  }

  const data = Object.fromEntries(
    parsed.ids.map((accountId) => {
      const player = playerAt({ context, accountId });

      if (!player) {
        return [String(accountId), null];
      }

      const tanks = [...stateOf({ context, player }).tanks.values()]
        .filter((tank) => filter.size === 0 || filter.has(tank.vehicle.tankId))
        .map((tank) =>
          selectFields({
            value: {
              statistics: { wins: tank.random.wins + tank.other.wins, battles: tank.random.battles + tank.other.battles },
              mark_of_mastery: masteryOf({ context, tank }),
              tank_id: tank.vehicle.tankId
            },
            fields: context.fields
          })
        );

      return [String(accountId), tanks];
    })
  );

  return ok({ data, meta: { count: parsed.ids.length } });
};

export const accountAchievementsRoute: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'account_id' });

  if ('error' in parsed) {
    return parsed.error;
  }

  const data = Object.fromEntries(
    parsed.ids.map((accountId) => {
      const player = playerAt({ context, accountId });

      if (!player) {
        return [String(accountId), null];
      }

      const counts = accountAchievements({ world: context.world, player, state: stateOf({ context, player }) });

      return [String(accountId), selectFields({ value: { ...counts, frags: null }, fields: context.fields })];
    })
  );

  return ok({ data, meta: { count: parsed.ids.length } });
};
