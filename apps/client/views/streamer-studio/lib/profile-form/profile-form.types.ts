import type { z } from 'zod';

import type { profileFormSchema } from './profile-form.schemas';

export type ProfileFormValues = z.input<typeof profileFormSchema>;

export type ProfileFormOutput = z.output<typeof profileFormSchema>;
