import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import type { Installation } from '@/entities/installation';

import { setComponentEnabled } from '@/entities/installation';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

import type { UseComponentToggleInput } from './use-component-toggle.types';

export const useComponentToggle = ({ clientPath, componentId, title }: UseComponentToggleInput) => {
  const t = useTranslations('components');
  const queryClient = useQueryClient();
  const showError = useErrorToast();

  const mutation = useMutation({
    mutationFn: (enabled: boolean) => setComponentEnabled({ clientPath, componentId, enabled }),
    onSuccess: (installation: Installation, enabled) => {
      queryClient.setQueryData(QUERY_KEYS.installation(clientPath), installation);
      toast.success(t(enabled ? 'enabledToast' : 'disabledToast', { title }));
    },
    onError: showError
  });

  return { isPending: mutation.isPending, onCheckedChange: (enabled: boolean) => mutation.mutate(enabled) };
};
