import type * as z from 'zod/mini';

import type { reloadTimerSchema } from './reload-timer.schemas';

export type ReloadTimerData = z.infer<typeof reloadTimerSchema>;
