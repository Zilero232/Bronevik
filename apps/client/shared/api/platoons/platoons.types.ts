import type { PlatoonsControllerListPlatoonsData } from '../generated';

export type { CreatePlatoon, PlatoonPage, PlatoonPost } from '../generated';

export type PlatoonListQuery = NonNullable<PlatoonsControllerListPlatoonsData['query']>;

export type ListPlatoonsInput = PlatoonListQuery & {
  signal?: AbortSignal;
};
