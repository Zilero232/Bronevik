import type { ClanListSortField } from '@otmetki/schemas';

export const CLAN_SORTS = [
  'wn8',
  'winRate',
  'members',
  'activeMembers',
  'eloRating10',
  'strongholdLevel'
] as const satisfies readonly ClanListSortField[];

export const CLAN_RATING = {
  defaultSort: 'wn8',
  pageSize: 25,
  searchLimit: 8,
  searchDebounceMs: 250
} as const;
