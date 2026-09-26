import type { MoeSortField, SortOrder, ThresholdSource, VehicleType } from '@bronevik/schemas';

export type MoeListInput = {
  tiers?: number[];
  types?: VehicleType[];
  nations?: string[];
  premium?: boolean;
  search?: string;
  sort?: MoeSortField;
  order?: SortOrder;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
};

export type MoeHistoryInput = {
  tankId: number;
  from?: string;
  to?: string;
  source?: ThresholdSource;
  signal?: AbortSignal;
};

export type MoeHistoryBatchInput = {
  tankIds: readonly number[];
  days?: number;
  source?: ThresholdSource;
  signal?: AbortSignal;
};

export type MoeProjectionInput = {
  tankId: number;
  currentPercent: number | null;
  targetMarks: number;
  avgDamage: number;
  signal?: AbortSignal;
};
