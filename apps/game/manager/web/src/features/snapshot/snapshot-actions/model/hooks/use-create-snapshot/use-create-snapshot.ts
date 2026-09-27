import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { createSnapshot } from '@/entities/snapshot';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

export const useCreateSnapshot = (clientPath: string | null) => {
  const t = useTranslations('backups');
  const queryClient = useQueryClient();
  const showError = useErrorToast();

  const mutation = useMutation({
    mutationFn: () => createSnapshot(clientPath),
    onSuccess: (snapshots) => {
      queryClient.setQueryData(QUERY_KEYS.snapshots(clientPath), snapshots);
      toast.success(t('created'));
    },
    onError: showError
  });

  return { isPending: mutation.isPending, onCreate: () => mutation.mutate() };
};
