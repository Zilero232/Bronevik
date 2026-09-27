import type {
  ActivateChallengeInput as ActivateChallengeBody,
  FollowStreamerInput as FollowStreamerBody,
  RemovalRequestInput as RemovalRequestBody,
  StartClaimInput as StartClaimBody,
  UpdateOverlayInput as UpdateOverlayBody
} from '@otmetki/schemas';

import type { StreamersControllerListData } from '@/shared/api/generated';

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

export type FollowStreamerInput = FollowStreamerBody & { slug: string };

export type StartClaimInput = StartClaimBody & { slug: string };

export type RemovalRequestInput = RemovalRequestBody & { slug: string };

export type StreamerDirectoryInput = NonNullable<StreamersControllerListData['query']>;
