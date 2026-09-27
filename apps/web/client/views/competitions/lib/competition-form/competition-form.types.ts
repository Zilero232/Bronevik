import type { z } from 'zod';

import type { competitionFormFieldsSchema, competitionFormSchema } from './competition-form.schemas';

export type CompetitionFormValues = z.input<typeof competitionFormFieldsSchema>;

export type CompetitionFormOutput = z.output<typeof competitionFormSchema>;
