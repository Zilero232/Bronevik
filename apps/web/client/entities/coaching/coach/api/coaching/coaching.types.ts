import type { Coach, CoachingControllerListData, ReviewOrder } from '@/shared/api/generated';

export type { Coach, CoachingOrder, CoachingOrderList, CoachOffer, CoachPage, CreateOrder, UpsertCoach } from '@/shared/api/generated';

export type CoachContacts = Coach['contacts'];

export type ListCoachesInput = NonNullable<CoachingControllerListData['query']> & {
  signal?: AbortSignal;
};

export type GetCoachInput = {
  userId: string;
  signal?: AbortSignal;
};

export type ReviewCoachingOrderInput = ReviewOrder & {
  id: string;
};
