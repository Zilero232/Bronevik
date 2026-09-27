import {
  applyRequestSchema,
  overlayPublicIdSchema,
  settingsShareSchema,
  streamerChannelInputSchema,
  streamerClaimSchema,
  streamerSlugSchema,
  uuidSchema
} from '@otmetki/schemas';
import { z } from 'zod';

import { StreamerProvider } from '../../../../generated';

export const slugParamsSchema = z.object({
  slug: streamerSlugSchema
});

export const idParamsSchema = z.object({
  id: uuidSchema
});

export const overlayParamsSchema = z.object({
  publicId: overlayPublicIdSchema
});

export const connectProviderSchema = z.object({
  provider: z.enum(['donation-alerts', 'twitch'])
});

export const oauthCallbackSchema = z.object({
  code: z.string().min(1).max(2048),
  state: z.string().min(1).max(256)
});

export const oauthStateSchema = z
  .string()
  .transform((raw, context) => {
    try {
      const value: unknown = JSON.parse(raw);

      return value;
    } catch {
      context.addIssue({ code: 'custom', message: 'The OAuth state is not JSON' });

      return z.NEVER;
    }
  })
  .pipe(z.object({ provider: z.enum(StreamerProvider), userId: z.string().min(1), binding: z.string().min(1) }));

export const claimStatusResponseSchema = z.object({ claim: streamerClaimSchema.nullable() });

export const applyListSchema = z.array(applyRequestSchema);

export const settingsShareResponseSchema = z.object({ share: settingsShareSchema.nullable() });

export const invitationChannelsSchema = z.array(streamerChannelInputSchema).catch([]);

export const twitchStreamsSchema = z.object({
  data: z.array(z.object({ user_login: z.string(), viewer_count: z.number().int().nullable().catch(null) }))
});

export const twitchUsersSchema = z.object({ data: z.array(z.object({ login: z.string(), description: z.string().catch('') })) });

export const vkTokenSchema = z.object({ access_token: z.string(), expires_in: z.number().catch(3600) });

export const vkChannelsSchema = z.object({
  data: z
    .object({
      channels: z.array(
        z.object({
          channel: z.object({ url: z.string().catch(''), nick: z.string().catch(''), description: z.string().catch('') }).partial(),
          stream: z
            .object({
              status: z.string().catch(''),
              counters: z
                .object({ viewers: z.number().int().catch(0) })
                .partial()
                .catch({})
            })
            .partial()
            .nullish()
        })
      )
    })
    .catch({ channels: [] })
});

export const youtubeLiveSchema = z.object({ items: z.array(z.object({ id: z.object({ videoId: z.string() }) })).catch([]) });

export const youtubeChannelSchema = z.object({ items: z.array(z.object({ snippet: z.object({ description: z.string().catch('') }) })).catch([]) });
