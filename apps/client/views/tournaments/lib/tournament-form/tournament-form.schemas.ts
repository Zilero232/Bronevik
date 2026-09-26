import { isFuture, isValid } from 'date-fns';
import { z } from 'zod';

import { requirementsFormSchema } from '@/features/community/stat-requirements';
import { zCreateTournament } from '@/shared/api/tournaments';

const localDate = z.string().refine((value) => value === '' || isValid(new Date(value)));

export const tournamentFormSchema = z
  .object({
    title: zCreateTournament.shape.title,
    description: zCreateTournament.shape.description.unwrap(),
    requirements: requirementsFormSchema,
    maxParticipants: z
      .string()
      .trim()
      .refine((value) => zCreateTournament.shape.maxParticipants.safeParse(Number(value)).success && value !== ''),
    registrationEndsAt: localDate,
    startsAt: localDate.refine((value) => value !== '' && isFuture(new Date(value)))
  })
  .refine(({ registrationEndsAt, startsAt }) => registrationEndsAt === '' || new Date(registrationEndsAt) <= new Date(startsAt), {
    path: ['registrationEndsAt']
  });
