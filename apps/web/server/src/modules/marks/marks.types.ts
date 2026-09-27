import type { MoeHistoryBatchQuery, MoeHistoryQuery, MoeProjection } from '@otmetki/schemas';
import type { z } from 'zod';

import type { modMoeThresholdsSchema } from './dto/marks.schemas';

export type ModMoeThresholds = z.infer<typeof modMoeThresholdsSchema>;

export type MoeHistoryInput = MoeHistoryQuery;

export type MoeHistoryBatchInput = MoeHistoryBatchQuery;

export type MoeProjectionInput = Omit<MoeProjection, 'battlesNeeded'>;

export type MoeProjectionResult = MoeProjection;
