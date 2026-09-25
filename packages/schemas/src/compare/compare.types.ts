import type { z } from 'zod';

import type { playerComparisonQuerySchema, playerComparisonSchema, tankComparisonQuerySchema, tankComparisonSchema } from './compare.schemas';

export type PlayerComparisonQuery = z.infer<typeof playerComparisonQuerySchema>;
export type PlayerComparison = z.infer<typeof playerComparisonSchema>;
export type TankComparisonQuery = z.infer<typeof tankComparisonQuerySchema>;
export type TankComparison = z.infer<typeof tankComparisonSchema>;
