import type { VehicleSummary } from '@bronevik/schemas';

import type { MockTank } from './mocks.types';

import { MOCK_TREE_VEHICLES } from './tech-tree';
import { MOCK_VEHICLES } from './vehicles';

export const mockVehicleSummary = ({ id, name, slug, nation, type, tier, isPremium, images }: MockTank): VehicleSummary => ({
  tankId: id,
  name,
  shortName: name,
  slug,
  nation,
  type,
  tier,
  isPremium,
  isCollectible: false,
  images
});

export const findMockVehicle = (idOrSlug: number | string): MockTank | undefined =>
  [...MOCK_VEHICLES, ...MOCK_TREE_VEHICLES].find(({ id, slug }) => id === Number(idOrSlug) || slug === idOrSlug);
