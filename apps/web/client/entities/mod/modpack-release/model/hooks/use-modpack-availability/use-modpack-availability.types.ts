import type { ModpackReleasesStatus } from '@/shared/api/generated';

export type ModpackAvailability = ModpackReleasesStatus & {
  isPending: boolean;
  isPublished: boolean;
};
