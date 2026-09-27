import type { Coach } from '@/entities/coaching/coach';

export type CoachSummaryProps = {
  coach: Coach;
  profileHref: string | null;
};
