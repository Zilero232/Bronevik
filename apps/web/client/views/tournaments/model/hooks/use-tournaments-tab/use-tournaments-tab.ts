'use client';

import { parseAsBoolean, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';

import type { TournamentTab } from '../../../config';

import { TOURNAMENT_TABS } from '../../../config';

export const useTournamentsTab = () => {
  const [{ tab }, setParams] = useQueryStates(
    {
      tab: parseAsStringLiteral(TOURNAMENT_TABS).withDefault(TOURNAMENT_TABS[0]),
      status: parseAsString,
      mine: parseAsBoolean
    },
    { history: 'replace' }
  );

  return {
    tab,
    onTabChange: (next: TournamentTab) => void setParams({ tab: next === TOURNAMENT_TABS[0] ? null : next, status: null, mine: null })
  };
};
