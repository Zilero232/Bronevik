import type { z } from 'zod';

import type { replayPlayerSchema, replayStatusSchema, replaySummarySchema } from './replays.schemas';

export type ReplayStatus = z.infer<typeof replayStatusSchema>;
export type ReplayPlayer = z.infer<typeof replayPlayerSchema>;
export type ReplaySummary = z.infer<typeof replaySummarySchema>;
