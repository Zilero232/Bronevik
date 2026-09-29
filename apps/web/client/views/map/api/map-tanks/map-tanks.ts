import type { MapTanks } from '@otmetki/schemas';

import { mapsControllerTanks } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { MapTanksInput } from './map-tanks.types';

export const getMapTanks = ({ idOrSlug, signal }: MapTanksInput): Promise<MapTanks> =>
  fromSdk(() => mapsControllerTanks({ path: { idOrSlug }, signal }));
