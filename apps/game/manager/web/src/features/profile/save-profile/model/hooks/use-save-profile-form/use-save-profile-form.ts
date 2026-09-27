import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { PROFILE, saveProfile } from '@/entities/profile';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

export const useSaveProfileForm = (clientPath: string | null) => {
  const t = useTranslations('profiles');
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const schema = z.object({ name: z.string().trim().min(1, t('validation.name')).max(PROFILE.nameMaxLength, t('validation.name')) });
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: '' } });

  const mutation = useMutation({
    mutationFn: (name: string) => saveProfile({ clientPath, name }),
    onSuccess: (view) => {
      queryClient.setQueryData(QUERY_KEYS.profiles(clientPath), view);
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
