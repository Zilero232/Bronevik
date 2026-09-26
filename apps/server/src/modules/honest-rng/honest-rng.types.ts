import type { z } from 'zod';

import type { honestRngMineSchema, honestRngSchema, rngLuckSchema, rngPeriodSchema, rngSummarySchema } from './dto';

export type RngPeriod = z.infer<typeof rngPeriodSchema>;

export type RngLuck = z.infer<typeof rngLuckSchema>;

export type RngSummary = z.infer<typeof rngSummarySchema>;

export type HonestRngView = z.infer<typeof honestRngSchema>;

export type HonestRngMine = z.infer<typeof honestRngMineSchema>;

export type RngMineInput = {
  userId: string;
  period: RngPeriod;
};
