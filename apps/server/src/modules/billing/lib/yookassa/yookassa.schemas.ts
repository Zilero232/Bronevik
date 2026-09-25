import { z } from 'zod';

const yookassaPaymentStatusSchema = z.enum(['pending', 'waiting_for_capture', 'succeeded', 'canceled']);

export const yookassaPaymentSchema = z.object({
  id: z.string().min(1),
  status: yookassaPaymentStatusSchema,
  paid: z.boolean().optional(),
  amount: z.object({ value: z.string(), currency: z.string() }),
  confirmation: z.object({ confirmation_url: z.string().optional() }).optional(),
  payment_method: z
    .object({
      id: z.string(),
      saved: z.boolean().optional(),
      title: z.string().optional(),
      card: z.object({ last4: z.string().optional(), card_type: z.string().optional() }).optional()
    })
    .optional(),
  metadata: z.record(z.string(), z.string()).optional()
});

export const yookassaWebhookSchema = z.object({
  type: z.literal('notification'),
  event: z.string().min(1),
  object: z.looseObject({ id: z.string().min(1), payment_id: z.string().optional() })
});
