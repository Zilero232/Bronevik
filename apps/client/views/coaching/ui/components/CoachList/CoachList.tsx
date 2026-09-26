'use client';

import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button, Card, CardHeader, EmptyState, PagedList } from '@/ui-kit';

import { useCoachList } from '../../../model/hooks';
import { CoachCard } from './components';

import s from './CoachList.module.scss';

export const CoachList = () => {
  const t = useTranslations('coaching.list');
  const { vehicle, items, isFiltered, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, onVehicleChange, onReset, loadMore, retry } =
    useCoachList();

  return (
    <section className={s.root}>
      <Card padding='sm'>
        <CardHeader
          action={<TankPicker className={s.picker} placeholder={t('tankPlaceholder')} value={vehicle} onChange={onVehicleChange} />}
          title={t('title')}
        />
      </Card>
      <PagedList
        empty={
          <Card padding='none'>
            <EmptyState
              action={
                isFiltered && (
                  <Button size='sm' variant='secondary' onClick={onReset}>
                    {t('reset')}
                  </Button>
                )
              }
              description={isFiltered ? t('emptyFilteredDescription') : t('emptyDescription')}
              title={t('emptyTitle')}
            />
          </Card>
        }
        errorDescription={t('errorDescription')}
        errorTitle={t('errorTitle')}
        getKey={(coach) => coach.userId}
        hasNextPage={hasNextPage}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        isPending={isPending}
        isRetrying={isRetrying}
        items={items}
        renderItem={(coach) => <CoachCard coach={coach} />}
        skeletonHeight={140}
        onLoadMore={loadMore}
        onRetry={retry}
      />
    </section>
  );
};
