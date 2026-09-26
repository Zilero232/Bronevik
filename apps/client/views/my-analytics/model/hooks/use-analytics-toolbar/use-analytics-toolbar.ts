'use client';

import { ANALYTICS_PERIODS } from '@otmetki/schemas';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { getLinkedAccounts } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';

import { useAnalyticsFilters } from '../../context';

export const useAnalyticsToolbar = () => {
  const t = useTranslations('analytics.periods');
  const { period, account, setPeriod, setAccount } = useAnalyticsFilters();
  const { data } = useQuery({ queryKey: QUERY_KEYS.me.section('accounts'), queryFn: getLinkedAccounts });

  const accounts = data?.lesta ?? [];
  const primary = accounts.find((item) => item.isPrimary) ?? accounts[0];

  return {
    period,
    periodOptions: ANALYTICS_PERIODS.map((value) => ({ value, label: t(value) })),
    accountItems: accounts.length > 1 ? accounts.map(({ accountId, nickname }) => ({ value: String(accountId), label: nickname })) : [],
    accountValue: String(account ?? primary?.accountId ?? ''),
    setPeriod,
    onAccountChange: (value: string) => setAccount(Number(value))
  };
};
