import {
  billingStatusSchema,
  checkoutResultSchema,
  checkoutSchema,
  paymentHistorySchema,
  plansSchema,
  promoRedeemSchema,
  referralSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { webhookAckSchema, webhookEventSchema } from './billing.schemas';

export class BillingStatusDto extends createZodDto(billingStatusSchema) {}
export class CheckoutDto extends createZodDto(checkoutSchema) {}
export class CheckoutResultDto extends createZodDto(checkoutResultSchema) {}
export class PaymentHistoryDto extends createZodDto(paymentHistorySchema) {}
export class PlansDto extends createZodDto(plansSchema) {}
export class PromoRedeemDto extends createZodDto(promoRedeemSchema) {}
export class ReferralDto extends createZodDto(referralSchema) {}
export class WebhookAckDto extends createZodDto(webhookAckSchema) {}
export class WebhookEventDto extends createZodDto(webhookEventSchema) {}
