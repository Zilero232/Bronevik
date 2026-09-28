import { findLast } from 'remeda';

import type { LeagueEntry, SocialLeague } from '@/entities/social/league';

import { shiftDay } from '@/shared/lib';

import type { LeagueStanding, LeagueWeekNav, LeagueWeekNavInput } from './league-table.types';

import { LEAGUE_VIEW } from '../../config';

export const leagueStanding = (entries: readonly LeagueEntry[]): LeagueStanding => {
  const ranked = entries.filter((entry) => entry.value !== null);
  const index = ranked.findIndex((entry) => entry.isMe);
  const me = ranked[index] ?? entries.find((entry) => entry.isMe) ?? null;
  const own = me?.value ?? null;
  const above = index > 0 ? findLast(ranked.slice(0, index), (entry) => (entry.value ?? 0) > (own ?? 0)) : undefined;
  const below = index >= 0 ? ranked.slice(index + 1).find((entry) => (entry.value ?? 0) < (own ?? 0)) : undefined;

  return {
    me,
    status: me === null ? null : me.value === null ? 'unranked' : (me.zone ?? 'ranked'),
    ranked: ranked.length,
    behind: above?.value !== undefined && above.value !== null && own !== null ? own - above.value : null,
    ahead: below?.value !== undefined && below.value !== null && own !== null ? own - below.value : null
  };
};

export const leagueHasData = ({ scope, division, entries }: Pick<SocialLeague, 'division' | 'entries' | 'scope'>): boolean =>
  scope === 'division' ? division !== null : entries.length > 0;

export const leagueWeekNav = ({ weekStart, currentWeek, hasData }: LeagueWeekNavInput): LeagueWeekNav => {
  const isCurrent = currentWeek !== null && weekStart >= currentWeek;

  return {
    previous: hasData ? shiftDay({ day: weekStart, amount: -LEAGUE_VIEW.daysPerWeek }) : null,
    next: isCurrent ? null : shiftDay({ day: weekStart, amount: LEAGUE_VIEW.daysPerWeek }),
    isCurrent,
    isPast: currentWeek !== null && weekStart < currentWeek
  };
};
