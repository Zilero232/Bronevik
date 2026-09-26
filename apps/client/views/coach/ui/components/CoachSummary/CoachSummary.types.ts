import type { Coach } from '@/shared/api/coaching';

export type CoachSummaryProps = {
  coach: Coach;
  profileHref: string | null;
};
