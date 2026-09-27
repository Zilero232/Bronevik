'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/constants';

import { getShells } from '../../../api';
import { PROGRESS_PAGE } from '../../../config';

export const useShells = () =>
  useQuery({
    queryKey: QUERY_KEYS.me.progression.shells,
    queryFn: getShells,
    select: (shells) => ({ ...shells, entries: shells.entries.slice(0, PROGRESS_PAGE.shellEntriesShown) })
  });
