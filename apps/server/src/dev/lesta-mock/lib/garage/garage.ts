import { LRUCache } from 'lru-cache';
import { groupBy, sumBy } from 'remeda';

import type { MockCatalog, MockGarage, MockGarageTank, MockPlayer, MockVehicle, MockWorld } from '../../lesta-mock.types';
import type { MockRng } from '../random';
import type { GaragePools, PlannedTank } from './garage.types';

import { MOCK_CACHE, MOCK_GARAGE, MOCK_OTHER_MODES, MOCK_SALT, MOCK_SKILL } from '../../config';
import { createRng } from '../random';

const pools = new WeakMap<MockCatalog, GaragePools>();
const garages = new LRUCache<string, MockGarage>({ max: MOCK_CACHE.garages });

const lineKey = (vehicle: MockVehicle): string => `${vehicle.nation}:${vehicle.type}`;

const NATION_WEIGHTS: ReadonlyMap<string, number> = new Map(Object.entries(MOCK_GARAGE.nationWeights));

const nationWeight = (nation: string): number => NATION_WEIGHTS.get(nation) ?? 0.3;

export const garagePools = (catalog: MockCatalog): GaragePools => {
  const cached = pools.get(catalog);

  if (cached) {
    return cached;
  }

  const playable = catalog.vehicles.filter((vehicle) => vehicle.playable);
  const tech = playable.filter((vehicle) => !vehicle.isPremium && !vehicle.isCollectible && vehicle.tier >= 2);
  const grouped = groupBy(tech, lineKey);
  const lines = Object.entries(grouped).map(([key, vehicles]) => {
    const [first] = vehicles;

    return { key, vehicles, weight: first ? nationWeight(first.nation) * MOCK_GARAGE.typeWeights[first.type] : 0 };
  });

  const created = {
    lines,
    starters: playable.filter((vehicle) => vehicle.tier === 1 && !vehicle.isPremium),
    premiums: playable.filter((vehicle) => vehicle.isPremium && !vehicle.isCollectible && !vehicle.isGift),
    collectibles: playable.filter((vehicle) => vehicle.isCollectible)
  };

  pools.set(catalog, created);

  return created;
};

const sample = <T>(rng: MockRng, items: readonly T[], count: number, weight: (item: T) => number): T[] => {
  const left = [...items];
  const chosen: T[] = [];

  while (chosen.length < count && left.length > 0) {
    const item = rng.weighted(left, weight);

    chosen.push(item);
    left.splice(left.indexOf(item), 1);
  }

  return chosen;
};

const plan = (rng: MockRng, player: MockPlayer, catalog: MockCatalog, anchorDay: number): PlannedTank[] => {
  const { lines, starters, premiums, collectibles } = garagePools(catalog);
  const experience = player.careerBattles;
  const lineCount = Math.min(
    MOCK_GARAGE.maxLines,
    lines.length,
    Math.max(1, Math.round(MOCK_GARAGE.linesBase + experience / MOCK_GARAGE.linesPerBattles + rng.normal(0, MOCK_GARAGE.linesSigma)))
  );

  const saturation = 1 - Math.exp(-experience / MOCK_GARAGE.tierSaturation);
  const planned: PlannedTank[] = [];
  const active = player.activity !== 'lapsed';

  for (const line of sample(rng, lines, lineCount, (entry) => entry.weight)) {
    const maxTier = Math.min(10, Math.max(2, Math.round(3 + 7 * saturation + rng.normal(0, MOCK_GARAGE.tierSigma))));

    for (let tier = 2; tier <= maxTier; tier += 1) {
      const candidates = line.vehicles.filter((vehicle) => vehicle.tier === tier);

      if (candidates.length === 0) {
        continue;
      }

      const second = tier >= 8 && experience > MOCK_GARAGE.secondBranchFrom && candidates.length > 1 && rng.chance(MOCK_GARAGE.secondBranchChance);

      for (const vehicle of rng.shuffle(candidates).slice(0, second ? 2 : 1)) {
        planned.push({ vehicle, role: tier === maxTier ? 'keeper' : 'grind', availableFromDay: 0 });
      }
    }

    const next = line.vehicles.filter((vehicle) => vehicle.tier === maxTier + 1);

    if (active && next.length > 0 && rng.chance(MOCK_GARAGE.unlockChance)) {
      planned.push({ vehicle: rng.pick(next), role: 'keeper', availableFromDay: anchorDay + rng.int(5, 400) });
    }
  }

  for (const vehicle of rng.shuffle(starters).slice(0, rng.int(MOCK_GARAGE.starters[0], MOCK_GARAGE.starters[1]))) {
    planned.push({ vehicle, role: 'starter', availableFromDay: 0 });
  }

  const premiumCount = Math.min(MOCK_GARAGE.maxPremiums, rng.poisson(experience / MOCK_GARAGE.premiumsPer));

  for (const vehicle of sample(rng, premiums, premiumCount, (entry) => MOCK_GARAGE.premiumTierWeights[entry.tier] ?? 0)) {
    planned.push({ vehicle, role: 'keeper', availableFromDay: 0 });
  }

  for (const vehicle of sample(rng, collectibles, rng.poisson(experience / MOCK_GARAGE.collectiblePer), () => 1)) {
    planned.push({ vehicle, role: 'keeper', availableFromDay: 0 });
  }

  const seen = new Set<number>();

  return planned.filter((entry) => {
    if (seen.has(entry.vehicle.tankId)) {
      return false;
    }

    seen.add(entry.vehicle.tankId);

    return true;
  });
};

const otherShareOf = (rng: MockRng, player: MockPlayer, world: MockWorld): number => {
  const clan = player.stints.at(-1);
  const tier = clan ? world.clanById.get(clan.clanId)?.tier : undefined;

  return tier ? MOCK_OTHER_MODES.clanTierShare[tier] * (0.5 + rng.float()) : 0;
};

export const buildGarage = (world: MockWorld, player: MockPlayer): MockGarage => {
  const key = `${world.seed}:${player.index}`;
  const cached = garages.get(key);

  if (cached) {
    return cached;
  }

  const rng = createRng(world.seed, MOCK_SALT.garage, player.index);
  const planned = plan(rng, player, world.catalog, world.anchorDay);
  const otherShare = otherShareOf(rng, player, world);
  const weights = planned.map((entry) =>
    entry.role === 'keeper'
      ? rng.logNormal(1, MOCK_GARAGE.preferenceSigma) *
        (MOCK_GARAGE.tierComfort[entry.vehicle.tier] ?? 1) *
        (entry.vehicle.isPremium && entry.vehicle.tier === 8 ? 1.3 : 1)
      : 0
  );

  const fixed = planned.map((entry) => {
    if (entry.availableFromDay > 0) {
      return 0;
    }

    if (entry.role === 'grind') {
      return rng.logNormal(MOCK_GARAGE.grindBase + MOCK_GARAGE.grindScale * entry.vehicle.tier ** MOCK_GARAGE.grindPower, MOCK_GARAGE.grindSigma);
    }

    return entry.role === 'starter' ? rng.int(MOCK_GARAGE.starterBattles[0], MOCK_GARAGE.starterBattles[1]) : 0;
  });

  const fixedTotal = sumBy(fixed, (value) => value);
  const minPlayed = player.careerBattles * MOCK_GARAGE.minPlayedShare;
  const scale = fixedTotal > player.careerBattles - minPlayed ? Math.max(0, player.careerBattles - minPlayed) / fixedTotal : 1;
  const played = Math.max(0, player.careerBattles - fixedTotal * scale);
  const weightTotal = sumBy(
    weights.filter((_, index) => (planned[index]?.availableFromDay ?? 0) === 0),
    (value) => value
  );

  const meanWeight = weightTotal / Math.max(1, weights.filter((value) => value > 0).length);

  const tanks = planned.map((entry, index): MockGarageTank => {
    const weight = weights[index] ?? 0;
    const share = entry.availableFromDay === 0 && weightTotal > 0 ? weight / weightTotal : 0;

    return {
      vehicle: entry.vehicle,
      baseBattles: Math.max(entry.availableFromDay > 0 ? 0 : 1, Math.round((fixed[index] ?? 0) * scale + played * share)),
      weight: entry.role === 'keeper' ? weight : MOCK_GARAGE.grindWeight * meanWeight,
      affinity: rng.logNormal(1, MOCK_SKILL.affinitySigma),
      availableFromDay: entry.availableFromDay,
      otherShare: entry.vehicle.tier >= MOCK_GARAGE.otherMinTier ? otherShare : 0
    };
  });

  const garage = { tanks, byTankId: new Map(tanks.map((tank) => [tank.vehicle.tankId, tank])) };

  garages.set(key, garage);

  return garage;
};
