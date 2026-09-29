import type { MapSampleCounts } from '../../lib';

export type MapSamplesScope = { arenaId: string } | { tankId: number };

export type MapSamplesInput = {
  scope: MapSamplesScope;
  since: Date;
  battleType: string;
};

export type MapSampleRow = MapSampleCounts & {
  key: string;
};
