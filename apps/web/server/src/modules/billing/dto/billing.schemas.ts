import { z } from 'zod';

import { yookassaWebhookSchema } from '../lib';

export const webhookAckSchema = z.object({
  received: z.literal(true)
});

export const webhookEventSchema = yookassaWebhookSchema;
