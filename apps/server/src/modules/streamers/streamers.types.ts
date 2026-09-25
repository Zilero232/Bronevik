import type { CreateChallengeInput } from '@bronevik/schemas';
import type { DonationAlertsDonationEvent, EventsListener } from '@donation-alerts/events';
import type { ChatClient } from '@twurple/chat';
import type { z } from 'zod';

import type { Challenge, StreamerProvider } from '../../../generated';
import type { CHAT_COPY } from './config';
import type {
  createOverlaySchema,
  overlayDataSchema,
  streamerChallengeSchema,
  streamerIntegrationSchema,
  streamerProfileSchema,
  updateOverlaySchema,
  upsertProfileSchema
} from './dto/streamers.schemas';
import type { ChallengeVerdict, ChatCommand } from './lib';

export type StreamerProfileView = z.infer<typeof streamerProfileSchema>;
export type UpsertProfileInput = z.infer<typeof upsertProfileSchema> & { userId: string };
export type CreateOverlayInput = z.infer<typeof createOverlaySchema> & { userId: string };
export type UpdateOverlayInput = z.infer<typeof updateOverlaySchema> & { userId: string; id: string };
export type OverlayData = z.infer<typeof overlayDataSchema>;
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

type ChatCopy = (typeof CHAT_COPY)[keyof typeof CHAT_COPY];

export type ChatReplyInput = {
  streamerUserId: string;
  command: ChatCommand;
};

export type ChatTextInput = {
  streamerUserId: string;
  pick: (copy: ChatCopy) => string;
  values: Record<string, number | string>;
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
