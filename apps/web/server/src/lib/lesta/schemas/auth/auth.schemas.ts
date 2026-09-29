import { z } from 'zod';

export const prolongateSchema = z.looseObject({
  access_token: z.string(),
  account_id: z.number(),
  expires_at: z.number()
});

export const loginLocationSchema = z.looseObject({ location: z.string() });

export const loginCallbackSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('ok'),
    access_token: z.string(),
    account_id: z.coerce.number(),
    nickname: z.string(),
    expires_at: z.coerce.number()
  }),
  z.object({
    status: z.literal('error'),
    code: z.string().default('UNKNOWN'),
    message: z.string().default('')
  })
]);
