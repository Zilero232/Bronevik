'use client';

import { useQuery } from '@tanstack/react-query';

import { getGuideAuthors } from '@/entities/guide/guide';
import { QUERY_KEYS } from '@/shared/constants';

import { GUIDE_LIST } from '../../../config';

export const useTopAuthors = () =>
  useQuery({
    queryKey: QUERY_KEYS.guides.authors,
    queryFn: ({ signal }) => getGuideAuthors(signal),
    select: (authors) => authors.slice(0, GUIDE_LIST.authorsShown)
  });
