import type { z } from 'zod';

import type { platoonFormSchema } from './platoon-form.schemas';

export type PlatoonFormValues = z.input<typeof platoonFormSchema>;

export type PlatoonFormOutput = z.output<typeof platoonFormSchema>;
