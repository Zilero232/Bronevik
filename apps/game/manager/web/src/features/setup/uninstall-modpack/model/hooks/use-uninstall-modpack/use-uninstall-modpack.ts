import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

import { uninstallModpack } from '../../../api';

export const useUninstallModpack = (clientPath: string | null) => {
  const t = useTranslations('uninstall');
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const [restoreSnapshot, setRestoreSnapshot] = useState(false);
  const [removeConfig, setRemoveConfig] = useState(false);

  const mutation = useMutation({
    mutationFn: () => uninstallModpack({ clientPath, restoreSnapshot, removeConfig }),
    onSuccess: async (report) => {
      queryClient.setQueryData(QUERY_KEYS.patchReport, report);
      await queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] !== QUERY_KEYS.patchReport[0] });
      toast.success(t('done'));
    },
    onError: showError
  });

  return {
    restoreSnapshot,
    removeConfig,
    isPending: mutation.isPending,
    setRestoreSnapshot,
    setRemoveConfig,
    onUninstall: () => mutation.mutate()
  };
};
