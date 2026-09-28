import type { LeagueEntry, LeagueZone } from '@/entities/social/league';

export type LeagueStatus = 'ranked' | 'unranked' | LeagueZone;

export type LeagueStanding = {
  me: LeagueEntry | null;
  status: LeagueStatus | null;
  ranked: number;
  behind: number | null;
  ahead: number | null;
};

export type LeagueWeekNavInput = {
  weekStart: string;
  currentWeek: string | null;
  hasData: boolean;
};

export type LeagueWeekNav = {
  previous: string | null;
  next: string | null;
  isCurrent: boolean;
  isPast: boolean;
};

export type LeagueEmptyKind = 'friends' | 'past' | 'pending';
