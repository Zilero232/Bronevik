'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { CommunityGate } from '@/entities/auth/session';
import { Card, CardBody, CardHeader, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { useCoachingOrders } from '../../../model/hooks';
import { OrderRow } from './components';

import s from './CoachingOrders.module.scss';

export const CoachingOrders = () => {
  const t = useTranslations('coaching.orders');
  const titleId = useId();
  const { isSignedIn, query, coachName } = useCoachingOrders();

  return (
    <Card aria-labelledby={titleId} id='orders' padding='none'>
      <CardHeader title={<span id={titleId}>{t('title')}</span>} />
      {isSignedIn ? (
        <QueryState
          isCompact
          skeleton={
            <CardBody>
              <Skeleton height={64} />
            </CardBody>
          }
          empty={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
          errorDescription={t('errorDescription')}
          errorTitle={t('errorTitle')}
          query={query}
        >
          {(orders) => (
            <ul className={s.list}>
              {orders.map((order) => (
                <li key={order.id} className={s.item}>
                  <OrderRow coachName={coachName(order.coachUserId)} order={order} />
                </li>
              ))}
            </ul>
          )}
        </QueryState>
      ) : (
        <CardBody>
          <CommunityGate requiresLesta={false}>{null}</CommunityGate>
        </CardBody>
      )}
    </Card>
  );
};
