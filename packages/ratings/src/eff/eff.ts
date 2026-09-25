import { sumBy } from 'remeda';

import type { AverageTierInput, EffInput } from './eff.types';

import { EFF } from './eff.constants';

export const averageTier = ({ tanks, tiers }: AverageTierInput): number | null => {
  const rated = tanks.flatMap((tank) => {
    const tier = tiers.get(tank.tankId);

    return tier === undefined || tank.battles === 0 ? [] : [{ battles: tank.battles, tier }];
  });

  const battles = sumBy(rated, (tank) => tank.battles);

  return battles === 0 ? null : sumBy(rated, (tank) => tank.battles * tank.tier) / battles;
};

export const eff = ({ totals, averageTier: tier }: EffInput): number | null => {
  const { battles } = totals;

  if (battles === 0) {
    return null;
  }

  const damage = totals.damageDealt / battles;
  const frags = totals.frags / battles;
  const spotted = totals.spotted / battles;
  const capture = totals.capturePoints / battles;
  const defence = totals.droppedCapturePoints / battles;

  return (
    damage * (EFF.damageTierNumerator / (tier + EFF.damageTierOffset)) * (EFF.damageBase + (EFF.damageTierSlope * tier) / 100) +
    frags * EFF.fragWeight +
    spotted * EFF.spotWeight +
    (Math.log(capture + 1) / Math.log(EFF.captureLogBase)) * EFF.captureWeight +
    defence * EFF.defenceWeight
  );
};
