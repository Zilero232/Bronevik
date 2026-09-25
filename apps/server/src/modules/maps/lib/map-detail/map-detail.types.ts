import type { MapStats } from '@bronevik/schemas';

import type { Arena } from '../../../../../generated';

export type ArenaRow = Pick<Arena, 'arenaId' | 'camouflageType' | 'data' | 'description' | 'image' | 'modes' | 'name' | 'sizeMeters' | 'slug'>;

export type MinimapUrlInput = {
  image: string | null;
  path: string | null | undefined;
};

export type ToMapDetailInput = {
  arena: ArenaRow;
  stats: MapStats | null;
};
