import { isAfter, isBefore } from 'date-fns';

import type { SeasonPhase, SeasonPhaseInput } from './season-phase.types';

export const seasonPhase = ({ season, now }: SeasonPhaseInput): SeasonPhase => {
  if (isBefore(now, season.startsAt)) {
    return 'upcoming';
  }

  if (season.endsAt !== null && isAfter(now, season.endsAt)) {
    return 'past';
  }

  return 'current';
};
