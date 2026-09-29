import { useComponentSets } from '@/entities/component-set';
import { fromUnixSeconds, useDisplayFormat } from '@/shared/lib';

export const useSetList = () => {
  const { stamp } = useDisplayFormat();
  const setsQuery = useComponentSets();
  const sets = setsQuery.data?.sets ?? [];

  return {
    setsQuery,
    count: sets.length,
    max: setsQuery.data?.max ?? 0,
    rows: sets.map((set) => {
      const updated = fromUnixSeconds(set.updated);

      return { set, updated: updated ? stamp(updated) : null };
    })
  };
};
