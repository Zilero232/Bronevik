import type { ActivateChallengeInput as ActivateChallengeBody, UpdateOverlayInput as UpdateOverlayBody } from '@bronevik/schemas';

export type {
  ConnectableProvider,
  CreateOverlayInput,
  OverlayData,
  PreviewOverlayInput,
  StreamerChallenge,
  StreamerIntegration,
  StreamerProfile,
  StreamerProvider,
  UpsertStreamerProfileInput
} from '@bronevik/schemas';

export type ActivateChallengeInput = ActivateChallengeBody & { id: string };

export type UpdateOverlayInput = UpdateOverlayBody & {
  id: string;
};
