import { useMutation, useQuery } from '@tanstack/react-query';
import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';

import { QUERY, QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

export const useAppUpdate = () => {
  const showError = useErrorToast();
  const query = useQuery({ queryKey: QUERY_KEYS.appUpdate, queryFn: () => check(), staleTime: QUERY.appUpdateStaleTimeMs, retry: false });
  const update = query.data ?? null;

  const install = useMutation({
    mutationFn: async () => {
      await update?.downloadAndInstall();
      await relaunch();
    },
    onError: showError
  });

  return {
    version: update?.version ?? null,
    isChecking: query.isFetching,
    hasFailed: query.isError,
    isInstalling: install.isPending,
    onCheck: () => void query.refetch(),
    onInstall: () => install.mutate()
  };
};
