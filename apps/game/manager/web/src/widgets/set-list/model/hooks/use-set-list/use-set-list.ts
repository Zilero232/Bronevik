import { useFormatter } from 'use-intl';

import { useComponentSets } from '@/entities/component-set';
import { fromUnixSeconds } from '@/shared/lib';

export const useSetList = () => {
  const format = useFormatter();
  const setsQuery = useComponentSets();
  const sets = setsQuery.data?.sets ?? [];

  return {
    setsQuery,
    count: sets.length,
    max: setsQuery.data?.max ?? 0,
    rows: sets.map((set) => {
      const updated = fromUnixSeconds(set.updated);

      return { set, updated: updated ? format.dateTime(updated, { dateStyle: 'medium', timeStyle: 'short' }) : null };
    })
  };
};
