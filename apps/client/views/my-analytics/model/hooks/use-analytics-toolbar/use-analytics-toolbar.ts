'use client';

import { ANALYTICS_PERIODS } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

import { useLinkedAccounts } from '@/entities/auth/session';
import { PERIOD_LABEL } from '@/shared/constants';

import { useAnalyticsFilters } from '../../context';

export const useAnalyticsToolbar = () => {
  const tPeriods = useTranslations('periods');
  const { period, account, setPeriod, setAccount } = useAnalyticsFilters();
  const { data } = useLinkedAccounts();

  const accounts = data?.lesta ?? [];
  const primary = accounts.find((item) => item.isPrimary) ?? accounts[0];

  return {
    period,
    periodOptions: ANALYTICS_PERIODS.map((value) => ({ value, label: tPeriods(PERIOD_LABEL[value]) })),
    accountItems: accounts.length > 1 ? accounts.map(({ accountId, nickname }) => ({ value: String(accountId), label: nickname })) : [],
    accountValue: String(account ?? primary?.accountId ?? ''),
    setPeriod,
    onAccountChange: (value: string) => setAccount(Number(value))
  };
};
