import type { DonationAlertsDonationEvent, EventsListener } from '@donation-alerts/events';
import type { RawBodyRequest } from '@nestjs/common';
import type {
  CreateApplyRequestInput,
  CreateChallengeInput,
  createOverlaySchema,
  ModSettingsExport,
  OverlayConfig,
  overlayDataSchema,
  OverlayKind,
  previewOverlaySchema,
  SettingsGroupKey,
  SettingsSource,
  SettingsValues,
  streamerChallengeSchema,
  streamerDirectoryQuerySchema,
  streamerIntegrationSchema,
  streamerProfileSchema,
  updateOverlaySchema,
  upsertStreamerProfileSchema
} from '@otmetki/schemas';
import type { ChatClient } from '@twurple/chat';
import type { Request } from 'express';
import type { z, ZodType } from 'zod';

import type {
  Challenge,
  Overlay,
  StreamerChannel,
  StreamerClaim as StreamerClaimRow,
  StreamerInvitation,
  StreamerPlatform,
  StreamerProfile,
  StreamerProvider
} from '../../../generated';
import type { AuthenticatedDevice } from '../mod';
import type { ChallengeVerdict, ChatCommand, ChatMessage, ChatValues, LiveStream } from './lib';

export type StreamerProfileView = z.infer<typeof streamerProfileSchema>;
export type UpsertProfileInput = z.infer<typeof upsertStreamerProfileSchema> & { userId: string };
export type CreateOverlayInput = z.infer<typeof createOverlaySchema> & { userId: string };
export type UpdateOverlayInput = z.infer<typeof updateOverlaySchema> & { userId: string; id: string };
export type OverlayData = z.infer<typeof overlayDataSchema>;
export type PreviewOverlayRequest = z.infer<typeof previewOverlaySchema> & { userId: string };
export type StreamerChallengeView = z.infer<typeof streamerChallengeSchema>;
export type StreamerIntegrationView = z.infer<typeof streamerIntegrationSchema>;

export type OwnedInput = {
  userId: string;
  id: string;
};

export type CreateStreamerChallengeInput = CreateChallengeInput & {
  userId: string;
};

export type ActivateChallengeInput = {
  challengeId: string;
  donorName: string | null;
  donorMessage: string | null;
  source: StreamerProvider | null;
  externalId: string | null;
  now: Date;
};

export type DonationInput = {
  streamerUserId: string;
  externalId: string;
  donorName: string;
  message: string;
  amount: number;
  currency: string;
};

export type ResolveChallengeInput = {
  challenge: Challenge;
  verdict: ChallengeVerdict;
  now: Date;
};

export type ChallengeAnnouncement = {
  streamerUserId: string;
  text: string;
};

export type ChatAnnouncer = {
  readonly provider: StreamerProvider;
  announce: (input: ChallengeAnnouncement) => Promise<void>;
};

export type OAuthStateInput = {
  provider: StreamerProvider;
  userId: string;
};

type OAuthCallbackInput = {
  code: string;
  state: string;
};

export type ProviderCallbackInput = OAuthCallbackInput & {
  provider: StreamerProvider;
};

export type OAuthCodeInput = {
  userId: string;
  code: string;
};

export type SaveIntegrationInput = {
  userId: string;
  provider: StreamerProvider;
  externalId: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
  scope: string | null;
  config: Record<string, string> | null;
};

type StoredToken = {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
};

export type StoreTokenInput = StoredToken & {
  provider: StreamerProvider;
  externalId: string;
};

export type BuildOverlayDataInput = {
  userId: string;
  accountId: bigint | null;
  kind: OverlayKind;
  name: string;
  config: OverlayConfig;
};

export type OverlayMoeInput = {
  accountId: bigint;
  tankId: number;
};

export type AssertAccountInput = {
  userId: string;
  accountId: number | undefined;
};

export type ActivateByStreamerInput = OwnedInput & {
  donorName: string | null;
};

export type ChatReplyInput = {
  streamerUserId: string;
  command: ChatCommand;
};

export type ChatTextInput = {
  streamerUserId: string;
  message: ChatMessage;
  values: ChatValues;
};

export type TwitchConnection = {
  client: ChatClient;
  login: string;
  externalId: string;
};

export type ChatMessageInput = {
  userId: string;
  client: ChatClient;
  channel: string;
  text: string;
};

export type DonationConnection = {
  userId: string;
  listener: EventsListener;
};

export type DonationEventInput = {
  streamerUserId: string;
  donation: DonationAlertsDonationEvent;
};

export type EvaluateInput = {
  challenge: Challenge;
  now: Date;
};

export type OverlayViewInput = {
  overlay: Overlay;
  isPaused: boolean;
};

export type CachedToken = {
  value: string;
  expiresAt: number;
};

export type PlatformVideo = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
};

export type ProfileWithChannels = StreamerProfile & {
  channels: StreamerChannel[];
  settings: { profileId: string } | null;
};

export type ChannelInput = {
  platform: StreamerPlatform;
  url: string;
  sourceUrl?: string;
};

export type ReplaceChannelsInput = {
  profileId: string;
  channels: readonly ChannelInput[];
};

export type StartClaimRequest = {
  userId: string;
  slug: string;
  method: 'bio_code' | 'manual' | 'oauth';
  platform?: StreamerPlatform;
  evidence?: string;
};

export type ClaimRef = SlugOwnerInput;

export type ResolveClaimRequest = {
  id: string;
  approve: boolean;
  moderatorId: string;
};

export type RemovalRequestInput = {
  slug: string;
  contact: string;
  reason?: string;
};

export type SaveSettingsRequest = {
  profileId: string;
  userId: string | null;
  source: SettingsSource;
  values: SettingsValues;
  sourceUrls?: Partial<Record<SettingsGroupKey, string>>;
};

export type ApplyRequestInput = CreateApplyRequestInput & { userId: string };

export type ModExportInput = {
  device: AuthenticatedDevice;
  body: ModSettingsExport;
};

export type ModApplyResultInput = {
  device: AuthenticatedDevice;
  id: string;
  status: 'applied' | 'rejected';
};

export type FollowInput = {
  userId: string;
  slug: string;
  tankId?: number | null;
};

export type SafePollInput = {
  platform: string;
  run: () => Promise<LiveStream[]>;
};

export type SlugOwnerInput = {
  userId: string;
  slug: string;
};

export type CompleteClaimInput = {
  claim: StreamerClaimRow;
  verifiedPlatform: StreamerPlatform | null;
  moderatorId: string | null;
};

export type EditorialInput = {
  slug: string;
  displayName: string;
  channels: readonly ChannelInput[];
};

export type StreamerDirectoryQueryView = z.infer<typeof streamerDirectoryQuerySchema>;

export type SaveMySettingsInput = Omit<SaveSettingsRequest, 'profileId' | 'userId'> & { userId: string };

export type SetAnonymousInput = {
  userId: string;
  anonymousStats: boolean;
};

export type ApplyViewInput = {
  id: string;
  slug: string;
  groups: string[];
  status: string;
  createdAt: Date;
  appliedAt: Date | null;
};

export type ClaimTarget = { profile: null; invitation: StreamerInvitation } | { profile: StreamerProfile; invitation: null };

export type SignedModInput<T> = {
  request: RawBodyRequest<Request>;
  deviceId: string | undefined;
  signature: string | undefined;
  schema: ZodType<T>;
};

export type SignedModResult<T> = {
  device: AuthenticatedDevice;
  body: T;
};
