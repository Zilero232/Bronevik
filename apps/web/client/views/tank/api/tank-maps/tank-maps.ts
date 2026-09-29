import type { TankMaps } from '@otmetki/schemas';

import { tankMapsControllerMaps } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { TankMapsInput } from './tank-maps.types';

export const getTankMaps = ({ tankId, signal }: TankMapsInput): Promise<TankMaps> =>
  fromSdk(() => tankMapsControllerMaps({ path: { id: tankId }, signal }));
