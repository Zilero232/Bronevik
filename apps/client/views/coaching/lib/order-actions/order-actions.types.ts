import type { CoachingOrder } from '@/shared/api/coaching';

export type OrderRole = 'coach' | 'student';

export type OrderActionsInput = {
  order: Pick<CoachingOrder, 'coachUserId' | 'score' | 'status'>;
  viewerId: string | null;
};

export type OrderActions = {
  role: OrderRole;
  canAccept: boolean;
  canComplete: boolean;
  canCancel: boolean;
  canReview: boolean;
};
