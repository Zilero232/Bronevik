import type { useProfiles } from './use-profiles';

export type RenameDraft = {
  id: string;
  name: string;
};

export type ProfileRowModel = ReturnType<typeof useProfiles>['rows'][number];
