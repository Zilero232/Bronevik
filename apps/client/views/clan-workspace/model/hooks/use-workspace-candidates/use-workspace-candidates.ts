'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';

import type { UseWorkspaceCandidatesInput } from './use-workspace-candidates.types';

import { workspaceQueries } from '../../../api';
import { CANDIDATE_FILTER_PARSER, CANDIDATE_FILTERS } from '../../../config';

export const useWorkspaceCandidates = ({ clanId, isEnabled }: UseWorkspaceCandidatesInput) => {
  const [filter, setFilter] = useQueryState('status', CANDIDATE_FILTER_PARSER);
  const query = useQuery({
    ...workspaceQueries.candidates({ clanId, status: filter === 'all' ? undefined : filter }),
    enabled: isEnabled,
    placeholderData: keepPreviousData
  });

  return {
    query,
    filter,
    filters: CANDIDATE_FILTERS,
    candidates: query.data ?? [],
    onFilterChange: (next: typeof filter) => void setFilter(next)
  };
};
