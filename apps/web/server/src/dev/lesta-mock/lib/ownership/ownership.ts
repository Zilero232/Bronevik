import type { IsInGarageInput } from './ownership.types';

import { MOCK_OWNERSHIP, MOCK_SALT, MOCK_TIME } from '../../config';
import { unitFloat } from '../random';

export const soldShare = (idleDays: number): number =>
  idleDays <= MOCK_OWNERSHIP.keepDays ? 0 : Math.min(MOCK_OWNERSHIP.soldMax, MOCK_OWNERSHIP.soldBase + idleDays * MOCK_OWNERSHIP.soldPerDay);

export const isInGarage = ({ seed, accountId, tank, at }: IsInGarageInput): boolean => {
  if (tank.vehicle.isPremium || tank.vehicle.isCollectible) {
    return true;
  }

  const idleDays = Math.max(0, (at - tank.lastBattle) / MOCK_TIME.daySec);

  return unitFloat(seed, MOCK_SALT.ownership, accountId, tank.vehicle.tankId) >= soldShare(idleDays);
};
