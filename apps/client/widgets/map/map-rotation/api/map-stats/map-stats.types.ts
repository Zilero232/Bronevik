import type { MapQueue, MapRotation, MapStatsControllerRotationData } from '@/shared/api/generated';

export type { MapQueue, MapRotation } from '@/shared/api/generated';

export type MapStatsMode = MapRotation['mode'];

export type MapStatsParams = Required<NonNullable<MapStatsControllerRotationData['query']>>;

export type MapStatsInput = MapStatsParams & {
  signal?: AbortSignal;
};

export type MapRotationRow = MapRotation['rows'][number];

export type QueueCell = MapQueue['cells'][number];
