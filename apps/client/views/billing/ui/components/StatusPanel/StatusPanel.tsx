'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { EmptyState, Skeleton } from '@/ui-kit';

import { useBillingStatus } from '../../../model/hooks';
import { StatusCard } from './components';

export const StatusPanel = () => {
  const t = useTranslations('billing.status');
  const { data: status, isPending } = useBillingStatus();

  return match({ isPending, status })
    .with({ isPending: true }, () => <Skeleton height={260} shape='block' />)
    .with({ status: P.nonNullable }, ({ status: loaded }) => <StatusCard status={loaded} />)
    .otherwise(() => <EmptyState description={t('errorHint')} title={t('error')} />);
};
