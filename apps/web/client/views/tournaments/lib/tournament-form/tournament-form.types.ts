import type { z } from 'zod';

import type { tournamentFormSchema } from './tournament-form.schemas';

export type TournamentFormValues = z.input<typeof tournamentFormSchema>;

export type TournamentFormOutput = z.output<typeof tournamentFormSchema>;
