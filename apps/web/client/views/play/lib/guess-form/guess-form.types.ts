import type { z } from 'zod';

import type { guessFormSchema } from './guess-form.schemas';

export type GuessFormValues = z.infer<typeof guessFormSchema>;
