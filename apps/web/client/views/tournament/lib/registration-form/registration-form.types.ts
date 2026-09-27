import type { z } from 'zod';

import type { registrationFormSchema } from './registration-form.schemas';

export type RegistrationFormValues = z.input<typeof registrationFormSchema>;

export type RegistrationFormOutput = z.output<typeof registrationFormSchema>;
