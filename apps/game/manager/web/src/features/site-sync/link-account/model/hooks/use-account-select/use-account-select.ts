import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'use-intl';

import { selectSyncAccount, useAccountLink } from '@/entities/account-link';
import { useSelectedClient } from '@/entities/client';
import { QUERY_KEYS } from '@/shared/config';
import { useErrorToast } from '@/shared/lib';

export const useAccountSelect = () => {
  const t = useTranslations('sync');
  const queryClient = useQueryClient();
  const showError = useErrorToast();
  const { clientPath } = useSelectedClient();
  const { data } = useAccountLink();
  const accounts = data?.accounts ?? [];

  const select = useMutation({
    mutationFn: selectSyncAccount,
    onSuccess: async (view) => {
      queryClient.setQueryData(QUERY_KEYS.accountLink, view);
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.syncStatus(clientPath) });
    },
    onError: showError
  });

  return {
    label: t('account'),
    options: accounts.map((account) => ({ value: String(account.accountId), label: t('accountOption', { id: account.accountId }) })),
    value: data?.selected === null || data?.selected === undefined ? '' : String(data.selected),
    isPending: select.isPending,
    onChange: (value: string) => select.mutate(Number(value))
  };
};
