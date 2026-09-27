'use client';

import { useTranslations } from 'next-intl';

import { QueryState, Skeleton } from '@/ui-kit';

import { useBillingStatus } from '../../../model/hooks';
import { StatusCard } from './components';

export const StatusPanel = () => {
  const t = useTranslations('billing.status');
  const query = useBillingStatus();

  return (
    <QueryState errorDescription={t('errorHint')} errorTitle={t('error')} query={query} skeleton={<Skeleton height={260} shape='block' />}>
      {(status) => <StatusCard status={status} />}
    </QueryState>
  );
};
