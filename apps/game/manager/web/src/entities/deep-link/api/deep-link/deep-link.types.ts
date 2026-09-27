import type { z } from 'zod';

import type { deepLinkSchema } from './deep-link.schemas';

export type DeepLink = z.infer<typeof deepLinkSchema>;
