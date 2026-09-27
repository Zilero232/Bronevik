'use client';

import type { UseIconFilterInput } from './use-icon-filter.types';

import { useIconFilterTitle } from '../use-icon-filter-title';

export const useIconFilter = <T extends number | string>({ options, value, isMultiple, onChange }: UseIconFilterInput<T>) => {
  const titleOf = useIconFilterTitle();

  const onValueChange = (next: string[]) => {
    if (!isMultiple && next.length === 0) {
      return;
    }

    onChange(options.filter((option) => next.includes(String(option))));
  };

  return { titleOf, selected: value.map(String), onValueChange };
};
