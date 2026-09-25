import type { ParsedLoadoutRequest, PopularBuildsQuery } from '@bronevik/schemas';

export type ProgressionData = {
  tree: unknown;
  pairs: unknown[];
};

export type CalculateLoadoutInput = {
  tankId: number;
  request: ParsedLoadoutRequest;
};

export type PopularBuildsInput = {
  tankId: number;
  query: PopularBuildsQuery;
};
