import type { ProfileSummary } from '@/entities/profile';

export type UseProfileActionsInput = {
  clientPath: string | null;
  profile: ProfileSummary;
};
