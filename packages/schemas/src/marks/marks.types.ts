import type { z } from 'zod';

import type {
  masteryThresholdSchema,
  moeHistoryBatchQuerySchema,
  moeHistoryBatchSchema,
  moeHistoryFiltersSchema,
  moeHistoryPointSchema,
  moeHistoryQuerySchema,
  moeHistorySchema,
  moePageSchema,
  moeProjectionSchema,
  moeQuerySchema,
  moeRowSchema,
  moeSortFieldSchema,
  moeThresholdSchema,
  sweatIndexSchema,
  sweatLevelSchema,
  thresholdSourceSchema,
  thresholdTrendSchema
} from './marks.schemas';

export type ThresholdSource = z.infer<typeof thresholdSourceSchema>;
export type MoeThreshold = z.infer<typeof moeThresholdSchema>;
export type MasteryThreshold = z.infer<typeof masteryThresholdSchema>;
export type ThresholdTrend = z.infer<typeof thresholdTrendSchema>;
export type MoeRow = z.infer<typeof moeRowSchema>;
export type MoeSortField = z.infer<typeof moeSortFieldSchema>;
export type MoeQuery = z.infer<typeof moeQuerySchema>;
export type MoePage = z.infer<typeof moePageSchema>;
export type MoeHistory = z.infer<typeof moeHistorySchema>;
export type MoeHistoryFilters = z.infer<typeof moeHistoryFiltersSchema>;
export type MoeHistoryQuery = z.infer<typeof moeHistoryQuerySchema>;
export type MoeHistoryBatchQuery = z.infer<typeof moeHistoryBatchQuerySchema>;
export type MoeHistoryPoint = z.infer<typeof moeHistoryPointSchema>;
export type MoeHistoryBatch = z.infer<typeof moeHistoryBatchSchema>;
export type MoeProjection = z.infer<typeof moeProjectionSchema>;
export type SweatLevel = z.infer<typeof sweatLevelSchema>;
export type SweatIndex = z.infer<typeof sweatIndexSchema>;
