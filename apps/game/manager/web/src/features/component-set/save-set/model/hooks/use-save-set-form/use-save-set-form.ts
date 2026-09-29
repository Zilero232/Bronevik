import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { COMPONENT_SET, saveSet } from '@/entities/component-set';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

export const useSaveSetForm = (components: string[]) => {
  const t = useTranslations('sets');
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const schema = z.object({ name: z.string().trim().min(1, t('validation.name')).max(COMPONENT_SET.nameMaxLength, t('validation.name')) });
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: '' } });

  const mutation = useMutation({
    mutationFn: (name: string) => saveSet({ name, components }),
    onSuccess: (view) => {
      queryClient.setQueryData(QUERY_KEYS.sets, view);
      form.reset();
      toast.success(t('saved'));
    },
    onError: showError
  });

  return {
    register: form.register,
    error: form.formState.errors.name?.message,
    isPending: mutation.isPending,
    onSubmit: form.handleSubmit(({ name }) => mutation.mutate(name))
  };
};
