import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { ACCOUNT_LINK, linkAccount } from '@/entities/account-link';
import { useSelectedClient } from '@/entities/client';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

export const useLinkAccountForm = () => {
  const t = useTranslations('sync');
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const { clientPath } = useSelectedClient();
  const schema = z.object({ code: z.string().trim().regex(ACCOUNT_LINK.codePattern, t('validation.code')) });
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { code: '' } });

  const link = useMutation({
    mutationFn: ({ code }: z.infer<typeof schema>) => linkAccount(code),
    onSuccess: async (view) => {
      queryClient.setQueryData(QUERY_KEYS.accountLink, view);
      form.reset({ code: '' });
      toast.success(t('linked'));
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.syncStatus(clientPath) });
    },
    onError: showError
  });

  return {
    register: form.register,
    error: form.formState.errors.code?.message,
    isPending: link.isPending,
    onSubmit: form.handleSubmit((values) => link.mutate(values))
  };
};
