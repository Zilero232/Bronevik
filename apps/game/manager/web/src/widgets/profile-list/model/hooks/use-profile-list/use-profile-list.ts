import { useFormatter } from 'use-intl';

import { useSelectedClient } from '@/entities/client';
import { useProfiles } from '@/entities/profile';
import { fromUnixSeconds } from '@/shared/lib';

export const useProfileList = () => {
  const format = useFormatter();
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

      return { profile, updated: updated ? format.dateTime(updated, { dateStyle: 'medium', timeStyle: 'short' }) : null };
    })
  };
};
