import type * as z from 'zod/mini';

import type { damageLogSchema, lastHitSchema } from './damage-log.schemas';

export type DamageLogData = z.infer<typeof damageLogSchema>;
export type DamageLogRow = DamageLogData['rows'][number];
export type LastHitData = z.infer<typeof lastHitSchema>;
