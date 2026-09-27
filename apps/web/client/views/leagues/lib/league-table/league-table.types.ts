import type { LeagueEntry, LeagueZone } from '../../api';

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
};

export type LeagueWeekNav = {
  previous: string;
  next: string | null;
  isCurrent: boolean;
};
