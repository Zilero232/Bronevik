import type { TankMapSample } from '@otmetki/schemas';

import { TANK_MAPS } from '@otmetki/schemas';

import type { MapSampleCounts } from './map-sample.types';

import { percentOf } from '../../../../common/lib';

export const toMapSample = ({ battles, wins, avgDamage }: MapSampleCounts): TankMapSample => {
  const isEnough = battles >= TANK_MAPS.minBattles;

  return {
    battles,
    isEnough,
    winRate: isEnough ? percentOf({ value: wins, by: battles }) : null,
    avgDamage: isEnough && avgDamage !== null ? Math.round(avgDamage) : null
  };
};
