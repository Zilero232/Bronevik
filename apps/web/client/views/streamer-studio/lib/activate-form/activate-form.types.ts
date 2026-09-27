import type { z } from 'zod';

import type { activateFormSchema } from './activate-form.schemas';

export type ActivateFormValues = z.input<typeof activateFormSchema>;

export type ActivateFormOutput = z.output<typeof activateFormSchema>;
