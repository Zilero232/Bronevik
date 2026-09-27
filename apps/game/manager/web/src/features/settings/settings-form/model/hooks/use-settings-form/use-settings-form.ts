import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import type { ManagerSettings } from '@/entities/settings';

import { SETTINGS, updateSettings } from '@/entities/settings';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

import { settingsFormSchema } from './use-settings-form.schemas';

export const useSettingsForm = (settings: ManagerSettings) => {
  const t = useTranslations('settings');
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const form = useForm({ resolver: zodResolver(settingsFormSchema), values: settingsFormSchema.parse(settings) });

  const mutation = useMutation({
    mutationFn: (values: ManagerSettings) => updateSettings(values),
    onSuccess: (saved) => {
      queryClient.setQueryData(QUERY_KEYS.settings, saved);
      toast.success(t('saved'));
    },
    onError: showError
  });

  const intervalOptions = SETTINGS.checkIntervals.map(({ minutes, label }) => ({ value: String(minutes), label: t(`intervalOption.${label}`) }));
  const languageOptions = SETTINGS.languages.map((language) => ({ value: language, label: t(`languageOption.${language}`) }));

  return {
    control: form.control,
    register: form.register,
    intervalOptions,
    languageOptions,
    isDirty: form.formState.isDirty,
    isPending: mutation.isPending,
    onSubmit: form.handleSubmit((values) => mutation.mutate({ ...settings, ...values }))
  };
};
