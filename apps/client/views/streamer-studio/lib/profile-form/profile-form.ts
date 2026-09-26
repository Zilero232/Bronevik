import type { StreamerPlatform } from '@otmetki/schemas';

import { apiErrorSchema, CHANNEL_HOSTS, STREAMER_PLATFORMS } from '@otmetki/schemas';
import { fromKeys } from 'remeda';

import type { StreamerProfile, UpsertStreamerProfileInput } from '@/entities/streamer/streamer';

import type { ChannelHostInput, ProfileFormOutput, ProfileFormValues } from './profile-form.types';

import { PROFILE_FORM } from '../../config';

export const isChannelHost = ({ platform, url }: ChannelHostInput): boolean => {
  if (!URL.canParse(url)) {
    return false;
  }

  const hosts: readonly string[] = CHANNEL_HOSTS[platform];

  return hosts.includes(new URL(url).hostname.toLowerCase());
};

export const toProfileFormValues = (profile: StreamerProfile | null): ProfileFormValues => ({
  slug: profile?.slug ?? '',
  displayName: profile?.displayName ?? '',
  bio: profile?.bio ?? '',
  accountId: profile?.accountId === null || profile?.accountId === undefined ? PROFILE_FORM.noAccount : String(profile.accountId),
  channels: fromKeys(STREAMER_PLATFORMS, (platform) => profile?.channels.find((channel) => channel.platform === platform)?.url ?? '')
});

export const toProfileInput = ({ slug, displayName, bio, accountId, channels }: ProfileFormOutput): UpsertStreamerProfileInput => ({
  slug,
  displayName,
  bio: bio === '' ? null : bio,
  accountId: accountId === PROFILE_FORM.noAccount ? null : Number(accountId),
  channels: STREAMER_PLATFORMS.flatMap((platform) => (channels[platform] === '' ? [] : [{ platform, url: channels[platform] }]))
});

export const rejectedPlatform = (body: unknown): StreamerPlatform | null => {
  const parsed = apiErrorSchema.safeParse(body);

  if (!parsed.success || parsed.data.code !== PROFILE_FORM.invalidCode) {
    return null;
  }

  return STREAMER_PLATFORMS.find((platform) => parsed.data.error.includes(` ${platform} `)) ?? null;
};
