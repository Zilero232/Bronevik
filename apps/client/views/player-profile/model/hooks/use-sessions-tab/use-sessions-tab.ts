'use client';

import { useState } from 'react';

import { SESSIONS } from '../../../config';
import { useProfileContext } from '../../context';
import { usePlayerSessions } from '../use-profile-queries';

export const useSessionsTab = () => {
  const { accountId, nickname } = useProfileContext();

  const [limit, setLimit] = useState<number>(SESSIONS.pageSize);
  const [selected, setSelected] = useState<string | null>(null);

  const { data: page, isPending, isError, isFetching, isRefetching, refetch } = usePlayerSessions(limit);

  return {
    accountId,
    nickname,
    items: page?.items ?? [],
    isEmpty: page?.items.length === 0,
    hasMore: page ? page.total > page.items.length : false,
    selectedId: selected ?? page?.items[0]?.id,
    isPending,
    isError,
    isFetching,
    isRetrying: isRefetching,
    select: setSelected,
    showMore: () => setLimit((current) => current + SESSIONS.pageSize),
    retry: () => void refetch()
  };
};
