import type { z } from 'zod';

import type { CoachingOrder, CoachingOrderStatus, Prisma } from '../../../generated';
import type { Owned, OwnedById } from '../community-core';
import type {
  coachContactsSchema,
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
export type CoachContacts = z.infer<typeof coachContactsSchema>;

export type CoachLookup = {
  userId: string;
  viewerUserId: string | null;
};

export type OrderViewInput = {
  order: CoachingOrder;
  viewerId: string;
};

export type OrderTransition = {
  id: string;
  userId: string;
  where: Prisma.CoachingOrderWhereInput;
  status: CoachingOrderStatus;
  completedAt?: Date;
};
