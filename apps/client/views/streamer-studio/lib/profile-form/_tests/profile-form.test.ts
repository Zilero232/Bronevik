import { STREAMER_PLATFORMS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { StreamerProfile } from '@/shared/api/streamers';

import { CHANNEL_HOSTS, PROFILE_FORM } from '../../../config';
import { isChannelHost, rejectedPlatform, toProfileFormValues, toProfileInput } from '../profile-form';
import { profileFormSchema } from '../profile-form.schemas';

const PROFILE: StreamerProfile = {
  slug: 'stalevar',
  displayName: 'Stalevar',
  kind: 'claimed',
  accountId: 42,
  accountSourceUrl: null,
  bio: 'Тяжи и отметки',
  channels: [{ platform: 'twitch', handle: 'stalevar', url: 'https://twitch.tv/stalevar', verified: true }],
  isLive: false,
  live: null,
  hasSettings: false,
  followers: 0,
  latestVideos: []
};

describe('toProfileFormValues', () => {
  it('fills a channel field for every platform so each input stays controlled', () => {
    expect(Object.keys(toProfileFormValues(PROFILE).channels).sort()).toEqual([...STREAMER_PLATFORMS].sort());
  });

  it('marks a profile without a linked account with the explicit no-account value', () => {
    expect(toProfileFormValues({ ...PROFILE, accountId: null }).accountId).toBe(PROFILE_FORM.noAccount);
    expect(toProfileFormValues(null).accountId).toBe(PROFILE_FORM.noAccount);
  });

  it('round-trips a saved profile back into the same request', () => {
    const input = toProfileInput(profileFormSchema.parse(toProfileFormValues(PROFILE)));

    expect(input).toEqual({
      slug: PROFILE.slug,
      displayName: PROFILE.displayName,
      bio: PROFILE.bio,
      accountId: PROFILE.accountId,
      channels: PROFILE.channels.map(({ platform, url }) => ({ platform, url }))
    });
  });
});

describe('toProfileInput', () => {
  const empty = profileFormSchema.parse({ ...toProfileFormValues(null), slug: 'new-streamer', displayName: 'Новичок' });

  it('sends null for bio and account and an empty channel list', () => {
    const input = toProfileInput(empty);

    expect(input.bio).toBeNull();
    expect(input.channels).toEqual([]);
    expect(input.accountId).toBeNull();
  });

  it('sends only the channels that were filled in', () => {
    const url = `https://${CHANNEL_HOSTS.vkVideoLive[0]}/x`;
    const input = toProfileInput({ ...empty, channels: { ...empty.channels, vkVideoLive: url } });

    expect(input.channels).toEqual([{ platform: 'vkVideoLive', url }]);
  });
});

describe('isChannelHost', () => {
  it('accepts every known host of a platform', () => {
    for (const platform of STREAMER_PLATFORMS) {
      for (const host of CHANNEL_HOSTS[platform]) {
        expect(isChannelHost({ platform, url: `https://${host}/someone` })).toBe(true);
      }
    }
  });

  it('refuses a host of another platform and a malformed url', () => {
    expect(isChannelHost({ platform: 'twitch', url: `https://${CHANNEL_HOSTS.youtube[0]}/@someone` })).toBe(false);
    expect(isChannelHost({ platform: 'twitch', url: 'not a url' })).toBe(false);
  });
});

describe('profileFormSchema', () => {
  const values = toProfileFormValues(PROFILE);

  it('refuses a channel that is not http or https', () => {
    expect(profileFormSchema.safeParse({ ...values, channels: { ...values.channels, twitch: 'javascript:alert(1)' } }).success).toBe(false);
  });

  it('flags a channel whose host belongs to another platform on that platform field', () => {
    const result = profileFormSchema.safeParse({ ...values, channels: { ...values.channels, twitch: `https://${CHANNEL_HOSTS.vk[0]}/x` } });

    expect(result.error?.issues.map((issue) => [issue.path.join('.'), issue.message])).toEqual([['channels.twitch', PROFILE_FORM.hostIssue]]);
  });

  it('lower-cases the slug the way the server stores it', () => {
    expect(profileFormSchema.parse({ ...values, slug: 'StalEvar' }).slug).toBe('stalevar');
  });
});

describe('rejectedPlatform', () => {
  it('names the platform of a channel the server refused', () => {
    expect(rejectedPlatform({ error: 'Not a vkVideoLive channel url: https://x.y', code: PROFILE_FORM.invalidCode })).toBe('vkVideoLive');
  });

  it('ignores other errors', () => {
    expect(rejectedPlatform({ error: 'Not a twitch channel url', code: 'CONFLICT' })).toBeNull();
    expect(rejectedPlatform('boom')).toBeNull();
  });
});
