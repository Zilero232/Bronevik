import type { CreateTournament } from '@/shared/api/tournaments';

import { toStatRequirements } from '@/features/community/stat-requirements';

import type { TournamentFormOutput } from './tournament-form.types';

export const toCreateTournament = (values: TournamentFormOutput): CreateTournament => {
  const description = values.description.trim();

  return {
    title: values.title.trim(),
    ...(description === '' ? {} : { description }),
    requirements: toStatRequirements(values.requirements),
    maxParticipants: Number(values.maxParticipants),
    ...(values.registrationEndsAt === '' ? {} : { registrationEndsAt: new Date(values.registrationEndsAt).toISOString() }),
    startsAt: new Date(values.startsAt).toISOString()
  };
};
