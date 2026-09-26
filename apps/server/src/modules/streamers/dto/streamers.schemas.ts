import { overlayPublicIdSchema, streamerSlugSchema, uuidSchema } from '@otmetki/schemas';
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
  .pipe(z.object({ provider: z.enum(StreamerProvider), userId: z.string().min(1) }));
