import type { VehicleSummary } from '@otmetki/schemas';

import { isNation, TIERS } from '@otmetki/icons';

import type { TankIdentityData } from '../../model/tank.types';

const FALLBACK_NATION = 'intunion';

const FALLBACK_TIER = 10;

export const vehicleIdentity = ({ name, shortName, nation, type, tier, isPremium, images }: VehicleSummary): TankIdentityData => ({
  name: shortName || name,
  nation: isNation(nation) ? nation : FALLBACK_NATION,
  type,
  tier: TIERS.find((value) => value === tier) ?? FALLBACK_TIER,
  isPremium,
  images
});
