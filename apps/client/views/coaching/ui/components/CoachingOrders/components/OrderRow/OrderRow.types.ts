import type { CoachingOrder } from '@/entities/coaching/coach';

export type OrderRowProps = {
  order: CoachingOrder;
  coachName: string | null;
};
