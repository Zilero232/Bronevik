import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { updateSettings, useSettings } from '@/entities/settings';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

export const useAutostartPrompt = () => {
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const { data: settings } = useSettings();
  const [autostart, setAutostart] = useState(true);

  const mutation = useMutation({
    mutationFn: (enabled: boolean) => {
      if (!settings) {
        throw new Error('the settings are not loaded');
      }

      return updateSettings({ ...settings, autostart: enabled, autostartAsked: true });
    },
    onSuccess: (saved) => queryClient.setQueryData(QUERY_KEYS.settings, saved),
    onError: showError
  });

  return {
    isOpen: settings?.autostartAsked === false,
    autostart,
    isPending: mutation.isPending,
    setAutostart,
    onConfirm: () => mutation.mutate(autostart)
  };
};
