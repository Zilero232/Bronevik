import type { VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import type { TankEconomyAggregate } from '../../../../../../generated';
import type { EconomyBattle } from '../tank-economy.types';

import { ACCOUNT_ECONOMY } from '../../../config';
import { accountEconomy, battleNet, toTankEconomy } from '../tank-economy';

const aggregate = (account: TankEconomyAggregate['account'], computedAt: Date): TankEconomyAggregate => ({
  tankId: 1,
  account,
  battles: 40,
  players: 8,
  costBattles: 20,
  credits: 50_000,
  creditsBase: 33_000,
  repair: 4_000,
  ammo: 2_000,
  consumables: 3_000,
  net: 41_000,
  xp: 1_200,
  freeXp: 60,
  windowDays: 30,
  computedAt
});

const vehicle = (tankId: number): VehicleSummary => ({
  tankId,
  name: `T${tankId}`,
  shortName: `T${tankId}`,
  slug: `t${tankId}`,
  nation: 'ussr',
  type: 'mediumTank',
  tier: 8,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null }
});

const vehicles = new Map([1, 2].map((tankId) => [tankId, vehicle(tankId)]));

const BATTLE: EconomyBattle = {
  tankId: 1,
  credits: 45_000,
  creditsGross: 30_000,
  repairCost: 5_000,
  ammoCost: 2_000,
  consumablesCost: 3_000,
  xp: 1_000,
  isPremiumAccount: true
};

describe('toTankEconomy', () => {
  it('splits the aggregate rows by account type and leaves a missing one null', () => {
    const economy = toTankEconomy({ tankId: 1, rows: [aggregate('all', new Date('2026-09-25')), aggregate('premium', new Date('2026-09-26'))] });

    expect(economy.all?.battles).toBe(40);
    expect(economy.premium).not.toBeNull();
    expect(economy.standard).toBeNull();
    expect(economy.computedAt).toBe(new Date('2026-09-26').toISOString());
  });

  it('is empty but well-formed for a tank with no aggregate', () => {
    expect(toTankEconomy({ tankId: 1, rows: [] })).toMatchObject({ all: null, premium: null, standard: null, computedAt: null });
  });
});

describe('battleNet', () => {
  it('subtracts every cost from the credits earned', () => {
    expect(battleNet(BATTLE)).toBe(BATTLE.credits - 5_000 - 2_000 - 3_000);
  });

  it('is unknown when any cost is missing', () => {
    expect(battleNet({ ...BATTLE, ammoCost: null })).toBeNull();
  });
});

describe('accountEconomy', () => {
  const standard: EconomyBattle = { ...BATTLE, tankId: 2, credits: 30_000, creditsGross: 30_000, isPremiumAccount: false, repairCost: null };

  it('counts what the premium account added and what it would have added', () => {
    const economy = accountEconomy({ accountId: 7, days: 30, battles: [BATTLE, standard], vehicles });

    expect(economy.premiumBonus.earned).toBe(BATTLE.credits - (BATTLE.creditsGross ?? 0));
    expect(economy.premiumBonus.missed).toBe(Math.round((standard.creditsGross ?? 0) * ACCOUNT_ECONOMY.premiumBonus));
  });

  it('averages net credits only over battles with reported costs', () => {
    const economy = accountEconomy({ accountId: 7, days: 30, battles: [BATTLE, standard], vehicles });

    expect(economy.totalNet).toBe(battleNet(BATTLE));
    expect(economy.standard.net).toBeNull();
    expect(economy.premium.battles + economy.standard.battles).toBe(economy.battles);
  });

  it('lists the most played tanks first', () => {
    const economy = accountEconomy({ accountId: 7, days: 30, battles: [standard, BATTLE, BATTLE], vehicles });

    expect(economy.tanks.map((tank) => tank.vehicle.tankId)).toEqual([1, 2]);
  });

  it('leaves a tank missing from the catalog out of the tank list only', () => {
    const economy = accountEconomy({ accountId: 7, days: 30, battles: [BATTLE, { ...BATTLE, tankId: 99 }], vehicles });

    expect(economy.tanks.map((tank) => tank.vehicle.tankId)).toEqual([1]);
    expect(economy.battles).toBe(2);
  });

  it('has no per-battle figures without battles', () => {
    const economy = accountEconomy({ accountId: 7, days: 30, battles: [], vehicles });

    expect(economy.premiumBonus.perBattle).toBeNull();
    expect(economy.premium.credits).toBeNull();
    expect(economy.totalNet).toBeNull();
  });
});
