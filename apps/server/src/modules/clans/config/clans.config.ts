import type { ClanListSortField } from '@bronevik/schemas';

export const CLAN_PAGE = {
  numericId: /^\d{1,12}$/,
  recentEvents: 20,
  recentPeriod: 'd30'
} as const;

export const CLAN_LIST_SORT = {
  members: 'c.members_count',
  wn8: 's.avg_wn8',
  winRate: 's.avg_win_rate',
  eloRating10: 's.elo_rating_10',
  strongholdLevel: 'st.level',
  activeMembers: 's.active_members_7d'
} as const satisfies Record<ClanListSortField, string>;

export const STRONGHOLD_FETCH = {
  levelKeys: ['stronghold_level', 'level']
} as const;
