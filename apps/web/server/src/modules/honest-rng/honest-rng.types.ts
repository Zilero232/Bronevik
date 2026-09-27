import type { z } from 'zod';

import type { honestRngMineSchema, honestRngSchema, rngLuckSchema, rngPeriodSchema, rngSummarySchema } from './dto';
import type { RngWatermark, RollTally } from './lib';

export type RngPeriod = z.infer<typeof rngPeriodSchema>;

export type RngLuck = z.infer<typeof rngLuckSchema>;

export type RngSummary = z.infer<typeof rngSummarySchema>;

export type HonestRngView = z.infer<typeof honestRngSchema>;

export type HonestRngMine = z.infer<typeof honestRngMineSchema>;

export type RngMineInput = {
  userId: string;
  period: RngPeriod;
};

export type DayTally = {
  day: Date;
  scope: string;
  tally: RollTally;
};

export type StoreDailyInput = {
  tallies: DayTally[];
  watermark: RngWatermark;
};
