import type { MoeSortField, SortOrder, ThresholdSource, VehicleType } from '@otmetki/schemas';

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
