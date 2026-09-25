import type { z } from 'zod';

import type {
  challengeConditionSchema,
  challengeMetricSchema,
  challengeSchema,
  challengeStatusSchema,
  createChallengeSchema,
  overlayConfigSchema,
  overlayKindSchema,
  overlayMetricSchema,
  overlaySchema
} from './streamers.schemas';

export type OverlayKind = z.infer<typeof overlayKindSchema>;
export type OverlayMetric = z.infer<typeof overlayMetricSchema>;
export type OverlayConfig = z.infer<typeof overlayConfigSchema>;
export type Overlay = z.infer<typeof overlaySchema>;
export type ChallengeMetric = z.infer<typeof challengeMetricSchema>;
export type ChallengeCondition = z.infer<typeof challengeConditionSchema>;
export type ChallengeStatus = z.infer<typeof challengeStatusSchema>;
export type Challenge = z.infer<typeof challengeSchema>;
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>;
