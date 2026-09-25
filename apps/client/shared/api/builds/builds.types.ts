import type { LoadoutRequest } from '@bronevik/schemas';

export type BuildOptionsInput = {
  tankId: number;
  signal?: AbortSignal;
};

export type CalculateLoadoutInput = {
  tankId: number;
  request: LoadoutRequest;
  signal?: AbortSignal;
};

export type PopularBuildsInput = {
  tankId: number;
  limit?: number;
  signal?: AbortSignal;
};
