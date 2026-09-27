import type { ReplayTrack } from '../replay-tracks';

export type MapBounds = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export type ToCellInput = {
  x: number;
  z: number;
  bounds: MapBounds;
  gridSize: number;
};

export type AccumulateInput = {
  tracks: readonly ReplayTrack[];
  bounds: MapBounds;
  gridSize: number;
};

export type MergeGridsInput = {
  base: readonly number[] | null;
  add: readonly number[];
};
