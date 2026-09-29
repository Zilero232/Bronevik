import type { Bracket } from '../bracket';

import { TOURNAMENT } from '../../config';
import { bracketSchema, tournamentRulesSchema } from '../../dto/tournaments.schemas';

export const storedBracket = (value: unknown): Bracket | null => {
  const parsed = bracketSchema.safeParse(value);

  return parsed.success ? parsed.data : null;
};

export const storedCapacity = (rules: unknown): number => {
  const parsed = tournamentRulesSchema.safeParse(rules);

  return parsed.success ? parsed.data.maxParticipants : TOURNAMENT.maxParticipants;
};
