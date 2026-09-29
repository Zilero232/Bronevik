import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { restoreMissing } from '@/entities/conflict';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

export const useRestoreMissing = (clientPath: string | null) => {
  const t = useTranslations('conflicts');
  const queryClient = useQueryClient();
  const showError = useErrorToast();

  const mutation = useMutation({
    mutationFn: () => restoreMissing(clientPath),
    onSuccess: async (report) => {
      queryClient.setQueryData(QUERY_KEYS.conflicts(clientPath), report);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.installation(clientPath) });
      toast.success(t('restored'));
    },
    onError: showError
  });

  return { isPending: mutation.isPending, onRestore: () => mutation.mutate() };
};
