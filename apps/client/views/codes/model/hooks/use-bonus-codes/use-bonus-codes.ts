'use client';

import { useQuery } from '@tanstack/react-query';
import { parseAsStringLiteral, useQueryState } from 'nuqs';

import { shopControllerListBonusCodesOptions } from '@/shared/api/query-options';
import { useClientNow } from '@/shared/lib';

import type { CodesTab } from './use-bonus-codes.types';

import { CODES } from '../../../config';
import { codeGroups } from '../../../lib/code-groups';
import { expiringCount } from '../../../lib/code-ribbon';

export const useBonusCodes = () => {
  const [tab, setTab] = useQueryState('tab', parseAsStringLiteral(CODES.tabs).withDefault('active').withOptions({ history: 'replace' }));
  const { data, isPending, isError, isFetching, refetch } = useQuery({ ...shopControllerListBonusCodesOptions(), staleTime: CODES.staleMs });

  const now = useClientNow({ updateInterval: CODES.clockMs });
  const groups = codeGroups(data ?? []);

  return {
    tab,
    active: groups.active,
    expired: groups.expired,
    expiringCount: expiringCount({ codes: groups.active, now, expiringDays: CODES.expiringDays }),
    isPending,
    isError,
    isRetrying: isFetching,
    setTab: (next: CodesTab) => void setTab(next),
    retry: () => void refetch()
  };
};
