'use client';

import { useFormatter } from 'next-intl';

import type { Tournament } from '@/entities/tournament/tournament';

import { TOURNAMENT_PAGE } from '../../../config';
import { championOf } from '../../../lib/bracket-columns';

export const useTournamentSummary = (tournament: Tournament) => {
  const format = useFormatter();

  return {
    startsAt: format.dateTime(new Date(tournament.startsAt), TOURNAMENT_PAGE.dateFormat),
    registrationEndsAt: tournament.registrationEndsAt ? format.dateTime(new Date(tournament.registrationEndsAt), TOURNAMENT_PAGE.dateFormat) : null,
    champion: tournament.bracket ? championOf({ bracket: tournament.bracket, participants: tournament.participants }) : null
  };
};
