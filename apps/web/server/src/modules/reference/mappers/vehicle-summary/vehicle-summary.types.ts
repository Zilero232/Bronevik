import type { Vehicle } from '../../../../../generated';

export type VehicleRow = Pick<
  Vehicle,
  'images' | 'isCollectible' | 'isPremium' | 'name' | 'nation' | 'shortName' | 'slug' | 'tag' | 'tankId' | 'tier' | 'type'
>;

export type ReadUrlInput = {
  images: unknown;
  keys: readonly string[];
};
