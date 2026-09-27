import type { ProfileSummary } from '@/entities/profile';

export type ProfileActionsProps = {
  clientPath: string | null;
  profile: ProfileSummary;
};
