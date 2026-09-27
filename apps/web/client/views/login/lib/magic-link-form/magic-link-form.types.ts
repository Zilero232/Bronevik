import type { z } from 'zod';

import type { magicLinkFormSchema } from './magic-link-form';

export type MagicLinkFormValues = z.infer<typeof magicLinkFormSchema>;
