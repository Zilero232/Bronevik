'use client';

import type { StreamerChannel } from '@otmetki/schemas';

import { STREAMER_PLATFORMS } from '@otmetki/schemas';
import { useFormContext } from 'react-hook-form';

import type { ProfileFormOutput, ProfileFormValues } from '../../../lib/profile-form';

import { PROFILE_FORM } from '../../../config';

export const useChannelsFields = (channels: readonly StreamerChannel[]) => {
  const {
    register,
    formState: { errors }
  } = useFormContext<ProfileFormValues, unknown, ProfileFormOutput>();

  const rows = STREAMER_PLATFORMS.map((platform) => {
    const error = errors.channels?.[platform];

    return {
      platform,
      field: register(`channels.${platform}`),
      error: error ? (error.message === PROFILE_FORM.hostIssue ? ('host' as const) : ('link' as const)) : null,
      isVerified: channels.some((channel) => channel.platform === platform && channel.verified)
    };
  });

  return { rows };
};
