import { isEmpty, pickBy } from 'remeda';

import type { StreamerProfile, UpsertStreamerProfileInput } from '@/shared/api/streamers';

import type { ProfileFormOutput, ProfileFormValues } from './profile-form.types';

import { PROFILE_FORM } from '../../config';

export const toProfileFormValues = (profile: StreamerProfile | null): ProfileFormValues => ({
  slug: profile?.slug ?? '',
  displayName: profile?.displayName ?? '',
  bio: profile?.bio ?? '',
  accountId: profile?.accountId === null || profile?.accountId === undefined ? PROFILE_FORM.noAccount : String(profile.accountId),
  links: {
    twitch: profile?.links?.twitch ?? '',
    vk: profile?.links?.vk ?? '',
    youtube: profile?.links?.youtube ?? '',
    telegram: profile?.links?.telegram ?? '',
    boosty: profile?.links?.boosty ?? ''
  }
});

export const toProfileInput = ({ slug, displayName, bio, accountId, links }: ProfileFormOutput): UpsertStreamerProfileInput => {
  const filled = pickBy(links, (url) => url !== '');

  return {
    slug,
    displayName,
    bio: bio === '' ? null : bio,
    accountId: accountId === PROFILE_FORM.noAccount ? null : Number(accountId),
    links: isEmpty(filled) ? null : filled
  };
};
