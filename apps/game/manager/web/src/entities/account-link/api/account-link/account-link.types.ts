import type { z } from 'zod';

import type { accountBindingSchema, accountLinkSchema } from './account-link.schemas';

export type AccountBinding = z.infer<typeof accountBindingSchema>;

export type AccountLink = z.infer<typeof accountLinkSchema>;
