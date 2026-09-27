'use client';

import { useState } from 'react';

import { SESSIONS } from '../../../config';
import { useProfileContext } from '../../context';
import { usePlayerSessions } from '../use-profile-queries';

export const useSessionsTab = () => {
  const { accountId, nickname } = useProfileContext();

  const [limit, setLimit] = useState<number>(SESSIONS.pageSize);
  const [selected, setSelected] = useState<string | null>(null);

  const query = usePlayerSessions(limit);

  return {
    accountId,
    nickname,
    query,
    selectedId: selected ?? query.data?.items[0]?.id,
    select: setSelected,
    showMore: () => setLimit((current) => current + SESSIONS.pageSize)
  };
};
