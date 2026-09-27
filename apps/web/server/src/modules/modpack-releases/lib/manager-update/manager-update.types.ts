import type { ModpackManagerUpdateQuery, ModpackReleaseIndex } from '@otmetki/schemas';

export type SelectManagerUpdateInput = {
  index: ModpackReleaseIndex;
  query: ModpackManagerUpdateQuery;
};
