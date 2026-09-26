import type { z } from 'zod';

import type { CoachingOrder, CoachingOrderStatus, Prisma } from '../../../generated';
import type { YooKassaPayment } from '../billing';
import type { Owned, OwnedById } from '../community-core';
import type {
  checkoutSchema,
  coachesQuerySchema,
  coachingOrderSchema,
  coachOfferSchema,
  coachPageSchema,
  coachSchema,
  createOfferSchema,
  createOrderSchema,
  reviewOrderSchema,
  updateOfferSchema,
  upsertCoachSchema
} from './dto/coaching.schemas';

export type CoachView = z.infer<typeof coachSchema>;
export type CoachOfferView = z.infer<typeof coachOfferSchema>;
export type CoachesQuery = z.output<typeof coachesQuerySchema>;
export type CoachPage = z.infer<typeof coachPageSchema>;
export type UpsertCoachRequest = z.output<typeof upsertCoachSchema> & Owned;
export type CreateOfferRequest = z.output<typeof createOfferSchema> & Owned;
export type UpdateOfferRequest = z.output<typeof updateOfferSchema> & OwnedById;
export type CoachingOrderView = z.infer<typeof coachingOrderSchema>;
export type CreateOrderRequest = z.output<typeof createOrderSchema> & Owned;
export type ReviewOrderRequest = z.output<typeof reviewOrderSchema> & OwnedById;
export type Checkout = z.infer<typeof checkoutSchema>;

export type OrderTransition = {
  id: string;
  where: Prisma.CoachingOrderWhereInput;
  status: CoachingOrderStatus;
  completedAt?: Date;
};

export type PaymentOfOrder = {
  order: CoachingOrder;
  payment: YooKassaPayment;
};
