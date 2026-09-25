import { describe, expect, it } from 'vitest';

import type { StreamerProfile } from '@/shared/api/streamers';

import { PROFILE_FORM, PROFILE_LINKS } from '../../../config';
import { toProfileFormValues, toProfileInput } from '../profile-form';
import { profileFormSchema } from '../profile-form.schemas';

const PROFILE: StreamerProfile = {
  slug: 'stalevar',
  displayName: 'Stalevar',
  accountId: 42,
  bio: 'Тяжи и отметки',
  links: { twitch: 'https://twitch.tv/stalevar' },
  isLive: false
};

describe('toProfileFormValues', () => {
  it('fills every link field so each input stays controlled', () => {
    expect(Object.keys(toProfileFormValues(PROFILE).links).sort()).toEqual([...PROFILE_LINKS].sort());
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
      links: PROFILE.links
    });
  });
});

describe('toProfileInput', () => {
  const empty = profileFormSchema.parse({ ...toProfileFormValues(null), slug: 'new-streamer', displayName: 'Новичок' });

  it('sends null rather than empty strings for bio, links and account', () => {
    const input = toProfileInput(empty);

    expect(input.bio).toBeNull();
    expect(input.links).toBeNull();
    expect(input.accountId).toBeNull();
  });

  it('drops only the links that were left blank', () => {
    const input = toProfileInput({ ...empty, links: { ...empty.links, vk: 'https://live.vkvideo.ru/x' } });

    expect(Object.keys(input.links ?? {})).toEqual(['vk']);
  });
});

describe('profileFormSchema', () => {
  it('refuses a link that is not http or https', () => {
    const values = { ...toProfileFormValues(PROFILE), links: { ...toProfileFormValues(PROFILE).links, twitch: 'javascript:alert(1)' } };

    expect(profileFormSchema.safeParse(values).success).toBe(false);
  });

  it('lower-cases the slug the way the server stores it', () => {
    expect(profileFormSchema.parse({ ...toProfileFormValues(PROFILE), slug: 'StalEvar' }).slug).toBe('stalevar');
  });
});
