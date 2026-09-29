import type * as z from 'zod/mini';

import type { consumablesSchema, reloadTimerSchema } from './consumables.schemas';

export type ConsumablesData = z.infer<typeof consumablesSchema>;
export type ReloadTimerData = z.infer<typeof reloadTimerSchema>;
