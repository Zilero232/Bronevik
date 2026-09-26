import type { CoachingOrder } from '@/shared/api/coaching';

export type OrderRowProps = {
  order: CoachingOrder;
  coachName: string | null;
};
