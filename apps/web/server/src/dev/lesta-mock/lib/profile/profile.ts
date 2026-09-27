import type { MockPlayerState } from '../../lesta-mock.types';
import type { IsPremiumAtInput, ProfileInput } from './profile.types';

import { MOCK_SALT, MOCK_TIME } from '../../config';
import { hashSeed, unitFloat } from '../random';
import { mergeTotals, sumTotals } from '../stats';
import { dayOf } from '../time';

export const accountTotals = (state: MockPlayerState) => {
  const tanks = [...state.tanks.values()];

  return {
    random: sumTotals(tanks.map((tank) => tank.random)),
    all: mergeTotals({ target: sumTotals(tanks.map((tank) => tank.random)), source: sumTotals(tanks.map((tank) => tank.other)) })
  };
};

export const globalRating = (state: MockPlayerState): number => {
  const tanks = [...state.tanks.values()];
  const battles = tanks.reduce((sum, tank) => sum + tank.random.battles, 0);

  if (battles < 10) {
    return 0;
  }

  const damage = tanks.reduce((sum, tank) => sum + tank.random.damageDealt, 0);
  const expected = tanks.reduce((sum, tank) => sum + tank.random.battles * tank.vehicle.expected.damage, 0);
  const wins = tanks.reduce((sum, tank) => sum + tank.random.wins, 0);
  const value = 2600 + 2500 * (damage / Math.max(1, expected) - 0.8) + 160 * ((wins / battles) * 100 - 49) + 450 * Math.log10(1 + battles / 2000);

  return Math.round(Math.min(13_000, Math.max(0, value)));
};

export const logoutAt = ({ world, player, state }: ProfileInput): number => {
  const pause = 300 + (hashSeed(world.seed, MOCK_SALT.player, player.index, state.lastBattle) % 1500);

  return Math.min(state.at, state.lastBattle + pause);
};

export const isPremiumAt = ({ seed, player, at }: IsPremiumAtInput): boolean =>
  unitFloat(seed, MOCK_SALT.economy, player.index, dayOf(at)) < player.premiumShare;

export const privateData = ({ world, player, state }: ProfileInput) => {
  const { all } = accountTotals(state);
  const premium = isPremiumAt({ seed: world.seed, player, at: state.at });
  const credits = Math.round(2_000_000 + 60_000_000 * unitFloat(world.seed, MOCK_SALT.economy, player.index, 1) + all.battles * 180);

  return {
    credits,
    gold: Math.round(30_000 * unitFloat(world.seed, MOCK_SALT.economy, player.index, 2) ** 2),
    free_xp: Math.round(all.xp * 0.05 * unitFloat(world.seed, MOCK_SALT.economy, player.index, 3)),
    bonds: Math.round(8000 * unitFloat(world.seed, MOCK_SALT.economy, player.index, 4)),
    is_premium: premium,
    premium_expires_at: premium
      ? state.at + Math.round(MOCK_TIME.daySec * (1 + 29 * unitFloat(world.seed, MOCK_SALT.economy, player.index, dayOf(state.at))))
      : null,
    is_bound_to_phone: true,
    ban_time: null,
    ban_info: null,
    battle_life_time: all.battles * 290,
    rental: {},
    restrictions: { chat_ban_time: null },
    grouped_contacts: { groups: {}, ignored: [], blocked: [], ungrouped: [] }
  };
};
