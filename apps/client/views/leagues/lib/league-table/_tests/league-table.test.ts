import { LEAGUE_SCOPES, LEAGUE_TIERS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { LOCALES, messages } from '@/shared/i18n';

import type { LeagueEntry } from '../../../api';

import { leagueStanding, leagueWeekNav } from '../league-table';

const entry = (accountId: number, value: number | null, isMe = false): LeagueEntry => ({
  rank: accountId,
  accountId,
  nickname: `P${accountId}`,
  isMe,
  battles: 10,
  value,
  tier: null,
  zone: null
});

const TEN = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => entry(id, 1_000 - id * 10, id === 4));

describe('leagueStanding', () => {
  it('measures the gap to the places above and below', () => {
    expect(leagueStanding(TEN)).toMatchObject({ ranked: 10, behind: -10, ahead: 10, me: { accountId: 4 } });
  });

  it('has no gap above the leader', () => {
    expect(leagueStanding([entry(1, 500, true), entry(2, 400)])).toMatchObject({ behind: null, ahead: 100 });
  });

  it('skips tied places when measuring the gap', () => {
    expect(leagueStanding([entry(1, 500), entry(2, 300), entry(3, 300, true), entry(4, 100)])).toMatchObject({ behind: -200, ahead: 200 });
  });

  it('reports an unranked viewer without gaps', () => {
    expect(leagueStanding([entry(1, 500), entry(2, null, true)])).toMatchObject({ me: { accountId: 2 }, behind: null, ahead: null, ranked: 1 });
  });

  it('returns no standing when the viewer is missing', () => {
    expect(leagueStanding([])).toMatchObject({ me: null, status: null });
  });

  it('reports the server zone of the viewer, and a plain place without one', () => {
    expect(leagueStanding([{ ...entry(1, 500, true), zone: 'relegation' }]).status).toBe('relegation');
    expect(leagueStanding([entry(1, 500, true)]).status).toBe('ranked');
    expect(leagueStanding([{ ...entry(1, null, true), zone: 'relegation' }]).status).toBe('unranked');
  });
});

describe('leagueWeekNav', () => {
  it('moves one week back and forward', () => {
    expect(leagueWeekNav({ weekStart: '2026-09-14', currentWeek: '2026-09-21' })).toEqual({
      previous: '2026-09-07',
      next: '2026-09-21',
      isCurrent: false
    });
  });

  it('stops at the current week', () => {
    expect(leagueWeekNav({ weekStart: '2026-09-21', currentWeek: '2026-09-21' })).toMatchObject({ next: null, isCurrent: true });
  });

  it('allows no step forward before the clock is known', () => {
    expect(leagueWeekNav({ weekStart: '2026-09-21', currentWeek: null }).isCurrent).toBe(false);
  });
});

describe('league labels', () => {
  it('names every tier and scope the server can send, in every locale', () => {
    for (const locale of LOCALES) {
      const { tiers, scopes } = messages[locale].social.leagues;

      expect(Object.keys(tiers).sort()).toEqual([...LEAGUE_TIERS].sort());
      expect(Object.keys(scopes).sort()).toEqual([...LEAGUE_SCOPES].sort());
    }
  });
});
