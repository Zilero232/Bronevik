import type { overlayConfigSchema } from '@bronevik/schemas';
import type { z } from 'zod';

import type {
  activateChallengeSchema,
  connectableProviderSchema,
  createOverlaySchema,
  overlayDataSchema,
  streamerChallengeSchema,
  streamerIntegrationSchema,
  streamerProfileSchema,
  streamerProviderSchema,
  upsertStreamerProfileSchema
} from './streamers.schemas';

export type StreamerProfile = z.infer<typeof streamerProfileSchema>;
export type UpsertStreamerProfileInput = z.infer<typeof upsertStreamerProfileSchema>;
export type CreateOverlayInput = Omit<z.infer<typeof createOverlaySchema>, 'config'> & { config: z.input<typeof overlayConfigSchema> };
export type OverlayData = z.infer<typeof overlayDataSchema>;
export type StreamerChallenge = z.infer<typeof streamerChallengeSchema>;
export type ActivateChallengeInput = z.infer<typeof activateChallengeSchema> & { id: string };
export type StreamerProvider = z.infer<typeof streamerProviderSchema>;
export type ConnectableProvider = z.infer<typeof connectableProviderSchema>;
export type StreamerIntegration = z.infer<typeof streamerIntegrationSchema>;

export type UpdateOverlayInput = Partial<CreateOverlayInput> & {
  id: string;
};
