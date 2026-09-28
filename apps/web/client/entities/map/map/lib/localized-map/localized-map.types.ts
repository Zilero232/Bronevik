import type { MapDetail, MapSummary } from '@otmetki/schemas';

export type LocalizedMapInput<T extends MapSummary> = {
  map: T;
  locale: string;
};

export type LocalizedMapDetailInput = LocalizedMapInput<MapDetail>;
