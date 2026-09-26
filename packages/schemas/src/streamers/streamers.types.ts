import type { z } from 'zod';

import type {
  activateChallengeSchema,
  challengeConditionSchema,
  challengeMetricSchema,
  challengeSchema,
  challengeStatusSchema,
  connectableProviderSchema,
  createChallengeSchema,
  createOverlaySchema,
  overlayConfigSchema,
  overlayDataSchema,
  overlayKindSchema,
  overlayMetricSchema,
  overlayResultSchema,
  overlaySchema,
  previewOverlaySchema,
  streamerChallengeSchema,
  streamerIntegrationSchema,
  streamerProfileSchema,
  streamerProviderSchema,
  updateOverlaySchema,
  upsertStreamerProfileSchema
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
export type StreamerProfile = z.infer<typeof streamerProfileSchema>;
export type UpsertStreamerProfileInput = z.infer<typeof upsertStreamerProfileSchema>;
export type CreateOverlayInput = z.input<typeof createOverlaySchema>;
export type UpdateOverlayInput = z.input<typeof updateOverlaySchema>;
export type PreviewOverlayInput = z.input<typeof previewOverlaySchema>;
export type OverlayResult = z.infer<typeof overlayResultSchema>;
export type OverlayData = z.infer<typeof overlayDataSchema>;
export type StreamerChallenge = z.infer<typeof streamerChallengeSchema>;
export type ActivateChallengeInput = z.infer<typeof activateChallengeSchema>;
export type StreamerProvider = z.infer<typeof streamerProviderSchema>;
export type ConnectableProvider = z.infer<typeof connectableProviderSchema>;
export type StreamerIntegration = z.infer<typeof streamerIntegrationSchema>;
