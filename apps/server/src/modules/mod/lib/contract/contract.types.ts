import type { z } from 'zod';

import type { battleResultEventSchema, bindResponseSchema, ingestBatchSchema, ingestEventSchema, ingestResponseSchema } from './contract.schemas';

export type BindResponse = z.infer<typeof bindResponseSchema>;
export type IngestBatch = z.infer<typeof ingestBatchSchema>;
export type IngestEvent = z.infer<typeof ingestEventSchema>;
export type BattleResultEvent = z.infer<typeof battleResultEventSchema>;
export type IngestResponse = z.infer<typeof ingestResponseSchema>;
