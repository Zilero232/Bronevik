import type { z } from 'zod';

import type { appInfoSchema } from './app-info.schemas';

export type AppInfo = z.infer<typeof appInfoSchema>;
