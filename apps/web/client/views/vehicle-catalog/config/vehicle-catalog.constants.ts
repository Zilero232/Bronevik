import { parseAsString } from 'nuqs/server';

export const CATALOG_SEARCH_PARSERS = {
  q: parseAsString.withDefault('')
} as const;

export const VEHICLE_CATALOG_VIEW = {
  skeletons: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  skeletonHeight: 104,
  emblemSize: 480,
  emblemStroke: 1.25,
  searchIcon: 16
} as const;
