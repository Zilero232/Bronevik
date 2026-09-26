import type { ParsedLoadoutRequest, PopularBuildsQuery } from '@otmetki/schemas';

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
