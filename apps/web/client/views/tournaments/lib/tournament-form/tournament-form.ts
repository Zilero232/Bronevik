import type { CreateTournament } from '@/entities/tournament/tournament';

import { toStatRequirements } from '@/features/community/stat-requirements';
import { zonedInputToIso } from '@/shared/lib';

import type { TournamentFormOutput } from './tournament-form.types';

export const toCreateTournament = (values: TournamentFormOutput): CreateTournament => {
  const description = values.description.trim();
  const registrationEndsAt = zonedInputToIso({ value: values.registrationEndsAt });

  return {
    title: values.title.trim(),
    ...(description === '' ? {} : { description }),
    requirements: toStatRequirements(values.requirements),
    maxParticipants: Number(values.maxParticipants),
    ...(registrationEndsAt ? { registrationEndsAt } : {}),
    startsAt: zonedInputToIso({ value: values.startsAt }) ?? ''
  };
};
