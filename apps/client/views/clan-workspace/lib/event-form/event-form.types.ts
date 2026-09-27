import type { z } from 'zod';

import type { eventFormFieldsSchema } from './event-form.schemas';

export type EventFormValues = z.input<typeof eventFormFieldsSchema>;

export type EventFormFields = z.output<typeof eventFormFieldsSchema>;
