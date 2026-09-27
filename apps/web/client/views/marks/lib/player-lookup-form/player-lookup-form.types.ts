import type { z } from 'zod';

import type { playerLookupFormSchema } from './player-lookup-form.schemas';

export type PlayerLookupFormValues = z.infer<typeof playerLookupFormSchema>;
