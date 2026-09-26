'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { CommunityGate } from '@/features/community/viewer';
import { Card, CardBody, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { useCoachingOrders } from '../../../model/hooks';
import { OrderRow } from './components';

import s from './CoachingOrders.module.scss';

export const CoachingOrders = () => {
  const t = useTranslations('coaching.orders');
  const titleId = useId();
  const { isSignedIn, orders, isPending, isError, isRetrying, coachName, retry } = useCoachingOrders();

  return (
    <Card aria-labelledby={titleId} id='orders' padding='none'>
      <CardHeader title={<span id={titleId}>{t('title')}</span>} />
      {!isSignedIn && (
        <CardBody>
          <CommunityGate requiresLesta={false}>{null}</CommunityGate>
        </CardBody>
      )}
      {isSignedIn && isError && (
        <ErrorState isCompact description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
      )}
      {isSignedIn && !isError && isPending && (
        <CardBody>
          <Skeleton height={64} />
        </CardBody>
      )}
      {isSignedIn && !isError && !isPending && orders.length === 0 && (
        <EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />
      )}
      {orders.length > 0 && (
        <ul className={s.list}>
          {orders.map((order) => (
            <li key={order.id} className={s.item}>
              <OrderRow coachName={coachName(order.coachUserId)} order={order} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
