import { z } from 'zod';

import { CHALLENGE_FORM } from '../../config';

export const activateFormSchema = z.object({
  donorName: z.string().trim().max(CHALLENGE_FORM.donorMax)
});

export const ACTIVATE_FORM_DEFAULTS: z.input<typeof activateFormSchema> = { donorName: '' };
