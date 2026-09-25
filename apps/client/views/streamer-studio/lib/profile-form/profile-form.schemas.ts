import { z } from 'zod';

import { STREAMER_PROFILE, upsertStreamerProfileSchema } from '@/shared/api/streamers';

import { PROFILE_FORM } from '../../config';

const linkField = z.union([z.literal(''), z.url({ protocol: PROFILE_FORM.linkProtocol })]);

export const profileFormSchema = z.object({
  slug: upsertStreamerProfileSchema.shape.slug,
  displayName: upsertStreamerProfileSchema.shape.displayName,
  bio: z.string().trim().max(STREAMER_PROFILE.bioMaxLength),
  accountId: z.string(),
  links: z.object({
    twitch: linkField,
    vk: linkField,
    youtube: linkField,
    telegram: linkField,
    boosty: linkField
  })
});
