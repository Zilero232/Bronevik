import type * as z from 'zod/mini';

import type { hitLogSchema } from './hit-log.schemas';

export type HitLogData = z.infer<typeof hitLogSchema>;
export type HitLogRow = HitLogData['rows'][number];
