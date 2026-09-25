import type { ClanListSortField, SortOrder } from '@bronevik/schemas';

export type ClanPageInput = {
  idOrTag: string;
  signal?: AbortSignal;
};

export type ClanEventsInput = {
  clanId: number;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
};

export type ClanListInput = {
  sort?: ClanListSortField;
  order?: SortOrder;
  search?: string;
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
};

export type ClanStrongholdInput = {
  clanId: number;
  signal?: AbortSignal;
};
