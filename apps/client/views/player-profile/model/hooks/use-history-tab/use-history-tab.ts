'use client';

import { useNicknameHistory } from '../use-profile-queries';

export const useHistoryTab = () => {
  const query = useNicknameHistory();

  return {
    query,
    nicknames: query.data?.filter(({ kind }) => kind === 'nickname') ?? [],
    clans: query.data?.filter(({ kind }) => kind === 'clan') ?? []
  };
};
