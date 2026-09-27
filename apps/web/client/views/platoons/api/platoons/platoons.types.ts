import type { PlatoonsControllerListPlatoonsData } from '@/shared/api/generated';

export type { CreatePlatoon, PlatoonPage, PlatoonPost } from '@/shared/api/generated';

export type PlatoonListQuery = NonNullable<PlatoonsControllerListPlatoonsData['query']>;

export type ListPlatoonsInput = PlatoonListQuery & {
  signal?: AbortSignal;
};
