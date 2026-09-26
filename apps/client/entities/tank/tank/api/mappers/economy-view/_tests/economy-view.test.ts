import type { TankEconomy, TankEconomyFigures } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { ECONOMY_VIEW } from '../../../../config';
import { economyView } from '../economy-view';

const FIGURES: TankEconomyFigures = {
  battles: 50,
  players: 9,
  costBattles: 30,
  credits: 48_000,
  creditsBase: 32_000,
  repair: 4_000,
  ammo: 2_500,
  consumables: 3_000,
  net: 38_500,
  xp: 1_200,
  freeXp: 60
};

const ECONOMY: TankEconomy = { tankId: 1, windowDays: 30, all: FIGURES, premium: FIGURES, standard: null, computedAt: null };

describe('economyView', () => {
  it('adds the credit reserve bonus to income and net alike', () => {
    const plain = economyView({ economy: ECONOMY, account: 'premium', withReserve: false });
    const boosted = economyView({ economy: ECONOMY, account: 'premium', withReserve: true });
    const bonus = Math.round((FIGURES.creditsBase ?? 0) * ECONOMY_VIEW.reserveBonus);

    expect((boosted?.credits ?? 0) - (plain?.credits ?? 0)).toBe(bonus);
    expect((boosted?.net ?? 0) - (plain?.net ?? 0)).toBe(bonus);
  });

  it('adds the clan payout bonus to base credits, on top of the reserve', () => {
    const plain = economyView({ economy: ECONOMY, account: 'premium', withReserve: false });
    const clan = economyView({ economy: ECONOMY, account: 'premium', withReserve: false, withClanPayout: true });
    const both = economyView({ economy: ECONOMY, account: 'premium', withReserve: true, withClanPayout: true });
    const base = FIGURES.creditsBase ?? 0;

    expect((clan?.credits ?? 0) - (plain?.credits ?? 0)).toBe(Math.round(base * ECONOMY_VIEW.clanPayoutBonus));
    expect((clan?.net ?? 0) - (plain?.net ?? 0)).toBe(Math.round(base * ECONOMY_VIEW.clanPayoutBonus));
    expect((both?.credits ?? 0) - (plain?.credits ?? 0)).toBe(Math.round(base * (ECONOMY_VIEW.reserveBonus + ECONOMY_VIEW.clanPayoutBonus)));
    expect(clan?.costs).toBe(plain?.costs);
  });

  it('adds no bonus when base credits are unknown', () => {
    const economy = { ...ECONOMY, premium: { ...FIGURES, creditsBase: null } };

    expect(economyView({ economy, account: 'premium', withReserve: true, withClanPayout: true })?.credits).toBe(FIGURES.credits);
  });

  it('sums the three costs and leaves the total unknown when one is missing', () => {
    expect(economyView({ economy: ECONOMY, account: 'premium', withReserve: false })?.costs).toBe(9_500);
    expect(economyView({ economy: { ...ECONOMY, premium: { ...FIGURES, ammo: null } }, account: 'premium', withReserve: false })?.costs).toBeNull();
  });

  it('has no view for an account type without data', () => {
    expect(economyView({ economy: ECONOMY, account: 'standard', withReserve: true })).toBeNull();
  });
});
