import { weekKey } from '@/shared/lib';

import type { WeekGroup, WeekGroupsInput } from './week-groups.types';

export const weekGroups = <T>({ entries, dateOf }: WeekGroupsInput<T>): WeekGroup<T>[] =>
  entries.reduce<WeekGroup<T>[]>((groups, entry) => {
    const week = weekKey({ date: dateOf(entry) });
    const last = groups.at(-1);

    if (last?.week === week) {
      last.entries.push(entry);

      return groups;
    }

    return [...groups, { week, entries: [entry] }];
  }, []);
