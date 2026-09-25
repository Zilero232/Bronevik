'use client';

import { useQuery } from '@tanstack/react-query';

import { getMoeHistory } from '@/shared/api/marks';
import { QUERY_KEYS } from '@/shared/constants';

import { MOE_LIST } from '../../config';

type UseMoeHistoryInput = {
  tankId: number | null;
  isEnabled?: boolean;
};

export const useMoeHistory = ({ tankId, isEnabled = true }: UseMoeHistoryInput) =>
  useQuery({
    queryKey: QUERY_KEYS.marks.history(tankId ?? 0),
    queryFn: ({ signal }) => getMoeHistory({ tankId: tankId ?? 0, signal }),
    enabled: isEnabled && tankId !== null,
    staleTime: MOE_LIST.historyStaleMs
  });
