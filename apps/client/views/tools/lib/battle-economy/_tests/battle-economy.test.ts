import { describe, expect, it } from 'vitest';

import type { BattleEconomyInput } from '../battle-economy.types';

import { ECONOMY, ECONOMY_TIERS } from '../../../config';
import { battleEconomy, defaultShellPrices } from '../battle-economy';

const BASE: BattleEconomyInput = {
  tier: 10,
  isPremiumVehicle: false,
  damage: 3_000,
  spotting: 800,
  shells: { ap: 8, heat: 2, he: 0 },
  prices: defaultShellPrices(10),
  consumables: { standard: 1, premium: 1 }
};

describe('battleEconomy', () => {
  it('nets out repair, ammunition and consumables from the gross income', () => {
    const { gross, repair, ammo, consumables, net } = battleEconomy(BASE);

    expect(net).toBe(gross - repair - ammo - consumables);
  });

  it('prices the fired shells by kind', () => {
    const { ap, heat, he } = BASE.prices;

    expect(battleEconomy(BASE).ammo).toBe(BASE.shells.ap * ap + BASE.shells.heat * heat + BASE.shells.he * he);
  });

  it('boosts only the income with a premium account, not the costs', () => {
    const economy = battleEconomy(BASE);

    expect(economy.grossPremium).toBe(Math.round(economy.gross * ECONOMY.premiumAccount));
    expect(economy.grossPremium - economy.netPremium).toBe(economy.gross - economy.net);
  });

  it('earns more on a premium vehicle with the same result', () => {
    expect(battleEconomy({ ...BASE, isPremiumVehicle: true }).net).toBeGreaterThan(battleEconomy(BASE).net);
  });

  it('pays more for dealing more damage', () => {
    expect(battleEconomy({ ...BASE, damage: 5_000 }).gross).toBeGreaterThan(battleEconomy(BASE).gross);
  });

  it('can end a battle in the red when firing gold shells', () => {
    const economy = battleEconomy({ ...BASE, damage: 0, spotting: 0, shells: { ap: 0, heat: 30, he: 0 } });

    expect(economy.net).toBeLessThan(0);
  });
});

describe('defaultShellPrices', () => {
  it('takes the shell prices from the tier table', () => {
    const { ap, heat, he } = ECONOMY_TIERS[8];

    expect(defaultShellPrices(8)).toEqual({ ap, heat, he });
  });

  it('makes premium shells dearer than regular ones on every tier', () => {
    expect(Object.values(ECONOMY_TIERS).every(({ ap, heat }) => heat > ap)).toBe(true);
  });
});
