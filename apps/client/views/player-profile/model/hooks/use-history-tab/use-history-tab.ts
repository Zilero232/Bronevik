'use client';

import { useNicknameHistory } from '../use-profile-queries';

export const useHistoryTab = () => {
  const { data: history, isPending, isError, isRefetching, refetch } = useNicknameHistory();

  return {
    nicknames: history?.filter(({ kind }) => kind === 'nickname') ?? [],
    clans: history?.filter(({ kind }) => kind === 'clan') ?? [],
    isEmpty: history?.length === 0,
    isPending,
    isError,
    isRetrying: isRefetching,
    retry: () => void refetch()
  };
};
