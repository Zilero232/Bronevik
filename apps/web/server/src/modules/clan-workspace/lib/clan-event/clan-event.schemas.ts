import { z } from 'zod';

export const eventDataSchema = z.object({ attendanceSyncedAt: z.string().optional() }).catch({});
