import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { collectLogs, revealPath } from '@/entities/app-info';
import { useErrorToast } from '@/shared/lib';

export const useCollectLogs = () => {
  const t = useTranslations('about');
  const showError = useErrorToast();

  const mutation = useMutation({
    mutationFn: collectLogs,
    onSuccess: (path) => {
      toast.success(t('logsCollected'), {
        description: path,
        action: { label: t('reveal'), onClick: () => void revealPath(path).catch(showError) }
      });
    },
    onError: showError
  });

  return { isPending: mutation.isPending, onCollect: () => mutation.mutate() };
};
