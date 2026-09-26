import { mapStatsControllerQueue, mapStatsControllerRotation } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { MapQueue, MapRotation, MapStatsInput } from './map-stats.types';

export const getMapRotation = ({ tier, mode, signal }: MapStatsInput): Promise<MapRotation> =>
  fromSdk(() => mapStatsControllerRotation({ query: { tier, mode }, signal }));

export const getMapQueue = ({ tier, mode, signal }: MapStatsInput): Promise<MapQueue> =>
  fromSdk(() => mapStatsControllerQueue({ query: { tier, mode }, signal }));
