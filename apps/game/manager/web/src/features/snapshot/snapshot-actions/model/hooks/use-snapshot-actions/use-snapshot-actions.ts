import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import type { Snapshot } from '@/entities/snapshot';

import { deleteSnapshot, restoreSnapshot } from '@/entities/snapshot';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

import type { UseSnapshotActionsInput } from './use-snapshot-actions.types';

export const useSnapshotActions = ({ clientPath, id }: UseSnapshotActionsInput) => {
  const t = useTranslations('backups');
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const store = (snapshots: Snapshot[]) => queryClient.setQueryData(QUERY_KEYS.snapshots(clientPath), snapshots);

  const restore = useMutation({
    mutationFn: () => restoreSnapshot({ clientPath, id }),
    onSuccess: async (snapshots) => {
      store(snapshots);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.installation(clientPath) });
      toast.success(t('restored'));
    },
    onError: showError
  });

  const remove = useMutation({
    mutationFn: () => deleteSnapshot({ clientPath, id }),
    onSuccess: (snapshots) => {
      store(snapshots);
      toast.success(t('deleted'));
    },
    onError: showError
  });

  return {
    isRestoring: restore.isPending,
    isDeleting: remove.isPending,
    onRestore: () => restore.mutate(),
    onDelete: () => remove.mutate()
  };
};
