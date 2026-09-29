import type { VehicleSummary } from '@otmetki/schemas';

import { isNation, TIERS } from '@otmetki/icons';

import type { TankIdentityData } from '../../model/tank.types';

import { TANK_IDENTITY } from '../../config';

export const vehicleIdentity = ({ name, shortName, nation, type, tier, isPremium, images }: VehicleSummary): TankIdentityData => ({
  name: shortName || name,
  nation: isNation(nation) ? nation : TANK_IDENTITY.fallback.nation,
  type,
  tier: TIERS.find((value) => value === tier) ?? TANK_IDENTITY.fallback.tier,
  isPremium,
  images
});
