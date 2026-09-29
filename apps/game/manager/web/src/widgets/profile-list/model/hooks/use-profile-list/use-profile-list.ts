import { useSelectedClient } from '@/entities/client';
import { useProfiles } from '@/entities/profile';
import { fromUnixSeconds, useDisplayFormat } from '@/shared/lib';

export const useProfileList = () => {
  const { stamp } = useDisplayFormat();
  const { clientPath } = useSelectedClient();
  const profilesQuery = useProfiles(clientPath);
  const profiles = profilesQuery.data?.profiles ?? [];

  return {
    clientPath,
    profilesQuery,
    count: profiles.length,
    max: profilesQuery.data?.max ?? 0,
    rows: profiles.map((profile) => {
      const updated = fromUnixSeconds(profile.updated);

      return { profile, updated: updated ? stamp(updated) : null };
    })
  };
};
