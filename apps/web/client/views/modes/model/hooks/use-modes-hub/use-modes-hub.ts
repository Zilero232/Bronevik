'use client';

import { useQuery } from '@tanstack/react-query';

import { getModesHub } from '@/entities/mode/mode';
import { QUERY_KEYS } from '@/shared/constants';

import { latestComputedAt, modePanels } from '../../../lib/mode-panels';

export const useModesHub = () =>
  useQuery({
    queryKey: QUERY_KEYS.modes.hub,
    queryFn: ({ signal }) => getModesHub({ signal }),
    select: ({ modes, windowDays }) => ({ panels: modePanels(modes), windowDays, computedAt: latestComputedAt(modes) })
  });
