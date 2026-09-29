import type {
  Replay,
  ReplaysControllerHeatmapData,
  ReplaysControllerMineData,
  ReplaysControllerSearchData,
  UpdateReplay
} from '@/shared/api/generated';

export type { Heatmap, Replay, ReplayPage, UploadedReplay } from '@/shared/api/generated';

export type ReplayPlayer = Replay['players'][number];

export type ReplayVisibility = Replay['visibility'];

export type ReplayStatus = Replay['status'];

export type ReplaySearchQuery = NonNullable<ReplaysControllerSearchData['query']>;

export type ReplaySearchInput = ReplaySearchQuery & {
  signal?: AbortSignal;
};

export type MyReplaysInput = NonNullable<ReplaysControllerMineData['query']> & {
  signal?: AbortSignal;
};

export type ReplayDetailInput = {
  id: string;
  signal?: AbortSignal;
};

export type UpdateReplayInput = UpdateReplay & {
  id: string;
};

export type HeatmapInput = NonNullable<ReplaysControllerHeatmapData['query']> & {
  arenaId: string;
  signal?: AbortSignal;
};

export type UploadReplayInput = {
  file: File;
  visibility?: ReplayVisibility;
  signal?: AbortSignal;
  onProgress?: (fraction: number) => void;
};
