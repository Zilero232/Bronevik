import type {
  ActivateChallengeInput as ActivateChallengeBody,
  RemovalRequestInput,
  StreamerPlatform,
  StartClaimInput,
  UpdateOverlayInput as UpdateOverlayBody
} from '@otmetki/schemas';

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
} from '@otmetki/schemas';

export type ActivateChallengeInput = ActivateChallengeBody & { id: string };

export type UpdateOverlayInput = UpdateOverlayBody & {
  id: string;
};

export type FollowStreamerRequest = {
  slug: string;
  tankId?: number | null;
};

export type StartClaimRequest = StartClaimInput & { slug: string };

export type RemovalRequest = RemovalRequestInput & { slug: string };

export type StreamerDirectoryFilters = {
  live?: 'true' | 'false';
  platform?: StreamerPlatform;
  tankId?: number;
  hasSettings?: 'true' | 'false';
  cursor?: number;
  limit?: number;
};
